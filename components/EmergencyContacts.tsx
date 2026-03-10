import React, { useState, useEffect } from 'react';
import Card from './shared/Card';
import { apiService } from '../services/apiService';
import { useTranslation } from '../hooks/useTranslation';

interface Contact {
    name: string;
    number: string;
}

const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;

const EmergencyContacts: React.FC = () => {
    const { t } = useTranslation();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                setLoading(true);
                const data = await apiService.getEmergencyContacts();
                setContacts(data);
            } catch (err) {
                setError(t('emergencyContacts.error'));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchContacts();
    }, [t]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-primary">{t('emergencyContacts.title')}</h1>
            <p className="text-lg text-gray-600">{t('emergencyContacts.subtitle')}</p>
            
            {loading ? (
                <p className="text-center p-8">{t('emergencyContacts.loading')}</p>
            ) : error ? (
                <p className="text-center p-8 text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contacts.map((contact, index) => (
                        <Card key={index} className="!bg-red-50 !border-red-200 border text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="flex flex-col items-center">
                                <div className="p-4 bg-red-100 rounded-full mb-4">
                                    <PhoneIcon />
                                </div>
                                <span className="font-semibold text-dark text-lg">{contact.name}</span>
                                <a 
                                    href={`tel:${contact.number.replace(/\s/g, '')}`} 
                                    className="text-3xl font-bold text-accent hover:text-red-700 hover:underline mt-2 transition-colors"
                                    aria-label={`Call ${contact.name} at ${contact.number}`}
                                >
                                    {contact.number}
                                </a>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmergencyContacts;