import React, { useState, useEffect } from 'react';
import ApiCall from "../../config";
import Header from "./Header";

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

    return (
        <div>
            <Header props='admin' />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Admin Statistikasi</h1>

                {loading ? (
                    <p>Yuklanmoqda...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="font-semibold">1 kunlik topshirganlar</h2>
                            <p className="text-xl">{stats.dailyCount}</p>
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="font-semibold">Umumiy topshirganlar</h2>
                            <p className="text-xl">{stats.totalCount}</p>
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="font-semibold">Rad etilganlar</h2>
                            <p className="text-xl">{stats.rejectedCount}</p>
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="font-semibold">Qabul qilinganlar</h2>
                            <p className="text-xl">{stats.acceptedCount}</p>
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="font-semibold">Ko‘rib chiqilayotganlar</h2>
                            <p className="text-xl">{stats.pendingCount}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminHome;
