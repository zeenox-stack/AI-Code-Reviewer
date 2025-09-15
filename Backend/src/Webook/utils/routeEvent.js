const handlePushEvent = require("./handlers/handlePushEvent");
const handlePullEvent = require("./handlers/handlePullEvent");
const handleInstallation = require("./handlers/handleInstallation");

module.exports = async (event, payload) => {
  try {
    switch (event) {
      case "installation":
        await handleInstallation(payload);
        break;
      case "push":
        await handlePushEvent(payload);
        break;
      case "pull":
        await handlePullEvent(payload);
        break;
      default:
        throw new Error(`Unhandled event type: ${event}`);
    }
  } catch (error) {
    throw error;
  }
};
