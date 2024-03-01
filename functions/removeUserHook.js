const functions = require("firebase-functions");
const { ROOT_USERDATA_COLLECTION } = require("./firebase_constants");

const admin = require("firebase-admin");

const removeUserHook = functions.auth.user().onDelete(async (user) => {
  // Delete all `userdata` subcollections for the user's id
  const userRef = admin
    .firestore()
    .collection(ROOT_USERDATA_COLLECTION)
    .doc(user.uid);

  const collections = await userRef.listCollections();
  collections.forEach(async (collection) => {
    const documents = await collection.listDocuments();
    documents.forEach(async (document) => {
      await document.delete();
    });
  });

  // Delete the `userdata` document for the user's id
  await admin
    .firestore()
    .collection(ROOT_USERDATA_COLLECTION)
    .doc(user.uid)
    .delete();
});

exports.removeUserHook = removeUserHook;
