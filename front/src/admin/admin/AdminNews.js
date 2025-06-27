import React, { useState, useEffect } from 'react';
import ApiCall from "../../config";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { FaPlus, FaTrash, FaTimes, FaSpinner } from 'react-icons/fa';
import './AdminNews.css';

const AdminNews = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [currentNews, setCurrentNews] = useState(null);
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
            console.error("Yangiliklarni yuklashda xatolik:", error);
            setError("Yangiliklarni yuklab bo'lmadi");
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
            console.error("Rasm yuklashda xatolik:", error);
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
        setCurrentNews(null);
    };

    const openCreateModal = () => {
        resetForm();
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

            if (formData.mainImage) {
                mainPhotoUuid = await uploadImage(formData.mainImage, '/main');
            }

            for (const image of formData.additionalImages) {
                const uuid = await uploadImage(image, '/additional');
                additionalImagesUuids.push(uuid);
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

            const response = await ApiCall('/api/v1/news', 'POST', newsData, null, true);

            if (response.error) {
                setError(response.data);
            } else {
                fetchNews();
                closeModal();
            }
        } catch (error) {
            console.error("Yangilikni saqlashda xatolik:", error);
            setError("Yangilikni saqlab bo'lmadi");
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
            console.error("Yangilikni o'chirishda xatolik:", error);
            setError("Yangilikni o'chirib bo'lmadi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mobile-news-dark">
            <Header props='admin/news' />

            <div className="mobile-news-header">
                <h1 className="mobile-news-title">Yangiliklar</h1>
                <button
                    onClick={openCreateModal}
                    className="add-news-btn"
                >
                    <FaPlus /> Qo'shish
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {loading && !newsList.length ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="news-list">
                    {newsList.map((news) => (
                        <div key={news.id} className="news-card">
                            <div className="news-card-header">
                                <h3 className="news-card-title">{news.titleUz}</h3>
                                <span className="news-card-date">
                                    {new Date(news.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="news-card-content">
                                <p>{news.descriptionUz.substring(0, 100)}...</p>
                            </div>
                            <div className="news-card-actions">
                                <button
                                    onClick={() => openDeleteModal(news)}
                                    className="delete-btn"
                                >
                                    <FaTrash /> O'chirish
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Yangi qo'shish modali */}
            {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title">Yangi Yangilik</h2>
                            <button onClick={closeModal} className="close-btn">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Sarlavha (O'zbekcha)</label>
                                <input
                                    type="text"
                                    name="titleUz"
                                    value={formData.titleUz}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Sarlavha (Ruscha)</label>
                                <input
                                    type="text"
                                    name="titleRu"
                                    value={formData.titleRu}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tavsif (O'zbekcha)</label>
                                <textarea
                                    name="descriptionUz"
                                    value={formData.descriptionUz}
                                    onChange={handleInputChange}
                                    className="form-input form-textarea"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tavsif (Ruscha)</label>
                                <textarea
                                    name="descriptionRu"
                                    value={formData.descriptionRu}
                                    onChange={handleInputChange}
                                    className="form-input form-textarea"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">YouTube Havolasi</label>
                                <input
                                    type="text"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="https://www.youtube.com/embed/..."
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Asosiy Rasm</label>
                                <label className="file-input-label">
                                    Rasm tanlang
                                    <input
                                        type="file"
                                        onChange={handleMainImageChange}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                    />
                                </label>
                                {formData.mainPhotoPreview && (
                                    <div className="image-preview-container">
                                        <div className="image-preview">
                                            <img
                                                src={formData.mainPhotoPreview}
                                                alt="Asosiy rasm"
                                                className="preview-image"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Qo'shimcha Rasmlar</label>
                                <label className="file-input-label">
                                    Rasmlar tanlang
                                    <input
                                        type="file"
                                        onChange={handleAdditionalImagesChange}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        multiple
                                    />
                                </label>
                                <div className="image-preview-container">
                                    {formData.additionalImagesPreviews.map((preview, index) => (
                                        <div key={index} className="image-preview">
                                            <img
                                                src={preview}
                                                alt={`Qo'shimcha ${index + 1}`}
                                                className="preview-image"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeAdditionalImage(index)}
                                                className="remove-image-btn"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="cancel-btn"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={loading}
                                >
                                    {loading ? <FaSpinner className="animate-spin" /> : "Saqlash"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* O'chirish tasdiq modali */}
            {deleteModalVisible && (
                <div className="modal-overlay">
                    <div className="delete-modal-content">
                        <h2 className="modal-title">O'chirishni Tasdiqlang</h2>
                        <p className="delete-modal-text">
                            Ushbu yangilikni rostdan ham o'chirmoqchimisiz?
                        </p>
                        <div className="delete-modal-actions">
                            <button
                                onClick={closeModal}
                                className="cancel-btn"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={handleDelete}
                                className="confirm-delete-btn"
                                disabled={loading}
                            >
                                {loading ? <FaSpinner className="animate-spin" /> : "O'chirish"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminNews;