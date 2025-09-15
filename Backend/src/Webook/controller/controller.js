require("dotenv").config();

const verifySignature = require("../utils/verifySignature");
const {
  fetchReposById,
  fetchUserProfile,
} = require("../../Repo/services/repoServices");
const routeEvent = require("../utils/routeEvent");
const processFiles = require("../utils/github/files/processFiles");
const getCodeReview = require("../utils/AI Services/getCodeReview");
const openPR = require("../utils/github/openPR");
const buildMetadata = require("../utils/AI Services/buildMetadata");

const handleEvents = async (req, res) => {
  try {
    if (!verifySignature(req))
      return res.status(401).json({ error: "Invalid Signature" });

    const repoId = req.body.repository?.id;
    if (!repoId) return res.status(400).json({ error: "Missing ID" });

    const repoData = await fetchReposById(repoId);
    
    if (!repoData.is_active)
      return res.status(503).json({ error: "No Events to Process" });

    const event = req.headers["x-github-event"].split("_")[0];

    if (event !== "installation" && !repoData.events.includes(event))
      return res.status(404).json({ error: "Event not registered" });

    await routeEvent(event, req.body);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message ?? "Internal Server Error" });
  }
};

const handleImmediateReview = async (req, res) => {
  try {
    const { id } = req.user;
    const { name: repo } = req.body;

    if (!id) throw new Error("Missing ID");
    if (!repo) return res.status(400).json({ error: "Bad Request" });

    const { username: owner, installation_id } = await fetchUserProfile(id);
    const { diffs, sha, ref } = await processFiles({
      owner,
      repo,
      installation_id,
    });
    const responses = await getCodeReview(diffs, "push");
    
    const metadata = await buildMetadata(responses); 
    const data = {
      owner, 
      repo, 
      installation_id, 
      commit_sha: sha, 
      ref
    }
    await openPR({ responses, metadata, payload: data }) 
    return res.status(200).json({ success: "Successfully provided a review" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.message ?? "Internal Server Error" });
  }
};

module.exports = { handleEvents, handleImmediateReview };