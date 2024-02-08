import { Timestamp } from "firebase/firestore";

export type Product = {
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  name: string;
  description: string;
  jiraProjectId?: string;
};

export type ProductWithId = Product & { id: string };

export type ProductInput = {
  name: string;
  description: string;
  jiraProjectId: string;
};
