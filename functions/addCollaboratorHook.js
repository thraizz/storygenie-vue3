const {
  onDocumentCreated,
  onDocumentDeleted,
} = require("firebase-functions/v2/firestore");
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
        // Exit if user has already been added to the product

        console.log(
          "User exists. Adding to collaborators collection and removing invite.",
        );

        const uid = userRecord.uid;
        const productId = snap.params.productId;

        if (userRecord.uid === productReference) {
          console.log("User is already a collaborator");
          return;
        }

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
            .doc(productId)
            .set({
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
      })
      .catch((error) => {
        console.log("Error adding collaborator", error);
      });
  },
);

exports.removeCollaboratorFromProduct = onDocumentDeleted(
  `${ROOT_USERDATA_COLLECTION}/{userid}/products/{productId}/collaborator/{email}`,
  (snap, context) => {
    const email = snap.params.email;

    // Remove the product from the users product_references collection
    admin
      .auth()
      .getUserByEmail(email)
      .then((userRecord) => {
        const uid = userRecord.uid;
        const productId = snap.params.productId;

        admin
          .firestore()
          .collection(ROOT_USERDATA_COLLECTION)
          .doc(uid)
          .collection("product_references")
          .doc(productId)
          .delete();
      });
  },
);
