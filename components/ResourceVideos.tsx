import React, { useState, useEffect } from 'react';
import { VideoCategory, VideoData } from '../types';
import { apiService } from '../services/apiService';
import { useTranslation } from '../hooks/useTranslation';

const ResourceVideos: React.FC = () => {
  const { t } = useTranslation();
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
        try {
            setLoading(true);
            const videoData = await apiService.getVideos();
            setVideos(videoData);
        } catch (err) {
            setError(t('resourceVideos.error'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchVideos();
  }, [t]);

  const getYouTubeEmbedUrl = (url: string): string | null => {
    let videoId: string | null = null;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v');
      } else if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      }
    } catch (e) {
      console.warn("Could not parse URL with new URL(), falling back to regex.", url, e);
    }

    if (!videoId) {
      const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regex);
      if (match && match[1]) {
        videoId = match[1];
      }
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    
    console.error("Could not extract YouTube video ID from URL:", url);
    return null;
  };

  const handleWatchNow = (url: string) => {
    const embedUrl = getYouTubeEmbedUrl(url);
    if (embedUrl) {
      setSelectedVideoUrl(embedUrl);
    } else {
      alert("Sorry, this video is currently unavailable or the link is invalid.");
    }
  };

  const closeModal = () => {
    setSelectedVideoUrl(null);
  };

  const categoryStyles: { [key in VideoCategory]: string } = {
    [VideoCategory.NATURAL_DISASTER]: 'bg-secondary',
    [VideoCategory.FIRST_AID]: 'bg-danger',
    [VideoCategory.PREPAREDNESS]: 'bg-accent',
    [VideoCategory.SPECIFIC_SKILL]: 'bg-primary',
  };


  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="text-3xl font-bold text-light font-mono">&gt; {t('resourceVideos.title')}</h1>
      <p className="text-lg text-dark-300">
        {t('resourceVideos.subtitle')}
      </p>

      {loading ? (
        <p className="text-center p-8 font-mono animate-pulse">{t('resourceVideos.loading')}</p>
      ) : error ? (
        <p className="text-center p-8 text-danger">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, index) => (
              <div 
                key={index} 
                className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer h-64 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-dark-700 hover:border-primary" 
                onClick={() => handleWatchNow(video.url)}
              >
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 p-4 text-white w-full">
                  <div className={`text-xs font-semibold px-2 py-1 rounded inline-block mb-2 ${categoryStyles[video.category]} font-mono`}>
                      {video.category}
                  </div>
                  <h3 className="text-lg font-bold leading-tight">{video.title}</h3>
                </div>
              </div>
            ))}
        </div>
      )}

      {selectedVideoUrl && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up"
          onClick={closeModal}
        >
          <div 
            className="bg-black p-1 rounded-xl shadow-2xl relative w-full max-w-4xl border border-dark-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeModal} 
              className="absolute -top-4 -right-4 z-10 bg-light rounded-full p-1 text-dark-900 hover:bg-gray-200 transition-all"
              aria-label="Close video player"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="relative h-0 pb-[56.25%]"> {/* 16:9 Aspect Ratio */}
              <iframe
                src={selectedVideoUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceVideos;
