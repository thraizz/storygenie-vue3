import {
  addDoc,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { useSelectedProductId } from "@/composables/useSelectedProduct";
import { db } from "@/firebase";
import { ROOT_USERDATA_COLLECTION } from "@/firebase_constants";
import { useUser } from "@/stores/useUser";
import { Template, TemplateWithId } from "@/types/templates";

const ITEM_PATH = "templates";

export const useTemplates = defineStore(ITEM_PATH, () => {
  const items = ref<TemplateWithId[]>([]);
  const userStore = useUser();

  const selectedItemId = useSelectedProductId();

  const uuid = computed(() => userStore.user?.uid);

  const fetchItems = async () => {
    if (!userStore.user?.uid) return;
    const itemsCollection = collection(
      db,
      ROOT_USERDATA_COLLECTION,
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
  // useRefetchOnAuthChange(fetchItems);

  const setAttributeOfItem = async (item: TemplateWithId, text: string) => {
    if (uuid.value === undefined) return;

    await updateDoc(
      doc(db, ROOT_USERDATA_COLLECTION, uuid.value, ITEM_PATH, item.id),
      {
        text,
      },
    );
    await fetchItems();
  };

  const putItem = async (item: TemplateWithId) => {
    if (uuid.value === undefined) return;

    await setDoc(
      doc(db, ROOT_USERDATA_COLLECTION, uuid.value, ITEM_PATH, item.id),
      item,
    );
    await fetchItems();
  };

  const postItem = async (item: Template) => {
    if (uuid.value === undefined) return;

    await addDoc(
      collection(db, ROOT_USERDATA_COLLECTION, uuid.value, ITEM_PATH),
      item,
    );
    await fetchItems();
  };

  return {
    setAttributeOfItem,
    putItem,
    postItem,
    items,
    fetchItems,
    selectedItemId,
    key: ITEM_PATH,
  };
});
