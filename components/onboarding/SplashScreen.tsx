import React, { useEffect, useState } from 'react';
import CogniSacraLogo from '../icons/IntelliLearnLogo';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
    onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 1600);

        const finishTimer = setTimeout(() => {
            onFinish();
        }, 2200);

        return () => {
            clearTimeout(timer);
            clearTimeout(finishTimer);
        };
    }, [onFinish]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.08 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="p-8"
                >
                    <div className="flex flex-col items-center text-center space-y-5">
                        <motion.div 
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="p-4 rounded-3xl bg-white border border-zinc-200 shadow-[0_0_35px_rgba(255,255,255,0.25)] inline-flex items-center justify-center"
                        >
                            <img src="/cogni-sacra.jpeg" alt="CogniSacra" className="w-20 h-20 object-contain block" />
                        </motion.div>
                        
                        <div className="space-y-1.5">
                            <motion.h1 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.15 }}
                                className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif"
                            >
                                CogniSacra
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.25 }}
                                className="text-xs font-mono tracking-widest uppercase text-emerald-400"
                            >
                                SOVEREIGN INTELLIGENCE PLATFORM
                            </motion.p>
                        </div>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.35 }}
                            className="flex items-center gap-2 pt-2"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            <span className="text-xs font-mono text-zinc-400">Initializing academic node...</span>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;
