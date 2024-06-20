// const Tesseract = require('tesseract.js');

// const { convert } = require('pdf-poppler');
// const path = require('path');
// const fs = require('fs');
// const { fileURLToPath } = require('url');

// // Dynamically import node-fetch
// async function fetchModule() {
//     return await import('node-fetch');
// }


// // Function to convert PDF to images
// async function pdfToImages(pdfPath) {
//     try {
//         const outputDir = path.dirname(pdfPath);
//         const options = {
//             format: 'png',
//             out_dir: outputDir,
//             out_prefix: 'page',
//             page: null // Convert all pages
//         };

//         await convert(pdfPath, options);

//         // Return array of image file paths
//         const files = fs.readdirSync(outputDir);
//         return files.filter(file => file.startsWith('page-') && file.endsWith('.png')).map(file => path.join(outputDir, file));
//     } catch (error) {
//         throw error;
//     }
// }

// // Function to download PDF and save it locally
// async function downloadPDF(url, outputPath) {
//     try {
//         const response = await fetch(url);
//         const buffer = await response.arrayBuffer();
//         fs.writeFileSync(outputPath, Buffer.from(buffer));
//     } catch (error) {
//         throw error;
//     }
// }

// // Function to recognize text from images using Tesseract.js
// async function recognizeTextFromPDF(url) {
//     try {
//         const pdfPath = path.join(__dirname, 'quiz.pdf');
//         await downloadPDF(url, pdfPath);
//         const imagePaths = await pdfToImages(pdfPath);

//         if (imagePaths.length === 0) {
//             throw new Error('No images found after PDF conversion.');
//         }

//         const texts = [];

//         for (const imagePath of imagePaths) {
//             const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
//                 logger: m => console.log(m),
//                 tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
//             });
//             texts.push(text);
//         }

//         // Clean up image files after processing
//         imagePaths.forEach(imagePath => fs.unlinkSync(imagePath));
//         fs.unlinkSync(pdfPath);

//         return texts.join('\n\n');
//     } catch (error) {
//         throw error;
//     }
// }

// const getQuizText = async (req, res) => {
//     const { url } = req.body;
//     console.log(url, "url")
//     if (!url) {
//         return res.status(400).json({ error: "PDF URL is required" });
//     }

//     try {
//         const text = await recognizeTextFromPDF(url);
//         res.status(200).json({ text });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
// module.exports = {
//     getQuizText
// }