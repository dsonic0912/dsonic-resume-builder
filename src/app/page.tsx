"use client";

import { CommandMenu } from "@/components/command-menu";
import { RESUME_DATA } from "@/data/resume-data";
import { WorkExperience } from "./components/WorkExperience";
import { Projects } from "./components/Projects";
import { Education } from "./components/Education";
import { Summary } from "./components/Summary";
import { Skills } from "./components/Skills";
import { Header } from "./components/Header";
import { useResume } from "@/context/resume-context";
import { EditModeSwitch } from "@/components/ui/edit-mode-switch";
import { useEditMode } from "@/context/edit-mode-context";

// Metadata is now generated dynamically based on the current resume data

/**
 * Transform social links for command menu
 */
function getCommandMenuLinks() {
  const links = [];

  if (RESUME_DATA.personalWebsiteUrl) {
    links.push({
      url: RESUME_DATA.personalWebsiteUrl,
      title: "Personal Website",
    });
  }

  return [
    ...links,
    ...RESUME_DATA.contact.social.map((socialMediaLink) => ({
      url: socialMediaLink.url,
      title: socialMediaLink.name,
    })),
  ];
}

export default function ResumePage() {
  const { resumeData } = useResume();
  const { isEditMode } = useEditMode();

  return (
    <main
      className="container relative mx-auto scroll-my-12 overflow-auto p-4 md:p-16 print:p-11"
      id="main-content"
    >
      <div className="sr-only">
        <h1>{resumeData.name}&apos;s Resume</h1>
      </div>

      <section
        className={`mx-auto w-full max-w-2xl space-y-8 bg-white print:space-y-4 ${
          isEditMode ? "edit-mode" : "view-mode"
        }`}
        aria-label="Resume Content"
      >
        <Header />

        <div className="space-y-8 print:space-y-4">
          <Summary summary={resumeData.summary} />

          <WorkExperience work={resumeData.work} />

          {/* <Skills /> */}

          <Projects projects={resumeData.projects} />

          <Education education={resumeData.education} />
        </div>
      </section>

      <nav className="print:hidden" aria-label="Quick navigation">
        <CommandMenu links={getCommandMenuLinks()} />
      </nav>

      {/* Edit Mode Switch */}
      <EditModeSwitch />
    </main>
  );
}
