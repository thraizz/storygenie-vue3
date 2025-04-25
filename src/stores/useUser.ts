import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { defineStore } from "pinia";
import { computed } from "vue";
import { useCurrentUser } from "vuefire";

import { auth } from "@/firebase";

export const userNavigation = [{ name: "Settings", href: "/settings" }];

// User store that leverages VueFire for authentication
export const useUser = defineStore("user", () => {
  const firebaseUser = useCurrentUser();
  const isLoggedIn = computed(
    () => !!firebaseUser.value && !firebaseUser.value.isAnonymous,
  );

  return {
    user: firebaseUser,
    isLoggedIn,
  };
});

export const logInWithFirebase: (
  email: string,
  password: string,
) => Promise<void | UserCredential> = async (email, password) => {
  try {
    return signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const signOut = async () => {
  auth.signOut().then(() => {
    window.location.assign("/login");
  });
};
