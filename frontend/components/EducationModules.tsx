import React, { useState, useEffect } from 'react';
import Card from './shared/Card';
import { DisasterType } from '../types';
import { apiService } from '../services/apiService';
import { useTranslation } from '../hooks/useTranslation';

interface EducationData {
    description: string;
    dos: string[];
    donts: string[];
}

type LanguageEducationData = {
    [key in DisasterType]: EducationData;
};

type AllEducationData = {
    en: LanguageEducationData;
    hi: LanguageEducationData;
}


const DisasterIcon: React.FC<{ type: DisasterType }> = ({ type }) => {
    const icons = {
        [DisasterType.EARTHQUAKE]: 'M3 8l4 8 4-8 4 8 4-8',
        [DisasterType.FLOOD]: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
        [DisasterType.CYCLONE]: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1 5h2v6h-2V7zm0 8h2v2h-2v-2z',
        [DisasterType.TSUNAMI]: 'M2 10c4.5.5 8-3 10-3s5.5 3.5 10 3M2 14c4.5.5 8-3 10-3s5.5 3.5 10 3M2 18c4.5.5 8-3 10-3s5.5 3.5 10 3',
    };
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-secondary mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={icons[type]}></path>
        </svg>
    );
};

const EducationModules: React.FC = () => {
    const { t, language } = useTranslation();
    const [selected, setSelected] = useState<DisasterType | null>(null);
    const [educationData, setEducationData] = useState<AllEducationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await apiService.getEducationData();
                setEducationData(data);
            } catch (err) {
                setError(t('education.error'));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [t]);

    if (loading) return <div className="text-center p-8 font-mono animate-pulse">{t('education.loading')}</div>;
    if (error || !educationData) return <div className="text-center p-8 text-danger">{error || 'Could not load content.'}</div>;

    const currentLangData = educationData[language];

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-light font-mono">&gt; {t('education.title')}</h1>
            <p className="text-lg text-dark-300">{t('education.subtitle')}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(Object.keys(currentLangData) as DisasterType[]).map((type) => (
                    <button key={type} onClick={() => setSelected(type)} className="w-full h-full transition-transform duration-300 transform hover:-translate-y-1">
                        <Card className={`text-center cursor-pointer h-full flex flex-col justify-center border-2 border-transparent hover:border-secondary ${selected === type ? '!border-primary ring-4 ring-primary/20' : ''}`}>
                            <DisasterIcon type={type} />
                            <h3 className="mt-4 text-lg font-bold text-dark-100 font-mono">{t(`disasters.${type}`)}</h3>
                            <p className="mt-1 text-xs text-dark-400">{currentLangData[type].description}</p>
                        </Card>
                    </button>
                ))}
            </div>

            {selected && (
                <Card className="mt-8 animate-fade-in-up">
                    <div className="flex justify-between items-center">
                         <h2 className="text-2xl font-bold text-primary font-mono">{t('education.safetyProtocolsTitle', { disaster: t(`disasters.${selected}`) })}</h2>
                         <button onClick={() => setSelected(null)} className="text-dark-400 hover:text-light">
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                         </button>
                    </div>
                   
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                            <h3 className="text-xl font-semibold text-accent font-mono">{t('education.dos')}</h3>
                            <ul className="mt-2 list-disc list-inside space-y-2 text-dark-200">
                                {currentLangData[selected].dos.map((item, index) => <li key={index}>{item}</li>)}
                            </ul>
                        </div>
                        <div className="bg-danger/10 p-4 rounded-lg border border-danger/20">
                            <h3 className="text-xl font-semibold text-danger font-mono">{t('education.donts')}</h3>
                            <ul className="mt-2 list-disc list-inside space-y-2 text-dark-200">
                                {currentLangData[selected].donts.map((item, index) => <li key={index}>{item}</li>)}
                            </ul>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default EducationModules;
