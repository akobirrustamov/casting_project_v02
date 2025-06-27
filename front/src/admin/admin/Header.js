import React, { useState } from 'react';
import './header.css';
import { Link } from 'react-router-dom';

function Header({ props }) {
    console.log(props)
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header-container">
            <div className="header-content">
                <Link to="/admin" className="logo" onClick={() => setIsMenuOpen(false)}>
                    <span className="logo-text">Bosh Sahifa</span>
                </Link>

                {/* Mobile menu toggle button */}
                <button className="menu-toggle" onClick={toggleMenu}>
                    {isMenuOpen ? '✕' : '☰'}
                </button>

                <nav className={`navigation ${isMenuOpen ? 'active' : ''}`}>
                    <ul className="nav-list">
                        <li className="nav-item" onClick={() => setIsMenuOpen(false)}>
                            <Link
                                to="/admin"
                                className={`nav-link text-white ${props === 'admin' ? 'active' : ''}`}
                            >
                                <span className="logo-text">Bosh Sahifa< /span>

                            </Link>
                        </li>
                        <li className="nav-item" onClick={() => setIsMenuOpen(false)}>
                            <Link
                                to="/admin/news"
                                className={`nav-link text-white ${props === 'admin/news' ? 'active' : ''}`}
                            >
                                Yangiliklar
                            </Link>
                        </li>
                        <li className="nav-item" onClick={() => setIsMenuOpen(false)}>
                            <Link
                                to="/admin/casting-users"
                                className={`nav-link text-white ${props === 'admin/casting-users' ? 'active' : ''}`}
                            >
                                Casting
                            </Link>
                        </li>

                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;