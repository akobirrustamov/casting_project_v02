import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import logo from "./logo.jpg";
import './header.css';

function Header({ activeTab }) {
    const { userId } = useParams();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [language, setLanguage] = useState('uz');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'uz';
        setLanguage(savedLanguage);

        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setIsMenuOpen(false);
                document.body.style.overflow = 'auto';
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleMenu = () => {
        const newState = !isMenuOpen;
        setIsMenuOpen(newState);
        document.body.style.overflow = newState ? 'hidden' : 'auto';
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        document.body.style.overflow = 'auto';
    };

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('selectedLanguage', lang);
        window.location.reload();
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
        <>
            <header className={`header-container ${scrolled ? 'scrolled' : ''}`}>
                <div className="header-content">
                    <Link to={`/${userId}`} className="logo" onClick={closeMenu}>
                        <img src={logo} alt="Logo" className="logo-image" />
                    </Link>

                    <div className="header-right">


                        {isMobile && (
                            <div className='for_flex'>
                                <div className="language-selector">
                                    <select
                                        value={language}
                                        onChange={(e) => changeLanguage(e.target.value)}
                                        className="language-dropdown"
                                        aria-label={translations[language].language}
                                    >
                                        <option value="uz">{translations[language].uzbek}</option>
                                        <option value="ru">{translations[language].russian}</option>
                                    </select>
                                </div>
                                <button
                                    className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
                                    onClick={toggleMenu}
                                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                                >
                                    <span className="menu-line"></span>
                                    <span className="menu-line"></span>
                                    <span className="menu-line"></span>
                                </button>
                            </div>
                        )}
                    </div>

                    {!isMobile && (
                        <nav className="desktop-navigation">
                            <ul className="nav-list">
                                <li className="nav-item">
                                    <Link
                                        to={`/${userId}`}
                                        className={`nav-link ${activeTab === '' ? 'active' : ''}`}
                                    >
                                        {translations[language].home}
                                        <span className="link-underline"></span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        to={`/data-form/${userId}`}
                                        className={`nav-link ${activeTab === 'data-form' ? 'active' : ''}`}
                                    >
                                        {translations[language].casting}
                                        <span className="link-underline"></span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        to={`/history/${userId}`}
                                        className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                                    >
                                        {translations[language].my}
                                        <span className="link-underline"></span>
                                    </Link>
                                </li>
                            </ul>
                            <div className="language-selector">
                                <select
                                    value={language}
                                    onChange={(e) => changeLanguage(e.target.value)}
                                    className="language-dropdown"
                                    aria-label={translations[language].language}
                                >
                                    <option value="uz">{translations[language].uzbek}</option>
                                    <option value="ru">{translations[language].russian}</option>
                                </select>
                            </div>
                        </nav>
                    )}
                </div>
            </header>

            {/* Mobile Navigation Overlay */}
            {isMobile && (
                <div className={`mobile-nav-overlay ${isMenuOpen ? 'active' : ''}`}>
                    <nav className="mobile-navigation">
                        <ul className="mobile-nav-list">
                            <li className="nav-item" onClick={closeMenu}>
                                <Link
                                    to={`/${userId}`}
                                    className={`nav-link ${activeTab === '' ? 'active' : ''}`}
                                >
                                    {translations[language].home}
                                </Link>
                            </li>
                            <li className="nav-item" onClick={closeMenu}>
                                <Link
                                    to={`/data-form/${userId}`}
                                    className={`nav-link ${activeTab === 'data-form' ? 'active' : ''}`}
                                >
                                    {translations[language].casting}
                                </Link>
                            </li>
                            <li className="nav-item" onClick={closeMenu}>
                                <Link
                                    to={`/history/${userId}`}
                                    className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                                >
                                    {translations[language].my}
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </>
    );
}

export default Header;