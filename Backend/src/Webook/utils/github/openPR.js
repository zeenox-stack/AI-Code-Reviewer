const getOcktokit = require("../../../Repo/utils/getOcktokit");
const createBranch = require("./createBranch");
const createOrUpdateFile = require("./createOrUpdateFile"); 
const getFileSha = require("./files/getFileSha");

module.exports = async ({ responses, payload, metadata }) => {
  try {
    if (responses.length !== metadata.length) throw new Error("Bad Input");

    const octokit = await getOcktokit(payload.installation_id);
    const { repo, owner, commit_sha, ref } = payload;

    for (let i = 0; i < responses.length; i++) {
      const { branch, title, body, commit_message } = metadata[i];

      await createBranch(octokit, { owner, repo, sha: commit_sha, branch });

      for (const { path, patch } of responses[i]) {
        let sha = await getFileSha(owner, { owner, repo, path });

        await createOrUpdateFile(octokit, {
          owner,
          repo,
          path,
          branch,
          commit_message,
          patch,
          sha,
        });
      }

      await octokit.pulls.create({
        owner,
        repo,
        title,
        body,
        head: branch,
        base: ref.split("/").pop(),
      });
    }
  } catch (error) {
    throw error;
  }
};
