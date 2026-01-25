import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { Package } from 'lucide-react';

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
        // Minimum animation time to let the "ripple" play a bit
        const minTime = setTimeout(() => {
            if (isDataReady) {
                setIsVisible(false);
            }
        }, 3500); // 3.5s minimum

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
        }, 5000);
        return () => clearTimeout(timer);
    }, [isDataReady]);

    // Animation Variants
    const letterVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1, // Stagger effect
                duration: 0.8,
                ease: [0.2, 0.65, 0.3, 0.9], // Custom cubic bezier
            },
        }),
    };

    const boxVariants = {
        hidden: { scale: 0, opacity: 0, rotate: -180 },
        visible: {
            scale: 1,
            opacity: 1,
            rotate: 0,
            transition: {
                delay: 0.5, // Start after letters begin
                type: "spring",
                stiffness: 260,
                damping: 20,
            },
        },
    };

    const rippleVariants = {
        animate: {
            scale: [1, 2.5],
            opacity: [0.6, 0],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
            },
        },
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    // Background: Clean Gradient
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative flex items-center justify-center">
                        <div className="flex items-center gap-1 md:gap-3">
                            {/* H */}
                            <motion.span
                                custom={0}
                                initial="hidden"
                                animate="visible"
                                variants={letterVariants}
                                className="text-7xl md:text-9xl font-bold tracking-tighter text-blue-900"
                            >
                                H
                            </motion.span>

                            {/* Center Icon (O) with Ripple */}
                            <div className="relative flex items-center justify-center w-16 h-16 md:w-24 md:h-24">
                                {/* Ripples */}
                                <motion.div
                                    className="absolute inset-0 bg-blue-300 rounded-full z-0"
                                    variants={rippleVariants}
                                    animate="animate"
                                />
                                <motion.div
                                    className="absolute inset-0 bg-blue-400 rounded-full z-0"
                                    variants={rippleVariants}
                                    animate="animate"
                                    transition={{ delay: 0.5, duration: 1.5, repeat: Infinity, ease: "easeOut" }} // Staggered ripple
                                />

                                {/* Custom Box Icon */}
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={boxVariants}
                                    className="relative z-10"
                                >
                                    <svg
                                        width="80"
                                        height="80"
                                        viewBox="0 0 100 100"
                                        className="w-16 h-16 md:w-24 md:h-24 drop-shadow-2xl"
                                    >
                                        {/* 3D Box Design */}
                                        {/* Top face */}
                                        <path
                                            d="M50 10 L80 25 L50 40 L20 25 Z"
                                            fill="#3b82f6"
                                            stroke="#1e40af"
                                            strokeWidth="2"
                                        />
                                        {/* Left face */}
                                        <path
                                            d="M20 25 L20 65 L50 80 L50 40 Z"
                                            fill="#2563eb"
                                            stroke="#1e40af"
                                            strokeWidth="2"
                                        />
                                        {/* Right face */}
                                        <path
                                            d="M50 40 L50 80 L80 65 L80 25 Z"
                                            fill="#1d4ed8"
                                            stroke="#1e40af"
                                            strokeWidth="2"
                                        />
                                        {/* Tape on top */}
                                        <path
                                            d="M50 10 L50 40"
                                            stroke="#fbbf24"
                                            strokeWidth="3"
                                        />
                                        {/* Highlight */}
                                        <path
                                            d="M50 15 L70 27 L50 35"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            opacity="0.4"
                                        />
                                    </svg>
                                </motion.div>
                            </div>

                            {/* M L Y */}
                            {['m', 'l', 'y'].map((char, index) => (
                                <motion.span
                                    key={char}
                                    custom={index + 2} // +2 because H is 0, Box is sort of 1
                                    initial="hidden"
                                    animate="visible"
                                    variants={letterVariants} // Uppercase logic or lowercase depending on design. User said "HMLY", I'll stick to case-matching slightly or just bold caps.
                                    // User said "HMLY" caps, but code had "mly". Let's do lower case to match previous or Caps as "H M L Y".
                                    // User prompt: "He letters fade up HMLY then the O".
                                    // Let's stick to "mly" lower case to match "Homly" brand usually seen? Or user typed HMLY.
                                    // I'll make them match the H style: "m", "l", "y" looks good for Homly brand usually.
                                    className="text-7xl md:text-9xl font-bold tracking-tighter text-blue-900 pb-2 md:pb-4" // pb to align baseline with Box better
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default IntroAnimation;
