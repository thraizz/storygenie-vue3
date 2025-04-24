const { onCall, HttpsError } = require("firebase-functions/v2/https");

const { FieldValue, getFirestore } = require("firebase-admin/firestore");
const OpenAI = require("openai");

const PROMPT_VERSION = 1.2;

exports.generateStory = onCall(async (request) => {
  // Get the accessing users uid
  const uid = request.auth.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "User must be authenticated");
  }

  const productId = request.data.productId?.toString();
  if (!productId) {
    throw new HttpsError("invalid-argument", "productId must be provided");
  }

  const product = await getFirestore()
    .collection("userdata")
    .doc(uid)
    .collection("products")
    .doc(productId)
    .get();

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

  const story = request.data?.description;
  if (!story) {
    throw new HttpsError("invalid-argument", "Missing story.");
  }

  console.log("Validation complete. Generating story...");

  const storyAsTipTapDoc = await getTipTapDocFromOpenAI(
    product,
    template,
    story,
  );

  console.log("Story generated. Writing to database...");

  const writeResult = await getFirestore()
    .collection("userdata")
    .doc(uid)
    .collection("products")
    .doc(productId)
    .collection("stories")
    .add({
      content: storyAsTipTapDoc,
      prompt: request.data.description,
      updatedAt: FieldValue.serverTimestamp(),
      promptVersion: PROMPT_VERSION,
    });

  console.log("Story written to database.");

  return { result: writeResult.id };
});

const getTipTapDocFromOpenAI = async (product, template, story) => {
  if (!product || !template || !story) {
    throw new HttpsError(
      "invalid-argument",
      "product and description must be provided",
    );
  }
  if (!process.env.OPENAI_API_KEY) {
    throw new HttpsError("internal", "OpenAI API key is not set");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const res = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: 'You generate precise scrum user stories with a headline, user story, and acceptance criteria based on the given product description. Output must be valid JSON: {"headline": string, "userStory": string, "acceptanceCriteria": string[]}. The headline should be concise (5-7 words). Acceptance criteria must be specific, testable, and directly related to the user story - no extraneous criteria beyond what\'s needed to fulfill the core functionality. Focus on technical implementation details rather than business outcomes. Never include logging, analytics, or general system behaviors unless explicitly requested.',
          },
        ],
      },
      {
        role: "system",
        content: [
          {
            type: "text",
            text: `The Product we are building is: \n${product}`,
          },
        ],
      },
      {
        role: "system",
        content: [
          {
            type: "text",
            text: `The Template we are using is: \n${template}`,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: story,
          },
        ],
      },
    ],
    temperature: 0.4,
    max_tokens: 3035,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: {
      type: "json_object",
    },
  });
  console.log("res", res);

  if (!res.choices[0].message.content) {
    throw new HttpsError("internal", "OpenAI did not return a response");
  }

  let jsonParsed = {
    headline: undefined,
    userStory: undefined,
    acceptanceCriteria: undefined,
  };
  try {
    jsonParsed = JSON.parse(res.choices[0].message.content);
  } catch (e) {
    throw new HttpsError("internal", "OpenAI did not return valid JSON");
  }
  if (
    !jsonParsed.headline ||
    !jsonParsed.userStory ||
    !jsonParsed.acceptanceCriteria
  ) {
    throw new HttpsError("internal", "OpenAI did not return valid JSON");
  }
  return {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          {
            type: "text",
            text: jsonParsed.headline,
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "User Story" }],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: jsonParsed.userStory }],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [
          {
            type: "text",
            text: "Acceptance Criteria",
          },
        ],
      },
      {
        type: "taskList",
        content: jsonParsed.acceptanceCriteria.map((ac) => ({
          type: "taskItem",
          attrs: {
            checked: false,
          },
          content: [
            { type: "paragraph", content: [{ type: "text", text: ac }] },
          ],
        })),
      },
    ],
  };
};

exports.getTipTapDocFromOpenAI = getTipTapDocFromOpenAI;
