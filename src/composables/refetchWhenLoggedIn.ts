import { getAuth } from "firebase/auth";

import { app } from "@/firebase";

export const useRefetchOnAuthChange = (fetchItems: () => void) => {
  const auth = getAuth(app);
  auth.onAuthStateChanged((u) => {
    if (u && !u?.isAnonymous) {
      fetchItems();
    }
  });
};
