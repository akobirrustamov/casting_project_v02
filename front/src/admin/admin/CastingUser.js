import React, { useState, useEffect } from 'react';
import ApiCall from "../../config";
import Sidebar from "./Sidebar";
import 'rodal/lib/rodal.css';
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { FaUser, FaPhone, FaEnvelope, FaTelegram } from 'react-icons/fa';

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
            0: "bg-yellow-100 text-yellow-800",
            1: "bg-green-100 text-green-800",
            2: "bg-red-100 text-red-800"
        };
        return statusClasses[status] || "";
    };

    const handleViewDetails = (castingUserId) => {
        navigate(`/admin/casting-users/${castingUserId}`);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <div className="flex-1 overflow-auto">
                <Header props='admin/casting-users' />

                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Foydalanuvchilar</h1>

                    {/* Status Filter */}
                    <div className="mb-6">
                        <label className="mr-3 font-medium">Holat bo‘yicha filter:</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border p-2 rounded"
                        >
                            <option value="all">Barcha</option>
                            <option value="0">Ko'rib chiqilmoqda</option>
                            <option value="1">Qabul qilindi</option>
                            <option value="2">Rad etildi</option>
                        </select>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {loading && !castingUsers.length ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            <p className="ml-3">Yuklanmoqda...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    onClick={() => handleViewDetails(user.id)}
                                    className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                                    <FaUser className="mr-2 text-blue-500" />
                                                    {user.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {user.castingType} • {user.gender}
                                                </p>
                                            </div>
                                            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusClass(user.status)}`}>
                                                {getStatusText(user.status)}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                                            <div className="flex items-center">
                                                <FaPhone className="mr-2 text-blue-500" />
                                                <span>{user.phone}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaEnvelope className="mr-2 text-blue-500" />
                                                <span>{user.email}</span>
                                            </div>
                                            {user.telegram && (
                                                <div className="flex items-center">
                                                    <FaTelegram className="mr-2 text-blue-500" />
                                                    <span>@{user.telegram}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center text-xs text-gray-500 mt-4">
                                            <span>{formatDate(user.createdAt)}</span>
                                            <span className="text-blue-600 hover:text-blue-800 font-medium">Batafsil</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CastingUser;
