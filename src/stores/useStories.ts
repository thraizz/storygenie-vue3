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
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import { db } from "@/firebase";
import { ROOT_USERDATA_COLLECTION } from "@/firebase_constants";
import { useUser } from "@/stores/useUser";
import { Story, StoryWithId } from "@/types/story";

import { useProducts } from "./useProducts";

const ITEM_PATH = "stories";

export const useStories = defineStore(ITEM_PATH, () => {
  const items = ref<StoryWithId[]>([]);
  const isLoading = ref(false);

  const userStore = useUser();
  const productStore = useProducts();
  const router = useRouter();

  const uuid = computed(() => userStore.user?.uid);
  const selectedProduct = computed(() => productStore.selectedProduct);

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

  const watchStories = () => {
    if (storiesCollection.value) {
      onSnapshot(storiesCollection.value, (querySnapshot) => {
        console.log("Received new stories at " + new Date().toISOString());
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
  };

  const fetchItems = async () => {
    if (!storiesCollection.value) return;

    isLoading.value = true;

    try {
      // Get timestamp before fetch
      console.log("Fetching items at " + new Date().toISOString());
      const itemsSnapshot = await getDocsFromServer(storiesCollection.value);
      console.log("Done at " + new Date().toISOString());
      items.value = itemsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as StoryWithId[];
    } catch (e) {
      console.error("Error fetching items", e);
      router.push("/");
    }

    isLoading.value = false;
  };
  // useRefetchOnAuthChange(fetchItems);

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

    await fetchItems();
  };

  const putItem = async (item: StoryWithId) => {
    if (!storiesCollection.value) return;

    await setDoc(doc(storiesCollection.value, item.id), item);
  };

  const deleteStory = async (item: StoryWithId) => {
    if (!storiesCollection.value) return;
    await deleteDoc(doc(storiesCollection.value, item.id));

    await fetchItems();
  };

  const fetchIfEmpty = async () => {
    if (items.value.length === 0) {
      await fetchItems();
    }
  };

  return {
    setAttributeOfItem,
    putItem,
    items,
    fetchItems,
    deleteStory,
    watchStories,
    fetchIfEmpty,
    isLoading,
  };
});
