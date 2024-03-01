const {
  ROOT_INVITES_COLLECTION,
  ROOT_USERDATA_COLLECTION,
} = require("./firebase_constants");

const admin = require("firebase-admin");

const addUserToProduct = async (productReference, productId, email, uid) => {
  if (uid === productReference) {
    console.log("User is already a collaborator");
    return;
  }

  const userInviteRef = productReference
    .collection("collaborator_invites")
    .doc(email);

  await userInviteRef.get().then(async (doc) => {
    // Add product ref to user's product_references collection
    await admin
      .firestore()
      .collection(ROOT_USERDATA_COLLECTION)
      .doc(uid)
      .collection("product_references")
      .doc(productId)
      .set({
        reference: productReference,
      });

    // Add user uid to collaborators collection
    await productReference
      .collection("collaborators")
      .doc(uid)
      .set({
        type: "collaborator",
        ...doc.data(),
      });

    // Remove the created invite document from collaborator_invites
    await admin
      .firestore()
      .collection(ROOT_INVITES_COLLECTION)
      .doc(email)
      .collection("products")
      .doc(productId)
      .delete();

    // Delete the invite document from the user's collection
    await userInviteRef.delete();
  });
};

exports.addUserToProduct = addUserToProduct;
