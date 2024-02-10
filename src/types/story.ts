import { Timestamp } from "firebase/firestore";

export type Story = {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  content: Doc;
  jiraIssueID?: string;
};

export type StoryWithId = Story & { id: string };

type Content = {
  attrs?: {
    level: number;
  };
  content?: Content[];
  marks?: {
    type: string;
  }[];
  text?: string;
  type: string;
};

type Doc = {
  content: Content[];
  type: string;
};

const exampleStory: Doc = {
  content: [
    {
      attrs: {
        level: 1,
      },
      content: [
        {
          marks: [
            {
              type: "strong",
            },
          ],
          text: "Google SSO Integration",
          type: "text",
        },
      ],
      type: "heading",
    },
    {
      attrs: {
        level: 2,
      },
      content: [
        {
          text: "User Story",
          type: "text",
        },
      ],
      type: "heading",
    },
    {
      content: [
        {
          text: "As a user, I want to be able to log in using my Google account so that I can quickly access Storygenie without creating a new account.",
          type: "text",
        },
      ],
      type: "paragraph",
    },
    {
      attrs: {
        level: 2,
      },
      content: [
        {
          text: "Acceptance Criteria",
          type: "text",
        },
      ],
      type: "heading",
    },
    {
      content: [
        {
          content: [
            {
              content: [
                {
                  text: "A 'Login with Google' button is visible on the login page.",
                  type: "text",
                },
              ],
              type: "paragraph",
            },
          ],
          type: "listItem",
        },
        {
          content: [
            {
              content: [
                {
                  text: "Clicking the 'Login with Google' button redirects the user to the Google sign-in page.",
                  type: "text",
                },
              ],
              type: "paragraph",
            },
          ],
          type: "listItem",
        },
        {
          content: [
            {
              content: [
                {
                  text: "After successful authentication, the user is redirected back to Storygenie and logged in.",
                  type: "text",
                },
              ],
              type: "paragraph",
            },
          ],
          type: "listItem",
        },
        {
          content: [
            {
              content: [
                {
                  text: "Users who log in via Google SSO should have their Google account email displayed in their profile.",
                  type: "text",
                },
              ],
              type: "paragraph",
            },
          ],
          type: "listItem",
        },
        {
          content: [
            {
              content: [
                {
                  text: "Existing users who have previously signed up with the same Google account email should be able to log in using Google SSO without creating a new account.",
                  type: "text",
                },
              ],
              type: "paragraph",
            },
          ],
          type: "listItem",
        },
      ],
      type: "bulletList",
    },
  ],
  type: "doc",
};

export const getHeadlineFromDoc = (doc: Doc): string => {
  const heading = doc.content.find(
    (content) => content.type === "heading" && content.attrs?.level === 1,
  );
  if (heading) {
    return heading.content?.[0].text as string;
  }
  return "";
};
