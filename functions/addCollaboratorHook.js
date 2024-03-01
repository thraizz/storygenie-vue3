const { onDocumentCreated } = require("firebase-functions/v2/firestore");

const { ROOT_INVITES_COLLECTION } = require("./firebase_constants");
const admin = require("firebase-admin");

const { addUserToProduct } = require("./addUserToProduct");

exports.addCollaborator = onDocumentCreated(
  `${ROOT_INVITES_COLLECTION}/{email}/products/{productId}`,
  (snap) => {
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
        addUserToProduct(productReference, productId, email, uid);
      })
      .catch((error) => {
        console.log("Error adding collaborator", error);
      });
  },
);
