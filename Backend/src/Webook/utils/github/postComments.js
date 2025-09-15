const getOcktokit = require("../../../Repo/utils/getOcktokit");

module.exports = async (responses, payload) => {
    const octokit = await getOcktokit(payload?.installation?.id);
    const { owner, name } = payload.pull_request.head.repo; 
    const { number } = payload.pull_request;

    for (const { comments } of responses) {
        try {
            await octokit.pulls.createReview({
                owner: owner.login, 
                repo: name, 
                pull_number: number, 
                event: "COMMENT", 
                comments: comments
            })
        } catch (error) {
            console.error(error); 
            throw error;
        }
    }
}