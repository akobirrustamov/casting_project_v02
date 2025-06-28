import React, { useEffect, useState } from 'react';
import Header from "./Header";
import "react-responsive-modal/styles.css";
import ApiCall, { baseUrl } from '../../config/index';
import { useParams, useNavigate } from "react-router-dom";
import { Modal } from "react-responsive-modal";
import './CastingUserDetail.css';
import { FaArrowLeft, FaCheck, FaTimes, FaDollarSign } from 'react-icons/fa';

function CastingUserDetail() {
    const { castingUserId } = useParams();
    const navigate = useNavigate();

    const [casting, setCasting] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
    const [price, setPrice] = useState('');

    useEffect(() => {
        fetchCasting();
    }, []);

    const fetchCasting = async () => {
        setLoading(true);
        try {
            const response = await ApiCall('/api/v1/casting-user/appeal/' + castingUserId, 'GET');
            if (response.error) {
                setError(response.data);
            } else {
                setCasting(response.data);
                if (response.data.price) {
                    setPrice(response.data.price);
                }
            }
        } catch (error) {
            console.error("Castingni yuklashda xatolik:", error);
            setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
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
            1: "status-approved",
            2: "status-rejected"
        };
        return statusClasses[status] || "";
    };

    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeImageModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    const handleAccept = async () => {
        if (!price) {
            alert("Iltimos, narx kiriting!");
            return;
        }

        setLoading(true);
        try {
            await ApiCall(`/api/v1/casting-user/price/${castingUserId}/${price}`, 'PUT');
            await ApiCall(`/api/v1/casting-user/status/${castingUserId}/1/${price}`, 'PUT');
            alert("Foydalanuvchi qabul qilindi va narx saqlandi.");
            fetchCasting();
            setIsPriceModalOpen(false);
        } catch (error) {
            console.error("Qabul qilishda xatolik:", error);
            setError("Qabul qilishda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!window.confirm("Haqiqatan ham ushbu foydalanuvchini rad qilmoqchimisiz?")) {
            return;
        }

        setLoading(true);
        try {
            await ApiCall(`/api/v1/casting-user/status/${castingUserId}/2/0`, 'PUT');
            alert("Foydalanuvchi rad etildi.");
            fetchCasting();
        } catch (error) {
            console.error("Rad qilishda xatolik:", error);
            setError("Rad qilishda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="casting-detail-dark">
            <Header props={""} />

            <div className="casting-detail-content">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <FaArrowLeft className="mr-2" /> Orqaga
                </button>

                {loading && !casting ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Yuklanmoqda...</p>
                    </div>
                ) : error ? (
                    <div className="error-message">
                        Xatolik: {error}
                    </div>
                ) : casting === null ? (
                    <div className="error-message">
                        Ma'lumotlar topilmadi
                    </div>
                ) : (
                    <>
                        <div className="casting-card">
                            <h2 className="section-title">Asosiy ma'lumotlar</h2>
                            <div className="info-grid">
                                <div className="info-item"><b>Ism:</b> {casting.name}</div>
                                <div className="info-item"><b>Casting turi:</b> {casting.castingType}</div>
                                <div className="info-item"><b>Jins:</b> {casting.gender}</div>
                                <div className="info-item"><b>Hudud:</b> {casting.region}</div>
                                <div className="info-item"><b>Millat:</b> {casting.nationality}</div>
                                <div className="info-item"><b>Tug'ilgan sana:</b> {formatDate(casting.birthday)}</div>
                                <div className="info-item">
                                    <b>Holat:</b>
                                    <span className={`status-badge ${getStatusClass(casting.status)}`}>
                                        {getStatusText(casting.status)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="casting-card">
                            <h2 className="section-title">Jismoniy tavsif</h2>
                            <div className="info-grid">
                                <div className="info-item"><b>Yosh:</b> {casting.age}</div>
                                <div className="info-item"><b>Bo'y (sm):</b> {casting.height}</div>
                                <div className="info-item"><b>Soch rangi:</b> {casting.hairColor}</div>
                                <div className="info-item"><b>Ko'z rangi:</b> {casting.eyeColor}</div>
                                <div className="info-item"><b>Kiyim o'lchami:</b> {casting.clothSize}</div>
                                <div className="info-item"><b>Oyoq o'lchami:</b> {casting.shoeSize}</div>
                                <div className="info-item"><b>Ko'krak (sm):</b> {casting.bust}</div>
                                <div className="info-item"><b>Bel (sm):</b> {casting.waist}</div>
                                <div className="info-item"><b>Son (sm):</b> {casting.son}</div>
                            </div>
                        </div>

                        <div className="casting-card">
                            <h2 className="section-title">Aloqa ma'lumotlari</h2>
                            <div className="info-grid">
                                <div className="info-item"><b>Email:</b> {casting.email}</div>
                                <div className="info-item"><b>Telefon:</b> {casting.phone}</div>
                                <div className="info-item"><b>Telegram:</b> {casting.telegram}</div>
                                <div className="info-item"><b>Facebook:</b> {casting.facebook}</div>
                                <div className="info-item"><b>Instagram:</b> {casting.instagram}</div>
                                <div className="info-item"><b>Narx ($):</b> {casting.price || "Belgilanmagan"}</div>
                            </div>
                        </div>

                        {casting.photos && casting.photos.length > 0 && (
                            <div className="casting-card">
                                <h2 className="section-title">Galereya</h2>
                                <div className="gallery-grid">
                                    {casting.photos.map((photo, index) => (
                                        <div key={index} className="gallery-item">
                                            <img
                                                src={`${baseUrl}/api/v1/file/getFile/${photo.id}`}
                                                alt={`Gallery ${index + 1}`}
                                                onClick={() => openImageModal(`${baseUrl}/api/v1/file/getFile/${photo.id}`)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="action-buttons">
                            <button
                                className="action-btn accept-btn"
                                onClick={() => setIsPriceModalOpen(true)}
                                disabled={loading}
                            >
                                <FaCheck /> Qabul qilish
                            </button>

                            <button
                                className="action-btn reject-btn"
                                onClick={handleReject}
                                disabled={loading}
                            >
                                <FaTimes /> Rad qilish
                            </button>

                            <button
                                className="action-btn price-btn"
                                onClick={() => setIsPriceModalOpen(true)}
                                disabled={loading}
                            >
                                <FaDollarSign /> Narx belgilash
                            </button>
                        </div>
                    </>
                )}

                {/* Rasm modal oynasi */}
                <Modal open={isModalOpen} onClose={closeImageModal} center>
                    {selectedImage && (
                        <img
                            src={selectedImage}
                            alt="To'liq rasm"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '80vh',
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }}
                        />
                    )}
                </Modal>

                {/* Narx modal oynasi */}
                <Modal open={isPriceModalOpen} onClose={() => setIsPriceModalOpen(false)} center>
                    <h2 className="section-title">Narx belgilash ($)</h2>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="price-input"
                        placeholder="Narxni kiriting"
                    />
                    <div className="action-buttons">
                        <button
                            className="action-btn accept-btn"
                            onClick={handleAccept}
                            disabled={loading}
                        >
                            {loading ? 'Saqlanmoqda...' : 'Saqlash va Qabul qilish'}
                        </button>
                        <button
                            className="action-btn reject-btn"
                            onClick={() => setIsPriceModalOpen(false)}
                            disabled={loading}
                        >
                            Bekor qilish
                        </button>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

export default CastingUserDetail;