
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = (text: string) => {
    const { t } = useI18nTranslation();
    const { language, translate } = useLanguage();
    const [translatedText, setTranslatedText] = useState(() => t(text));

    useEffect(() => {
        const i18nTranslated = t(text);
        if (i18nTranslated !== text || language === 'en') {
            setTranslatedText(i18nTranslated);
            return;
        }

        let isMounted = true;
        setTranslatedText('...'); // Loading state
        
        translate(text)
            .then(result => {
                if (isMounted) {
                    setTranslatedText(result);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setTranslatedText(text); // Fallback on error
                }
            });

        return () => {
            isMounted = false;
        };
    }, [text, language, translate, t]);

    return translatedText;
};
