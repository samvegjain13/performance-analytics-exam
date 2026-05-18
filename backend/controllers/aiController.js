const axios = require('axios');
const Employee = require('../models/Employee');

exports.getAIRecommendation = async (req, res) => {
  try {
    const { employeeId } = req.body;
    let employeesData = [];
    let isSingleEmployee = false;
    let employeeName = "";

    if (employeeId) {
      // Single employee evaluation
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      employeesData.push(employee);
      isSingleEmployee = true;
      employeeName = employee.name;
    } else {
      // Evaluate all employees for ranking
      employeesData = await Employee.find();
    }

    if (employeesData.length === 0) {
      return res.status(404).json({ message: 'No employees found to evaluate' });
    }

    const systemPrompt = "You are an expert HR AI assistant. Analyze the employee data and provide performance insights, promotion recommendations, and training suggestions. Respond strictly in JSON format.";
    
    let userPrompt = "";
    if (isSingleEmployee) {
      userPrompt = `Analyze the following employee: ${JSON.stringify(employeesData[0])}. Provide 1. Promotion Recommendation (Yes/No with reason), 2. Improvement Feedback, 3. Skill enhancement recommendation. Respond in JSON format like: { "recommendation": "...", "feedback": "...", "training": "..." }`;
    } else {
      userPrompt = `Rank the following employees based on performance score and experience: ${JSON.stringify(employeesData)}. Provide a JSON array of objects with fields: { "name": "...", "rank": 1, "reason": "..." }`;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'AI API Key is missing in server configuration' });
    }

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 1500
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    let aiContent = response.data.choices[0].message.content;
    
    // Extract JSON from markdown if necessary
    const jsonMatch = aiContent.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      aiContent = jsonMatch[1];
    } else {
      // In case it's just wrapped in braces
      const braceMatch = aiContent.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (braceMatch) {
        aiContent = braceMatch[0];
      }
    }

    // Parse json just to ensure it's valid, and return to frontend
    try {
      const parsedContent = JSON.parse(aiContent);
      res.status(200).json(parsedContent);
    } catch (e) {
      console.error("JSON Parsing failed. Raw content:", aiContent);
      res.status(200).json({ rawText: aiContent });
    }

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'AI Recommendation Failed', error: error.message });
  }
};
