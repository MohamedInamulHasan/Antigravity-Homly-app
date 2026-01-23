import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { Package, Bike, Cloud, Star } from 'lucide-react';

const IntroAnimation = () => {
    const { setInitialLoading, loading } = useData();
    const [isVisible, setIsVisible] = useState(true);

    // Data ready check including Ads and Services
    const isDataReady =
        !loading.products &&
        !loading.stores &&
        !loading.news &&
        !loading.categories &&
        !loading.ads &&
        !loading.services;

    useEffect(() => {
        // Minimum animation time 4.5s
        const minTime = setTimeout(() => {
            if (isDataReady) {
                setIsVisible(false);
            }
        }, 4500);

        return () => clearTimeout(minTime);
    }, [isDataReady]);

    // Check data readiness periodically
    useEffect(() => {
        if (!isVisible) {
            setTimeout(() => {
                if (setInitialLoading) setInitialLoading(false);
            }, 600); // Wait for exit animation
        }
    }, [isVisible, setInitialLoading]);

    // Force exit backup
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isDataReady) setIsVisible(false);
        }, 4500);
        return () => clearTimeout(timer);
    }, [isDataReady]);

    // Animation Timing
    const BIKE_START_DELAY = 0.8;
    const BIKE_HIT_TIME = 1.0;
    const IMPACT_TIME = BIKE_START_DELAY + BIKE_HIT_TIME; // 1.8s

    const DROP_DURATION = 0.3;
    const DROP_START = IMPACT_TIME - DROP_DURATION; // 1.5s
    const BOUNCE_DURATION = 0.3;


    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-b from-orange-400 via-orange-300 to-orange-100 overflow-hidden"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative w-full h-full flex items-center justify-center">

                        {/* 0. CLOUDS */}
                        <motion.div
                            className="absolute top-20 left-10 text-white/40"
                            initial={{ x: -50 }} animate={{ x: 50 }} transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                        >
                            <Cloud size={64} fill="currentColor" />
                        </motion.div>


                        {/* 1. LOGO CONTAINER */}
                        <div className="absolute top-1/3 w-full flex items-end justify-center z-10">
                            <motion.span
                                className="text-6xl md:text-8xl font-bold tracking-tighter text-gray-900"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                H
                            </motion.span>

                            {/* O -> PACKAGE ICON (THE BOUNCER) */}
                            <motion.div
                                className="relative bottom-1 mx-1 z-30"
                                initial={{ opacity: 0, scale: 0, y: 0 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: [0, 0, 180, 0], // Drop & Bounce
                                    rotate: [0, 0, 15, 0]
                                }}
                                transition={{
                                    opacity: { duration: 0.5 },
                                    scale: { delay: 0.4, type: "spring" },
                                    y: {
                                        times: [0, 0.6, 0.8, 1],
                                        duration: DROP_START + DROP_DURATION + BOUNCE_DURATION,
                                        ease: ["linear", "easeIn", "easeOut"]
                                    },
                                    rotate: { delay: DROP_START, duration: 0.6 }
                                }}
                            >
                                <Package className="w-12 h-12 md:w-20 md:h-20 text-orange-700 fill-white" strokeWidth={2.5} />
                            </motion.div>

                            <motion.div
                                className="flex text-6xl md:text-8xl font-bold tracking-tighter text-gray-900"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, staggerChildren: 0.1 }}
                            >
                                <motion.span animate={{ opacity: 1 }}>m</motion.span>
                                <motion.span animate={{ opacity: 1 }}>l</motion.span>
                                <motion.span animate={{ opacity: 1 }}>y</motion.span>
                            </motion.div>
                        </div>

                        {/* 2. ROAD */}
                        <div className="absolute bottom-0 w-full h-1/3 flex items-end">
                            <motion.div
                                className="w-full h-32 bg-gray-800 relative flex items-center overflow-hidden"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                            >
                                <div className="absolute w-full border-t-4 border-dashed border-white/50" />
                            </motion.div>
                        </div>

                        {/* 3. BIKE CRASH ANIMATION */}
                        <motion.div
                            className="absolute bottom-[6.5rem] left-0 z-20"
                            initial={{ x: "-20vw", rotate: 0 }}
                            animate={{
                                x: ["-20vw", "50vw"],
                                y: [0, 0, 10, 0],
                            }}
                            transition={{
                                x: {
                                    duration: BIKE_HIT_TIME,
                                    ease: "linear",
                                    delay: BIKE_START_DELAY
                                },
                                y: {
                                    delay: IMPACT_TIME,
                                    duration: 0.3,
                                    type: "spring"
                                }
                            }}
                        >
                            <div className="relative flex flex-col items-center">
                                <Bike className="w-24 h-24 text-gray-900 fill-gray-900" strokeWidth={1.5} />

                                {/* TWINKLING STARS EFFECT - Static Position, Pulsing Scale/Opacity */}
                                <div className="absolute -top-8 w-full flex justify-center gap-3">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: [0, 1, 0.5, 1], scale: [1, 1.2, 0.8, 1.2] }}
                                        transition={{ delay: IMPACT_TIME, repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                                    >
                                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                    </motion.div>

                                    <motion.div
                                        className="relative -top-3"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: [0, 1, 0.5, 1], scale: [0.8, 1.3, 0.9, 1.3] }}
                                        transition={{ delay: IMPACT_TIME + 0.2, repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                    >
                                        <Star size={20} className="text-yellow-500 fill-yellow-500" />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: [0, 1, 0.5, 1], scale: [1, 1.1, 0.9, 1.1] }}
                                        transition={{ delay: IMPACT_TIME + 0.4, repeat: Infinity, duration: 1.0, ease: "easeInOut" }}
                                    >
                                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                    </motion.div>
                                </div>

                                {/* Removed Confusion Mark (!) as requested */}

                            </div>
                        </motion.div>

                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default IntroAnimation;
