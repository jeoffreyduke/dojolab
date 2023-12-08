export const breakDownGoals = async (goal: string): Promise<string> => {
  const apiKey = "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"; // Replace with your OpenAI API key
  const apiUrl = "https://api.openai.com/v1/chat/completions";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  // Combine all the answers into a single string with template literals
  const conversation = `
        Please break this ${goal} down into a numbered list of five steps (keep them short and clear) a business would take to successfully execute said goal`;

  const requestData = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: conversation,
      },
    ],
    temperature: 0.7, // Adjust the temperature for creativity
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      const responseData = await response.json();
      if (responseData.choices && responseData.choices.length > 0) {
        return responseData.choices[0].message.content.trim();
      } else {
        return "No steps found"; // You can handle this case as needed
      }
    } else {
      console.error("Error generating steps:", response.status);
      return "Error";
    }
  } catch (error) {
    console.error("Error generating steps:", error);
    return "Error";
  }
};
