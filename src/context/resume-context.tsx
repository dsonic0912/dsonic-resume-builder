"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { RESUME_DATA } from "@/data/resume-data";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons";

// Define the context type
type ResumeContextType = {
  resumeData: typeof RESUME_DATA;
  updateField: (path: string[], value: any) => Promise<void>;
  loading: boolean;
  error: string | null;
  resumeId: string | null;
};

// Create the context
const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// Helper function to create a deep copy while preserving React components and functions
const deepCopyWithComponents = (obj: any): any => {
  // Handle null, undefined, or primitive values
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => deepCopyWithComponents(item));
  }

  // Handle objects
  const copy: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Special handling for social icons and other React components
      if (key === "icon" && typeof obj[key] === "function") {
        // Preserve the icon component reference
        copy[key] = obj[key];
      } else if (key === "social" && Array.isArray(obj[key])) {
        // Special handling for social array to preserve icon components
        copy[key] = obj[key].map((social: any) => {
          const socialCopy = { ...social };
          // Preserve the icon component reference
          if (typeof social.icon === "function") {
            socialCopy.icon = social.icon;
          }
          return socialCopy;
        });
      } else {
        // Regular deep copy for other properties
        copy[key] = deepCopyWithComponents(obj[key]);
      }
    }
  }
  return copy;
};

// Map social network names to icon components
const socialIconMap: Record<string, any> = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
  X: XIcon,
};

// Transform database resume to match the expected format
const transformDatabaseResume = (dbResume: any): typeof RESUME_DATA => {
  if (!dbResume) return deepCopyWithComponents(RESUME_DATA);

  // Add icon components to social entries
  const socialWithIcons =
    dbResume.contact?.social.map((social: any) => ({
      ...social,
      icon: socialIconMap[social.name] || null,
    })) || [];

  // Transform work entries to include React components for descriptions
  const workWithComponents = dbResume.work.map((work: any) => {
    // Try to parse the description as JSON if it might be a serialized React element
    let description = work.description;

    // Check if the description might be a serialized JSX element
    if (description && description.includes('{"type":"')) {
      try {
        // Try to parse it as JSON
        const parsedDescription = JSON.parse(description);

        // If it has a type property, it might be a React element
        if (parsedDescription && parsedDescription.type) {
          // Convert it back to a React element
          description = React.createElement(
            React.Fragment,
            null,
            parsedDescription.props?.children || "",
          );
        }
      } catch (e) {
        // If parsing fails, keep the original description
        console.log("Failed to parse description:", e);
      }
    }

    return {
      ...work,
      badges: work.badges.map((badge: any) => badge.name),
      description: description,
      logo: null, // We don't store logos in the database
      tasks: work.tasks
        ? work.tasks.map((task: any) => ({
            id: task.id,
            description: task.description,
          }))
        : [], // Include tasks from the database and ensure they have the right format
    };
  });

  // Transform projects to match the expected format
  const projectsWithComponents = dbResume.projects.map((project: any) => ({
    ...project,
    techStack: project.techStack.map((tech: any) => tech.name),
    logo: null, // We don't store logos in the database
  }));

  return {
    name: dbResume.name,
    initials: dbResume.initials || "",
    location: dbResume.location || "",
    locationLink: dbResume.locationLink || "",
    about: dbResume.about || "",
    summary: dbResume.summary || "",
    avatarUrl: dbResume.avatarUrl || "",
    personalWebsiteUrl: dbResume.personalWebsiteUrl || "",
    contact: {
      email: dbResume.contact?.email || "",
      tel: dbResume.contact?.tel || "",
      social: socialWithIcons,
    },
    education: dbResume.education || [],
    work: workWithComponents,
    skills: dbResume.skills.map((skill: any) => skill.name),
    projects: projectsWithComponents,
  };
};

// Provider component
export function ResumeProvider({ children }: { children: ReactNode }) {
  // Initialize with default data
  const [resumeData, setResumeData] = useState(() =>
    deepCopyWithComponents(RESUME_DATA),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);

  // Fetch resume data from the API
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/resume");
        const result = await response.json();

        if (result.data) {
          const transformedData = transformDatabaseResume(result.data);
          setResumeData(transformedData);
          setResumeId(result.data.id);
        }
      } catch (err) {
        console.error("Error fetching resume data:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, []);

  // Function to update a field at a specific path
  const updateField = async (path: string[], value: any) => {
    if (!resumeId) {
      setError("No resume ID available");
      return;
    }

    try {
      // Update local state first for immediate UI feedback
      setResumeData((prevData: typeof RESUME_DATA) => {
        // Create a deep copy of the previous data while preserving components
        const newData = deepCopyWithComponents(prevData);

        // Navigate to the nested property
        let current = newData;
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]];
        }

        // Update the value
        current[path[path.length - 1]] = value;

        return newData;
      });

      // Send update to the server
      const response = await fetch(`/api/resume/${resumeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path, value }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update resume");
      }

      // Update with the server response to ensure consistency
      if (result.data) {
        const transformedData = transformDatabaseResume(result.data);
        setResumeData(transformedData);
      }
    } catch (err) {
      console.error("Error updating resume:", err);
      setError((err as Error).message);

      // Revert to the server state if there was an error
      const response = await fetch(`/api/resume/${resumeId}`);
      const result = await response.json();

      if (result.data) {
        const transformedData = transformDatabaseResume(result.data);
        setResumeData(transformedData);
      }
    }
  };

  return (
    <ResumeContext.Provider
      value={{ resumeData, updateField, loading, error, resumeId }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

// Custom hook to use the resume context
export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}
