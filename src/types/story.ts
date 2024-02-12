import { Timestamp } from "firebase/firestore";

export type Story = {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  content: Doc;
  jiraIssueID?: string;
};

export type StoryWithId = Story & { id: string };

type Content = {
  attrs?: {
    level: number;
  };
  content?: Content[];
  marks?: {
    type: string;
  }[];
  text?: string;
  type: string;
};

type Doc = {
  content: Content[];
  type: string;
};

export const getHeadlineFromDoc = (doc: Doc): string => {
  const heading = doc.content.find(
    (content) => content.type === "heading" && content.attrs?.level === 1,
  );
  if (heading) {
    return heading.content?.[0].text as string;
  }

  return "";
};
