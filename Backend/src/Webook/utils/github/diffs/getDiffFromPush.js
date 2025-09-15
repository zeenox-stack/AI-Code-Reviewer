const getOcktokit = require("../../../../Repo/utils/getOcktokit");
const getPathData = require("../files/getPathData");
const buildDiff = require("./buildDiff");

module.exports = async (payload) => {
  try {
    const { owner: { login: owner }, name: repo } = payload.repository;
    const { before, after } = payload;
    const octokit = await getOcktokit(payload?.installation?.id); 

    if (!owner || !repo || !before || !after) throw new Error("Missing values");

    const diffs = [];
    const pathData = getPathData({
      added: payload?.head_commit?.added || [],
      removed: payload?.head_commit?.removed || [],
    });
    for (const { name: path, added, removed } of pathData.values()) {
      if (removed) continue;
      const data = await buildDiff(octokit, {
        owner,
        repo,
        path,
        before,
        after,
        isNew: added,
      });
      diffs.push(data);
    }

    return diffs;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
