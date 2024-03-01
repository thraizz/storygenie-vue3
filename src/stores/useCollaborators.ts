// Collaborators is a collection inside a user's product.
// It specifies who can access the product besides the owner.
// An example path to a document in the collection is:
// /ROOT_USERDATA_COLLECTION/nKaaFWfMR3R3rrKYlT722Tt6zycm/products/0P8O8nTCjYsLbbgryxpX/collaborators/OOVT3MG4UBwANwBUTImq

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { db } from "@/firebase";
import {
  ROOT_INVITES_COLLECTION,
  ROOT_USERDATA_COLLECTION,
} from "@/firebase_constants";

import { useProducts } from "./useProducts";
import { useUser } from "./useUser";

// Constants
const ITEM_PATH = "collaborators";

// Types
export type Collaborator = {
  email: string;
  name: string;
};
export type CollaboratorWithId = Collaborator & {
  id: string;
  type: "collaborator" | "collaborator_invite";
};

const mapDoc: (doc: QueryDocumentSnapshot) => CollaboratorWithId = (doc) => ({
  ...(doc.data() as Collaborator),
  type: "collaborator",
  id: doc.id,
});

// Store
export const useCollaborators = defineStore("collaborators", () => {
  // State
  const items = ref<CollaboratorWithId[]>([]);
  const isLoading = ref(false);

  // Utils
  const userStore = useUser();
  const uuid = computed(() => userStore.user?.uid);
  const productStore = useProducts();

  if (uuid.value && productStore.selectedItemId) {
    onSnapshot(
      collection(
        db,
        ROOT_USERDATA_COLLECTION,
        uuid.value,
        productStore.collectionName,
        productStore.selectedItemId.toString(),
        ITEM_PATH,
      ),
      (querySnapshot) => {
        isLoading.value = true;
        console.log(
          "Received collaborator update at ",
          new Date().toISOString(),
        );
        const updatedItems: CollaboratorWithId[] = [];
        querySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites) return;
          const existingItem = items.value.find((item) => item.id === doc.id);
          if (existingItem) {
            // Update existing item
            existingItem.id = doc.id;
            updatedItems.push(existingItem);
          } else {
            // Add new item
            updatedItems.push({
              ...(doc.data() as Collaborator),
              id: doc.id,
              type: "collaborator",
            });
          }
        });

        // Remove deleted items
        items.value = updatedItems
          .filter((item) =>
            querySnapshot.docs.some((doc) => doc.id === item.id),
          )
          .concat(
            items.value.filter((item) => item.type === "collaborator_invite"),
          );
        isLoading.value = false;
      },
    );
    onSnapshot(
      collection(
        db,
        ROOT_USERDATA_COLLECTION,
        uuid.value,
        productStore.collectionName,
        productStore.selectedItemId.toString(),
        "collaborator_invites",
      ),
      (querySnapshot) => {
        isLoading.value = true;
        console.log(
          "Updating collaborator_invites at",
          new Date().toISOString(),
        );
        const updatedItems: CollaboratorWithId[] = [];
        querySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites) return;
          const existingItem = items.value.find((item) => item.id === doc.id);
          if (existingItem) {
            // Update existing item
            existingItem.id = doc.id;
            updatedItems.push(existingItem);
          } else {
            // Add new item
            updatedItems.push({
              ...(doc.data() as Collaborator),
              id: doc.id,
              type: "collaborator",
            });
          }
        });

        // Remove deleted items
        items.value = updatedItems
          .filter((item) =>
            querySnapshot.docs.some((doc) => doc.id === item.id),
          )
          .concat(items.value.filter((item) => item.type === "collaborator"));
        isLoading.value = false;
      },
    );
  }

  const fetchItems = async () => {
    if (!userStore.user?.uid || !productStore.selectedItemId) return;

    isLoading.value = true;
    const itemsCollection = collection(
      db,
      ROOT_USERDATA_COLLECTION,
      userStore.user.uid,
      productStore.collectionName,
      productStore.selectedItemId.toString(),
      ITEM_PATH,
    );
    const itemsSnapshot = await getDocs(itemsCollection);
    const itemsList = await itemsSnapshot.docs.map(mapDoc);

    const invitesCollection = collection(
      db,
      ROOT_USERDATA_COLLECTION,
      userStore.user.uid,
      productStore.collectionName,
      productStore.selectedItemId.toString(),
      "collaborator_invites",
    );

    const invitesSnapshot = await getDocs(invitesCollection);
    await invitesSnapshot.docs.forEach((doc) =>
      itemsList.push({
        ...(doc.data() as Collaborator),
        type: "collaborator_invite",
        id: doc.id,
      }),
    );

    items.value = itemsList;

    isLoading.value = false;
  };

  const setAttributeOfItem = async (item: CollaboratorWithId, text: string) => {
    if (uuid.value === undefined || !productStore.selectedItemId) return;

    await updateDoc(
      doc(
        db,
        ROOT_USERDATA_COLLECTION,
        uuid.value,
        productStore.collectionName,
        productStore.selectedItemId.toString(),
        ITEM_PATH,
        item.id,
      ),
      {
        text,
      },
    );

    await fetchItems();
  };

  const putItem = async (item: CollaboratorWithId) => {
    if (uuid.value === undefined || !productStore.selectedItemId) return;

    await setDoc(
      doc(
        db,
        ROOT_USERDATA_COLLECTION,
        uuid.value,
        productStore.collectionName,
        productStore.selectedItemId.toString(),
        ITEM_PATH,
        item.id,
      ),
      item,
    );

    await fetchItems();
  };

  const postItem = async (item: Collaborator) => {
    if (uuid.value === undefined || !productStore.selectedItemId) return;

    const inviteDocRef = doc(
      db,
      "collaborators_invites",
      item.email,
      productStore.collectionName,
      productStore.selectedItemId.toString(),
    );
    await Promise.all([
      setDoc(inviteDocRef, {
        uid: doc(
          db,
          ROOT_USERDATA_COLLECTION,
          uuid.value,
          productStore.collectionName,
          productStore.selectedItemId.toString(),
        ),
      }),
      setDoc(
        doc(
          db,
          ROOT_USERDATA_COLLECTION,
          uuid.value,
          productStore.collectionName,
          productStore.selectedItemId.toString(),
          "collaborator_invites",
          item.email,
        ),
        {
          email: item.email,
          name: item.name,
          ref: inviteDocRef,
        },
      ),
    ]);

    await fetchItems();
  };

  const getItem = (id: string) => {
    return items.value.find((item) => item.id === id);
  };

  const deleteItem = async (collaborator: CollaboratorWithId) => {
    if (uuid.value === undefined || !productStore.selectedItemId) return;
    console.log(collaborator);

    await deleteDoc(
      doc(
        db,
        ROOT_USERDATA_COLLECTION,
        uuid.value,
        productStore.collectionName,
        productStore.selectedItemId.toString(),
        collaborator.type === "collaborator_invite"
          ? "collaborator_invites"
          : "collaborators",
        collaborator.type === "collaborator_invite"
          ? collaborator.email
          : collaborator.id,
      ),
    );

    if (collaborator.type === "collaborator_invite") {
      await deleteDoc(
        doc(
          db,
          ROOT_INVITES_COLLECTION,
          collaborator.email,
          productStore.collectionName,
          productStore.selectedItemId.toString(),
        ),
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
    await fetchItems();
  };

  // Util
  // useRefetchOnAuthChange(fetchItems);

  return {
    setAttributeOfItem,
    putItem,
    postItem,
    deleteItem,
    items,
    fetchItems,
    getItem,
    isLoading,
  };
});
