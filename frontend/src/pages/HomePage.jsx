import { useTranslation } from 'react-i18next'; // 1. Import the hook

const HomePage = () => {
  const { t } = useTranslation(); // 2. Initialize the hook

  return (
    <div className="text-center p-12">
      {/* 3. Use the t() function with your translation keys */}
      <h2 className="text-4xl font-bold">{t('welcomeMessage')}</h2>
      <p className="mt-4 text-lg">This is the best place to find all your hardware needs.</p>
    </div>
  );
};

export default HomePage;