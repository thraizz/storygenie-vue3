import { Timestamp } from "firebase/firestore";

export type Product = {
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  name: string;
  description: string;
  jiraProjectId?: string;
};
export type CollaboratorProduct = Product & {
  id: string;
  role: "collaborator";
  referencePath: string;
};
export type ProductWithId =
  | (Product & {
      id: string;
      role: "owner";
    })
  | CollaboratorProduct;

export type ProductInput = {
  name: string;
  description: string;
  jiraProjectId: string;
};
