const { fetchUserProfile } = require("../../Repo/services/repoServices");

module.exports = async (req, res) => {
  try {
    const { id } = req.user;

    if (!id) throw new Error("Missing ID");

    const userData = await fetchUserProfile(id);

    return res
      .status(200)
      .json({
        success: "Successfully fetched user data",
        avatar: userData.avatar_url,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error?.message ?? "Internal Server Error" });
  }
};
