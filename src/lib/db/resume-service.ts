import { prisma } from "@/lib/prisma";
import { RESUME_DATA } from "@/data/resume-data";

/**
 * Service for handling resume database operations
 */
export const resumeService = {
  /**
   * Get a resume by ID
   */
  async getResumeById(id: string) {
    return prisma.resume.findUnique({
      where: { id },
      include: {
        contact: {
          include: {
            social: true,
          },
        },
        education: true,
        work: {
          include: {
            badges: true,
            tasks: true,
          },
        },
        skills: true,
        projects: {
          include: {
            techStack: true,
            link: true,
          },
        },
      },
    });
  },

  /**
   * Get the default resume (first one found)
   */
  async getDefaultResume() {
    const resume = await prisma.resume.findFirst({
      include: {
        contact: {
          include: {
            social: true,
          },
        },
        education: true,
        work: {
          include: {
            badges: true,
            tasks: true,
          },
        },
        skills: true,
        projects: {
          include: {
            techStack: true,
            link: true,
          },
        },
      },
    });

    return resume;
  },

  /**
   * Create a new resume
   */
  async createResume(userId: string, data: any) {
    return prisma.resume.create({
      data: {
        userId,
        name: data.name,
        initials: data.initials,
        location: data.location,
        locationLink: data.locationLink,
        about: data.about,
        summary: data.summary?.toString() || "",
        avatarUrl: data.avatarUrl,
        personalWebsiteUrl: data.personalWebsiteUrl,
        contact: {
          create: {
            email: data.contact.email,
            tel: data.contact.tel,
            social: {
              createMany: {
                data: data.contact.social.map((social: any) => ({
                  name: social.name,
                  url: social.url,
                })),
              },
            },
          },
        },
        education: {
          createMany: {
            data: data.education.map((edu: any) => ({
              school: edu.school,
              degree: edu.degree,
              start: edu.start,
              end: edu.end,
            })),
          },
        },
        work: {
          create: data.work.map((work: any) => ({
            company: work.company,
            link: work.link,
            title: work.title,
            start: work.start,
            end: work.end,
            description: work.description?.toString() || "",
            badges: {
              createMany: {
                data: work.badges.map((badge: string) => ({
                  name: badge,
                })),
              },
            },
          })),
        },
        skills: {
          createMany: {
            data: data.skills.map((skill: string) => ({
              name: skill,
            })),
          },
        },
        projects: {
          create: data.projects.map((project: any) => ({
            title: project.title,
            description: project.description,
            techStack: {
              createMany: {
                data: project.techStack.map((tech: string) => ({
                  name: tech,
                })),
              },
            },
            link: project.link
              ? {
                  create: {
                    label: project.link.label,
                    href: project.link.href,
                  },
                }
              : undefined,
          })),
        },
      },
      include: {
        contact: {
          include: {
            social: true,
          },
        },
        education: true,
        work: {
          include: {
            badges: true,
            tasks: true,
          },
        },
        skills: true,
        projects: {
          include: {
            techStack: true,
            link: true,
          },
        },
      },
    });
  },

  /**
   * Update a resume field
   */
  async updateResumeField(resumeId: string, path: string[], value: any) {
    // Handle different paths based on the structure
    const rootField = path[0];

    // Handle simple fields at the root level
    if (
      path.length === 1 &&
      [
        "name",
        "initials",
        "location",
        "locationLink",
        "about",
        "summary",
        "avatarUrl",
        "personalWebsiteUrl",
      ].includes(rootField)
    ) {
      return prisma.resume.update({
        where: { id: resumeId },
        data: { [rootField]: value },
      });
    }

    // Handle nested fields
    switch (rootField) {
      case "contact":
        return this.updateContactField(resumeId, path.slice(1), value);
      case "education":
        return this.updateEducationField(resumeId, path.slice(1), value);
      case "work":
        return this.updateWorkField(resumeId, path.slice(1), value);
      case "skills":
        return this.updateSkillsField(resumeId, path.slice(1), value);
      case "projects":
        return this.updateProjectField(resumeId, path.slice(1), value);
      default:
        throw new Error(`Unknown field path: ${path.join(".")}`);
    }
  },

  /**
   * Update contact information
   */
  async updateContactField(resumeId: string, path: string[], value: any) {
    const contact = await prisma.contact.findUnique({
      where: { resumeId },
    });

    if (!contact) {
      throw new Error(`Contact not found for resume ${resumeId}`);
    }

    const field = path[0];

    if (field === "email" || field === "tel") {
      return prisma.contact.update({
        where: { id: contact.id },
        data: { [field]: value },
      });
    } else if (field === "social") {
      // Handle social updates
      const socialIndex = parseInt(path[1]);
      const socialField = path[2];

      // Get all social entries
      const socials = await prisma.social.findMany({
        where: { contactId: contact.id },
      });

      if (socialIndex >= socials.length) {
        throw new Error(`Social index ${socialIndex} out of bounds`);
      }

      return prisma.social.update({
        where: { id: socials[socialIndex].id },
        data: { [socialField]: value },
      });
    }

    throw new Error(`Unknown contact field: ${path.join(".")}`);
  },

  /**
   * Update work experience field
   */
  async updateWorkField(resumeId: string, path: string[], value: any) {
    // If path is empty, it means we're updating the entire work array
    if (path.length === 0) {
      // Delete all existing work entries
      await prisma.work.deleteMany({
        where: { resumeId },
      });

      // Create new work entries
      for (const work of value) {
        await prisma.work.create({
          data: {
            resume: {
              connect: {
                id: resumeId,
              },
            },
            company: work.company,
            link: work.link,
            title: work.title,
            start: work.start,
            // Handle end as optional field
            ...(work.end !== null && work.end !== undefined
              ? { end: work.end }
              : {}),
            // Ensure description is stored as a string
            description:
              typeof work.description === "object"
                ? JSON.stringify(work.description)
                : String(work.description || ""),
            badges: {
              createMany: {
                data: (work.badges || []).map((badge: string) => ({
                  name: badge,
                })),
              },
            },
            // Add tasks if they exist
            tasks:
              work.tasks && Array.isArray(work.tasks) && work.tasks.length > 0
                ? {
                    createMany: {
                      data: work.tasks
                        .filter(
                          (task: any) =>
                            task &&
                            (task.description ||
                              typeof task.description === "string"),
                        )
                        .map((task: any) => ({
                          description:
                            typeof task.description === "string"
                              ? task.description.trim()
                              : String(task.description || "").trim(),
                        }))
                        .filter((task: any) => task.description.length > 0),
                    },
                  }
                : undefined,
          },
        });
      }
      return;
    }

    // Get all work entries for this resume
    const workEntries = await prisma.work.findMany({
      where: { resumeId },
      include: {
        badges: true,
        tasks: true,
      },
    });

    // Handle specific work entry update
    const workIndex = parseInt(path[0]);
    if (workIndex >= workEntries.length) {
      throw new Error(`Work index ${workIndex} out of bounds`);
    }

    const workId = workEntries[workIndex].id;

    // If path length is 1, we're updating a specific work entry
    if (path.length === 1) {
      // Delete the existing work entry
      await prisma.work.delete({
        where: { id: workId },
      });

      // Create a new work entry
      await prisma.work.create({
        data: {
          resume: {
            connect: {
              id: resumeId,
            },
          },
          company: value.company,
          link: value.link,
          title: value.title,
          start: value.start,
          // Handle end as optional field
          ...(value.end !== null && value.end !== undefined
            ? { end: value.end }
            : {}),
          // Ensure description is stored as a string
          description:
            typeof value.description === "object"
              ? JSON.stringify(value.description)
              : String(value.description || ""),
          badges: {
            createMany: {
              data: (value.badges || []).map((badge: string) => ({
                name: badge,
              })),
            },
          },
          // Add tasks if they exist
          tasks:
            value.tasks && Array.isArray(value.tasks) && value.tasks.length > 0
              ? {
                  createMany: {
                    data: value.tasks
                      .filter(
                        (task: any) =>
                          task &&
                          (task.description ||
                            typeof task.description === "string"),
                      )
                      .map((task: any) => ({
                        description:
                          typeof task.description === "string"
                            ? task.description.trim()
                            : String(task.description || "").trim(),
                      }))
                      .filter((task: any) => task.description.length > 0),
                  },
                }
              : undefined,
        },
      });
      return;
    }

    // Handle specific field update
    const field = path[1];
    if (field === "badges") {
      // Delete all existing badges
      await prisma.workBadge.deleteMany({
        where: { workId },
      });

      // Create new badges
      await prisma.workBadge.createMany({
        data: value.map((badge: string) => ({
          workId,
          name: badge,
        })),
      });
      return;
    }

    // Handle tasks field
    if (field === "tasks") {
      try {
        // Delete all existing tasks
        await prisma.workTasks.deleteMany({
          where: { workId },
        });

        // Create new tasks if there are any
        if (Array.isArray(value) && value.length > 0) {
          // Validate and sanitize task data
          const sanitizedTasks = value
            .filter(
              (task) =>
                task &&
                (task.description || typeof task.description === "string"),
            )
            .map((task) => ({
              workId,
              description:
                typeof task.description === "string"
                  ? task.description.trim()
                  : String(task.description || "").trim(),
            }))
            .filter((task) => task.description.length > 0);

          if (sanitizedTasks.length > 0) {
            await prisma.workTasks.createMany({
              data: sanitizedTasks,
            });
          }
        }
        return;
      } catch (error) {
        console.error("Error updating work tasks:", error);
        throw new Error(`Failed to update tasks: ${(error as Error).message}`);
      }
    }

    // Handle other fields
    if (["company", "link", "title", "start", "end"].includes(field)) {
      await prisma.work.update({
        where: { id: workId },
        data: { [field]: value },
      });
      return;
    }

    // Special handling for description field to ensure it's stored as a string
    if (field === "description") {
      await prisma.work.update({
        where: { id: workId },
        data: {
          description:
            typeof value === "object"
              ? JSON.stringify(value)
              : String(value || ""),
        },
      });
      return;
    }

    throw new Error(`Unknown work field: ${path.join(".")}`);
  },

  /**
   * Update education field
   */
  async updateEducationField(resumeId: string, path: string[], value: any) {
    // Get all education entries for this resume
    const educationEntries = await prisma.education.findMany({
      where: { resumeId },
    });

    // If path is empty, it means we're updating the entire education array
    if (path.length === 0) {
      // Delete all existing education entries
      await prisma.education.deleteMany({
        where: { resumeId },
      });

      // Create new education entries
      await prisma.education.createMany({
        data: value.map((edu: any) => ({
          resumeId,
          school: edu.school,
          degree: edu.degree,
          start: edu.start,
          end: edu.end,
        })),
      });
      return;
    }

    // Handle specific education entry update
    const eduIndex = parseInt(path[0]);
    if (eduIndex >= educationEntries.length) {
      throw new Error(`Education index ${eduIndex} out of bounds`);
    }

    const eduId = educationEntries[eduIndex].id;

    // If path length is 1, we're updating a specific education entry
    if (path.length === 1) {
      await prisma.education.update({
        where: { id: eduId },
        data: {
          school: value.school,
          degree: value.degree,
          start: value.start,
          end: value.end,
        },
      });
      return;
    }

    // Handle specific field update
    const field = path[1];
    if (["school", "degree", "start", "end"].includes(field)) {
      await prisma.education.update({
        where: { id: eduId },
        data: { [field]: value },
      });
      return;
    }

    throw new Error(`Unknown education field: ${path.join(".")}`);
  },

  /**
   * Update skills field
   */
  async updateSkillsField(resumeId: string, path: string[], value: any) {
    // If path is empty, it means we're updating the entire skills array
    if (path.length === 0) {
      // Delete all existing skills
      await prisma.skill.deleteMany({
        where: { resumeId },
      });

      // Create new skills
      await prisma.skill.createMany({
        data: value.map((skill: string) => ({
          resumeId,
          name: skill,
        })),
      });
      return;
    }

    throw new Error(`Unsupported skills update path: ${path.join(".")}`);
  },

  /**
   * Update project field
   */
  async updateProjectField(resumeId: string, path: string[], value: any) {
    // Get all projects for this resume
    const projects = await prisma.project.findMany({
      where: { resumeId },
      include: { techStack: true, link: true },
    });

    // If path is empty, it means we're updating the entire projects array
    if (path.length === 0) {
      // Delete all existing projects
      await prisma.project.deleteMany({
        where: { resumeId },
      });

      // Create new projects
      for (const project of value) {
        await prisma.project.create({
          data: {
            resumeId,
            title: project.title,
            description: project.description,
            techStack: {
              createMany: {
                data: project.techStack.map((tech: string) => ({
                  name: tech,
                })),
              },
            },
            link: project.link
              ? {
                  create: {
                    label: project.link.label,
                    href: project.link.href,
                  },
                }
              : undefined,
          },
        });
      }
      return;
    }

    // Handle specific project update
    const projectIndex = parseInt(path[0]);
    if (projectIndex >= projects.length) {
      throw new Error(`Project index ${projectIndex} out of bounds`);
    }

    const projectId = projects[projectIndex].id;

    // If path length is 1, we're updating a specific project
    if (path.length === 1) {
      // Delete the existing project
      await prisma.project.delete({
        where: { id: projectId },
      });

      // Create a new project
      await prisma.project.create({
        data: {
          resumeId,
          title: value.title,
          description: value.description,
          techStack: {
            createMany: {
              data: value.techStack.map((tech: string) => ({
                name: tech,
              })),
            },
          },
          link: value.link
            ? {
                create: {
                  label: value.link.label,
                  href: value.link.href,
                },
              }
            : undefined,
        },
      });
      return;
    }

    // Handle specific field update
    const field = path[1];
    if (field === "title" || field === "description") {
      await prisma.project.update({
        where: { id: projectId },
        data: { [field]: value },
      });
      return;
    }

    if (field === "techStack") {
      // Delete all existing tech stack entries
      await prisma.projectTech.deleteMany({
        where: { projectId },
      });

      // Create new tech stack entries
      await prisma.projectTech.createMany({
        data: value.map((tech: string) => ({
          projectId,
          name: tech,
        })),
      });
      return;
    }

    if (field === "link") {
      // Delete existing link if any
      await prisma.projectLink.deleteMany({
        where: { projectId },
      });

      // Create new link if provided
      if (value) {
        await prisma.projectLink.create({
          data: {
            projectId,
            label: value.label,
            href: value.href,
          },
        });
      }
      return;
    }

    throw new Error(`Unknown project field: ${path.join(".")}`);
  },

  /**
   * Seed the database with initial resume data
   */
  async seedDatabase() {
    try {
      // Create a default resume without a user
      const resume = await prisma.resume.create({
        data: {
          name: RESUME_DATA.name,
          initials: RESUME_DATA.initials,
          location: RESUME_DATA.location,
          locationLink: RESUME_DATA.locationLink,
          about: RESUME_DATA.about,
          summary: RESUME_DATA.summary?.toString() || "",
          avatarUrl: RESUME_DATA.avatarUrl,
          personalWebsiteUrl: RESUME_DATA.personalWebsiteUrl,
          contact: {
            create: {
              email: RESUME_DATA.contact.email,
              tel: RESUME_DATA.contact.tel,
              social: {
                createMany: {
                  data: RESUME_DATA.contact.social.map((social: any) => ({
                    name: social.name,
                    url: social.url,
                  })),
                },
              },
            },
          },
          education: {
            createMany: {
              data: RESUME_DATA.education.map((edu: any) => ({
                school: edu.school,
                degree: edu.degree,
                start: edu.start,
                end: edu.end,
              })),
            },
          },
          work: {
            create: RESUME_DATA.work.map((work: any) => {
              // Extract tasks from description if they exist
              const tasks: { description: string }[] = [];
              // For server-side seeding, we'll use a simpler approach
              // We'll extract tasks from the work object if it has them
              if (
                work.tasks &&
                Array.isArray(work.tasks) &&
                work.tasks.length > 0
              ) {
                // Filter and sanitize tasks
                work.tasks.forEach((task: any) => {
                  if (
                    task &&
                    (task.description || typeof task.description === "string")
                  ) {
                    const description =
                      typeof task.description === "string"
                        ? task.description.trim()
                        : String(task.description || "").trim();

                    if (description.length > 0) {
                      tasks.push({ description });
                    }
                  }
                });
              }

              return {
                company: work.company,
                link: work.link,
                title: work.title,
                start: work.start,
                ...(work.end !== null && work.end !== undefined
                  ? { end: work.end }
                  : {}),
                description: work.description?.toString() || "",
                badges: {
                  createMany: {
                    data: work.badges.map((badge: string) => ({
                      name: badge,
                    })),
                  },
                },
                // Add tasks if they exist
                tasks:
                  tasks.length > 0
                    ? {
                        createMany: {
                          data: tasks,
                        },
                      }
                    : undefined,
              };
            }),
          },
          skills: {
            createMany: {
              data: RESUME_DATA.skills.map((skill: string) => ({
                name: skill,
              })),
            },
          },
          projects: {
            create: RESUME_DATA.projects.map((project: any) => ({
              title: project.title,
              description: project.description,
              techStack: {
                createMany: {
                  data: project.techStack.map((tech: string) => ({
                    name: tech,
                  })),
                },
              },
              link: project.link
                ? {
                    create: {
                      label: project.link.label,
                      href: project.link.href,
                    },
                  }
                : undefined,
            })),
          },
        },
      });

      console.log("Database seeded with resume ID:", resume.id);
      return true;
    } catch (error) {
      console.error("Error seeding database:", error);
      return false;
    }
  },
};
