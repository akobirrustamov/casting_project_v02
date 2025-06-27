import React, { useEffect, useState } from 'react';
import Header from "../header/Header";
import "react-responsive-modal/styles.css";
import ApiCall, { baseUrl } from '../../config/index';
import './home.css';
import {useParams} from "react-router-dom";

function Home(props) {
    const { userId } = useParams();

    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [language, setLanguage] = useState('uz');

    useEffect(() => {
        // Get language from localStorage
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'uz';
        setLanguage(savedLanguage);
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await ApiCall('/api/v1/news', 'GET');
            if (response.error) {
                setError(response.data);
            } else {
                setNewsList(response.data);
            }
        } catch (error) {
            console.error("Error fetching news:", error);
            setError("Failed to fetch news");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Translations for UI elements
    const translations = {
        uz: {
            loading: "Yuklanmoqda...",
            error: "Yangiliklar yuklanmadi",
            gallery: "Galereya"
        },
        ru: {
            loading: "Загрузка...",
            error: "Новости не загружены",
            gallery: "Галерея"
        }
    };

    return (
        <div className="home-container">
            <Header props={""} />
            <div className="header-spacer"></div>

            <main className="news-main">
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>{translations[language].loading}</p>
                    </div>
                ) : error ? (
                    <div className="error-message">
                        {translations[language].error}: {error}
                    </div>
                ) : (
                    <div className="news-grid">
                        {newsList.map((news) => (
                            <article key={news.id} className="news-card">
                                {/* Main Image */}
                                {news.mainPhoto && (
                                    <div className="news-main-image">
                                        <img
                                            src={`${baseUrl}/api/v1/file/getFile/${news.mainPhoto.id}`}
                                            alt={language === 'uz' ? news.titleUz : news.titleRu}
                                            className="news-image"
                                        />
                                    </div>
                                )}

                                <div className="news-content">
                                    <div className="news-meta">
                                        <span className="news-date">{formatDate(news.createdAt)}</span>
                                    </div>

                                    <h2 className="news-title">
                                        {language === 'uz' ? news.titleUz : news.titleRu}
                                    </h2>

                                    <div className="news-description">
                                        <p>{language === 'uz' ? news.descriptionUz : news.descriptionRu}</p>
                                    </div>

                                    {/* YouTube Embed */}
                                    {news.link && (
                                        <div className="news-video">
                                            <div className="video-container">
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: news.link
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Additional Images */}
                                    {news.photos && news.photos.length > 0 && (
                                        <div className="news-gallery">
                                            <h4 className="gallery-title">{translations[language].gallery}</h4>
                                            <div className="gallery-grid">
                                                {news.photos.map((photo) => (
                                                    <div key={photo.id} className="gallery-item">
                                                        <img
                                                            src={`${baseUrl}/api/v1/file/getFile/${photo.id}`}
                                                            alt={translations[language].gallery}
                                                            className="gallery-image"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Home;