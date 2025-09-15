module.exports = async (octokit, { owner, repo, branch, sha }) => {
    try {
        await octokit.git.createRef({
          owner,
          repo,
          ref: `refs/heads/${branch}`,
          sha,
        });
      } catch (refError) {
        if (refError.status === 422) {
          console.log("Branch already exists, skipping creation");
        } else throw refError;
      }
}