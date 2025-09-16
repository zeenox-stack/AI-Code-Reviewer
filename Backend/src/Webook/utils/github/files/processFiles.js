const getFiles = require("./getFiles");
const buildDiff = require("../diffs/buildDiff");
const getOcktokit = require("../../../../Repo/utils/getOcktokit");

module.exports = async ({ owner, repo, installation_id }) => {
  const { files, sha, ref } = await getFiles({ owner, repo, installation_id });
  const octokit = await getOcktokit(installation_id);
  const diffs = [];

  for (const { path } of files) {
    diffs.push(
      await buildDiff(octokit, {
        owner,
        repo,
        path,
        before: null,
        after: ref.split("/").pop(),
        isNew: true,
      })
    );
  }

  return { diffs, sha, ref };
};
