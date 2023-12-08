export const getTips = async (businessInfo: any): Promise<string> => {
  const apiKey = "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"; // Replace with your OpenAI API key
  const apiUrl = "https://api.openai.com/v1/chat/completions";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  // Combine all the answers into a single string with template literals
  const conversation = `
      Please return a numbered list of five tips (keep them short and clear) for a business with the following characteristics:
  
      1. Primary nature of the business: ${businessInfo.primaryNature}, belonging to the ${businessInfo.industry} industry.
      2. Business goals and objectives: ${businessInfo.goals}
      3. Target audience demographics and preferences:
         - Demographics: ${businessInfo.demographics}
         - Preferences: ${businessInfo.preferences}
      4. Main competitors and what makes the business unique: ${businessInfo.competitors}
      5. Significant challenges or obstacles: ${businessInfo.challenges}
      6. Marketing, sales, and operational strategies and tactics:
         - Marketing Strategies: ${businessInfo.marketingStrategies}
         - Sales Tactics: ${businessInfo.salesTactics}
         - Operational Tactics: ${businessInfo.operationalTactics}
      7. Performance of these strategies in achieving goals: ${businessInfo.strategyPerformance}
      8. Financial information:
         - Current Revenue: $${businessInfo.revenue}
         - Monthly Expenses: $${businessInfo.expenses}
         - Profitability Status: ${businessInfo.profitability}
      9. Primary marketing and sales channels and conversion rates:
         - Marketing Channels: ${businessInfo.marketingChannels}
         - Sales Channels: ${businessInfo.salesChannels}
         - Conversion Rates: ${businessInfo.conversionRates}
      10. Team members and their roles within the organization: ${businessInfo.teamMembers}
      11. Technologies, software, or systems used for operations: ${businessInfo.technologies}
      12. Customer feedback or reviews: ${businessInfo.customerFeedback}
      13. Legal or compliance-related matters: ${businessInfo.legalMatters}
      14. Plans for the future, including strategies for growth and expansion: ${businessInfo.futurePlans}
    `;

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
        return "No tips found"; // You can handle this case as needed
      }
    } else {
      console.error("Error generating tips:", response.status);
      return "Error";
    }
  } catch (error) {
    console.error("Error generating tips:", error);
    return "Error";
  }
};
