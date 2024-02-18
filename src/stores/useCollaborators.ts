// Collaborators is a collection inside a user's product.
// It specifies who can access the product besides the owner.
// An example path to a document in the collection is:
// /ROOT_USERDATA_COLLECTION/nKaaFWfMR3R3rrKYlT722Tt6zycm/products/0P8O8nTCjYsLbbgryxpX/collaborators/OOVT3MG4UBwANwBUTImq

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

import { useRefetchOnAuthChange } from "@/composables/refetchWhenLoggedIn";
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

// Store
export const useCollaborators = defineStore("collaborators", () => {
  // State
  const items = ref<CollaboratorWithId[]>([]);

  // Utils
  const userStore = useUser();
  const uuid = computed(() => userStore.user?.uid);
  const productStore = useProducts();

  const fetchItems = async () => {
    if (!userStore.user?.uid || !productStore.selectedItem) return;
    const itemsCollection = collection(
      db,
      ROOT_USERDATA_COLLECTION,
      userStore.user.uid,
      productStore.collectionName,
      productStore.selectedItem.toString(),
      ITEM_PATH,
    );
    const itemsSnapshot = await getDocs(itemsCollection);
    const itemsList = (await itemsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      type: "collaborator",
      id: doc.id,
    }))) as CollaboratorWithId[];

    const invitesCollection = collection(
      db,
      ROOT_USERDATA_COLLECTION,
      userStore.user.uid,
      productStore.collectionName,
      productStore.selectedItem.toString(),
      "collaborator_invites",
    );

    const invitesSnapshot = await getDocs(invitesCollection);
    await invitesSnapshot.docs.forEach((doc) =>
      itemsList.push({
        ...(doc.data() as CollaboratorWithId),
        type: "collaborator_invite",
        id: doc.id,
      }),
    );

    items.value = itemsList;
  };

  const setAttributeOfItem = async (item: CollaboratorWithId, text: string) => {
    if (uuid.value === undefined || !productStore.selectedItem) return;

    await updateDoc(
      doc(
        db,
        ROOT_USERDATA_COLLECTION,
        uuid.value,
        productStore.collectionName,
        productStore.selectedItem.toString(),
        ITEM_PATH,
        item.id,
      ),
      {
        text,
      },
    );
    fetchItems();
  };

  const putItem = async (item: CollaboratorWithId) => {
    if (uuid.value === undefined || !productStore.selectedItem) return;

    await setDoc(
      doc(
        db,
        ROOT_USERDATA_COLLECTION,
        uuid.value,
        productStore.collectionName,
        productStore.selectedItem.toString(),
        ITEM_PATH,
        item.id,
      ),
      item,
    );
    fetchItems();
  };

  const postItem = async (item: Collaborator) => {
    if (uuid.value === undefined || !productStore.selectedItem) return;

    const inviteDocRef = doc(
      db,
      "collaborators_invites",
      item.email,
      productStore.collectionName,
      productStore.selectedItem.toString(),
    );
    await setDoc(inviteDocRef, {
      uid: doc(
        db,
        ROOT_USERDATA_COLLECTION,
        uuid.value,
        productStore.collectionName,
        productStore.selectedItem.toString(),
      ),
    });
    await setDoc(
      doc(
        db,
        ROOT_USERDATA_COLLECTION,
        uuid.value,
        productStore.collectionName,
        productStore.selectedItem.toString(),
        "collaborator_invites",
        item.email,
      ),
      {
        email: item.email,
        name: item.name,
        ref: inviteDocRef,
      },
    );
    fetchItems();
  };

  const getItem = (id: string) => {
    return items.value.find((item) => item.id === id);
  };

  const deleteItem = async (collaborator: CollaboratorWithId) => {
    if (uuid.value === undefined || !productStore.selectedItem) return;

    await deleteDoc(
      doc(
        db,
        ROOT_USERDATA_COLLECTION,
        uuid.value,
        productStore.collectionName,
        productStore.selectedItem.toString(),
        collaborator.type === "collaborator_invite"
          ? "collaborator_invites"
          : "collaborators",
        collaborator.id,
      ),
    );
    if (collaborator.type === "collaborator_invite") {
      await deleteDoc(
        doc(
          db,
          ROOT_INVITES_COLLECTION,
          collaborator.email,
          productStore.collectionName,
          productStore.selectedItem.toString(),
        ),
      );
    }
    fetchItems();
  };

  // Util
  useRefetchOnAuthChange(fetchItems);
  watch(
    () => userStore.isLoggedIn,
    (isLoggedIn) => {
      if (isLoggedIn) {
        fetchItems();
      }
    },
  );

  return {
    setAttributeOfItem,
    putItem,
    postItem,
    deleteItem,
    items,
    fetchItems,
    getItem,
  };
});
