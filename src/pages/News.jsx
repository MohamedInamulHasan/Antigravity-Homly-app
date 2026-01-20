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
                        <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-300">
                            <div className="relative h-48 sm:h-64">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />

                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
                                        {t(item, 'category')}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                                    <Calendar size={14} className="mr-2" />
                                    {new Date(item.createdAt || item.date).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {t(item, 'title')}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {item.content ? t(item, 'content') : t(item, 'description')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default News;
