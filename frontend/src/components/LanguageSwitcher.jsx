import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  
  // Function to change language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Optional: Save the language preference to localStorage
    localStorage.setItem('i18nextLng', lng);
    // Update HTML dir attribute for RTL support
    document.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="language-switcher flex gap-2">
      <button 
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 text-sm rounded ${i18n.language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      >
        English
      </button>
      <button 
        onClick={() => changeLanguage('fr')}
        className={`px-2 py-1 text-sm rounded ${i18n.language === 'fr' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      >
        Français
      </button>
      <button 
        onClick={() => changeLanguage('ar')}
        className={`px-2 py-1 text-sm rounded ${i18n.language === 'ar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      >
        العربية
      </button>
    </div>
  );
};

export default LanguageSwitcher;
