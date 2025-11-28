# StayFit Lite V2 - AI-First Fitness App

An intelligent fitness application powered by a triple-AI system that adapts to your physical AND mental state.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## ✨ Features

### AI-First Architecture
- **Triple-AI System**: DeepSeek (reasoning) + Groq (speed) + Gemini (multimodal)
- **Smart Orchestration**: AI decides what you see based on time, context, and data freshness
- **Psychosocial Override**: Mental state prioritized over physical metrics
- **Preference Learning**: Learns from your choices (3x reject = permanent dislike)

### Intelligent Tracking
- Sleep quality (5-point scale)
- Motivation level (3 emojis)
- Stress level (5-point scale)
- Hydration (progress tracking)
- Meals (binary logging)
- Recovery score (0-100 with psychological override)

### Workout Features
- AI-generated personalized plans
- 60+ exercise database
- Individual exercise swapping
- Progressive overload automation (RPE-based)
- Plateau detection with style switching
- Full workout player with rest timers

### AI Coach
- Real-time chat with context awareness
- Voice-to-text input
- Proactive messaging (poor sleep, low motivation, etc.)
- Exercise negotiation via chat

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS (Glassmorphism)
- **Animation**: Framer Motion
- **AI**: Groq SDK, Gemini SDK, DeepSeek API
- **State**: Context API + localStorage

## 📂 Project Structure

```
src/
├── components/        # UI components (cards, modals)
├── pages/            # Main pages (SmartFeed, WorkoutPlayer, AICoach, Settings)
├── services/         # AI services (Orchestrator, Memory, Negotiation, Overload)
├── utils/            # AI clients & utilities
├── data/             # Exercise database
└── context/          # React context (UserContext)
```

## 🧪 API Keys Required

Create a `.env` file:

```env
VITE_GROQ_API_KEY=your_groq_key
VITE_GEMINI_API_KEY=your_gemini_key
VITE_DEEPSEEK_API_KEY=your_deepseek_key
```

Get free keys:
- Groq: https://console.groq.com/
- Gemini: https://ai.google.dev/
- DeepSeek: https://platform.deepseek.com/

## 💡 Key Concepts

### Recovery Score Formula
```
Base: 50 points
+ Sleep Quality (0-30)
+ Hydration (0-15)
+ Nutrition (0-10)
+ Psychological (0-25)
+ Rest Bonus (0-10)

OVERRIDE: If motivation="low" OR stress>=4 → Cap at 40
```

### Progressive Overload
```
RPE 1-6: Increase weight 5%
RPE 7-8: Maintain (perfect intensity)
RPE 9-10: Decrease weight 5%
2/3 failures → Switch training style
```

### AI Memory
- Tracks exercise preferences (loved/disliked)
- Detects psychological patterns (e.g., "Low motivation Mondays")
- Learns training time preferences
- Monitors injury watch list
- Stores progression status

## 📱 Usage

1. **Onboarding**: Complete 6-step profile setup
2. **Morning Flow**: Sleep → Motivation → Stress → Hydration → Workout
3. **Workout**: View plan → Swap exercises → Start → Track RPE → Complete
4. **Chat**: Ask questions, get nutrition advice, negotiate exercises
5. **Settings**: Edit profile, view AI memory stats

## 🎯 Testing

Quick test (skip onboarding):
```javascript
localStorage.setItem('stayfitlite_v2_user', JSON.stringify({
  id: 'test',
  name: 'Alex',
  age: 28,
  weight: 75,
  goal: 'muscle_gain',
  level: 'intermediate',
  recoveryScore: 85,
  onboarded: true
}));
location.reload();
```

## 📄 License

MIT

## 🙏 Credits

Built with AI-First principles. Powered by DeepSeek, Groq, and Gemini.
