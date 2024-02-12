import { watch } from "vue";

import { useUser } from "@/stores/user";

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
