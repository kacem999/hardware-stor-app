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
        className={`px-2 py-1 text-sm rounded ${i18n.language === 'en' ? 'bg-[#dc6b01] text-white' : 'bg-[#3c3b3b] text-white'}`}
      >
        English
      </button>
      <button 
        onClick={() => changeLanguage('fr')}
        className={`px-2 py-1 text-sm rounded ${i18n.language === 'fr' ? 'bg-[#dc6b01] text-white' : 'bg-[#3c3b3b] text-white'}`}
      >
        Français
      </button>
      <button 
        onClick={() => changeLanguage('ar')}
        className={`px-2 py-1 text-sm rounded ${i18n.language === 'ar' ? 'bg-[#dc6b01] text-white' : 'bg-[#3c3b3b] text-white'}`}
      >
        العربية
      </button>
    </div>
  );
};

export default LanguageSwitcher;
