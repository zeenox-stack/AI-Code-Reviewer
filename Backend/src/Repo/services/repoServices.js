const getSupabase = require("../../Database/utils/getSupabase");

const createRepo = async ({ owner_id, repo_id, name, events, html_url }) => {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("repos")
    .insert([
      {
        repo_id,
        owner_id,
        events,
        name,
        html_url,
        is_active: true,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const updateRepo = async ({ events, repoId, ownerId }) => {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("repos")
    .update({
      events,
      is_active: events.length !== 0,
    })
    .eq("repo_id", repoId)
    .eq("owner_id", ownerId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const fetchReposById = async (id) => {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("repos")
    .select()
    .eq("repo_id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const fetchUserProfile = async (id) => {
  const supabase = await getSupabase();
  const { data, error } = await supabase.from("users").select().eq("id", id).single();

  if (error) throw error;
  return data;
};

const updateInstallationId = async (installationId, id) => {
  const supabase = await getSupabase();
  const { error } = await supabase
    .from("users")
    .update({ installation_id: installationId })
    .eq("id", id);

  if (error) throw error;
};

const fetchInstallationId = async (id) => {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("users")
    .select("installation_id")
    .eq("id", id);

  if (error) throw error;
  return data?.installation_id;
};

module.exports = {
  createRepo,
  updateRepo,
  fetchReposById,
  fetchUserProfile,
  updateInstallationId,
  fetchInstallationId,
};
