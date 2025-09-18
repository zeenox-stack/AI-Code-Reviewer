module.exports = async (octokit, { owner, repo, ref, path }) => {
  try {
    const { data } = await octokit?.rest?.repos?.getContent({
      owner,
      repo,
      ref,
      path,
    });

    return data?.sha ?? null;
  } catch (er) {
    if (er.status !== 404) throw er;
  }
};
