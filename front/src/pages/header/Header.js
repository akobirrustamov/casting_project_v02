import React, { useState, useEffect } from 'react';
import {Link, useParams} from 'react-router-dom';
import './header.css';

function Header({ props }) {
    const { userId } = useParams();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [language, setLanguage] = useState('uz');

    useEffect(() => {
        // Get language from localStorage or default to Uzbek
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'uz';
        setLanguage(savedLanguage);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('selectedLanguage', lang);
        window.location.reload(); // Refresh to apply language changes
    };

    const translations = {
        uz: {
            home: "Bosh Sahifa",
            casting: "Casting",
            my: "Tarix",
            language: "Til",
            uzbek: "O'zbekcha",
            russian: "Ruscha"
        },
        ru: {
            home: "Главная",
            casting: "Кастинг",
            my: "История",
            language: "Язык",
            uzbek: "Узбекский",
            russian: "Русский"
        }
    };

    return (
        <header className="header-container">
            <div className="header-content">
                <Link  to={`/${userId}`} className="logo" onClick={() => setIsMenuOpen(false)}>
                    <span className="logo-text">{translations[language].home}</span>
                </Link>

                <div className="language-selector">
                    <select
                        value={language}
                        onChange={(e) => changeLanguage(e.target.value)}
                        className="language-dropdown"
                    >
                        <option value="uz">{translations[language].uzbek}</option>
                        <option value="ru">{translations[language].russian}</option>
                    </select>
                </div>

                <button className="menu-toggle" onClick={toggleMenu}>
                    {isMenuOpen ? '✕' : '☰'}
                </button>

                <nav className={`navigation ${isMenuOpen ? 'active' : ''}`}>
                    <ul className="nav-list">
                        <li className="nav-item" onClick={() => setIsMenuOpen(false)}>
                            <Link
                                to={`/${userId}`}
                                className={`nav-link text-white ${props === '' ? 'active' : ''}`}
                            >
                                {translations[language].home}
                            </Link>
                        </li>

                        <li className="nav-item" onClick={() => setIsMenuOpen(false)}>
                            <Link
                                to={`/data-form/${userId}`}
                                className={`nav-link text-white ${props === 'data-form' ? 'active' : ''}`}
                            >
                                {translations[language].casting}
                            </Link>
                        </li>
                        <li className="nav-item" onClick={() => setIsMenuOpen(false)}>
                            <Link
                                to={`/history/${userId}`}
                                className={`nav-link text-white ${props === 'history' ? 'active' : ''}`}
                            >
                                {translations[language].my}
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;