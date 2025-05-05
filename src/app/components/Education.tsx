"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { RESUME_DATA } from "@/data/resume-data";
import { EditableContent } from "@/components/ui/editable-content";
import { useResume } from "@/context/resume-context";
import { useEditMode } from "@/context/edit-mode-context";

type Education = (typeof RESUME_DATA)["education"][number];

interface EducationPeriodProps {
  start: Education["start"];
  end: Education["end"];
}

/**
 * Displays the education period in a consistent format
 */
function EducationPeriod({ start, end }: EducationPeriodProps) {
  return (
    <div
      className="text-sm tabular-nums text-gray-500"
      aria-label={`Period: ${start} to ${end}`}
    >
      {start} - {end}
    </div>
  );
}

interface EducationItemProps {
  education: Education;
}

/**
 * Individual education card component
 */
function EducationItem({ education }: EducationItemProps) {
  const { school, start, end, degree } = education;
  const { updateField } = useResume();

  const handleSchoolUpdate = (newValue: string) => {
    // Find the index of this education item
    const index = RESUME_DATA.education.findIndex((e) => e.school === school);
    if (index !== -1) {
      updateField(["education", index.toString(), "school"], newValue);
    }
  };

  const handleDegreeUpdate = (newValue: string) => {
    // Find the index of this education item
    const index = RESUME_DATA.education.findIndex((e) => e.school === school);
    if (index !== -1) {
      updateField(["education", index.toString(), "degree"], newValue);
    }
  };

  const handleStartUpdate = (newValue: string) => {
    // Find the index of this education item
    const index = RESUME_DATA.education.findIndex((e) => e.school === school);
    if (index !== -1) {
      updateField(["education", index.toString(), "start"], newValue);
    }
  };

  const handleEndUpdate = (newValue: string) => {
    // Find the index of this education item
    const index = RESUME_DATA.education.findIndex((e) => e.school === school);
    if (index !== -1) {
      updateField(["education", index.toString(), "end"], newValue);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-x-2 text-base">
          <h3
            className="font-semibold leading-none"
            id={`education-${school.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <EditableContent content={school} onSave={handleSchoolUpdate} />
          </h3>
          <div className="text-sm tabular-nums text-gray-500">
            <EditableContent
              content={start}
              onSave={handleStartUpdate}
              className="inline"
            />{" "}
            -{" "}
            <EditableContent
              content={end}
              onSave={handleEndUpdate}
              className="inline"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent
        className="mt-2 text-foreground/80 print:text-[12px]"
        aria-labelledby={`education-${school
          .toLowerCase()
          .replace(/\s+/g, "-")}`}
      >
        <EditableContent content={degree} onSave={handleDegreeUpdate} />
      </CardContent>
    </Card>
  );
}

interface EducationListProps {
  education: readonly Education[];
}

/**
 * Main education section component
 * Renders a list of education experiences
 */
export function Education({ education }: EducationListProps) {
  const { resumeData, updateField } = useResume();
  const { isEditMode } = useEditMode();

  const handleAddEducation = () => {
    // Get current year for default dates
    const currentYear = new Date().getFullYear();

    const newEducation = {
      school: "New School",
      degree: "Degree Title",
      start: (currentYear - 4).toString(), // Default to 4 years ago
      end: currentYear.toString(),
    };

    // Add the new education to the beginning of the array
    const updatedEducation = [newEducation, ...resumeData.education];
    updateField(["education"], updatedEducation);
  };

  return (
    <Section>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" id="education-section">
          Education
        </h2>
        {isEditMode && (
          <button
            onClick={handleAddEducation}
            className="rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground hover:bg-primary/90"
          >
            Add Education +
          </button>
        )}
      </div>
      <div
        className="space-y-4"
        role="feed"
        aria-labelledby="education-section"
      >
        {education.map((item) => (
          <article key={item.school} role="article">
            <EducationItem education={item} />
          </article>
        ))}
      </div>
    </Section>
  );
}
