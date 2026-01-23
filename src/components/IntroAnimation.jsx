import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';

const IntroAnimation = () => {
    const { setInitialLoading, loading } = useData();
    const [isVisible, setIsVisible] = useState(true);
    const [minTimePassed, setMinTimePassed] = useState(false);

    useEffect(() => {
        // Minimum display time of 1.5 seconds to prevent flickering
        const timer = setTimeout(() => {
            setMinTimePassed(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Check if critical data is loaded
        const isDataReady = !loading.products && !loading.stores && !loading.news && !loading.categories;

        if (minTimePassed && isDataReady) {
            // Start exit animation
            setIsVisible(false);

            // Actually hide the component after animation finishes
            setTimeout(() => {
                if (setInitialLoading) setInitialLoading(false);
            }, 800);
        }
    }, [minTimePassed, loading, setInitialLoading]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-center"
                    >
                        {/* Simple, Static Text */}
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-gray-900 dark:text-white mb-4">
                            Homly
                        </h1>

                        {/* Optional subtle loading indicator if things take too long */}
                        <div className="flex gap-1 mt-4 opacity-50">
                            <motion.div
                                className="w-1.5 h-1.5 bg-gray-900 dark:bg-white rounded-full"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                            />
                            <motion.div
                                className="w-1.5 h-1.5 bg-gray-900 dark:bg-white rounded-full"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                            />
                            <motion.div
                                className="w-1.5 h-1.5 bg-gray-900 dark:bg-white rounded-full"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default IntroAnimation;
