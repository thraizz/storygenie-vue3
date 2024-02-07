import { Timestamp } from "firebase/firestore";

export type Product = {
  id: string;
  createdAt: Timestamp;
  updatedAt: string;
  deletedAt: string;
  userID: string;
  name: string;
  description: string;
  isExample: boolean;
  jiraProjectId: string;
};

export type ProductWithId = Product & { id: string };

export type ProductInput = {
  name: string;
  description: string;
  jiraProjectId: string;
};
