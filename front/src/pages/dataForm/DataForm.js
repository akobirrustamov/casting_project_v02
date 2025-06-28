import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiCall from '../../config/index';
import './DataForm.css';
import Header from "../header/Header";

function DataForm() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [language, setLanguage] = useState('uz');

    useEffect(() => {
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'uz';
        setLanguage(savedLanguage);
    }, []);

    const translations = {
        uz: {
            formTitle: "Casting Ro'yxatdan O'tish Formasi",
            formSubtitle: "Iltimos, barcha kerakli maydonlarni to'ldiring",
            basicInfo: "Asosiy Ma'lumotlar",
            physicalChars: "Jismoniy Tavsif",
            contactInfo: "Aloqa Ma'lumotlari",
            photos: "Rasmlar",
            submit: "Ariza Yuborish",
            success: "Ro'yxatdan o'tish muvaffaqiyatli yakunlandi! Yo'naltirilmoqda...",
            error: "Xatolik yuz berdi",
            requiredField: "Majburiy maydon",
            castingType: "Casting Turi",
            selectType: "Turini tanlang",
            model: "Model",
            actor: "Aktyor",
            extra: "Statist",
            influencer: "Inflyuencer",
            gender: "Jins",
            selectGender: "Jinsni tanlang",
            male: "Erkak",
            female: "Ayol",
            fullName: "To'liq Ism",
            region: "Viloyat",
            nationality: "Millati",
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
            email: "Elektron pochta",
            phone: "Telefon raqam",
            telegram: "Telegram username",
            facebook: "Facebook",
            instagram: "Instagram",
            price: "Kutilayotgan narx ($)",
            uploadPhotos: "Rasmlar yuklash (bir nechta rasm yuklash mumkin)",
            photoHint: "Iltimos, yuzingiz va butun tanaingiz ko'rinadigan aniq rasmlarni yuklang(6 tadan kam bo'lmasin)",
            remove: "×"
        },
        ru: {
            formTitle: "Форма регистрации на кастинг",
            formSubtitle: "Пожалуйста, заполните все обязательные поля",
            basicInfo: "Основная информация",
            physicalChars: "Физические характеристики",
            contactInfo: "Контактная информация",
            photos: "Фотографии",
            submit: "Отправить заявку",
            success: "Регистрация прошла успешно! Перенаправление...",
            error: "Произошла ошибка",
            requiredField: "Обязательное поле",
            castingType: "Тип кастинга",
            selectType: "Выберите тип",
            model: "Модель",
            actor: "Актер",
            extra: "Статист",
            influencer: "Инфлюенсер",
            gender: "Пол",
            selectGender: "Выберите пол",
            male: "Мужской",
            female: "Женский",
            fullName: "Полное имя",
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
            email: "Электронная почта",
            phone: "Номер телефона",
            telegram: "Telegram username",
            facebook: "Facebook",
            instagram: "Instagram",
            price: "Ожидаемая цена ($)",
            uploadPhotos: "Загрузить фотографии (можно несколько)",
            photoHint: "Пожалуйста, загрузите чёткие фотографии, на которых видно ваше лицо и всё тело (не менее 6 штук)",
            remove: "×"
        }
    };

    const [formData, setFormData] = useState({
        telegramId: userId || '',
        castingType: '',
        gender: '',
        name: '',
        region: '',
        nationality: '',
        birthday: '',
        age: '',
        height: '',
        hairColor: '',
        eyeColor: '',
        clothSize: '',
        shoeSize: '',
        bust: '',
        waist: '',
        son: '',
        email: '',
        phone: '',
        telegram: '',
        facebook: '',
        instagram: '',
        price: '',
        photos: []
    });

    const isFormValid = () => {
        const requiredFields = [
            formData.castingType,
            formData.gender,
            formData.name,
            formData.region,
            formData.nationality,
            formData.age,
            formData.height,
            formData.hairColor,
            formData.eyeColor,
            formData.email,
            formData.phone
        ];
        const allFieldsFilled = requiredFields.every(field => field && field.trim() !== '');
        const hasEnoughPhotos = formData.photos.length >= 6;
        return allFieldsFilled && hasEnoughPhotos;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...previews]);

        const uploadedIds = [];
        for (const file of files) {
            try {
                const uploadData = new FormData();
                uploadData.append('photo', file);
                uploadData.append('prefix', '/users/' + userId);
                const response = await ApiCall('/api/v1/file/upload', 'POST', uploadData, null, true);
                uploadedIds.push(response.data);
            } catch (error) {
                console.error("Image upload error:", error);
                setError("Rasmlarni yuklashda xatolik yuz berdi");
            }
        }

        setFormData(prev => ({
            ...prev,
            photos: [...prev.photos, ...uploadedIds]
        }));
    };

    const removeImage = (index) => {
        const newPreviews = [...imagePreviews];
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);

        const newPhotos = [...formData.photos];
        newPhotos.splice(index, 1);
        setFormData(prev => ({
            ...prev,
            photos: newPhotos
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.photos.length < 6) {
            setError("Kamida 6 ta rasm yuklashingiz shart!");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                age: parseInt(formData.age),
                height: parseInt(formData.height),
                price: parseFloat(formData.price) || 0,
                birthday: formData.birthday ? new Date(formData.birthday).toISOString() : null,
                status: 0,
                createdAt: new Date().toISOString()
            };

            const response = await ApiCall('/api/v1/casting-user', 'POST', payload);

            if (response.error) {
                setError(response.data?.message || "Formani yuborishda xatolik");
            } else {
                setSuccess(true);
                setTimeout(() => {
                    navigate(`/history/${userId}`);
                }, 2000);
            }
        } catch (error) {
            console.error("Submit error:", error);
            setError("Formani yuborishda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={"history-container"}>
            <Header props={"data-form"} />
            <div className="data-form-container">

                <div className="form-header">
                    <h1>{translations[language].formTitle}</h1>
                    <p>{translations[language].formSubtitle}</p>
                </div>

                {error && (
                    <div className="error-message">
                        {translations[language].error}: {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        {translations[language].success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="casting-form">
                    <input type="hidden" name="telegramId" value={formData.telegramId} />
                    <div className="form-section">
                        <h2>{translations[language].basicInfo}</h2>
                        <div className="form-row">
                            <div className="form-group">
                                <label>{translations[language].castingType}*</label>
                                <select
                                    name="castingType"
                                    value={formData.castingType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">{translations[language].selectType}</option>
                                    <option value="model">{translations[language].model}</option>
                                    <option value="actor">{translations[language].actor}</option>
                                    <option value="extra">{translations[language].extra}</option>
                                    <option value="influencer">{translations[language].influencer}</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>{translations[language].gender}*</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">{translations[language].selectGender}</option>
                                    <option value="male">{translations[language].male}</option>
                                    <option value="female">{translations[language].female}</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>{translations[language].fullName}*</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>{translations[language].region}*</label>
                                <input
                                    type="text"
                                    name="region"
                                    value={formData.region}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>{translations[language].nationality}*</label>
                                <input
                                    type="text"
                                    name="nationality"
                                    value={formData.nationality}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>{translations[language].birthday}</label>
                                <input
                                    type="date"
                                    name="birthday"
                                    value={formData.birthday}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-section">
                        <h2>{translations[language].physicalChars}</h2>
                        <div className="form-row">
                            <div className="form-group">
                                <label>{translations[language].age}*</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>{translations[language].height}*</label>
                                <input
                                    type="number"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>{translations[language].hairColor}*</label>
                                <input
                                    type="text"
                                    name="hairColor"
                                    value={formData.hairColor}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>{translations[language].eyeColor}*</label>
                                <input
                                    type="text"
                                    name="eyeColor"
                                    value={formData.eyeColor}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>{translations[language].clothSize}</label>
                                <input
                                    type="text"
                                    name="clothSize"
                                    value={formData.clothSize}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>{translations[language].shoeSize}</label>
                                <input
                                    type="text"
                                    name="shoeSize"
                                    value={formData.shoeSize}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Agar gender male bo‘lmasa, bust va son inputlarini chiqaramiz */}
                        {formData.gender !== 'male' && (
                            <>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>{translations[language].bust}</label>
                                        <input
                                            type="text"
                                            name="bust"
                                            value={formData.bust}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>{translations[language].son}</label>
                                        <input
                                            type="text"
                                            name="son"
                                            value={formData.son}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <label>{translations[language].waist}</label>
                            <input
                                type="text"
                                name="waist"
                                value={formData.waist}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-section">
                        <h2>{translations[language].contactInfo}</h2>
                        <div className="form-row">
                            <div className="form-group">
                                <label>{translations[language].email}*</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>{translations[language].phone}*</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>{translations[language].telegram}</label>
                                <input
                                    type="text"
                                    name="telegram"
                                    value={formData.telegram}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>{translations[language].facebook}</label>
                                <input
                                    type="text"
                                    name="facebook"
                                    value={formData.facebook}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>{translations[language].instagram}</label>
                            <input
                                type="text"
                                name="instagram"
                                value={formData.instagram}
                                onChange={handleChange}
                            />
                        </div>


                    </div>
                    <div className="form-section">
                        <h2>{translations[language].photos}</h2>
                        <div className="form-group">
                            <label>{translations[language].uploadPhotos}*</label>
                            <input
                                type="file"
                                onChange={handleImageUpload}
                                accept="image/*"
                                multiple
                                required={formData.photos.length === 0}
                            />
                            <p className="hint">{translations[language].photoHint}</p>
                        </div>

                        {imagePreviews.length > 0 && (
                            <div className="image-previews">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="image-preview">
                                        <img src={preview} alt={`Preview ${index}`} />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="remove-image"
                                        >
                                            {translations[language].remove}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="form-actions">
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={!isFormValid() || loading}
                        >
                            {loading ? '...' : translations[language].submit}
                        </button>

                    </div>
                </form>
            </div>
        </div>

    );
}

export default DataForm;