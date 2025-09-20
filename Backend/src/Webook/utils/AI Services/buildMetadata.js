require("dotenv").config();
const axios = require("axios");
const getCodeFromResponse = require("../getCodeFromResponse");

module.exports = async (groupedFiles) => {
  const headers = {
    accept: "application/json",
    Authorization: `Bearer ${process.env.COHERE_API_TOKEN}`,
    "Content-Type": "application/json",
  };

  try {
    const requests = groupedFiles.map((fileGroup) =>
      axios.post(
        "https://api.cohere.com/v2/chat",
        {
          model: "command-a-03-2025",
          messages: [
            {
              role: "system",
              content: `You are an experienced software engineer.
                You will receive a JSON object containing groups of file paths. 
                Your task is to generate metadata for creating pull requests for each group.  

                Rules:
                1. Always output valid JSON only. No extra text, no explanations.  
                2. The output must be an array of objects, in the exact same order as the input groups.  
                3. Always give a single metadata object for a single group.
                4. Each object must have:  
                   - "branch": a short and meaningful branch name (use 'feature/<desc>' or 'fix/<desc>' format).  
                   - "title": a clear and concise pull request title.  
                   - "body": a meaningful pull request description, explaining the purpose of the changes.  
                5. Branch names must be URL-safe (no spaces, special characters).  
                6. Keep titles short (<80 chars).  

                --- 
                ### Input Format
                {
                  "groups": [
                    [
                      path: <path to a file 1>, 
                      patch: <The changes made>
                    ], 
                    [
                      path: <path to a file 2>, 
                      patch: <The changes made>
                    ], 
                    [
                      path: <path to a file 3>, 
                      patch: <The changes made>
                    ]
                  ]
                }

                ### Output Format
                {
                  metadata: [
                    { 
                      "commit_message": <a meaningful commit message>,
                      "branch": "feature/frontend-home-integration",
                      "title": "Integrate Home page with App entry",
                      "body": "This PR connects the main App.tsx entry point with the Home page, ensuring navigation and rendering flow are consistent."
                    }
                  ]
                }
                `,
            },
            {
              role: "user",
              content: JSON.stringify(fileGroup),
            },
          ],
        },
        { headers }
      )
    );

    const responses = await Promise.all(requests);

    return responses.map((response, idx) => {
      if (response.status !== 200) {
        throw new Error(
          `Metadata request failed for group ${idx}: ${response.statusText}`
        );
      }

      let parsed;
      try {
        parsed = JSON.parse(
          getCodeFromResponse(response.data.message.content[0].text)
        );
      } catch (err) {
        throw new Error(`Invalid JSON in response for group ${idx}`);
      }

      if (!parsed?.metadata) {
        throw new Error(`No metadata found in response for group ${idx}`);
      }

      return parsed.metadata;
    })[0];
  } catch (error) {
    console.error("Error while fetching metadata:", error.message);
    throw error;
  }
};
