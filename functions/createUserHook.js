const functions = require("firebase-functions");

const admin = require("firebase-admin");

const { addUserToProduct } = require("./addUserToProduct");

const { getFirestore } = require("firebase-admin/firestore");
const createTemplates = async (user) => {
  const templates = [
    {
      description: "Add a new feature to the application.",
      name: "New Feature",
    },
    {
      description: "The bug should be fixed.",
      name: "Bugfix",
    },
    {
      description: "General todos for this bigger task should be outlined.",
      name: "Epic",
    },
  ];

  // Build all promises
  const promises = templates.map((template) =>
    getFirestore()
      .collection("userdata")
      .doc(user.uid)
      .collection("templates")
      .add(template),
  );
  // Execute all promises
  await Promise.all(promises);
};

const addUserToProducts = async (userRecord) => {
  // We need to get the ${ROOT_INVITES_COLLECTION}/{email}/products
  // collection and iterate over each document and
  // 1. add the product to the user's product_references collection
  // 2. add the user to the product's collaborators collection

  const collaboratorProducts = await admin
    .firestore()
    .collection(
      `/collaborators_invites/${userRecord.email.replaceAll(".", "\\.")}/products`,
    )
    .get();

  const a = await admin
    .firestore()
    .collection("/collaborators_invites/test/products")
    .get();
  console.log(a.size, a.docs.length, a.empty);

  if (collaboratorProducts.empty) {
    console.log("User has no invites to products");
    return;
  }

  console.log("User has invites to products", collaboratorProducts.docs.length);

  await collaboratorProducts.forEach(async (doc) => {
    const productReference = doc.ref;
    const productId = doc.id;
    const email = userRecord.email;
    const uid = userRecord.uid;

    await addUserToProduct(productReference, productId, email, uid);
  });
};

const createUserHook = functions.auth.user().onCreate(async (user) => {
  await createTemplates(user);
  await addUserToProducts(user);
});

exports.createUserHook = createUserHook;
