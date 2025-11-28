import { motion } from 'framer-motion';

export default function AuraBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Base gradient */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800"
                style={{ backgroundSize: '200% 200%' }}
                animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                    duration: 25,
                    ease: 'linear',
                    repeat: Infinity
                }}
            />

            {/* Floating orbs */}
            <motion.div
                className="absolute w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"
                animate={{
                    x: [0, 100, 0],
                    y: [0, 150, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{
                    duration: 20,
                    ease: 'easeInOut',
                    repeat: Infinity
                }}
                style={{ top: '10%', left: '10%' }}
            />

            <motion.div
                className="absolute w-80 h-80 rounded-full bg-purple-500/20 blur-3xl"
                animate={{
                    x: [0, -80, 0],
                    y: [0, -100, 0],
                    scale: [1, 1.3, 1]
                }}
                transition={{
                    duration: 18,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    delay: 2
                }}
                style={{ bottom: '20%', right: '15%' }}
            />

            <motion.div
                className="absolute w-72 h-72 rounded-full bg-pink-500/15 blur-3xl"
                animate={{
                    x: [0, 120, 0],
                    y: [0, -120, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 22,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    delay: 4
                }}
                style={{ top: '50%', right: '30%' }}
            />

            {/* Subtle shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-50" />
        </div>
    );
}
