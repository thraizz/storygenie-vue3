import { Timestamp } from "firebase/firestore";

export type Story = {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  acceptanceCriteria: string[];
  headline: string;
  userStory: string;
  jiraIssueID?: string;
};

export type StoryWithId = Story & { id: string };
