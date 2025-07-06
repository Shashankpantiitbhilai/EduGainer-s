// client/components/TranslateWidget.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TranslateWidget = () => {
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('hi'); // Default to Hindi
  const [translatedContent, setTranslatedContent] = useState({});

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleTranslate = async () => {
    setLoading(true);

    try {
      // Get all div elements on the page
      const divElements = document.querySelectorAll('div');

      // Create an object to store the original and translated content
      const contentToTranslate = {};

      // Iterate through the div elements and store their content
      divElements.forEach((div) => {
        contentToTranslate[div.id] = div.textContent;
      });

      // Send the content to the server for translation
      const { data } = await axios.post('/api/translate', {
        contentToTranslate,
        targetLanguage: language,
      });

      setTranslatedContent(data.translations);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Update the page content with the translated text
    const divElements = document.querySelectorAll('div');
    divElements.forEach((div) => {
      if (translatedContent[div.id]) {
        div.textContent = translatedContent[div.id];
      }
    });
  }, [translatedContent]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h3>Select Language:</h3>
      <select value={language} onChange={handleLanguageChange}>
        <option value="hi">Hindi</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        {/* Add more languages as needed */}
      </select>

      <button onClick={handleTranslate} disabled={loading}>
        {loading ? 'Translating...' : 'Translate'}
      </button>
    </div>
  );
};

export default TranslateWidget;