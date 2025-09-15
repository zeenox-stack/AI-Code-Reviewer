const getDiffFromPull = require("../github/diffs/getDiffFromPull");
const getCodeReview = require("../AI Services/getCodeReview");
const postComments = require("../github/postComments");

module.exports = async (payload) => {
  try {
    if (
      payload.sender.login === "gh-ai-code-reviewer-app[bot]" ||
      payload.action === "closed" ||
      payload.action === "synchronized"
    )
      return;


    const diffs = await getDiffFromPull(payload);

    const responses = await getCodeReview(diffs, "pull");

    await postComments(responses, payload);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
