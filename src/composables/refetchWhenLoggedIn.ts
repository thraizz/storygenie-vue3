import { useUser } from "@/stores/user";
import { watch } from "vue";

export const useRefetchOnAuthChange = (fetchItems: () => void) => {
  const userStore = useUser();
  watch(
    () => userStore.isLoggedIn,
    (isLoggedIn) => {
      if (isLoggedIn) {
        fetchItems();
      }
    },
  );
};
