import { GoogleGenerativeAI } from "@google/generative-ai";

const getGenerativeData = async (api, prompt) => {
  try {
    const genAI = new GoogleGenerativeAI(api);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-01-21" });

    // Await the result
    const result = await model.generateContent(prompt);
    const rawText = result.response.text(); // Extract raw text

    // Clean the response to remove code block markers
    const cleanedText = rawText.replace(/```json/, "").replace(/```/, "").trim();

    // Parse into JSON
    const jsonData = JSON.parse(cleanedText);

    return jsonData; // Return parsed JSON object
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    return null; // Handle errors gracefully
  }
};

export default getGenerativeData;