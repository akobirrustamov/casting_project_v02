import React, { useState, useEffect } from 'react';
import ApiCall from "../../config";
import Sidebar from "./Sidebar";
import 'rodal/lib/rodal.css';
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Rodal from 'rodal';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

const AdminNews = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [currentNews, setCurrentNews] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        titleUz: '',
        titleRu: '',
        descriptionUz: '',
        descriptionRu: '',
        link: '',
        mainImage: null,
        additionalImages: [],
        mainPhotoPreview: null,
        additionalImagesPreviews: []
    });

    useEffect(() => {
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

    const uploadImage = async (image, prefix) => {
        const formData = new FormData();
        formData.append('photo', image);
        formData.append('prefix', prefix);

        try {
            const response = await ApiCall('/api/v1/file/upload', 'POST', formData, null, true);
            return response.data;
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                mainImage: file,
                mainPhotoPreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleAdditionalImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const previews = files.map(file => URL.createObjectURL(file));
            setFormData(prev => ({
                ...prev,
                additionalImages: [...prev.additionalImages, ...files],
                additionalImagesPreviews: [...prev.additionalImagesPreviews, ...previews]
            }));
        }
    };

    const removeAdditionalImage = (index) => {
        const newImages = [...formData.additionalImages];
        const newPreviews = [...formData.additionalImagesPreviews];

        newImages.splice(index, 1);
        newPreviews.splice(index, 1);

        setFormData(prev => ({
            ...prev,
            additionalImages: newImages,
            additionalImagesPreviews: newPreviews
        }));
    };

    const resetForm = () => {
        setFormData({
            titleUz: '',
            titleRu: '',
            descriptionUz: '',
            descriptionRu: '',
            link: '',
            mainImage: null,
            additionalImages: [],
            mainPhotoPreview: null,
            additionalImagesPreviews: []
        });
        setIsEditing(false);
        setCurrentNews(null);
    };

    const openCreateModal = () => {
        resetForm();
        setModalVisible(true);
    };

    const openEditModal = (news) => {
        setCurrentNews(news);
        setFormData({
            titleUz: news.titleUz,
            titleRu: news.titleRu,
            descriptionUz: news.descriptionUz,
            descriptionRu: news.descriptionRu,
            link: news.link,
            mainImage: null,
            additionalImages: [],
            mainPhotoPreview: news.mainPhoto ? `/api/v1/file/getFile/${news.mainPhoto.id}` : null,
            additionalImagesPreviews: news.photos.map(photo => `/api/v1/file/getFile/${photo.id}`)
        });
        setIsEditing(true);
        setModalVisible(true);
    };

    const openDeleteModal = (news) => {
        setCurrentNews(news);
        setDeleteModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setDeleteModalVisible(false);
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let mainPhotoUuid = null;
            const additionalImagesUuids = [];

            // Upload new main image if it exists
            if (formData.mainImage) {
                mainPhotoUuid = await uploadImage(formData.mainImage, '/main');
            } else if (isEditing && currentNews.mainPhoto) {
                // Use existing main photo if not uploading new one
                mainPhotoUuid = currentNews.mainPhoto.id;
            }

            // Upload new additional images
            for (const image of formData.additionalImages) {
                const uuid = await uploadImage(image, '/additional');
                additionalImagesUuids.push(uuid);
            }

            // Include existing additional images if editing
            if (isEditing && currentNews.photos) {
                currentNews.photos.forEach(photo => {
                    additionalImagesUuids.push(photo.id);
                });
            }

            const newsData = {
                titleUz: formData.titleUz,
                titleRu: formData.titleRu,
                descriptionUz: formData.descriptionUz,
                descriptionRu: formData.descriptionRu,
                link: formData.link,
                mainPhoto: mainPhotoUuid,
                photos: additionalImagesUuids
            };

            const url = isEditing ? `/api/v1/news/${currentNews.id}` : '/api/v1/news';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await ApiCall(url, method, newsData, null, true);

            if (response.error) {
                setError(response.data);
            } else {
                fetchNews();
                closeModal();
            }
        } catch (error) {
            console.error("Error saving news:", error);
            setError("Failed to save news");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await ApiCall(`/api/v1/news/${currentNews.id}`, 'DELETE');
            if (response.error) {
                setError(response.data);
            } else {
                fetchNews();
                closeModal();
            }
        } catch (error) {
            console.error("Error deleting news:", error);
            setError("Failed to delete news");
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
                        <button
                            onClick={openCreateModal}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                        >
                            <FaPlus className="mr-2" /> Add News
                        </button>
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
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title (UZ)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title (RU)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {newsList.map((news) => (
                                    <tr key={news.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{news.titleUz}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{news.titleRu}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {new Date(news.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => openEditModal(news)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(news)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Rodal
                visible={modalVisible}
                onClose={closeModal}
                width={800}
                height={600}
                customStyles={{ overflowY: 'auto' }}
            >
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">
                        {isEditing ? 'Edit News' : 'Add New News'}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title (Uzbek)</label>
                                <input
                                    type="text"
                                    name="titleUz"
                                    value={formData.titleUz}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title (Russian)</label>
                                <input
                                    type="text"
                                    name="titleRu"
                                    value={formData.titleRu}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Uzbek)</label>
                                <textarea
                                    name="descriptionUz"
                                    value={formData.descriptionUz}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    rows="4"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Russian)</label>
                                <textarea
                                    name="descriptionRu"
                                    value={formData.descriptionRu}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    rows="4"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Link (iframe)</label>
                            <input
                                type="text"
                                name="link"
                                value={formData.link}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="https://www.youtube.com/embed/..."
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
                            <input
                                type="file"
                                onChange={handleMainImageChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                accept="image/*"
                            />
                            {formData.mainPhotoPreview && (
                                <div className="mt-2">
                                    <img
                                        src={formData.mainPhotoPreview}
                                        alt="Main preview"
                                        className="h-32 object-cover rounded"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Images</label>
                            <input
                                type="file"
                                onChange={handleAdditionalImagesChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                accept="image/*"
                                multiple
                            />
                            <div className="flex flex-wrap mt-2 gap-2">
                                {formData.additionalImagesPreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={preview}
                                            alt={`Additional ${index}`}
                                            className="h-24 w-24 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeAdditionalImage(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                        >
                                            <FaTimes size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : isEditing ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </Rodal>

            {/* Delete Confirmation Modal */}
            <Rodal
                visible={deleteModalVisible}
                onClose={closeModal}
                width={400}
                height={200}
            >
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                    <p className="mb-6">Are you sure you want to delete this news item?</p>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300"
                            disabled={loading}
                        >
                            {loading ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </Rodal>
        </div>
    );
};

export default AdminNews;