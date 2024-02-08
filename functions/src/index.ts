import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

import { HttpsError, onCall } from "firebase-functions/v2/https";

import OpenAI from "openai";

admin.initializeApp();

export const generateStory = onCall(async (request) => {
  console.log("Got request!");
  console.log(request.data);
  // Get the accessing users uid
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "User must be authenticated");
  }

  const productId = request.data.productId?.toString();
  if (!productId) {
    throw new HttpsError("invalid-argument", "productId must be provided");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const product = await getFirestore()
    .collection("userdata")
    .doc(uid)
    .collection("products")
    .doc(productId)
    .get();
  console.log("Product: ", product.data());
  if (!product || !product.exists) {
    throw new HttpsError("not-found", "Product not found");
  }

  const template = await getFirestore()
    .collection("userdata")
    .doc(uid)
    .collection("templates")
    .doc(request.data?.templateId)
    .get();

  if (!template || !template.exists) {
    throw new HttpsError("not-found", "Template not found");
  }

  const res = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          'You generate a scrum story with a headline, userstory and acceptance criteria for the given product and description, according to the template. It must be in valid JSON format, like this: { "headline": string, "userStory": string, "acceptanceCriteria": string[] } The `headline` must be as short as possible. The `acceptanceCriteria` must be as specific as possible. No acceptance criteria beyond the specified input. Acceptance criteria and user story can reference the product description. ',
      },
      {
        role: "system",
        content: `Product: ${product.data()?.description}, Description: ${template.data()?.description}`,
      },
      {
        role: "user",
        content: `${request.data?.description}`,
      },
    ],
    temperature: 0,
    max_tokens: 3414,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  if (!res.choices[0].message.content) {
    throw new HttpsError("internal", "OpenAI did not return a response");
  }

  type Story = {
    headline: string;
    acceptanceCriteria: string[];
    userStory: string;
  };
  let jsonParsed: Story | undefined = undefined;
  try {
    jsonParsed = JSON.parse(res.choices[0].message.content);
  } catch (e) {
    throw new HttpsError("internal", "OpenAI did not return valid JSON");
  }
  if (
    !jsonParsed ||
    !jsonParsed.headline ||
    !jsonParsed.userStory ||
    !jsonParsed.acceptanceCriteria
  ) {
    throw new HttpsError("internal", "OpenAI did not return valid JSON");
  }

  const writeResult = await getFirestore()
    .collection("userdata")
    .doc(uid)
    .collection("products")
    .doc(productId)
    .collection("stories")
    .add({
      ...jsonParsed,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  return { result: `Message with ID: ${writeResult.id} added.` };
});
