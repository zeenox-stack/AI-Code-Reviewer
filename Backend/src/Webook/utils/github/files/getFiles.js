const getOcktokit = require("../../../../Repo/utils/getOcktokit");

module.exports = async ({ owner, repo, installation_id }) => {
  try {
    const octokit = await getOcktokit(installation_id);
    const { data: repoData } = await octokit.rest.repos.get({
      owner,
      repo,
    });

    const branch = repoData?.default_branch;

    const { data: branchData } = await octokit.rest.repos.getBranch({
      owner,
      repo,
      branch,
    });

    const sha = branchData.commit.sha;

    const { data: treeData } = await octokit.git.getTree({
      owner,
      repo,
      recursive: "true",
      tree_sha: branchData.commit.commit.tree.sha,
    });

    const files = treeData.tree.filter((file) => file.type === "blob");
    return { files, sha, ref: `/refs/heads/${branch}` };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
