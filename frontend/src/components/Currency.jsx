import { useTranslation } from "react-i18next";


const Currency = ({ value }) => {
    const { i18n } = useTranslation();


    const formatPrice = (price) => {
        return new Intl.NumberFormat(i18n.language, {
            style: "currency",
            currency: 'DZD',
            minimumFractionDigits: 2,
        }).format(price);
    };

    return <span>{formatPrice(value)}</span>
};

export default Currency;