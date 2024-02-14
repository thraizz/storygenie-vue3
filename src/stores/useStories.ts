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

import { useSelectedProductId } from "@/composables/useSelectedProduct";
import { db } from "@/firebase";
import { useUser } from "@/stores/useUser";
import { StoryWithId } from "@/types/story";

import { useProducts } from "./useProducts";

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

  const selectedProduct = useSelectedProductId();

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

    const docRef = doc(db, "userdata", uuid.value, productStore.key, item.id);
    await updateDoc(docRef, {
      text,
    });
    fetchItems();
  };

  const putItem = async (item: StoryWithId) => {
    console.log(
      "userdata",
      uuid.value,
      productStore.key,
      selectedProduct.value,
      ITEM_PATH,
      item.id,
    );
    if (uuid.value === undefined || !selectedProduct.value) return;

    await setDoc(
      doc(
        db,
        "userdata",
        uuid.value,
        productStore.key,
        selectedProduct.value as string,
        ITEM_PATH,
        item.id,
      ),
      item,
    );
    fetchItems();
  };

  const deleteStory = async (item: StoryWithId) => {
    if (uuid.value === undefined || !selectedProduct.value) return;
    await deleteDoc(
      doc(
        db,
        "userdata",
        uuid.value,
        productStore.key,
        selectedProduct.value as string,
        ITEM_PATH,
        item.id,
      ),
    );
  };

  return {
    setAttributeOfItem,
    putItem,
    items,
    fetchItems,
    deleteStory,
  };
});
