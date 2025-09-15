module.exports = async (
  octokit,
  { owner, repo, path, branch, commit_message, patch, sha }
) => {
  try {
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      ...(sha && { sha }),
      branch,
      message: commit_message,
      content: Buffer.from(patch).toString("base64"),
    });
  } catch (error) {
    throw error;
  }
};
