import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

import { useRefetchOnAuthChange } from "@/composables/refetchWhenLoggedIn";
import { useSelectedProductId } from "@/composables/useSelectedProduct";
import { db } from "@/firebase";
import { ROOT_USERDATA_COLLECTION } from "@/firebase_constants";
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
      ROOT_USERDATA_COLLECTION,
      userStore.user.uid,
      ITEM_PATH,
    );
    const itemsSnapshot = await getDocs(itemsCollection);
    const itemsList = (await itemsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      role: "owner",
      id: doc.id,
    }))) as ProductWithId[];

    if (userStore.user.email != null) {
      try {
        const collaborationProducts = await getDocs(
          collection(
            db,
            ROOT_USERDATA_COLLECTION,
            userStore.user.uid,
            "product_references",
          ),
        );

        const productReferences = collaborationProducts.docs.map(
          (doc) => doc.data().reference as DocumentReference,
        );
        const products = await Promise.all(
          productReferences.map(async (reference) => await getDoc(reference)),
        );
        products.forEach((product) => {
          if (product != undefined) {
            itemsList.push({
              ...product.data(),
              id: product.id,
              role: "collaborator",
            } as ProductWithId);
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
    items.value = itemsList;
  };
  useRefetchOnAuthChange(fetchItems);

  const setAttributeOfItem = async (item: ProductWithId, text: string) => {
    if (uuid.value === undefined) return;

    await updateDoc(
      doc(db, ROOT_USERDATA_COLLECTION, uuid.value, ITEM_PATH, item.id),
      {
        text,
      },
    );
    fetchItems();
  };

  const putItem = async (item: ProductWithId) => {
    if (uuid.value === undefined) return;

    await setDoc(
      doc(db, ROOT_USERDATA_COLLECTION, uuid.value, ITEM_PATH, item.id),
      item,
    );
    fetchItems();
  };

  const postItem = async (item: Product) => {
    if (uuid.value === undefined) return;

    const doc = await addDoc(
      collection(db, ROOT_USERDATA_COLLECTION, uuid.value, ITEM_PATH),
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
    collectionName: ITEM_PATH,
    getItem,
  };
});
