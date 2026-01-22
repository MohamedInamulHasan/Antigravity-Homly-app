import { useEffect } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

const News = () => {
    const navigate = useNavigate();
    const { news: newsItems } = useData();
    const { t } = useLanguage();


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-200">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        {t('Back')}
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('News & Offers')}</h1>
                    <div className="w-5" /> {/* Spacer for alignment */}
                </div>

                <div className="space-y-6">
                    {newsItems.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-gray-700/50 group flex flex-col md:flex-row h-full md:h-64">
                            {/* Image Section */}
                            <div className="relative h-48 md:h-full md:w-2/5 shrink-0 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                                {/* Category Badge */}
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg border border-blue-400/30">
                                        {t(item, 'category')}
                                    </span>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-6 md:p-8 flex flex-col justify-center flex-grow relative">
                                {/* Decorative Background Element */}
                                <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 text-gray-900 dark:text-white transform rotate-12 pointer-events-none">
                                    <Calendar size={120} strokeWidth={1} />
                                </div>

                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium uppercase tracking-wide">
                                    <Calendar size={14} className="mr-2 text-blue-500" />
                                    {new Date(item.createdAt || item.date).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {t(item, 'title')}
                                </h2>

                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base line-clamp-3 md:line-clamp-none">
                                    {item.content ? t(item, 'content') : t(item, 'description')}
                                </p>

                                {/* "Read More" or Line Decoration */}
                                <div className="mt-4 md:mt-6 w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full group-hover:w-24 transition-all duration-300"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default News;
