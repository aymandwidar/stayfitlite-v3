import { motion } from 'framer-motion';
import SleepCheckCard from './cards/SleepCheckCard';
import MotivationCheckCard from './cards/MotivationCheckCard';
import StressCheckCard from './cards/StressCheckCard';
import PainCheckCard from './cards/PainCheckCard';
import HydrationCard from './cards/HydrationCard';
import WorkoutPlanCard from './cards/WorkoutPlanCard';
import MealCheckCard from './cards/MealCheckCard';
import DaySummaryCard from './cards/DaySummaryCard';

export default function Card({ cardType, data, timeContext, onAction }) {
    // Route to appropriate card component based on type
    const renderCard = () => {
        switch (cardType) {
            case 'sleep_check':
                return <SleepCheckCard data={data} onAction={onAction} />;

            case 'motivation_check':
                return <MotivationCheckCard data={data} onAction={onAction} />;

            case 'stress_check':
                return <StressCheckCard data={data} onAction={onAction} />;

            case 'pain_check':
                return <PainCheckCard data={data} onAction={onAction} />;

            case 'hydration_prompt':
                return <HydrationCard data={data} onAction={onAction} />;

            case 'workout_plan':
                return <WorkoutPlanCard data={data} onAction={onAction} />;

            case 'meal_check':
                return <MealCheckCard data={data} onAction={onAction} />;

            case 'day_summary':
                return <DaySummaryCard data={data} onAction={onAction} />;

            default:
                return (
                    <div className="glass-card p-8 text-center">
                        <p className="text-white">Unknown card type: {cardType}</p>
                    </div>
                );
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {renderCard()}
        </motion.div>
    );
}
