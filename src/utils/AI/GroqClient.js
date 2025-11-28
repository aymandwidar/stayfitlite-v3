import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true // Allowed for client-side demo
});

export const GroqClient = {
    async chat(messages) {
        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are 'Coach Saty', an expert fitness and nutrition coach. You are energetic, motivating, and highly knowledgeable. You specialize in creating personalized workout plans, estimating calories burned, and providing meal advice. When asked for a plan, use Markdown tables for clarity. Keep responses concise but impactful."
                    },
                    ...messages
                ],
                model: "llama-3.2-90b-vision-preview", // Using the high-end model for best results
                temperature: 0.7,
                max_tokens: 1024,
            });
            return completion.choices[0]?.message?.content || "Let's hit the gym! (Error getting response)";
        } catch (error) {
            console.error("Groq Error:", error);
            return "I'm having trouble connecting to my brain right now. Check your internet connection!";
        }
    },

    async getDailyTip(goal) {
        try {
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
