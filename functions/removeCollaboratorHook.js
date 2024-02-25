const { onDocumentDeleted } = require("firebase-functions/v2/firestore");
const { ROOT_USERDATA_COLLECTION } = require("./firebase_constants");
const admin = require("firebase-admin");

exports.removeCollaboratorFromProduct = onDocumentDeleted(
  `${ROOT_USERDATA_COLLECTION}/{userid}/products/{productId}/collaborator/{email}`,
  (snap, context) => {
    const email = snap.params.email;

    // Remove the product from the users product_references collection
    admin
      .auth()
      .getUserByEmail(email)
      .then(async (userRecord) => {
        const uid = userRecord.uid;
        const productId = snap.params.productId;

        await admin
          .firestore()
          .collection(ROOT_USERDATA_COLLECTION)
          .doc(uid)
          .collection("product_references")
          .doc(productId)
          .delete();
      });
  },
);
