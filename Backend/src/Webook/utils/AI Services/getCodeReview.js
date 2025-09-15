require("dotenv").config();
const axios = require("axios");
const getCodeFromResponse = require("../getCodeFromResponse");
const groupFiles = require("../github/files/groupFiles");

module.exports = async (contents, event) => {
  const mods = {
    push: `4. For any titles, branch names, or descriptions, be meaningful and concise.
    - Branch names should follow the format: 'feature/<short-description>' or 'fix/<short-description>'.
    - Pull request titles should be short but clear.
    - Pull request bodies should explain the purpose of the change.

    ---
    ### JSON Format:
    {
      "patch": "<your reviewed and improved code here>",
      "path": <given file path>
    }`,

    pull: `4. Guidelines for review comments:
    - Be concise, professional, and constructive.
    - Use markdown for clarity (e.g., inline code formatting).
    - Each comment must be tied to a real issue:
        * Bug/Error
        * Optimization suggestion
        * Readability/maintainability improvement
    - Never generate generic comments.
    - Line numbers ('position') must map to the diff hunk correctly:
        * Only count lines prefixed with '+' in the diff (including empty '+' lines).
        * 'position' = the relative index in the diff where the comment applies.
    - If no issues are found, return an empty 'comments' array.

    ---
    ### JSON Format
    {
      "comments": [
        {
          "path": "<file path from diff>",
          "position": <line number in the diff>,
          "body": "<short, meaningful review comment>"
        }
      ]
    }`,
  };

  const headers = {
    accept: "application/json",
    Authorization: `Bearer ${process.env.COHERE_API_TOKEN}`,
    "Content-Type": "application/json",
  };

  try {
    const requests = contents.map(({ path, diff }, idx) =>
      axios
        .post(
          "https://api.cohere.com/v2/chat",
          {
            model: "command-a-03-2025",
            messages: [
              {
                role: "system",
                content: `You are a senior programmer reviewing code diffs.
                  Your job is to produce structured output in JSON format based on the review.

                  Rules:
                  1. If there is anything in the provided code that is NSFW, reply ONLY with:
                     "I cannot provide further information on this topic."
                     (Do NOT output JSON in this case.)

                  2. Otherwise, always reply strictly in the JSON format described below.
                     - No extra text.
                     - No explanations.
                     - Only valid JSON.

                  3. Always avoid any kind of config files. Return empty code/comment response.

                  ${mods[event] || ""}
                `,
              },
              {
                role: "user",
                content: JSON.stringify({ path, diff }),
              },
            ],
          },
          { headers }
        )
        .then((res) => {
          if (res.status !== 200) {
            throw new Error(`Failed for file ${path}: ${res.statusText}`);
          }

          try {
            return JSON.parse(
              getCodeFromResponse(res.data.message.content[0].text)
            );
          } catch {
            throw new Error(`Invalid JSON in response for file: ${path}`);
          }
        })
    );

    const responses = await Promise.all(requests);

    return event === "pull" ? responses : await groupFiles(responses, event);
  } catch (error) {
    console.error("Review processing error:", error.message);
    throw error;
  }
};
