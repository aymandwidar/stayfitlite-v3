import { GoogleGenerativeAI } from '@google/generative-ai';

// Lazy initialization
let genAI = null;

const getGeminiClient = () => {
    if (!genAI) {
        const apiKey = localStorage.getItem('VITE_GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('Gemini API key not found. Please add it in Settings.');
        }
        genAI = new GoogleGenerativeAI(apiKey);
    }
    return genAI;
};

export const GeminiClient = {
    /**
     * Generate an image description or create image for exercise visualization
     * @param {string} userPrompt - User's request for visual aid
     * @returns {Promise<{type: 'image'|'text', content: string, imageUrl?: string}>}
     */
    async generateImageDescription(userPrompt) {
        try {
            const genAI = getGeminiClient();
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-1219" });

            // Detect if user is asking for visual aid
            const lowerPrompt = userPrompt.toLowerCase();
            const needsImage = lowerPrompt.includes('show') ||
                lowerPrompt.includes('how to') ||
                lowerPrompt.includes('image') ||
                lowerPrompt.includes('video') ||
                lowerPrompt.includes('demonstrate');

            if (needsImage) {
                // Extract exercise name from prompt
                const exerciseMatch = userPrompt.match(/(?:show|demonstrate|how to do|how to perform)\s+(?:a\s+|an\s+|the\s+)?(\w+(?:\s+\w+)*)/i);
                const exerciseName = exerciseMatch ? exerciseMatch[1] : 'exercise';

                // Generate detailed description for the exercise
                const descriptionPrompt = `Provide a detailed, step-by-step description of how to properly perform a ${exerciseName}. Include proper form, common mistakes to avoid, and safety tips. Keep it concise but comprehensive (3-5 sentences).`;

                const result = await model.generateContent(descriptionPrompt);
                const description = result.response.text();

                // For now, return a placeholder image URL since we can't generate images directly
                // In production, you would integrate with an image generation API or use pre-made exercise images
                const imageUrl = `https://via.placeholder.com/600x400/1a1a2e/00f2ea?text=${encodeURIComponent(exerciseName)}`;

                return {
                    type: 'image',
                    content: `## How to: ${exerciseName}\n\n${description}\n\n*Note: This is a demonstration placeholder. In production, this would show an AI-generated or real exercise image.*`,
                    imageUrl: imageUrl
                };
            } else {
                // Regular text-based response using Gemini
                const result = await model.generateContent({
                    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
                    systemInstruction: {
                        role: 'system',
                        parts: [{
                            text: "You are 'Coach Adam', an expert fitness and nutrition coach. You are energetic, motivating, and highly knowledgeable. Provide detailed, helpful responses with practical advice. Use emojis sparingly but effectively."
                        }]
                    }
                });

                return {
                    type: 'text',
                    content: result.response.text()
                };
            }
        } catch (error) {
            console.error("Gemini Error:", error);
            return {
                type: 'text',
                content: "My vision systems are having trouble right now. Try asking in a different way, or check back soon! 🔧"
            };
        }
    },

    /**
     * Generate workout estimations (calories, duration, etc.)
     * @param {object} workoutData - Workout details
     * @returns {Promise<{calories: number, duration: number, difficulty: string}>}
     */
    async estimateWorkout(workoutData) {
        try {
            const genAI = getGeminiClient();
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-1219" });

            const prompt = `Analyze this workout and provide estimates:
Workout: ${JSON.stringify(workoutData)}

Provide your response in JSON format with these fields:
{
  "calories": estimated calories burned (number),
  "duration": estimated duration in minutes (number),
  "difficulty": "Easy", "Moderate", or "Hard",
  "tips": 2-3 quick tips (array of strings)
}`;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            // Extract JSON from response (handle markdown code blocks)
            const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) ||
                responseText.match(/(\{[\s\S]*\})/);

            if (jsonMatch) {
                const estimates = JSON.parse(jsonMatch[1]);
                return estimates;
            }

            // Fallback estimates
            return {
                calories: 200,
                duration: 30,
                difficulty: "Moderate",
                tips: ["Stay hydrated!", "Focus on form over speed", "Listen to your body"]
            };
        } catch (error) {
            console.error("Gemini Estimation Error:", error);
            return {
                calories: 200,
                duration: 30,
                difficulty: "Moderate",
                tips: ["Stay hydrated!", "Focus on form", "Have fun!"]
            };
        }
    },

    /**
     * Generate text response from chat messages (fallback for chat)
     * @param {Array} messages - Array of message objects
     * @returns {Promise<object>} - Response in OpenAI-compatible format
     */
    async generateTextResponse(messages) {
        try {
            const genAI = getGeminiClient();
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-1219" });

            // Convert messages to Gemini format
            const lastMessage = messages[messages.length - 1];
            const prompt = lastMessage.content || lastMessage.parts?.[0]?.text || '';

            const result = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                systemInstruction: {
                    role: 'system',
                    parts: [{
                        text: "You are 'Coach Adam', an expert fitness and nutrition coach. You are energetic, motivating, and highly knowledgeable. Provide helpful, concise responses."
                    }]
                }
            });

            return {
                choices: [{
                    message: {
                        content: result.response.text()
                    }
                }]
            };
        } catch (error) {
            console.error("Gemini Text Response Error:", error);
            return {
                choices: [{
                    message: {
                        content: "I'm having trouble right now. Please try again! 💪"
                    }
                }]
            };
        }
    }
};
