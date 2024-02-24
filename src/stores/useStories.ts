import {
  collection,
  deleteDoc,
  doc,
  getDocsFromServer,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";

import { db } from "@/firebase";
import { ROOT_USERDATA_COLLECTION } from "@/firebase_constants";
import { useUser } from "@/stores/useUser";
import { StoryWithId } from "@/types/story";

import { useProducts } from "./useProducts";

const ITEM_PATH = "stories";

export const useStories = defineStore(ITEM_PATH, () => {
  const items = ref<StoryWithId[]>([]);

  const userStore = useUser();
  const productStore = useProducts();
  const router = useRouter();

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

  // if (storiesCollection.value) {
  //   onSnapshot(storiesCollection.value, (querySnapshot) => {
  //     console.log("Received new stories at " + new Date().toISOString());
  //     querySnapshot.forEach((doc) => {
  //       if (doc.metadata.hasPendingWrites) return;
  //       items.value = items.value.filter((item) => item.id !== doc.id);
  //       items.value.push({
  //         ...(doc.data() as Story),
  //         id: doc.id,
  //       });
  //     });
  //   });
  // }

  const fetchItems = async () => {
    if (!storiesCollection.value) return;

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

    fetchItems();
  };

  const putItem = async (item: StoryWithId) => {
    if (!storiesCollection.value) return;

    await setDoc(doc(storiesCollection.value, item.id), item);
  };

  const deleteStory = async (item: StoryWithId) => {
    if (!storiesCollection.value) return;
    await deleteDoc(doc(storiesCollection.value, item.id));

    fetchItems();
  };

  return {
    setAttributeOfItem,
    putItem,
    items,
    fetchItems,
    deleteStory,
  };
});
