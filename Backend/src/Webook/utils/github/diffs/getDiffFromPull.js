const getOcktokit = require("../../../../Repo/utils/getOcktokit");
const buildDiff = require("./buildDiff");

module.exports = async (payload) => {
  try {
    const { owner, name: repo } = payload.repository;
    const { number: pull_number } = payload.pull_request;
    const octokit = await getOcktokit(payload?.installation.id);

    const { data: files } = await octokit.pulls.listFiles({
      owner: owner.login,
      repo,
      pull_number,
    });
    const diffs = [];

    for (const { filename, status } of files) {
      if (status !== "added" && status !== "modified") continue;
      const base = payload.pull_request.base,
        head = payload.pull_request.head;

      diffs.push(
        await buildDiff(octokit, {
          owner: base.user.login,
          repo: base.repo.name,
          path: filename,
          before: base.sha,
          after: head.sha,
          isNew: status === "added",
        })
      );
    }
    return diffs;
  } catch (error) {
    throw error;
  }
};