import React, { useState, useEffect } from 'react';
import ApiCall from "../../config";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { FaUser, FaPhone, FaEnvelope, FaTelegram } from 'react-icons/fa';
import './CastingUser.css';

const CastingUser = () => {
    const [castingUsers, setCastingUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCastingUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [statusFilter, castingUsers]);

    const fetchCastingUsers = async () => {
        setLoading(true);
        try {
            const response = await ApiCall('/api/v1/casting-user', 'GET');
            if (response.error) {
                setError(response.data);
            } else {
                setCastingUsers(response.data);
            }
        } catch (error) {
            console.error("Casting foydalanuvchilarni yuklashda xatolik:", error);
            setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        if (statusFilter === "all") {
            setFilteredUsers(castingUsers);
        } else {
            setFilteredUsers(castingUsers.filter(user => String(user.status) === statusFilter));
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('uz-UZ', options);
    };

    const getStatusText = (status) => {
        const statusTexts = {
            0: "Ko'rib chiqilmoqda",
            1: "Qabul qilindi",
            2: "Rad etildi"
        };
        return statusTexts[status] || "";
    };

    const getStatusClass = (status) => {
        const statusClasses = {
            0: "status-pending",
            1: "status-accepted",
            2: "status-rejected"
        };
        return statusClasses[status] || "";
    };

    const handleViewDetails = (castingUserId) => {
        navigate(`/admin/casting-users/${castingUserId}`);
    };

    return (
        <div className="casting-dark">
            <Header props='admin/casting-users' />

            <div className="casting-content">
                <h1 className="casting-title">Foydalanuvchilar</h1>

                {/* Status Filter */}
                <div className="filter-container">
                    <label className="filter-label">Holat bo'yicha filter:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Barcha</option>
                        <option value="0">Ko'rib chiqilmoqda</option>
                        <option value="1">Qabul qilindi</option>
                        <option value="2">Rad etildi</option>
                    </select>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {loading && !castingUsers.length ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <span className="loading-text">Yuklanmoqda...</span>
                    </div>
                ) : (
                    <div className="users-grid">
                        {filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                onClick={() => handleViewDetails(user.id)}
                                className="user-card"
                            >
                                <div className="user-header">
                                    <div>
                                        <h3 className="user-name">
                                            <FaUser className="info-icon" />
                                            {user.name}
                                        </h3>
                                        <p className="user-meta">
                                            {user.castingType} • {user.gender}
                                        </p>
                                    </div>
                                    <span className={`status-badge ${getStatusClass(user.status)}`}>
                                        {getStatusText(user.status)}
                                    </span>
                                </div>

                                <div className="user-info">
                                    <div className="info-item">
                                        <FaPhone className="info-icon" />
                                        <span>{user.phone}</span>
                                    </div>
                                    <div className="info-item">
                                        <FaEnvelope className="info-icon" />
                                        <span>{user.email}</span>
                                    </div>
                                    {user.telegram && (
                                        <div className="info-item">
                                            <FaTelegram className="info-icon" />
                                            <span>@{user.telegram}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="user-footer">
                                    <span>{formatDate(user.createdAt)}</span>
                                    <span className="details-link">Batafsil</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CastingUser;