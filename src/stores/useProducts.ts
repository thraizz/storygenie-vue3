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
import { useUser } from "@/stores/useUser";
import { Product, ProductWithId } from "@/types/product";

const ITEM_PATH = "products";

export const useProducts = defineStore(ITEM_PATH, () => {
  const items = ref<ProductWithId[]>([]);
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
    }))) as ProductWithId[];

    items.value = itemsList;
  };
  useRefetchOnAuthChange(fetchItems);

  const setAttributeOfItem = async (item: ProductWithId, text: string) => {
    if (uuid.value === undefined) return;

    await updateDoc(doc(db, "userdata", uuid.value, ITEM_PATH, item.id), {
      text,
    });
    fetchItems();
  };

  const putItem = async (item: ProductWithId) => {
    if (uuid.value === undefined) return;

    await setDoc(doc(db, "userdata", uuid.value, ITEM_PATH, item.id), item);
    fetchItems();
  };

  const postItem = async (item: Product) => {
    if (uuid.value === undefined) return;

    const doc = await addDoc(
      collection(db, "userdata", uuid.value, ITEM_PATH),
      item,
    );
    fetchItems();

    return doc.id;
  };

  const getItem = (id: string) => {
    return items.value.find((item) => item.id === id);
  };

  return {
    setAttributeOfItem,
    putItem,
    postItem,
    items,
    fetchItems,
    selectedItem,
    key: ITEM_PATH,
    getItem,
  };
});
