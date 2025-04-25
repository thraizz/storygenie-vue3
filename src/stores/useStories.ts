import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { computed, ref, watch } from "vue";
import { useCollection, useDocument, useFirestore } from "vuefire";

import { ROOT_USERDATA_COLLECTION } from "@/firebase_constants";
import { useProducts } from "@/stores/useProducts";
import { StoryVersion, StoryVersionWithId, StoryWithId } from "@/types/story";

import { useUser } from "./useUser";

const ITEM_PATH = "stories";

/**
 * VueFire-based composable for working with stories
 */
export function useStories() {
  const isLoading = ref(false);
  const isLoadingVersions = ref(false);
  const storyVersions = ref<Record<string, StoryVersionWithId[]>>({});
  const items = ref<StoryWithId[]>([]);
  const db = useFirestore();
  const currentUser = useUser();
  const productStore = useProducts();

  // Compute the path to the stories collection based on selected product
  const storiesColPath = computed(() => {
    const uid = currentUser.user?.uid;
    const productId = productStore.selectedItemId;
    const product = productStore.selectedProduct;

    if (!uid || !productId) return null;

    if (product?.role === "collaborator") {
      return `${product.referencePath}/${ITEM_PATH}`;
    } else {
      return `${ROOT_USERDATA_COLLECTION}/${uid}/${productStore.collectionName}/${productId}/${ITEM_PATH}`;
    }
  });

  // Create a watcher for the stories collection
  watch(
    storiesColPath,
    (path) => {
      if (!path) return;

      isLoading.value = true;
      const colRef = collection(db, path);
      const storiesCollection = useCollection(colRef);

      // Set up the watcher for the collection
      return watch(
        storiesCollection,
        (docs) => {
          if (!docs) return;

          // Convert FirestoreRef data to normal objects with IDs
          items.value = (
            docs as unknown as Array<DocumentData & { id: string }>
          ).map((doc) => ({ ...doc, id: doc.id })) as StoryWithId[];
          isLoading.value = false;
        },
        { immediate: true },
      );
    },
    { immediate: true },
  );

  // Function to fetch a specific story (returns a ref)
  const getStory = (storyId: string) => {
    if (!storiesColPath.value) return null;

    return useDocument(doc(db, storiesColPath.value, storyId));
  };

  // Function to update a story attribute
  const setAttributeOfItem = async (item: StoryWithId, text: string) => {
    if (!storiesColPath.value) return;
    await updateDoc(doc(db, storiesColPath.value, item.id), { text });
  };

  // Function to save/update a story
  const putItem = async (item: StoryWithId) => {
    if (!storiesColPath.value) return;
    await updateDoc(doc(db, storiesColPath.value, item.id), {
      ...item,
      updatedAt: Timestamp.now(),
    });
  };

  // Function to delete a story
  const deleteStory = async (item: StoryWithId) => {
    if (!storiesColPath.value) return;
    await deleteDoc(doc(db, storiesColPath.value, item.id));
  };

  // Function to fetch all story versions for a story
  const fetchVersions = async (storyId: string) => {
    if (!storiesColPath.value) return;
    isLoadingVersions.value = true;

    try {
      const versionsColRef = collection(
        db,
        storiesColPath.value,
        storyId,
        "versions",
      );
      const versionsCollection = query(
        versionsColRef,
        orderBy("versionCreatedAt", "desc"),
      );

      const q = await getDocs(versionsCollection);

      const versions = await Promise.all(
        q.docs.map(async (doc) => {
          const version = doc.data() as StoryVersion;

          return { ...version, id: doc.id } as StoryVersionWithId;
        }),
      );
      console.log("got versions:", versions);

      storyVersions.value[storyId] = versions.sort(
        (a, b) => b.versionCreatedAt.toMillis() - a.versionCreatedAt.toMillis(),
      );
      isLoadingVersions.value = false;
    } catch (e) {
      console.error("Error fetching story versions", e);
      isLoadingVersions.value = false;
    }
  };

  // Function to restore a story to a previous version
  const restoreVersion = async (storyId: string, versionId: string) => {
    if (!storiesColPath.value) return;

    const storyRef = doc(db, storiesColPath.value, storyId);
    const versionRef = doc(
      db,
      storiesColPath.value,
      storyId,
      "versions",
      versionId,
    );

    try {
      // Get the version data
      const versionDoc = await getDoc(versionRef);
      if (!versionDoc.exists()) {
        throw new Error("Version not found");
      }

      const versionData = versionDoc.data() as StoryVersion;

      // Save current story as a new version
      const currentStory = items.value.find((s) => s.id === storyId);
      if (currentStory) {
        await addDoc(
          collection(db, storiesColPath.value, storyId, "versions"),
          {
            ...currentStory,
            versionCreatedAt: Timestamp.now(),
          },
        );
      }

      // Update the story with version data
      await updateDoc(storyRef, {
        content: versionData.content,
        updatedAt: Timestamp.now(),
        restoredFromVersion: versionId,
      });

      // Refresh story versions
      await fetchVersions(storyId);
    } catch (e) {
      console.error("Error restoring version", e);
      throw e;
    }
  };

  return {
    // Data
    items,
    isLoading,
    storyVersions,
    isLoadingVersions,

    // Methods
    getStory,
    setAttributeOfItem,
    putItem,
    deleteStory,
    fetchVersions,
    restoreVersion,
  };
}
