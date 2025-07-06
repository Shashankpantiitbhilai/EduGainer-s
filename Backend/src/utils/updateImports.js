const fs = require('fs');
const path = require('path');

// Function to update import paths in files
function updateImportPaths(dirPath) {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    
    files.forEach(file => {
        if (file.isDirectory()) {
            updateImportPaths(path.join(dirPath, file.name));
        } else if (file.name.endsWith('.js')) {
            const filePath = path.join(dirPath, file.name);
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Update common import patterns
            content = content.replace(/require\("\.\.\/models\//g, 'require("../models/");
            content = content.replace(/require\("\.\.\/controllers\//g, 'require("../controllers/");
            content = content.replace(/require\("\.\.\/multer"\)/g, 'require("../middleware/upload")');
            content = content.replace(/require\("\.\.\/cloudinary"\)/g, 'require("../config/cloudinary")');
            content = content.replace(/require\("\.\.\/emailSender"\)/g, 'require("../services/email/emailSender")');
            content = content.replace(/require\("\.\.\/redis"\)/g, 'require("../config/redis")');
            content = content.replace(/require\("\.\.\/triggers"\)/g, 'require("../jobs/triggers")');
            content = content.replace(/require\("\.\.\/cronJobs"\)/g, 'require("../jobs/cronJobs")');
            content = content.replace(/require\("\.\.\/db"\)/g, 'require("../config/database")');
            
            fs.writeFileSync(filePath, content);
            console.log(`Updated: ${filePath}`);
        }
    });
}

// Update all routes
const routesDir = 'c:\\Users\\shashankp\\OneDrive\\Documents\\EduGainer\'s\\EduGainer-s\\Backend\\src\\routes\\api\\v1';
updateImportPaths(routesDir);

console.log('Import paths updated successfully!');

module.exports = { updateImportPaths };
