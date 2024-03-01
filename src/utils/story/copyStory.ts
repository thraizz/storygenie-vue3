import * as storypolyfill from "clipboard-polyfill";

export const copyStory = async (id: string) => {
  const story = document.getElementById(`story-${id}`);
  if (story && story.innerHTML) {
    const clipboardItem = new storypolyfill.ClipboardItem({
      "text/html": new Blob([story.innerHTML], { type: "text/html" }),
    });
    await storypolyfill.write([clipboardItem]);
  }
};
