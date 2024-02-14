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

import { useRefetchOnAuthChange } from "@/composables/refetchWhenLoggedIn";
import { useSelectedProductId } from "@/composables/useSelectedProduct";
import { db } from "@/firebase";
import { useUser } from "@/stores/user";
import { Template, TemplateWithId } from "@/types/templates";

const ITEM_PATH = "templates";

export const useTemplates = defineStore(ITEM_PATH, () => {
  const items = ref<TemplateWithId[]>([]);
  const userStore = useUser();

  const selectedItem = useSelectedProductId();

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
    if (!userStore.user?.uid) return;
    const itemsCollection = collection(
      db,
      "userdata",
      userStore.user.uid,
      ITEM_PATH,
    );
    const itemsSnapshot = await getDocs(itemsCollection);
    const itemsList = (await itemsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))) as TemplateWithId[];

    items.value = itemsList;
  };
  useRefetchOnAuthChange(fetchItems);

  const setAttributeOfItem = async (item: TemplateWithId, text: string) => {
    if (uuid.value === undefined) return;

    await updateDoc(doc(db, "userdata", uuid.value, ITEM_PATH, item.id), {
      text,
    });
    fetchItems();
  };

  const putItem = async (item: TemplateWithId) => {
    if (uuid.value === undefined) return;

    await setDoc(doc(db, "userdata", uuid.value, ITEM_PATH, item.id), item);
    fetchItems();
  };

  const postItem = async (item: Template) => {
    if (uuid.value === undefined) return;

    await addDoc(collection(db, "userdata", uuid.value, ITEM_PATH), item);
    await fetchItems();
  };

  return {
    setAttributeOfItem,
    putItem,
    postItem,
    items,
    fetchItems,
    selectedItem,
    key: ITEM_PATH,
  };
});
