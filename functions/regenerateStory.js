const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { FieldValue, getFirestore } = require("firebase-admin/firestore");
const OpenAI = require("openai");

const PROMPT_VERSION = 1.2;

exports.regenerateStory = onCall(async (request) => {
  // Get the accessing users uid
  const uid = request.auth.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "User must be authenticated");
  }

  const productId = request.data.productId?.toString();
  if (!productId) {
    throw new HttpsError("invalid-argument", "productId must be provided");
  }

  const storyId = request.data.storyId?.toString();
  if (!storyId) {
    throw new HttpsError("invalid-argument", "storyId must be provided");
  }

  const feedback = request.data.feedback?.toString();
  if (!feedback) {
    throw new HttpsError("invalid-argument", "feedback must be provided");
  }

  // Get the product document
  const product = await getFirestore()
    .collection("userdata")
    .doc(uid)
    .collection("products")
    .doc(productId)
    .get();

  if (!product || !product.exists) {
    throw new HttpsError("not-found", "Product not found");
  }

  // Get the original story
  const originalStoryRef = getFirestore()
    .collection("userdata")
    .doc(uid)
    .collection("products")
    .doc(productId)
    .collection("stories")
    .doc(storyId);

  const originalStory = await originalStoryRef.get();
  if (!originalStory || !originalStory.exists) {
    throw new HttpsError("not-found", "Original story not found");
  }

  // Get template
  const templateId = request.data.templateId;
  const template = await getFirestore()
    .collection("userdata")
    .doc(uid)
    .collection("templates")
    .doc(templateId)
    .get();

  if (!template || !template.exists) {
    throw new HttpsError("not-found", "Template not found");
  }

  console.log("Validation complete. Regenerating story...");

  // Save the original story to the versions subcollection
  await originalStoryRef.collection("versions").add({
    ...originalStory.data(),
    versionCreatedAt: FieldValue.serverTimestamp(),
  });

  // Generate new story based on original + feedback
  const regeneratedStoryContent = await regenerateStoryContent(
    product,
    template,
    originalStory.data(),
    feedback,
  );

  console.log("Story regenerated. Updating in database...");

  // Update the original story with the new content
  await originalStoryRef.update({
    content: regeneratedStoryContent,
    updatedAt: FieldValue.serverTimestamp(),
    latestFeedback: feedback,
    promptVersion: PROMPT_VERSION,
  });

  return { success: true, storyId };
});

const regenerateStoryContent = async (
  product,
  template,
  originalStory,
  feedback,
) => {
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
            text: 'You regenerate scrum user stories based on feedback. You are given an original story and feedback about what to improve or change. Output must be valid JSON: {"headline": string, "userStory": string, "acceptanceCriteria": string[]}. The headline should be concise (5-7 words). Acceptance criteria must be specific, testable, and directly related to the user story - no extraneous criteria beyond what\'s needed to fulfill the core functionality. Focus on technical implementation details rather than business outcomes. Never include logging, analytics, or general system behaviors unless explicitly requested.',
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
            text: `Here is the original story that needs to be improved:\n${JSON.stringify(originalStory.content)}\n\nFeedback to address:\n${feedback}\n\nPlease provide an improved version of this story.`,
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

exports.regenerateStoryContent = regenerateStoryContent;
