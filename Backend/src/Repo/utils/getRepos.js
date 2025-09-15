const getSupabase = require("../../Database/utils/getSupabase");
const getOcktokit = require("./getOcktokit");
const getOctokit = require("./getOcktokit");

const fetchRegisteredRepos = async (supabase, id) => {
  const { data, error } = await supabase
    .from("repos")
    .select()
    .eq("owner_id", id);

  if (error) throw error;

  return new Map(data.map((repo) => [repo.repo_id, repo]));
};

const fetchInstallationId = async (supabase, id) => {
  const { data, error } = await supabase
    .from("users")
    .select("installation_id")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data?.installation_id;
};

const fetchGithubRepos = async (id) => {
  const octokit = await getOcktokit(id);
  const { data } = await octokit.apps.listReposAccessibleToInstallation();
  return data.repositories;
};

const mergeRepos = async (ghRepos, repoMap, id) => {
  return ghRepos.map((repo) => {
    const registeredRepo = repoMap.get(repo.id);
    return {
      data: {
        name: repo.full_name,
        html_url: repo.html_url,
        owner_id: id,
        created_at: repo.created_at,
        repo_id: repo.id,
        events: registeredRepo?.events || [],
      },
      isRegistered: !!registeredRepo,
    };
  });
};

module.exports = async (id) => {
  try {
    if (!id) throw new Error("Missing ID");

    const supabase = await getSupabase();

    const repoMap = await fetchRegisteredRepos(supabase, id);
    const installation_id = await fetchInstallationId(supabase, id);
    const repos = await fetchGithubRepos(installation_id);

    return mergeRepos(repos, repoMap, id);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
