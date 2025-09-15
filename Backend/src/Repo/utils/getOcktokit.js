require("dotenv").config();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const fs = require("fs");

module.exports = async (installation_id) => {
  try {
    const { Octokit } = await import("@octokit/rest");
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iat: now - 60,
      exp: now + 9 * 60,
      iss: process.env.GITHUB_APP_ID,
    };

    const privateKey = fs.readFileSync(
      "gh-ai-code-reviewer-app.2025-08-14.private-key.pem",
      "utf-8"
    );
    const jwtToken = jwt.sign(payload, privateKey, { algorithm: "RS256" });
    const response = await axios.post(
      `https://api.github.com/app/installations/${installation_id}/access_tokens`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (response.status !== 201) throw new Error("Cannot fetch");
    
    return new Octokit({
      auth: response.data.token,
    });
  } catch (error) {
    console.error(error)?.response?.data?.message;
    throw error?.response?.data?.message;
  }
};
