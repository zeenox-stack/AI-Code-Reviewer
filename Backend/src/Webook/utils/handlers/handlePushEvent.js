const openPR = require("../github/openPR");
const getDiffFromPush = require("../github/diffs/getDiffFromPush");
const getCodeReview = require("../AI Services/getCodeReview");
const buildMetadata = require("../AI Services/buildMetadata");

module.exports = async (payload) => {
  try {
    if (payload.sender.login === "gh-ai-code-reviewer-app[bot]") return;

    const changes = await getDiffFromPush(payload);
    const responses = await getCodeReview(changes, "push");

    const metadata = await buildMetadata(responses);

    const {
      owner: { login: owner },
      name: repo,
    } = payload.repository;
    const data = {
      owner,
      repo,
      installation_id: payload.installation.id,
      ref: payload.ref,
      commit_sha: payload.after,
    };

    await openPR({
      responses,
      metadata,
      payload: data,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
