require("dotenv").config();
const axios = require("axios");
const getCodeFromResponse = require("../../getCodeFromResponse");

const getFilePaths = (arr) => arr.map((file) => ({ path: file.path }));

module.exports = async (responses, type) => {
  try {
    if (type !== "push") return;
    const paths = getFilePaths(responses);

    const response = await axios.post(
      "https://api.cohere.com/v2/chat",
      {
        model: "command-a-03-2025",
        messages: [
          {
            role: "system",
            content: `You are given an array of file objects with paths. Group them into batches for creating pull requests. 

                Rules:
                1. Use 0-based indexes from the input array to represent files.
                2. Group files that are likely related based on path and filename.
                3. Files that dont clearly belong to a group can be in their own array.
                4. Return ONLY valid JSON in this format:
                
                {
                  "groups": [
                    [0, 1, ...],
                    [2, 3, ...],
                    ...
                  ]
                }
                5. Do NOT include explanations or extra text.
                `,
          },
          {
            role: "user",
            content: JSON.stringify(paths),
          },
        ],
      },
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.COHERE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) throw new Error("Failed to group");
    
    const groups = JSON.parse(getCodeFromResponse(response.data.message.content[0].text)).groups;
    const grouped = [];
    for (const idxGroup of groups) {
      const group = []; 

      for (const idx of idxGroup) {
        group.push(responses[idx]); 
      }; 
      grouped.push(group);
    }
    return grouped;
  } catch (error) {
    throw error;
  }
};
