const functions = require("firebase-functions");

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

  // Add the user to the userdata collection
  await getFirestore().collection("userdata").doc(user.uid).set({});

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

const createUserHook = functions.auth.user().onCreate(async (user) => {
  await createTemplates();
});

exports.createUserHook = createUserHook;
