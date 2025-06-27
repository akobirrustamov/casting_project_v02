import React, { useEffect, useState } from 'react';
import Header from "./Header";
import "react-responsive-modal/styles.css";
import ApiCall, { baseUrl } from '../../config/index';
import { useParams, useNavigate } from "react-router-dom";
import { Modal } from "react-responsive-modal";

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

        try {
            await ApiCall(`/api/v1/casting-user/status/${castingUserId}/1`, 'PUT');
            await ApiCall(`/api/v1/casting-user/price/${castingUserId}/${price}`, 'PUT');  // Narxni saqlash uchun, kerak bo‘lsa backendda qo‘shing
            alert("Foydalanuvchi qabul qilindi va narx saqlandi.");
            fetchCasting();
            setIsPriceModalOpen(false);
        } catch (error) {
            console.error("Qabul qilishda xatolik:", error);
        }
    };

    const handleReject = async () => {
        try {
            await ApiCall(`/api/v1/casting-user/status/${castingUserId}/2`, 'PUT');
            alert("Foydalanuvchi rad etildi.");
            fetchCasting();
        } catch (error) {
            console.error("Rad qilishda xatolik:", error);
        }
    };

    return (
        <div className="appeal-container">
            <Header props={""} />
            <div className="header-spacer"></div>

            <main className="appeal-main">
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Yuklanmoqda...</p>
                    </div>
                ) : error ? (
                    <div className="error-message">
                        Xatolik: {error}
                    </div>
                ) : casting === null ? (
                    <div className="no-applications">
                        Ma'lumotlar topilmadi
                    </div>
                ) : (
                    <div className="appeal-detail">
                        <button className="back-button" onClick={() => navigate(-1)}>Orqaga</button>

                        <div className="appeal-card">
                            {/* Info sections */}
                            <div className="appeal-sections">
                                <div className="appeal-card">
                                    <div className="appeal-sections">
                                        <div className="appeal-section">
                                            <h2>Asosiy ma'lumotlar</h2>
                                            <div className="info-grid">
                                                <div className="info-item flex flex-wrap"><b>Ism:</b> {casting.name}</div>
                                                <div className="info-item"><b>Casting turi:</b> {casting.castingType}</div>
                                                <div className="info-item"><b>Jins:</b> {casting.gender}</div>
                                                <div className="info-item"><b>Hudud:</b> {casting.region}</div>
                                                <div className="info-item"><b>Millat:</b> {casting.nationality}</div>
                                                <div className="info-item"><b>Tug‘ilgan sana:</b> {formatDate(casting.birthday)}</div>
                                            </div>
                                        </div>

                                        <div className="appeal-section">
                                            <h2>Jismoniy tavsif</h2>
                                            <div className="info-grid">
                                                <div className="info-item"><b>Yosh:</b> {casting.age}</div>
                                                <div className="info-item"><b>Bo‘y (sm):</b> {casting.height}</div>
                                                <div className="info-item"><b>Soch rangi:</b> {casting.hairColor}</div>
                                                <div className="info-item"><b>Ko‘z rangi:</b> {casting.eyeColor}</div>
                                                <div className="info-item"><b>Kiyim o‘lchami:</b> {casting.clothSize}</div>
                                                <div className="info-item"><b>Oyoq o‘lchami:</b> {casting.shoeSize}</div>
                                                <div className="info-item"><b>Ko‘krak (sm):</b> {casting.bust}</div>
                                                <div className="info-item"><b>Bel (sm):</b> {casting.waist}</div>
                                                <div className="info-item"><b>Son (sm):</b> {casting.son}</div>
                                            </div>
                                        </div>

                                        <div className="appeal-section">
                                            <h2>Aloqa ma'lumotlari</h2>
                                            <div className="info-grid">
                                                <div className="info-item"><b>Email:</b> {casting.email}</div>
                                                <div className="info-item"><b>Telefon:</b> {casting.phone}</div>
                                                <div className="info-item"><b>Telegram:</b> {casting.telegram}</div>
                                                <div className="info-item"><b>Facebook:</b> {casting.facebook}</div>
                                                <div className="info-item"><b>Instagram:</b> {casting.instagram}</div>
                                                <div className="info-item"><b>Narx ($):</b> {casting.price}</div>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <b>Holat:</b>
                                            <span className={`status-badge ${getStatusClass(casting.status)}`}>
                                        {getStatusText(casting.status)}
                                    </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Status */}

                            </div>

                            {/* Gallery */}
                            {casting.photos && casting.photos.length > 0 && (
                                <div className="appeal-section">
                                    <h2>Galereya</h2>
                                    <div className="gallery-grid">
                                        {casting.photos.map((photo, index) => (
                                            <div key={index} className="gallery-item">
                                                <img
                                                    src={`${baseUrl}/api/v1/file/getFile/${photo.id}`}
                                                    alt={`Gallery ${index + 1}`}
                                                    onClick={() => openImageModal(`${baseUrl}/api/v1/file/getFile/${photo.id}`)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action buttons */}
                            <div className="flex space-x-4 mt-6">
                                <button
                                    className="px-4 py-2 bg-green-500 text-white rounded"
                                    onClick={() => setIsPriceModalOpen(true)}
                                >
                                    Qabul qilish
                                </button>

                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded"
                                    onClick={handleReject}
                                >
                                    Rad qilish
                                </button>

                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                    onClick={() => setIsPriceModalOpen(true)}
                                >
                                    Narx berish
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Image Modal */}
                <Modal open={isModalOpen} onClose={closeImageModal} center>
                    {selectedImage && (
                        <img
                            src={selectedImage}
                            alt="To‘liq rasm"
                            style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
                        />
                    )}
                </Modal>

                {/* Price Modal */}
                <Modal open={isPriceModalOpen} onClose={() => setIsPriceModalOpen(false)} center>
                    <div>
                        <h2>Narx kiriting ($):</h2>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="border p-2 w-full my-3"
                        />
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded"
                            onClick={handleAccept}
                        >
                            Saqlash va Qabul qilish
                        </button>
                    </div>
                </Modal>
            </main>
        </div>
    );
}

export default CastingUserDetail;
