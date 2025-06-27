import React, { useState, useEffect } from 'react';
import ApiCall from "../../config";
import Header from "./Header";
import './AdminHome.css';

const AdminHome = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        setLoading(true);
        try {
            const response = await ApiCall('/api/v1/admin/statistic', 'GET');
            if (response.error) {
                setError(response.data);
            } else {
                setStats(response.data);
            }
        } catch (error) {
            console.error("Statistikani olishda xatolik:", error);
            setError("Statistikani olishda xatolik yuz berdi.");
        } finally {
            setLoading(false);
        }
    };

    const calculateDonutSegments = () => {
        if (!stats) return [];

        const total = stats.totalCount || 1;
        const accepted = (stats.acceptedCount / total) * 360;
        const pending = (stats.pendingCount / total) * 360;
        const rejected = (stats.rejectedCount / total) * 360;

        return [
            { degrees: accepted, color: '#4895ef' },
            { degrees: pending, color: '#4cc9f0' },
            { degrees: rejected, color: '#ef4444' }
        ];
    };

    const donutSegments = calculateDonutSegments();

    return (
        <div style={{ backgroundColor: '#000000' }}>
            <Header props='admin' />
            <div className="admin-stats-container">
                <h1 className="admin-stats-title">Admin Statistikasi</h1>
                {loading ? (
                    <p className="loading-text">Yuklanmoqda...</p>
                ) : error ? (
                    <p className="error-text">{error}</p>
                ) : stats && (
                    <div className="stats-grid">

                        {/* Umumiy topshirganlar - Donut chart */}
                        <div className="stat-card">
                            <h2 className="stat-title">Umumiy topshirganlar</h2>
                            <div className="donut-chart">
                                <div className="donut-chart-bg"></div>
                                {donutSegments.map((segment, index) => (
                                    <div
                                        key={index}
                                        className="donut-segment"
                                        style={{
                                            transform: `rotate(${index === 0 ? 0 : donutSegments.slice(0, index).reduce((a, b) => a + b.degrees, 0)}deg)`,
                                            background: segment.degrees > 0 ? segment.color : 'transparent'
                                        }}
                                    ></div>
                                ))}
                                <div className="donut-center">
                                    {stats.totalCount}
                                </div>
                            </div>
                            <div className="donut-legend">
                                <div className="legend-item">
                                    <div className="legend-color status-accepted"></div>
                                    <span>Qabul qilingan</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-color status-pending"></div>
                                    <span>Ko'rib chiqilmoqda</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-color status-rejected"></div>
                                    <span>Rad etilgan</span>
                                </div>
                            </div>
                        </div>

                        {/* Holatlar bo'yicha statistikalar */}
                        <div className="stat-card">
                            <h2 className="stat-title">Holatlar bo'yicha statistikalar</h2>

                            <div className="progress-container">
                                <h3>Qabul qilinganlar</h3>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill status-accepted"
                                        style={{ width: `${(stats.acceptedCount / stats.totalCount) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="stat-value">{stats.acceptedCount}</div>
                            </div>

                            <div className="progress-container">
                                <h3>Ko'rib chiqilayotganlar</h3>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill status-pending"
                                        style={{ width: `${(stats.pendingCount / stats.totalCount) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="stat-value">{stats.pendingCount}</div>
                            </div>

                            <div className="progress-container">
                                <h3>Rad etilganlar</h3>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill status-rejected"
                                        style={{ width: `${(stats.rejectedCount / stats.totalCount) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="stat-value">{stats.rejectedCount}</div>
                            </div>
                        </div>
                        {/* 1 kunlik topshirganlar */}
                        <div className="stat-card">
                            <h2 className="stat-title">Kunlik topshirganlar</h2>
                            <div className="bar-chart">
                                <div
                                    className="bar"
                                    style={{
                                        height: `${Math.min(100, (stats.dailyCount / Math.max(1, stats.totalCount)) * 100)}%`
                                    }}
                                ></div>
                            </div>
                            <div className="stat-value">{stats.dailyCount}</div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminHome;