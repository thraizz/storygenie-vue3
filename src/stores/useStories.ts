import {
  collection,
  deleteDoc,
  doc,
  getDocsFromServer,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

import { db } from "@/firebase";
import { ROOT_USERDATA_COLLECTION } from "@/firebase_constants";
import { useUser } from "@/stores/useUser";
import { Story, StoryWithId } from "@/types/story";

import { useProducts } from "./useProducts";

const ITEM_PATH = "stories";

export const useStories = defineStore(ITEM_PATH, () => {
  const items = ref<StoryWithId[]>([]);

  const userStore = useUser();
  const productStore = useProducts();

  const uuid = computed(() => userStore.user?.uid);
  const selectedProduct = computed(() => productStore.selectedProduct);

  watch(
    () => userStore.isLoggedIn,
    (isLoggedIn) => {
      if (isLoggedIn) {
        fetchItems();
      }
    },
  );

  const storiesCollection = computed(() =>
    uuid.value && productStore.selectedItemId
      ? selectedProduct.value?.role === "collaborator"
        ? collection(db, selectedProduct.value.referencePath + "/stories")
        : collection(
            db,
            ROOT_USERDATA_COLLECTION,
            uuid.value,
            productStore.collectionName,
            productStore.selectedItemId.toString(),
            ITEM_PATH,
          )
      : null,
  );

  if (storiesCollection.value) {
    onSnapshot(storiesCollection.value, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.metadata.hasPendingWrites) return;
        items.value = items.value.filter((item) => item.id !== doc.id);
        items.value.push({
          ...(doc.data() as Story),
          id: doc.id,
        });
      });
    });
  }

  const fetchItems = async () => {
    if (!storiesCollection.value) return;

    console.log(selectedProduct.value?.role);
    const itemsSnapshot = await getDocsFromServer(storiesCollection.value);
    items.value = (await itemsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))) as StoryWithId[];
  };

  const setAttributeOfItem = async (item: StoryWithId, text: string) => {
    if (uuid.value === undefined) return;

    const docRef = doc(
      db,
      ROOT_USERDATA_COLLECTION,
      uuid.value,
      productStore.collectionName,
      item.id,
    );
    await updateDoc(docRef, {
      text,
    });
  };

  const putItem = async (item: StoryWithId) => {
    if (!storiesCollection.value) return;

    await setDoc(doc(storiesCollection.value, item.id), item);
  };

  const deleteStory = async (item: StoryWithId) => {
    if (!storiesCollection.value) return;
    await deleteDoc(doc(storiesCollection.value, item.id));
  };

  return {
    setAttributeOfItem,
    putItem,
    items,
    fetchItems,
    deleteStory,
  };
});
