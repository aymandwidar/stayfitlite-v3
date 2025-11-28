import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';

export default function MealCheckCard({ data, onAction }) {
    const { logMeal } = useUser();

    const handleResponse = (eaten) => {
        logMeal(data.mealType, eaten);

        setTimeout(() => {
            onAction('meal_logged', { mealType: data.mealType, eaten });
        }, 400);
    };

    return (
        <div className="glass-card-prominent p-8 max-w-md mx-auto">
            {/* Title */}
            <h2 className="text-2xl font-heading text-white mb-2">{data.title}</h2>
            <p className="text-lg text-gray-200 mb-8">{data.question}</p>

            {/* Binary Choice */}
            <div className="grid grid-cols-2 gap-4">
                <motion.button
                    onClick={() => handleResponse(true)}
                    className="py-8 bg-white/10 hover:bg-white/20 rounded-2xl flex flex-col items-center gap-3 transition group"
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="text-5xl group-hover:scale-110 transition-transform">✅</span>
                    <span className="text-white font-semibold text-lg">Yes</span>
                </motion.button>

                <motion.button
                    onClick={() => handleResponse(false)}
                    className="py-8 bg-white/10 hover:bg-white/20 rounded-2xl flex flex-col items-center gap-3 transition group"
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="text-5xl group-hover:scale-110 transition-transform">❌</span>
                    <span className="text-white font-semibold text-lg">No</span>
                </motion.button>
            </div>

            {/* Info */}
            <p className="mt-6 text-center text-sm text-gray-300 italic">
                {data.reasoning}
            </p>
        </div>
    );
}
