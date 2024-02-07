import {
  addDoc,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

import { db } from "@/firebase";
import { useUser } from "@/stores/user";
import { Story, StoryWithId } from "@/types/story";
import { useProducts } from "./products";

const ITEM_PATH = "stories";

export const useStories = defineStore(ITEM_PATH, () => {
  const items = ref<StoryWithId[]>([]);
  const userStore = useUser();

  const productStore = useProducts();

  const uuid = computed(() => userStore.user?.uid);

  watch(
    () => userStore.isLoggedIn,
    (isLoggedIn) => {
      if (isLoggedIn) {
        fetchItems();
      }
    },
  );

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
    }))) as StoryWithId[];

    items.value = itemsList;
  };

  const setAttributeOfItem = async (item: StoryWithId, text: string) => {
    if (uuid.value === undefined) return;

    const boardRef = doc(db, "userdata", uuid.value, "items", item.id);
    await updateDoc(boardRef, {
      text,
    });
    fetchItems();
  };

  const putItem = async (item: StoryWithId) => {
    if (uuid.value === undefined) return;

    await setDoc(
      doc(db, "userdata", uuid.value, productStore.key, item.id, ITEM_PATH),
      item,
    );
    fetchItems();
  };

  const createItem = async (item: Story) => {
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

  return {
    setAttributeOfItem,
    putItem,
    createItem,
    items,
    fetchItems,
  };
});
