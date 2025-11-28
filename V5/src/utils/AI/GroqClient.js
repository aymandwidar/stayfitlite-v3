import Groq from 'groq-sdk';

// Lazy initialization - only create client when needed
let groqInstance = null;

const getGroqClient = () => {
    if (!groqInstance) {
        const apiKey = localStorage.getItem('VITE_GROQ_API_KEY') || import.meta.env.VITE_GROQ_API_KEY;
        if (!apiKey) {
            throw new Error('Groq API key not found. Please add it in Settings.');
        }
        groqInstance = new Groq({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true
        });
    }
    return groqInstance;
};

export const GroqClient = {
    async chat(messages) {
        try {
            const groq = getGroqClient();
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are 'Coach Adam', an expert fitness and nutrition coach. You are energetic, motivating, and highly knowledgeable. You specialize in creating personalized workout plans, estimating calories burned, and providing meal advice. When asked for a plan, use Markdown tables for clarity. Keep responses concise but impactful."
                    },
                    ...messages
                ],
                model: "llama-3.3-70b-versatile", // Stable, versatile model
                temperature: 0.7,
                max_tokens: 1024,
            });
            return completion; // Return the full completion object
        } catch (error) {
            throw error; // Throw error so fallback can catch it
        }
    },

    async getDailyTip(goal) {
        try {
            const groq = getGroqClient();
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: `Give me a short, punchy, 1-sentence fitness or nutrition tip for someone whose goal is "${goal}". Add a relevant emoji.`
                    }
                ],
                model: "llama-3.2-11b-vision-preview", // Faster model for small tasks
                temperature: 0.9,
            });
            return completion.choices[0]?.message?.content || "Stay consistent and trust the process! 💪";
        } catch (error) {
            return "Hydration is key! 💧";
        }
    }
};
