import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.css';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
        document.body.style.overflow = 'auto';
    }, [location.pathname]);

    const navItems = [
        { path: '/admin', icon: '🏠', text: 'Bosh Sahifa' },
        { path: '/admin/news', icon: '📰', text: 'Yangiliklar' },
        { path: '/admin/casting-users', icon: '🎭', text: 'Casting' }
    ];

    return (
        <header className={`header-container ${scrolled ? 'scrolled' : ''}`}>
            <div className="header-content">
                <Link to="/admin" className="logo" onClick={() => setIsMenuOpen(false)}>
                    <div className="logo-mark">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3 12L12 17L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3 17L12 22L21 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="logo-text">Admin Panel</span>
                </Link>

                <button
                    className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? "Yopish" : "Menyu"}
                    aria-expanded={isMenuOpen}
                >
                    <span className="menu-toggle-line"></span>
                    <span className="menu-toggle-line"></span>
                    <span className="menu-toggle-line"></span>
                </button>

                <nav className={`navigation ${isMenuOpen ? 'active' : ''}`} aria-hidden={!isMenuOpen}>
                    <button
                        className="menu-close"
                        onClick={toggleMenu}
                        aria-label="Yopish"
                    >

                    </button>

                    <ul className="nav-list">
                        {navItems.map((item) => (
                            <li className="nav-item" key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                                    onClick={toggleMenu}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <span className="nav-text">{item.text}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;