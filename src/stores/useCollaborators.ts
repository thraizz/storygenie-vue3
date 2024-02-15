// Collaborators is a collection inside a user's product.
// It specifies who can access the product besides the owner.
// An example path to a document in the collection is:
// /userdata/nKaaFWfMR3R3rrKYlT722Tt6zycm/products/0P8O8nTCjYsLbbgryxpX/collaborators/OOVT3MG4UBwANwBUTImq

import {
  addDoc,
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

import { useProducts } from "./useProducts";
import { useUser } from "./useUser";

export type Collaborator = {
  email: string;
  name: string;
};

export type CollaboratorWithId = Collaborator & {
  id: string;
};

const ITEM_PATH = "collaborators";

export const useCollaborators = defineStore("collaborators", () => {
  const items = ref<CollaboratorWithId[]>([]);
  const userStore = useUser();

  const uuid = computed(() => userStore.user?.uid);

  watch(
    () => userStore.isLoggedIn,
    (isLoggedIn) => {
      if (isLoggedIn) {
        fetchItems();
      }
    },
  );

  const productStore = useProducts();

  const fetchItems = async () => {
    if (!userStore.user?.uid || !productStore.selectedItem) return;
    const itemsCollection = collection(
      db,
      "userdata",
      userStore.user.uid,
      productStore.key,
      productStore.selectedItem.toString(),
      ITEM_PATH,
    );
    const itemsSnapshot = await getDocs(itemsCollection);
    const itemsList = (await itemsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))) as CollaboratorWithId[];

    items.value = itemsList;
  };
  useRefetchOnAuthChange(fetchItems);

  const setAttributeOfItem = async (item: CollaboratorWithId, text: string) => {
    if (uuid.value === undefined || !productStore.selectedItem) return;

    await updateDoc(
      doc(
        db,
        "userdata",
        uuid.value,
        productStore.key,
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
        "userdata",
        uuid.value,
        productStore.key,
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

    await addDoc(
      collection(
        db,
        "userdata",
        uuid.value,
        productStore.key,
        productStore.selectedItem.toString(),
        ITEM_PATH,
      ),
      item,
    );
    fetchItems();
  };

  const getItem = (id: string) => {
    return items.value.find((item) => item.id === id);
  };

  const deleteItem = async (id: string) => {
    if (uuid.value === undefined || !productStore.selectedItem) return;

    await deleteDoc(
      doc(
        db,
        "userdata",
        uuid.value,
        productStore.key,
        productStore.selectedItem.toString(),
        ITEM_PATH,
        id,
      ),
    );
    fetchItems();
  };

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
