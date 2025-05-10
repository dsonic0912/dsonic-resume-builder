"use client";

import { CommandMenu } from "@/components/command-menu";
import { RESUME_DATA } from "@/data/resume-data";
import { WorkExperience } from "../components/WorkExperience";
import { Projects } from "../components/Projects";
import { Education } from "../components/Education";
import { Summary } from "../components/Summary";
import { Header as ResumeHeader } from "../components/Header";
import { useResume } from "@/context/resume-context";
import { useEditMode } from "@/context/edit-mode-context";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

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
  const { resumeData, loading, error } = useResume();
  const { isEditMode } = useEditMode();

  if (loading) {
    return (
      <DashboardLayout title="Resume">
        <div className="container flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            <p className="text-lg">Loading resume data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Resume">
        <div className="container flex h-screen items-center justify-center">
          <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <h2 className="mb-2 text-xl font-semibold text-red-700">
              Error Loading Resume
            </h2>
            <p className="mb-4 text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Resume">
      <div
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
          <ResumeHeader />

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
      </div>
    </DashboardLayout>
  );
}
