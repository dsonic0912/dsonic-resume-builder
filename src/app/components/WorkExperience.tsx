"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { RESUME_DATA } from "@/data/resume-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EditableContent } from "@/components/ui/editable-content";
import { useResume } from "@/context/resume-context";
import React, { useState } from "react";
import { PlusIcon, XIcon, PencilIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useEditMode } from "@/context/edit-mode-context";

type WorkExperience = (typeof RESUME_DATA)["work"][number];
type WorkBadges = readonly string[];

interface BadgeListProps {
  className?: string;
  badges: WorkBadges;
  workIndex: number;
}

/**
 * Renders a list of badges for work experience with edit functionality
 * Handles both mobile and desktop layouts through className prop
 */
function BadgeList({ className, badges, workIndex }: BadgeListProps) {
  const { updateField } = useResume();
  const { isEditMode } = useEditMode();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBadge, setEditingBadge] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [newBadge, setNewBadge] = useState("");

  // Ensure badges is always an array
  const badgesArray = Array.isArray(badges) ? badges : [];

  const handleAddBadge = () => {
    if (newBadge.trim() === "") return;

    // Add the new badge to the bottom of the list
    const updatedBadges = [...badgesArray, newBadge];
    updateField(["work", workIndex.toString(), "badges"], updatedBadges);

    setNewBadge("");
    setIsDialogOpen(false);
    console.log("Badge added:", newBadge, "to work index:", workIndex);
  };

  if (badgesArray.length === 0 && !className?.includes("sm:hidden")) {
    return isEditMode ? (
      <>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1 text-xs"
          onClick={() => {
            setIsEditing(false);
            setNewBadge("");
            setIsDialogOpen(true);
            console.log("Add Skills button clicked, dialog should open");
          }}
        >
          <PlusIcon className="mr-1 h-3 w-3" /> Add Skills
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <input
                type="text"
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value)}
                className="w-full rounded-md border border-input bg-[hsl(var(--background))] px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Enter skill or technology"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBadge}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    ) : null;
  }

  const handleEditBadge = (badge: string, index: number) => {
    setEditingBadge(badge);
    setEditingIndex(index);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteBadge = (index: number) => {
    const updatedBadges = [...badgesArray];
    updatedBadges.splice(index, 1);
    updateField(["work", workIndex.toString(), "badges"], updatedBadges);
  };

  const handleSaveBadge = () => {
    if (editingBadge.trim() === "") return;

    const updatedBadges = [...badgesArray];
    updatedBadges[editingIndex] = editingBadge;
    updateField(["work", workIndex.toString(), "badges"], updatedBadges);

    setIsEditing(false);
    setIsDialogOpen(false);
  };

  return (
    <>
      <div
        className={cn(
          "relative",
          className?.includes("sm:hidden") ? "mt-2" : "",
        )}
      >
        <ul
          className={cn("inline-flex list-none flex-wrap gap-1 p-0", className)}
          aria-label="Technologies used"
        >
          {badgesArray.map((badge, index) => (
            <li key={`${badge}-${index}`} className="group relative">
              <Badge
                variant="secondary"
                className="pr-5 align-middle text-xs print:px-1 print:py-0.5 print:text-[8px] print:leading-tight"
              >
                {badge}
                {isEditMode && (
                  <span className="absolute right-1 top-1/2 flex -translate-y-1/2 space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 p-0"
                      onClick={() => handleEditBadge(badge, index)}
                    >
                      <PencilIcon className="h-2 w-2" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 p-0 text-destructive"
                      onClick={() => handleDeleteBadge(index)}
                    >
                      <XIcon className="h-2 w-2" />
                    </Button>
                  </span>
                )}
              </Badge>
            </li>
          ))}
          {isEditMode && (
            <li>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 px-1 text-xs"
                onClick={() => {
                  setIsEditing(false);
                  setNewBadge("");
                  setIsDialogOpen(true);
                  console.log("Add button clicked, dialog should open");
                }}
              >
                <PlusIcon className="mr-1 h-3 w-3" /> Add
              </Button>
            </li>
          )}
        </ul>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Skill" : "Add New Skill"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <input
              type="text"
              value={isEditing ? editingBadge : newBadge}
              onChange={(e) =>
                isEditing
                  ? setEditingBadge(e.target.value)
                  : setNewBadge(e.target.value)
              }
              className="w-full rounded-md border border-input bg-[hsl(var(--background))] px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Enter skill or technology"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={isEditing ? handleSaveBadge : handleAddBadge}>
              {isEditing ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Note: WorkPeriod component is not currently used but kept for future reference
// interface WorkPeriodProps {
//   start: WorkExperience["start"];
//   end?: WorkExperience["end"];
// }

// /**
//  * Displays the work period in a consistent format
//  */
// function WorkPeriod({ start, end }: WorkPeriodProps) {
//   return (
//     <div
//       className="text-sm tabular-nums text-gray-500"
//       aria-label={`Employment period: ${start} to ${end ?? "Present"}`}
//     >
//       {start} - {end ?? "Present"}
//     </div>
//   );
// }

interface CompanyLinkProps {
  company: WorkExperience["company"];
  link: WorkExperience["link"];
}

/**
 * Renders company name with optional link
 */
function CompanyLink({ company, link }: CompanyLinkProps) {
  if (!link) {
    return <span>{company}</span>;
  }

  return (
    <a
      className="inline-flex items-center gap-1 hover:underline"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${company} company website (opens in new tab)`}
    >
      {company}
      <span
        className="size-1 rounded-full bg-green-500"
        aria-label="Active company indicator"
      />
    </a>
  );
}

interface WorkExperienceItemProps {
  work: WorkExperience;
}

/**
 * Individual work experience card component
 * Handles responsive layout for badges (mobile/desktop)
 */
function WorkExperienceItem({ work }: WorkExperienceItemProps) {
  const { company, link, badges, title, start, end, description } = work;
  const { updateField } = useResume();
  const { isEditMode } = useEditMode();
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [editedLink, setEditedLink] = useState(link || "");

  // Find the index of this work item
  const workIndex = RESUME_DATA.work.findIndex(
    (w) => w.company === company && w.start === start,
  );

  const handleCompanyUpdate = (newValue: string) => {
    if (workIndex !== -1) {
      updateField(["work", workIndex.toString(), "company"], newValue);
    }
  };

  const handleTitleUpdate = (newValue: string) => {
    if (workIndex !== -1) {
      updateField(["work", workIndex.toString(), "title"], newValue);
    }
  };

  const handleStartUpdate = (newValue: string) => {
    if (workIndex !== -1) {
      updateField(["work", workIndex.toString(), "start"], newValue);
    }
  };

  const handleEndUpdate = (newValue: string) => {
    if (workIndex !== -1) {
      updateField(["work", workIndex.toString(), "end"], newValue || null);
    }
  };

  const handleDescriptionUpdate = (newValue: string) => {
    if (workIndex !== -1) {
      // Check if the original description is a JSX element
      const isJSX =
        React.isValidElement(description) ||
        (typeof description === "object" && description !== null);

      // If it's JSX, wrap the new value in a fragment to maintain consistency
      const newDescription = isJSX ? <>{newValue}</> : newValue;
      updateField(
        ["work", workIndex.toString(), "description"],
        newDescription,
      );
    }
  };

  // Function to extract list items from description JSX
  const extractListItems = (): string[] => {
    if (!description || typeof description === "string") return [];

    // Try to find list items in the description
    let items: string[] = [];

    // Handle React elements
    if (React.isValidElement(description)) {
      const children = (description as any).props?.children;

      if (Array.isArray(children)) {
        // Look for ul element in children
        children.forEach((child: any) => {
          if (React.isValidElement(child) && child.type === "ul") {
            const listItems = (child as any).props?.children;
            if (Array.isArray(listItems)) {
              items = listItems
                .map((item: any) => {
                  if (React.isValidElement(item) && item.type === "li") {
                    const itemChildren = (item as any).props?.children;
                    return itemChildren ? itemChildren.toString() : "";
                  }
                  return "";
                })
                .filter(Boolean);
            }
          }
        });
      }
    }

    return items;
  };

  // Extract text content from description, excluding the list
  const getDescriptionTextWithoutList = (): string => {
    if (typeof description === "string") return description;

    if (React.isValidElement(description)) {
      const children = (description as any).props?.children;
      if (Array.isArray(children)) {
        return children
          .filter(
            (child: any) =>
              !React.isValidElement(child) || (child as any).type !== "ul",
          )
          .map((child: any) => (typeof child === "string" ? child : ""))
          .join("");
      }
    }

    return "";
  };

  // State for list item management
  const [isListItemDialogOpen, setIsListItemDialogOpen] = useState(false);
  const [editingListItemIndex, setEditingListItemIndex] = useState(-1);
  const [newListItemText, setNewListItemText] = useState("");

  // Function to add a new list item
  const handleAddListItem = (newItem: string) => {
    if (workIndex === -1 || !newItem.trim()) return;

    const items = extractListItems();
    const newItems = [...items, newItem];
    const descriptionText = getDescriptionTextWithoutList();

    const newDescription = (
      <>
        {descriptionText}
        <ul className="list-inside list-disc">
          {newItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </>
    );

    updateField(["work", workIndex.toString(), "description"], newDescription);
    setIsListItemDialogOpen(false);
    setNewListItemText("");
  };

  // Function to edit a list item
  const handleEditListItem = (index: number, newText: string) => {
    if (workIndex === -1) return;

    const items = extractListItems();
    if (index < 0 || index >= items.length) return;

    const newItems = [...items];
    newItems[index] = newText;
    const descriptionText = getDescriptionTextWithoutList();

    const newDescription = (
      <>
        {descriptionText}
        <ul className="list-inside list-disc">
          {newItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </>
    );

    updateField(["work", workIndex.toString(), "description"], newDescription);
    setIsListItemDialogOpen(false);
    setEditingListItemIndex(-1);
    setNewListItemText("");
  };

  // Function to delete a list item
  const handleDeleteListItem = (index: number) => {
    if (workIndex === -1) return;

    const items = extractListItems();
    if (index < 0 || index >= items.length) return;

    const newItems = items.filter((_, idx) => idx !== index);
    const descriptionText = getDescriptionTextWithoutList();

    const newDescription = (
      <>
        {descriptionText}
        {newItems.length > 0 && (
          <ul className="list-inside list-disc">
            {newItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
      </>
    );

    updateField(["work", workIndex.toString(), "description"], newDescription);
  };

  // Open dialog to add a new list item
  const openAddListItemDialog = () => {
    setEditingListItemIndex(-1);
    setNewListItemText("");
    setIsListItemDialogOpen(true);
  };

  // Open dialog to edit a list item
  const openEditListItemDialog = (index: number) => {
    const items = extractListItems();
    if (index >= 0 && index < items.length) {
      setEditingListItemIndex(index);
      setNewListItemText(items[index]);
      setIsListItemDialogOpen(true);
    }
  };

  const handleLinkUpdate = () => {
    if (workIndex !== -1) {
      updateField(["work", workIndex.toString(), "link"], editedLink || null);
      setIsLinkDialogOpen(false);
    }
  };

  const openLinkDialog = () => {
    setEditedLink(link || "");
    setIsLinkDialogOpen(true);
  };

  const cardClassName =
    company === "LBSTek"
      ? "py-1 print:py-0 print-force-new-page"
      : "py-1 print:py-0";

  return (
    <Card className={cardClassName}>
      <CardHeader className="print:space-y-1">
        <div className="flex items-center justify-between gap-x-2 text-base">
          <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none print:text-sm">
            <div className="flex items-center">
              {isEditMode ? (
                <EditableContent
                  content={company}
                  onSave={handleCompanyUpdate}
                />
              ) : (
                <CompanyLink company={company} link={link} />
              )}
              {isEditMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-6 w-6 p-0"
                  onClick={openLinkDialog}
                  title="Edit company link"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                </Button>
              )}
            </div>
            <BadgeList
              className="hidden gap-x-1 sm:inline-flex"
              badges={badges}
              workIndex={workIndex}
            />
          </h3>
          <div className="text-sm tabular-nums text-gray-500">
            <EditableContent
              content={start}
              onSave={handleStartUpdate}
              className="inline"
            />{" "}
            -{" "}
            <EditableContent
              content={end || "Present"}
              onSave={handleEndUpdate}
              className="inline"
            />
          </div>
        </div>

        <h4 className="font-mono text-sm font-semibold leading-none print:text-[14px]">
          <EditableContent content={title} onSave={handleTitleUpdate} />
        </h4>
      </CardHeader>

      <CardContent>
        <div className="mt-2 text-pretty text-xs text-foreground/80 print:mt-1 print:text-[12px]">
          {!isEditMode ? (
            <EditableContent
              content={description}
              onSave={handleDescriptionUpdate}
              multiline={true}
              dialogTitle="Edit Job Description"
            />
          ) : (
            <>
              {/* In edit mode, show only the description text without the list */}
              <EditableContent
                content={getDescriptionTextWithoutList()}
                onSave={handleDescriptionUpdate}
                multiline={true}
                dialogTitle="Edit Job Description"
              />

              {/* List items management */}
              <div className="mt-2">
                <button
                  onClick={openAddListItemDialog}
                  className="flex items-center text-xs text-primary hover:underline"
                >
                  <PlusIcon className="mr-1 h-3 w-3" /> Add Bullet Point
                </button>

                {extractListItems().length > 0 && (
                  <ul className="mt-2 list-inside list-disc">
                    {extractListItems().map((item, index) => (
                      <li key={index} className="group relative">
                        {item}
                        <span className="absolute right-0 top-1/2 flex -translate-y-1/2 space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0"
                            onClick={() => openEditListItemDialog(index)}
                          >
                            <PencilIcon className="h-2 w-2" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 text-destructive"
                            onClick={() => handleDeleteListItem(index)}
                          >
                            <XIcon className="h-2 w-2" />
                          </Button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
        <div className="mt-2">
          <BadgeList
            className="-mx-2 flex-wrap gap-1 sm:hidden"
            badges={badges}
            workIndex={workIndex}
          />
        </div>

        {/* Dialog for adding/editing list items */}
        <Dialog
          open={isListItemDialogOpen}
          onOpenChange={setIsListItemDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingListItemIndex === -1
                  ? "Add Bullet Point"
                  : "Edit Bullet Point"}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <textarea
                value={newListItemText}
                onChange={(e) => setNewListItemText(e.target.value)}
                className="min-h-[100px] w-full rounded-md border border-input bg-[hsl(var(--background))] px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Enter bullet point text"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsListItemDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  editingListItemIndex === -1
                    ? handleAddListItem(newListItemText)
                    : handleEditListItem(editingListItemIndex, newListItemText)
                }
              >
                {editingListItemIndex === -1 ? "Add" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>

      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Company Link</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <input
              type="text"
              value={editedLink}
              onChange={(e) => setEditedLink(e.target.value)}
              className="w-full rounded-md border border-input bg-[hsl(var(--background))] px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="https://example.com"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsLinkDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleLinkUpdate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

interface WorkExperienceProps {
  work: (typeof RESUME_DATA)["work"];
}

/**
 * Main work experience section component
 * Renders a list of work experiences in chronological order
 */
export function WorkExperience({ work }: WorkExperienceProps) {
  const { resumeData, updateField } = useResume();
  const { isEditMode } = useEditMode();

  const handleAddWork = () => {
    // Get current year for the start date
    const currentYear = new Date().getFullYear();

    const newWork = {
      company: "New Company",
      link: "#",
      badges: [], // Initialize with an empty array to allow adding badges later
      title: "Job Title",
      logo: null,
      start: currentYear.toString(), // Use current year as default
      end: null,
      description: "Job description goes here.",
    };

    // Add the new work experience to the beginning of the array
    const updatedWork = [newWork, ...resumeData.work];
    updateField(["work"], updatedWork);
  };

  return (
    <Section>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" id="work-experience">
          Work Experience
        </h2>
        {isEditMode && (
          <button
            onClick={handleAddWork}
            className="rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground hover:bg-primary/90"
          >
            Add Work +
          </button>
        )}
      </div>
      <div
        className="space-y-4 print:space-y-0"
        role="feed"
        aria-labelledby="work-experience"
      >
        {work.map((item) => (
          <article key={`${item.company}-${item.start}`} role="article">
            <WorkExperienceItem work={item} />
          </article>
        ))}
      </div>
    </Section>
  );
}
