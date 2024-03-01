import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

import { useSelectedProductId } from "@/composables/useSelectedProduct";
import { db } from "@/firebase";
import { ROOT_USERDATA_COLLECTION } from "@/firebase_constants";
import { useUser } from "@/stores/useUser";
import { Product, ProductWithId } from "@/types/product";

const ITEM_PATH = "products";

export const useProducts = defineStore(ITEM_PATH, () => {
  // State
  const items = ref<ProductWithId[]>([]);
  const productReferencesItems = ref<
    { reference: DocumentReference; id: string }[]
  >([]);
  const isLoading = ref(false);

  // Utils
  const userStore = useUser();
  const selectedItemId = useSelectedProductId();

  const selectedProduct = computed(() =>
    items.value.find((item) => item.id === selectedItemId.value),
  );
  const uuid = computed(() => userStore.user?.uid);

  // if (uuid.value) {
  //   onSnapshot(
  //     collection(db, ROOT_USERDATA_COLLECTION, uuid.value, ITEM_PATH),
  //     (querySnapshot) => {
  //       const updatedItems: ProductWithId[] = [];
  //       querySnapshot.forEach((doc) => {
  //         if (doc.metadata.hasPendingWrites) return;
  //         const existingItem = items.value.find((item) => item.id === doc.id);
  //         if (existingItem) {
  //           // Update existing item
  //           existingItem.role = "owner";
  //           existingItem.id = doc.id;
  //           updatedItems.push(existingItem);
  //         } else {
  //           // Add new item
  //           updatedItems.push({
  //             ...(doc.data() as Product),
  //             role: "owner",
  //             id: doc.id,
  //           });
  //         }
  //       });

  //       // Remove deleted items
  //       items.value = updatedItems.filter((item) =>
  //         querySnapshot.docs.some((doc) => doc.id === item.id),
  //       );
  //     },
  //   );
  //   onSnapshot(
  //     collection(
  //       db,
  //       ROOT_USERDATA_COLLECTION,
  //       uuid.value,
  //       "product_references",
  //     ),
  //     (querySnapshot) => {
  //       const updatedItems: ProductWithId[] = [];
  //       querySnapshot.forEach(async (doc) => {
  //         if (doc.metadata.hasPendingWrites) return;
  //         productReferencesItems.value = querySnapshot.docs.map((doc) => ({
  //           ...doc.data(),
  //           id: doc.id,
  //         })) as { reference: DocumentReference; id: string }[];

  //         const productReferences = querySnapshot.docs.map(
  //           (doc) => doc.data().reference as DocumentReference,
  //         );
  //         const products = await Promise.all(
  //           productReferences.map(async (reference) => {
  //             return { product: await getDoc(reference), reference };
  //           }),
  //         );
  //         products.forEach(({ product, reference }) => {
  //           items.value.push({
  //             ...product.data(),
  //             referencePath: reference.path,
  //             id: product.id,
  //             role: "collaborator",
  //           } as ProductWithId);
  //         });
  //       });

  //       // Remove deleted items
  //       items.value = updatedItems.filter((item) =>
  //         querySnapshot.docs.some((doc) => doc.id === item.id),
  //       );
  //     },
  //   );
  // }

  const docWithId: (doc: QueryDocumentSnapshot) => any = (
    doc: QueryDocumentSnapshot,
  ) => ({
    ...doc.data(),
    id: doc.id,
  });

  const fetchItems = async () => {
    if (!userStore.user?.uid) return;

    isLoading.value = true;
    const itemsCollection = collection(
      db,
      ROOT_USERDATA_COLLECTION,
      userStore.user.uid,
      ITEM_PATH,
    );
    const itemsSnapshot = await getDocs(itemsCollection);
    const itemsList = itemsSnapshot.docs.map((doc) => ({
      ...docWithId(doc),
      role: "owner",
    }));

    try {
      const collaborationProducts = await getDocs(
        collection(
          db,
          ROOT_USERDATA_COLLECTION,
          userStore.user.uid,
          "product_references",
        ),
      );

      // Store references to other products
      productReferencesItems.value = collaborationProducts.docs.map(docWithId);

      const productReferences = collaborationProducts.docs.map(
        (doc) => doc.data().reference as DocumentReference,
      );

      const products = await Promise.all(
        productReferences.map(async (reference) => ({
          product: await getDoc(reference),
          reference,
        })),
      );
      products.forEach(({ product, reference }) => {
        itemsList.push({
          ...product.data(),
          id: product.id,
          referencePath: reference.path,
          role: "collaborator",
        } as ProductWithId);
      });
    } catch (e) {
      console.error(e);
    }

    items.value = itemsList;

    isLoading.value = false;
  };

  const setAttributeOfItem = async (item: ProductWithId, text: string) => {
    if (uuid.value === undefined) return;

    await updateDoc(
      doc(db, ROOT_USERDATA_COLLECTION, uuid.value, ITEM_PATH, item.id),
      {
        text,
      },
    );

    await fetchItems();
  };

  const putItem = async (item: ProductWithId) => {
    if (uuid.value === undefined) return;

    await setDoc(
      doc(db, ROOT_USERDATA_COLLECTION, uuid.value, ITEM_PATH, item.id),
      item,
    );

    await fetchItems();
  };

  const postItem = async (item: Product) => {
    if (uuid.value === undefined) return;

    const doc = await addDoc(
      collection(db, ROOT_USERDATA_COLLECTION, uuid.value, ITEM_PATH),
      item,
    );
    await fetchItems();

    return doc.id;
  };

  const getItem = (id: string) => {
    return items.value.find((item) => item.id === id);
  };

  const fetchIfEmpty = async () => {
    if (items.value.length === 0) {
      await fetchItems();
    }
  };

  // Initialize store
  watch(uuid, fetchIfEmpty);

  return {
    isLoading,
    setAttributeOfItem,
    putItem,
    postItem,
    items,
    fetchItems,
    selectedItemId,
    selectedProduct,
    collectionName: ITEM_PATH,
    getItem,
    fetchIfEmpty,
  };
});
