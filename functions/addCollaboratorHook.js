const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const {
  ROOT_INVITES_COLLECTION,
  ROOT_USERDATA_COLLECTION,
} = require("./firebase_constants");

const admin = require("firebase-admin");

exports.addCollaborator = onDocumentCreated(
  `${ROOT_INVITES_COLLECTION}/{email}/products/{productId}`,
  (snap, context) => {
    const email = snap.params.email;
    console.log("A new collaborator was added to a product", email);

    const productReference = snap.data.data().uid;
    admin
      .auth()
      .getUserByEmail(email)
      .then((userRecord) => {
        console.log(
          "User exists. Adding to collaborators collection and removing invite.",
        );

        const uid = userRecord.uid;
        const productId = snap.params.productId;

        const userInviteRef = productReference
          .collection("collaborator_invites")
          .doc(email);

        userInviteRef.get().then((doc) => {
          // Add product ref to user's product_references collection
          admin
            .firestore()
            .collection(ROOT_USERDATA_COLLECTION)
            .doc(uid)
            .collection("product_references")
            .add({
              reference: productReference,
            });

          // Add user uid to collaborators collection
          productReference
            .collection("collaborators")
            .doc(uid)
            .set({
              type: "collaborator",
              ...doc.data(),
            });

          // Remove the created invite document from collaborator_invites
          admin
            .firestore()
            .collection(ROOT_INVITES_COLLECTION)
            .doc(email)
            .collection("products")
            .doc(productId)
            .delete();

          // Delete the invite document from the user's collection
          userInviteRef.delete();
        });
      });
  },
);
