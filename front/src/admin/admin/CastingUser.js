import React, { useState, useEffect } from 'react';
import ApiCall from "../../config";
import Sidebar from "./Sidebar";
import 'rodal/lib/rodal.css';
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Rodal from 'rodal';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

const CastingUser = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

   

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await ApiCall('/api/v1/casting-user', 'GET');
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











    return (
        <div className="flex h-screen bg-gray-100">

            <div className="flex-1 overflow-auto">
                <Header props='admin/news' />

                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">News Management</h1>

                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {loading && !newsList.length ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="bg-white shadow rounded-lg overflow-hidden">

                        </div>
                    )}
                </div>
            </div>


        </div>
    );
};

export default CastingUser;