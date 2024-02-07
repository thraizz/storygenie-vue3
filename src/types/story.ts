import { Timestamp } from "firebase/firestore";

export type Story = {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  headline: string;
  userStory: string;
  jiraIssueID?: string;
};

export type StoryWithId = Story & { id: string };
