import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wrench, Truck, ShieldCheck, Clock, MapPin, Phone, CheckCircle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import PullToRefreshLayout from '../components/PullToRefreshLayout';

const Services = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { services, loading, requestService } = useData();
    const [selectedService, setSelectedService] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [requestSuccess, setRequestSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRequestService = (service) => {
        setSelectedService(service);
        setShowConfirmation(true);
    };

    const confirmRequest = async () => {
        if (!selectedService) return;

        setIsSubmitting(true);
        try {
            await requestService(selectedService._id || selectedService.id);
            setShowConfirmation(false);
            setTimeout(() => {
                setRequestSuccess(true);
                setIsSubmitting(false);
            }, 300);
        } catch (error) {
            console.error("Failed to request service:", error);
            setIsSubmitting(false);
            alert(t('Failed to request service. Please try again.'));
        }
    };





    return (
        <PullToRefreshLayout>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
                <div className="max-w-3xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors group"
                    >
                        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                        <span className="font-medium">{t('Back')}</span>
                    </button>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('Our Services')}</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {t('Enhance your shopping experience with our premium services.')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {loading.services ? (
                            <div className="col-span-full flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : services.length > 0 ? (
                            services.map((service, index) => (
                                <div key={service._id || index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group flex flex-col h-full">
                                    {/* Image Section */}
                                    <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-900">
                                        <img
                                            src={service.image}
                                            alt={service.name}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=Service'; }}
                                        />

                                    </div>

                                    {/* Content Section */}
                                    <div className="p-5 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{service.name}</h3>

                                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-3 line-clamp-2">
                                            {service.description}
                                        </p>

                                        {/* info rows - Compact spacing */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-start gap-2.5 w-full group/loc leading-snug">
                                                <div className="mt-0.5 p-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg shrink-0">
                                                    <MapPin size={14} className="text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium truncate pt-0.5">{service.address}</span>
                                            </div>
                                        </div>

                                        {/* Action Button - Button pushed to bottom */}
                                        <div className="pt-0 mt-auto">
                                            <button
                                                onClick={() => handleRequestService(service)}
                                                className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-95 duration-200"
                                            >
                                                <span>{t('Book Now')}</span>
                                                <ArrowLeft className="rotate-180 w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <Wrench size={48} className="mx-auto mb-4 opacity-50" />
                                <p>{t('No services available at the moment.')}</p>
                            </div>
                        )}
                    </div>


                </div>

                {/* Confirmation Modal */}
                {/* Confirmation Modal */}
                {showConfirmation && selectedService && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all scale-100 opacity-100">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShieldCheck className="text-blue-600 dark:text-blue-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {t('Confirm Request')}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    {t('Are you sure you want to request')} <span className="font-semibold text-gray-900 dark:text-white">"{selectedService.name}"</span>?
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                    className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    {t('Cancel')}
                                </button>
                                <button
                                    onClick={confirmRequest}
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                                >
                                    {t('Confirm')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Modal */}
                {requestSuccess && selectedService && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all scale-100 opacity-100">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {t('Request Sent!')}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    {t('Your request for')} <span className="font-semibold text-gray-900 dark:text-white">"{selectedService.name}"</span> {t('has been received')}.
                                    <br />
                                    {t('Our team will contact you shortly at')} <span className="font-semibold text-blue-600">{selectedService.mobile}</span>.
                                </p>
                            </div>
                            <button
                                onClick={() => setRequestSuccess(false)}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                            >
                                {t('Close')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </PullToRefreshLayout>
    );
};

export default Services;
