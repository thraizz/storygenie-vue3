import {
  getAuth,
  signInWithEmailAndPassword,
  User,
  UserCredential,
} from "firebase/auth";
import { defineStore } from "pinia";
import { ref } from "vue";

import { app, auth } from "@/firebase";

export const userNavigation = [{ name: "Settings", href: "/settings" }];

// User firebase to receive current user and autheticaiton status.
export const useUser = defineStore("user", () => {
  const user = ref<User | null>(null);
  const isLoggedIn = ref(false);

  const auth = getAuth(app);
  auth.onAuthStateChanged((u) => {
    user.value = u;
    isLoggedIn.value = !!u && !u.isAnonymous;
  });

  return {
    user,
    isLoggedIn,
  };
});

export const logInWithFirebase: (
  email: string,
  password: string,
) => Promise<void | UserCredential> = async (email, password) => {
  const auth = getAuth(app);
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
