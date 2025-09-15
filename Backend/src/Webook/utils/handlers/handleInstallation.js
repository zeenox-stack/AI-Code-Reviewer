const { updateInstallationId } = require("../../../Repo/services/repoServices");

module.exports = async (payload) => {
try {
    const { id: installationId, account: { id } } = payload.installation;
    await updateInstallationId(installationId, id);
} catch (error) {
    console.error(error); 
    throw error;
}
}