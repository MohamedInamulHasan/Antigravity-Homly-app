import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { Package, Cloud } from 'lucide-react';

// City Skyline Component (Blue Theme)
const CitySkyline = () => {
    return (
        <div className="absolute bottom-0 w-full h-1/3 flex items-end justify-center overflow-hidden z-0">
            <svg viewBox="0 0 200 50" className="w-full h-full text-blue-900" preserveAspectRatio="none">
                {/* Back Layer (Darker Blue) */}
                <path d="M0 50 L0 20 L30 20 L30 35 L50 35 L50 15 L70 15 L70 50 Z" fill="#1e3a8a" opacity="0.6" />
                <path d="M120 50 L120 25 L140 25 L140 50 Z" fill="#1e3a8a" opacity="0.6" />

                {/* Main City Layer (Dark Blue/Gray) */}
                <path d="M10 50 L10 25 L25 25 L25 50" fill="currentColor" />
                <path d="M35 50 L35 15 L55 15 L55 50" fill="currentColor" />
                <path d="M60 50 L60 10 L80 10 L80 50" fill="currentColor" />
                <path d="M90 50 L90 20 L110 20 L110 50" fill="currentColor" />
                <path d="M115 50 L115 30 L130 30 L130 50" fill="currentColor" />
                <path d="M135 50 L135 5 L160 5 L160 50" fill="currentColor" />
                <path d="M170 50 L170 25 L190 25 L190 50" fill="currentColor" />

                {/* Windows (White) */}
                <rect x="38" y="18" width="2" height="2" fill="white" className="animate-pulse" style={{ animationDuration: '3s' }} />
                <rect x="44" y="18" width="2" height="2" fill="white" />
                <rect x="38" y="24" width="2" height="2" fill="white" />

                <rect x="65" y="15" width="2" height="2" fill="white" className="animate-pulse" style={{ animationDuration: '4s' }} />
                <rect x="71" y="15" width="2" height="2" fill="white" />

                <rect x="140" y="10" width="2" height="2" fill="white" />
                <rect x="150" y="10" width="2" height="2" fill="white" className="animate-pulse" style={{ animationDuration: '2.5s' }} />
                <rect x="140" y="20" width="2" height="2" fill="white" />
            </svg>
        </div>
    );
};

// Custom Parachutist Icon
const Parachutist = ({ className }) => (
    <svg viewBox="0 0 50 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Parachute Canopy */}
        <path d="M5 25 Q 25 0 45 25" stroke="white" strokeWidth="2" fill="#2563eb" /> {/* Blue canopy */}
        <path d="M5 25 L 25 55 M 45 25 L 25 55 M 25 25 L 25 55" stroke="white" strokeWidth="0.5" />

        {/* Skydiver */}
        <circle cx="25" cy="55" r="3" fill="#1e3a8a" /> {/* Head */}
        <line x1="25" y1="58" x2="25" y2="70" stroke="#1e3a8a" strokeWidth="2" /> {/* Body */}
        <line x1="25" y1="62" x2="15" y2="55" stroke="#1e3a8a" strokeWidth="2" /> {/* Arm L */}
        <line x1="25" y1="62" x2="35" y2="55" stroke="#1e3a8a" strokeWidth="2" /> {/* Arm R */}
        <line x1="25" y1="70" x2="20" y2="78" stroke="#1e3a8a" strokeWidth="2" /> {/* Leg L */}
        <line x1="25" y1="70" x2="30" y2="78" stroke="#1e3a8a" strokeWidth="2" /> {/* Leg R */}
    </svg>
);


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
        // Minimum animation time 4.5s (Time for parachute to land)
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


    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    // BACKGROUND GRADIENT: Sky Blue
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-b from-sky-400 via-sky-300 to-blue-100 overflow-hidden"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative w-full h-full flex items-center justify-center">

                        {/* 0. CLOUDS */}
                        <motion.div
                            className="absolute top-20 left-10 text-white/60"
                            initial={{ x: -50 }} animate={{ x: 50 }} transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                        >
                            <Cloud size={64} fill="currentColor" />
                        </motion.div>
                        <motion.div
                            className="absolute top-40 right-20 text-white/50"
                            initial={{ x: 50 }} animate={{ x: -50 }} transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
                        >
                            <Cloud size={48} fill="currentColor" />
                        </motion.div>


                        {/* 1. LOGO CONTAINER */}
                        <div className="absolute top-1/4 w-full flex flex-col items-center z-20">
                            <div className="flex items-end justify-center">
                                {/* H */}
                                <motion.span
                                    className="text-6xl md:text-8xl font-bold tracking-tighter text-blue-900"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    H
                                </motion.span>

                                {/* O -> PACKAGE ICON (BLUE Theme) */}
                                <motion.div
                                    className="relative bottom-1 mx-1 z-30"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                                >
                                    <Package className="w-12 h-12 md:w-20 md:h-20 text-blue-600 fill-white" strokeWidth={2.5} />
                                    {/* HIDDEN PARACHUTIST SPAWNING FROM HERE - REMOVED */}
                                </motion.div>

                                {/* mly */}
                                <motion.span
                                    className="text-6xl md:text-8xl font-bold tracking-tighter text-blue-900"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    mly
                                </motion.span>
                            </div>

                        </div>

                        {/* 2. CITY SKYLINE (Bottom) */}
                        <motion.div
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            transition={{ delay: 0.1, duration: 1.0, ease: "easeOut" }}
                            className="absolute bottom-0 w-full h-1/3"
                        >
                            <CitySkyline />
                        </motion.div>

                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default IntroAnimation;
