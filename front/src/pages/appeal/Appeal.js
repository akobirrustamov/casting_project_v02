import React, { useEffect, useState } from 'react';
import Header from "../header/Header";
import "react-responsive-modal/styles.css";
import ApiCall, { baseUrl } from '../../config/index';
import './Appeal.css';
import {useParams, useNavigate, useLocation} from "react-router-dom";
import { Modal } from "react-responsive-modal";

function Appeal(props) {
    const { userId } = useParams();
    const location = useLocation();
    const castingId = location.state?.castingId;
    const navigate = useNavigate();

    const [casting, setCasting] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [language, setLanguage] = useState('uz');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeImageModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    useEffect(() => {
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'uz';
        setLanguage(savedLanguage);
        fetchCasting();
    }, []);

    const fetchCasting = async () => {
        setLoading(true);
        try {
            const response = await ApiCall('/api/v1/casting-user/appeal/'+castingId, 'GET');
            if (response.error) {
                setError(response.data);
            } else {
                setCasting(response.data);
            }
        } catch (error) {
            console.error("Error fetching casting:", error);
            setError("Failed to fetch casting application");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusText = (status) => {
        const statusTexts = {
            uz: {
                0: "Ko'rib chiqilmoqda",
                1: "Qabul qilindi",
                2: "Rad etildi"
            },
            ru: {
                0: "На рассмотрении",
                1: "Принято",
                2: "Отклонено"
            }
        };
        return statusTexts[language][status] || "";
    };

    const getStatusClass = (status) => {
        const statusClasses = {
            0: "status-pending",
            1: "status-approved",
            2: "status-rejected"
        };
        return statusClasses[status] || "";
    };

    const translations = {
        uz: {
            loading: "Yuklanmoqda...",
            error: "Ariza yuklanmadi",
            back: "Orqaga",
            basicInfo: "Asosiy ma'lumotlar",
            physicalInfo: "Jismoniy tavsif",
            contactInfo: "Aloqa ma'lumotlari",
            gallery: "Galereya",
            name: "Ism",
            castingType: "Casting turi",
            gender: "Jins",
            region: "Hudud",
            nationality: "Millat",
            birthday: "Tug'ilgan sana",
            age: "Yosh",
            height: "Bo'y (sm)",
            hairColor: "Soch rangi",
            eyeColor: "Ko'z rangi",
            clothSize: "Kiyim o'lchami",
            shoeSize: "Oyoq kiyim o'lchami",
            bust: "Ko'krak (sm)",
            waist: "Bel (sm)",
            son: "Son (sm)",
            email: "Email",
            phone: "Telefon",
            telegram: "Telegram",
            facebook: "Facebook",
            instagram: "Instagram",
            price: "Narx ($)",
            createdAt: "Ariza sanasi",
            status: "Holat"
        },
        ru: {
            loading: "Загрузка...",
            error: "Заявка не загружена",
            back: "Назад",
            basicInfo: "Основная информация",
            physicalInfo: "Физические характеристики",
            contactInfo: "Контактная информация",
            gallery: "Галерея",
            name: "Имя",
            castingType: "Тип кастинга",
            gender: "Пол",
            region: "Регион",
            nationality: "Национальность",
            birthday: "Дата рождения",
            age: "Возраст",
            height: "Рост (см)",
            hairColor: "Цвет волос",
            eyeColor: "Цвет глаз",
            clothSize: "Размер одежды",
            shoeSize: "Размер обуви",
            bust: "Грудь (см)",
            waist: "Талия (см)",
            son: "Бедра (см)",
            email: "Email",
            phone: "Телефон",
            telegram: "Telegram",
            facebook: "Facebook",
            instagram: "Instagram",
            price: "Цена ($)",
            createdAt: "Дата заявки",
            status: "Статус"
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
                        <p>{translations[language].loading}</p>
                    </div>
                ) : error ? (
                    <div className="error-message">
                        {translations[language].error}: {error}
                    </div>
                ) : casting === null ? (
                    <div className="no-applications">
                        {translations[language].noApplications}
                    </div>
                ) : (
                    <div className="appeal-detail">
                        <button
                            className="back-button"
                            onClick={() => navigate(-1)}
                        >
                            {translations[language].back}
                        </button>

                        <div className="appeal-card">
                            {/* Main photo */}
                            {/*{casting.photos && casting.photos.length > 0 && (*/}
                            {/*    <div className="main-photo">*/}
                            {/*        <img*/}
                            {/*            src={`${baseUrl}/api/v1/file/getFile/${casting.photos[0].id}`}*/}
                            {/*            alt={casting.name}*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*)}*/}

                            <div className="appeal-sections">
                                {/* Basic Information */}
                                <div className="appeal-section">
                                    <h2>{translations[language].basicInfo}</h2>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].name}</span>
                                            <span className="info-value">{casting.name}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].castingType}</span>
                                            <span className="info-value">{casting.castingType}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].gender}</span>
                                            <span className="info-value">{casting.gender}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].region}</span>
                                            <span className="info-value">{casting.region}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].nationality}</span>
                                            <span className="info-value">{casting.nationality}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].birthday}</span>
                                            <span className="info-value">{formatDate(casting.birthday)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Physical Information */}
                                <div className="appeal-section">
                                    <h2>{translations[language].physicalInfo}</h2>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].age}</span>
                                            <span className="info-value">{casting.age}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].height}</span>
                                            <span className="info-value">{casting.height}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].hairColor}</span>
                                            <span className="info-value">{casting.hairColor}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].eyeColor}</span>
                                            <span className="info-value">{casting.eyeColor}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].clothSize}</span>
                                            <span className="info-value">{casting.clothSize}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].shoeSize}</span>
                                            <span className="info-value">{casting.shoeSize}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].bust}</span>
                                            <span className="info-value">{casting.bust}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].waist}</span>
                                            <span className="info-value">{casting.waist}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].son}</span>
                                            <span className="info-value">{casting.son}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="appeal-section">
                                    <h2>{translations[language].contactInfo}</h2>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].email}</span>
                                            <span className="info-value">{casting.email}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].phone}</span>
                                            <span className="info-value">{casting.phone}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].telegram}</span>
                                            <span className="info-value">{casting.telegram}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].facebook}</span>
                                            <span className="info-value">{casting.facebook}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].instagram}</span>
                                            <span className="info-value">{casting.instagram}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].price}</span>
                                            <span className="info-value">{casting.price}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status and Date */}
                                <div className="appeal-section">
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].status}</span>
                                            <span className={`info-value status-badge ${getStatusClass(casting.status)}`}>
                                                {getStatusText(casting.status)}
                                            </span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">{translations[language].createdAt}</span>
                                            <span className="info-value">{formatDate(casting.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Gallery */}
                                {casting.photos && casting.photos.length > 0 && (
                                    <div className="appeal-section">
                                        <h2>{translations[language].gallery}</h2>
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

                            </div>
                        </div>
                    </div>
                )}


                <Modal open={isModalOpen} onClose={closeImageModal} center>
                    {selectedImage && (
                        <img
                            src={selectedImage}
                            alt="Full Image"
                            style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
                        />
                    )}
                </Modal>

            </main>
        </div>
    );
}

export default Appeal;