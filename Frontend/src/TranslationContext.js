// TranslationContext.js
import React, { createContext, useContext, useState } from 'react';

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
    const [translatedContent, setTranslatedContent] = useState("");

    return (
        <TranslationContext.Provider value={{ translatedContent, setTranslatedContent }}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslation = () => useContext(TranslationContext);
