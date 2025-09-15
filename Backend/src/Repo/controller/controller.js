const getSupabase = require("../../Database/utils/getSupabase");
const getRepos = require("../utils/getRepos");
const { createRepo, updateRepo } = require("../services/repoServices");

const handleGetRepos = async (req, res) => {
  try {
    const { id } = req.user;
    if (!id) throw new Error("Missing ID");

    const repos = await getRepos(id)

    return res.status(200).json({
      success: "Successfully fetched repos",
      repos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.message ?? "Internal Server Error" });
  }
};

const handleRepoCreation = async (req, res) => {
  try {
    const supabase = await getSupabase();
    const { id } = req.user;
    const { repo_id, name, events, html_url } = req.body;

    if (!id) throw new Error("Missing ID");
    if (!repo_id || !Array.isArray(events) || events.length === 0 || !name || !html_url) {
      return res.status(400).json({ error: "Bad Request" });
    };

    const repo = await createRepo({
      owner_id: id, 
      repo_id, 
      name, 
      events, 
      html_url
    });

    return res.status(201).json({
      success: "Successfully created the repo",
      repo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.message ?? "Internal Server Error" });
  }
};


const handleRepoUpdates = async (req, res) => {
  try {
    const { id } = req.user;
    const { events, repoId } = req.body;
    const supabase = await getSupabase();

    if (!id) throw new Error("Missing ID");
    if (!Array.isArray(events) || !repoId) {
      return res.status(400).json({ error: "Bad Request" });
    }

    const updatedRepo = await updateRepo({
      events, 
      repoId, 
      ownerId: id
    })

    return res.status(200).json({
      success: "Successfully updated repo",
      repo: updatedRepo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.message ?? "Internal Server Error" });
  }
};


module.exports = { handleGetRepos, handleRepoCreation, handleRepoUpdates };
