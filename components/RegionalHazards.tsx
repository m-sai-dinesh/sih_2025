import React, { useState, useEffect } from 'react';
import Card from './shared/Card';
import { apiService } from '../services/apiService';
import { useTranslation } from '../hooks/useTranslation';

// --- SVG Icons for Hazards ---
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const AlertTriangleIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const EarthquakeIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/><path d="M4.14 15.05 2 21h12.24"/><path d="M19.86 15.05 22 21H9.76"/></svg>;
const FloodIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>;
const CycloneIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H3"/><path d="M3 12h18"/><path d="M3 20h18"/><path d="M13 4a4 4 0 0 0-4 4c0 2 3 6 4 6s4-4 4-6a4 4 0 0 0-4-4z"/><path d="M7 12a4 4 0 0 0 4 4c2 0 6-3 6-4s-4-4-6-4a4 4 0 0 0-4 4z"/><path d="M17 20a4 4 0 0 0-4-4c-2 0-6 3-6 4s4 4 6 4a4 4 0 0 0 4-4z"/></svg>;
const TsunamiIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.26 15.62c.74.1 1.48.2 2.22.21 2.22.06 4.43-.37 6.5-1.25 1.25-.53 2.45-1.2 3.56-1.98.56-.39 1.1-1.03 1.1-1.6.01-.52-.2-1.04-.5-1.5-.4-.6-.9-1.2-1.4-1.8-1.2-1.3-2.5-2.6-3.8-3.9a.85.85 0 0 0-1.2 0c-.2.2-.2.5 0 .7l1.3 1.3c.7.8 1.4 1.5 2.1 2.3.4.4.4 1 0 1.4-.3.3-.7.3-1 0-.6-.5-1.2-1-1.8-1.5l-1.3-1.3c-.3-.2-.5-.2-.7 0a.48.48 0 0 0 0 .7l1.3 1.3c.6.5 1.2 1 1.8 1.5.4.3.4.9 0 1.2-.3.3-.7.3-1 0-.6-.5-1.2-1-1.8-1.5l-1.3-1.3c-.3-.2-.5-.2-.7 0a.48.48 0 0 0 0 .7l1.3 1.3c.6.5 1.2 1 1.8 1.5.4.3.4.9 0 1.2-.3.3-.7.3-1 0-.6-.5-1.2-1-1.8-1.5L9.6 12a.48.48 0 0 0-.7 0c-.2.3-.2.5 0 .7l1.3 1.3c.8.7 1.6 1.3 2.5 1.8 2.2 1.2 4.7 1.6 7.2 1.3"/><path d="m18 10-1.4 1.4c-.2.2-.2.5 0 .7l1.3 1.3c.7.8 1.4 1.5 2.1 2.3.4.4.4 1 0 1.4-.3.3-.7.3-1 0-.6-.5-1.2-1-1.8-1.5l-1.3-1.3c-.3-.2-.5-.2-.7 0a.48.48 0 0 0 0 .7l1.3 1.3c.6.5 1.2 1 1.8 1.5.4.3.4.9 0 1.2-.3.3-.7.3-1 0-.6-.5-1.2-1-1.8-1.5l-1.3-1.3c-.3-.2-.5-.2-.7 0a.48.48 0 0 0 0 .7l1.3 1.3c.6.5 1.2 1 1.8 1.5.4.3.4.9 0 1.2-.3.3-.7.3-1 0-.6-.5-1.2-1-1.8-1.5l-.2-.2"/></svg>;
const LandslideIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 7.5 1.5L14 4l6 6-4 3.5 4.5 5.5-11.5 2L3 11z"/><path d="m9.5 6.5 3 2.5"/><path d="M12.5 15.5 15 17"/></svg>;
const DroughtIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 12a.5.5 0 0 0-1 0v5.5a.5.5 0 0 0 1 0V12z"/><path d="M12.5 12a.5.5 0 0 0-1 0v5.5a.5.5 0 0 0 1 0V12z"/><path d="M16.5 12a.5.5 0 0 0-1 0v5.5a.5.5 0 0 0 1 0V12z"/><path d="M2 12h20"/><path d="M17.3 5.3a2.4 2.4 0 0 0-3.16-3.16"/><path d="M22 17a5 5 0 0 1-10 0v-1a5 5 0 0 1 10 0v1z"/></svg>;
const HeatwaveIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>;
const AvalancheIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 15h14"/><path d="m16 4-3 3-3-3 3-3 3 3z"/><path d="m20 8-2 2-2-2 2-2 2 2z"/><path d="m4 8 2 2 2-2-2-2-2 2z"/><path d="M15 15 8 22h14l-7-7z"/><path d="M9 15 2 22h14l-7-7z"/></svg>;
const LightningIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2v8h6L8 22v-8H2L13 2z"/></svg>;
const ColdIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h10"/><path d="M17 20v-6.5a4.5 4.5 0 1 0-9 0V20"/><path d="M17 16h5"/><path d="m5 8 1.8-1.8"/><path d="m5 16 1.8 1.8"/><path d="M11 8 9.2 6.2"/><path d="M11 16 9.2 17.8"/></svg>;
const FireIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 6.5a4.5 4.5 0 1 0 0-5 4.5 4.5 0 0 0 0 5z"/><path d="M12 12a6 6 0 1 0 0-7 6 6 0 0 0 0 7z"/><path d="M19 19a7 7 0 1 0-14 0h14z"/><path d="M13 19a1 1 0 1 0-2 0h2z"/></svg>;
const SandstormIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M2 7h20"/><path d="M2 17h20"/><path d="m7 12-4-5"/><path d="m14 12-4-5"/><path d="m7 17-4 5"/><path d="m14 17-4 5"/></svg>;
const FogIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M2 17h20"/><path d="M12 2v2.5"/><path d="m4.2 7.8 1.2 1.2"/><path d="M18.6 9 17.4 7.8"/><path d="M12 22v-2.5"/></svg>;

// --- Hazard Styles Mapping ---
const HAZARD_STYLES: { [key: string]: { icon: React.ReactNode; color: string } } = {
    'Tsunami': { icon: <TsunamiIcon />, color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' },
    'Cyclone': { icon: <CycloneIcon />, color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' },
    'Earthquake': { icon: <EarthquakeIcon />, color: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
    'Flood': { icon: <FloodIcon />, color: 'bg-blue-500/10 text-blue-300 border-blue-500/30' },
    'Flash Flood': { icon: <FloodIcon />, color: 'bg-blue-500/10 text-blue-300 border-blue-500/30' },
    'Urban Flood': { icon: <FloodIcon />, color: 'bg-blue-500/10 text-blue-300 border-blue-500/30' },
    'Landslide': { icon: <LandslideIcon />, color: 'bg-stone-500/10 text-stone-300 border-stone-500/30' },
    'Drought': { icon: <DroughtIcon />, color: 'bg-orange-500/10 text-orange-300 border-orange-500/30' },
    'Heatwave': { icon: <HeatwaveIcon />, color: 'bg-red-500/10 text-red-300 border-red-500/30' },
    'Avalanche': { icon: <AvalancheIcon />, color: 'bg-sky-500/10 text-sky-300 border-sky-500/30' },
    'Lightning': { icon: <LightningIcon />, color: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30' },
    'Extreme Cold': { icon: <ColdIcon />, color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' },
    'Forest Fire': { icon: <FireIcon />, color: 'bg-rose-500/10 text-rose-300 border-rose-500/30' },
    'Sandstorm': { icon: <SandstormIcon />, color: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30' },
    'Hailstorm': { icon: <FloodIcon />, color: 'bg-slate-500/10 text-slate-300 border-slate-500/30' },
    'Fog': { icon: <FogIcon />, color: 'bg-gray-500/10 text-gray-300 border-gray-500/30' },
    'Default': { icon: <AlertTriangleIcon />, color: 'bg-gray-500/10 text-gray-300 border-gray-500/30' }
};

const HazardBadge: React.FC<{ hazard: string }> = ({ hazard }) => {
  const style = HAZARD_STYLES[hazard] || HAZARD_STYLES['Default'];
  return (
    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-mono border ${style.color}`}>
      {style.icon}
      <span className="truncate">{hazard}</span>
    </div>
  );
};

type HazardsData = { [key: string]: string[] };

const RegionalHazards: React.FC = () => {
    const { t } = useTranslation();
    const [selectedState, setSelectedState] = useState<string>('');
    const [hazardsData, setHazardsData] = useState<HazardsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHazards = async () => {
            try {
                setLoading(true);
                const data = await apiService.getHazardsData();
                setHazardsData(data);
            } catch (err) {
                setError(t('regionalHazards.error'));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHazards();
    }, [t]);

    const states = hazardsData ? Object.keys(hazardsData) : [];

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-light font-mono">&gt; {t('regionalHazards.title')}</h1>
            <p className="text-lg text-dark-300">{t('regionalHazards.subtitle')}</p>
            
            <Card className="max-w-2xl mx-auto">
                <div className="flex items-center space-x-2 text-dark-200 mb-4">
                    <MapPinIcon/>
                    <label htmlFor="state-select" className="font-semibold">{t('regionalHazards.selectLabel')}</label>
                </div>
                {loading ? (
                    <p className="font-mono animate-pulse">{t('regionalHazards.loading')}</p>
                ) : error ? (
                    <p className="text-red-400">{error}</p>
                ) : (
                    <select
                        id="state-select"
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="w-full p-3 border border-dark-700 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-dark-800 text-dark-200 font-mono hover:border-primary transition-colors"
                    >
                        <option value="" disabled></option>
                        {states.map(state => <option key={state} value={state}>{state}</option>)}
                    </select>
                )}

                {selectedState && hazardsData && (
                    <div className="mt-6 animate-fade-in-up">
                        <div className="flex items-center border-b border-dark-700 pb-3 mb-4">
                            <h3 className="text-lg font-bold text-dark-100 font-mono">
                                {t('regionalHazards.hazardsTitle', { state: selectedState })}
                            </h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {hazardsData[selectedState].map(hazard => (
                                <HazardBadge key={hazard} hazard={hazard} />
                            ))}
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default RegionalHazards;