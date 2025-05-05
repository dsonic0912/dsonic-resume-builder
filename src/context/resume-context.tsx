"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { RESUME_DATA } from "@/data/resume-data";

// Define the context type
type ResumeContextType = {
  resumeData: typeof RESUME_DATA;
  updateField: (path: string[], value: any) => void;
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

// Provider component
export function ResumeProvider({ children }: { children: ReactNode }) {
  // Initialize with a proper deep copy that preserves component references
  const [resumeData, setResumeData] = useState(() =>
    deepCopyWithComponents(RESUME_DATA),
  );

  // Function to update a field at a specific path
  const updateField = (path: string[], value: any) => {
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

      // Update the global RESUME_DATA variable to keep it in sync
      // This ensures other components that directly import RESUME_DATA get the updated values
      Object.assign(RESUME_DATA, newData);

      return newData;
    });
  };

  return (
    <ResumeContext.Provider value={{ resumeData, updateField }}>
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
