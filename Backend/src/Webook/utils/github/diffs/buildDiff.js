const readDiff = require("./readDiff");
const decodeBase64 = (val) =>
  val ? Buffer.from(val, "base64").toString("utf-8") : "";

const fetchFileContent = async (octokit, { owner, repo, path, ref }) => {
  try {
    const { data } = await octokit.rest?.repos?.getContent({
      owner,
      repo,
      path,
      ref,
    });
    return decodeBase64(data?.content);
  } catch (error) {
    throw error;
  }
};

module.exports = async (
  octokit,
  { owner, repo, path, before, after, isNew }
) => {
  try {
    const beforeContent = isNew
        ? ""
        : await fetchFileContent(octokit, {
            owner,
            repo,
            path,
            ref: before,
          }),
      afterContent = await fetchFileContent(octokit, {
        owner,
        repo,
        path,
        ref: after,
      });

    return { path, diff: readDiff(beforeContent, afterContent) };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
