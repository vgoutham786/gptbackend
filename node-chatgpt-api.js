const axios = require("axios");
const readlineSync = require("readline-sync");
require("dotenv").config();

const apiKey = process.env.OPENAI_API_KEY;
const apiUrl = "https://api.openai.com/v1/engines/text-davinci-002/completions"; // Use the GPT-3 model engine

const history = [];

(async () => {
    while (true) {
        const user_input = readlineSync.question("Your input: ");

        const messages = [];
        for (const [input_text, completion_text] of history) {
            messages.push({ role: "user", content: input_text });
            messages.push({ role: "assistant", content: completion_text });
        }

        messages.push({ role: "user", content: user_input });

        try {
            const response = await axios.post(
                apiUrl,
                {
                    prompt: messages.map((message) => `${message.role}: ${message.content}`).join("\n"),
                    max_tokens: 50, // Adjust as needed
                },
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const completion_text = response.data.choices[0].text;
            console.log(completion_text);

            history.push([user_input, completion_text]);

            const user_input_again = readlineSync.question(
                "\nWould you like to continue the conversation? (Y/N)"
            );
            if (user_input_again.toUpperCase() === "N") {
                return;
            } else if (user_input_again.toUpperCase() !== "Y") {
                console.log("Invalid input. Please enter 'Y' or 'N'.");
                return;
            }
        } catch (error) {
            console.error("Error:");
            console.error(error.message || error);
        }
    }
})();
