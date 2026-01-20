import { useEffect, useState } from 'react';
import { Home } from 'lucide-react';
import { useData } from '../context/DataContext';

const IntroAnimation = () => {
    // Component is now controlled purely by parent's conditional rendering
    // No internal state or timeout needed

    // SAFETY: Use DataContext to force close specific to this component if it hangs
    const { setInitialLoading } = useData();

    useEffect(() => {
        // Safety timeout: If for ANY reason data loading hangs or error boundaries
        // fail to catch something, force close the intro after 6 seconds.
        const timer = setTimeout(() => {
            console.warn("⚠️ IntroAnimation safety timeout triggered. Force closing.");
            if (setInitialLoading) setInitialLoading(false);
        }, 6000);
        return () => clearTimeout(timer);
    }, [setInitialLoading]);


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-teal-500 animate-gradient">
            <style>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                @keyframes fadeInScale {
                    0% {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                
                @keyframes dots {
                    0%, 20% {
                        content: '.';
                    }
                    40% {
                        content: '..';
                    }
                    60%, 100% {
                        content: '...';
                    }
                }
                
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
                
                .animate-fadeInScale {
                    animation: fadeInScale 0.8s ease-out forwards;
                }
                
                .animate-pulse-slow {
                    animation: pulse 2s ease-in-out infinite;
                }
                
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                
                .loading-dots::after {
                    content: '';
                    animation: dots 1.5s steps(1) infinite;
                }
            `}</style>

            {/* Main Content */}
            <div className="text-center animate-fadeInScale">
                {/* Logo/Icon */}
                <div className="flex justify-center mb-6 animate-float">
                    <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 shadow-2xl">
                        <Home size={64} className="text-white" strokeWidth={1.5} />
                    </div>
                </div>

                {/* App Name */}
                <h1 className="text-7xl md:text-8xl font-bold text-white mb-4 tracking-tight animate-pulse-slow">
                    Homly
                </h1>

                {/* Tagline */}
                <p className="text-xl md:text-2xl text-white/90 font-light mb-8">
                    Your Home Shopping Companion
                </p>

                {/* Loading Indicator */}
                <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>

                {/* Loading Text */}
                <p className="text-white/70 text-sm mt-4 loading-dots">
                    Loading
                </p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/3 right-20 w-16 h-16 bg-white/10 rounded-full blur-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
    );
};

export default IntroAnimation;
