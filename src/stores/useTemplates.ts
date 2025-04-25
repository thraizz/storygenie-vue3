import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { computed, ref } from "vue";
import { useCollection, useFirestore } from "vuefire";

import { useSelectedProductId } from "@/composables/useSelectedProduct";
import { ROOT_USERDATA_COLLECTION } from "@/firebase_constants";
import { useUser } from "@/stores/useUser";
import { Template, TemplateWithId } from "@/types/templates";

const ITEM_PATH = "templates";

export function useTemplates() {
  const isLoading = ref(false);
  const db = useFirestore();
  const { user } = useUser();

  const selectedItemId = useSelectedProductId();

  const uuid = computed(() => user?.uid);

  // Compute path to templates collection
  const templatesColPath = computed(() => {
    if (!uuid.value) return null;

    return `${ROOT_USERDATA_COLLECTION}/${uuid.value}/${ITEM_PATH}`;
  });

  const collectionRef = computed(() => {
    if (!uuid.value || !templatesColPath.value) return null;

    return collection(db, templatesColPath.value);
  });

  const items = useCollection(collectionRef);

  const setAttributeOfItem = async (item: TemplateWithId, text: string) => {
    if (!templatesColPath.value || !uuid.value) return;

    await updateDoc(doc(db, templatesColPath.value, item.id), {
      text,
      updatedAt: Timestamp.now(),
    });
  };

  const putItem = async (item: TemplateWithId) => {
    if (!templatesColPath.value || !uuid.value) return;

    await updateDoc(doc(db, templatesColPath.value, item.id), {
      ...item,
      updatedAt: Timestamp.now(),
    });
  };

  const postItem = async (item: Template) => {
    if (!templatesColPath.value || !uuid.value) return;

    await addDoc(collection(db, templatesColPath.value), {
      ...item,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  };

  const deleteItem = async (item: TemplateWithId) => {
    if (!templatesColPath.value || !uuid.value) return;

    await deleteDoc(doc(db, templatesColPath.value, item.id));
  };

  return {
    setAttributeOfItem,
    putItem,
    postItem,
    deleteItem,
    items,
    isLoading,
    selectedItemId,
    key: ITEM_PATH,
  };
}
