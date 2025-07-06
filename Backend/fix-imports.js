const fs = require('fs');
const path = require('path');

// Function to fix import paths in a file
function fixImportPaths(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Fix patterns for files in routes/api/v1/
        const replacements = [
            // Models imports
            { from: /require\(["']\.\.\/\.\.\/models\//g, to: 'require("../../../models/' },
            // Config imports
            { from: /require\(["']\.\.\/\.\.\/config\//g, to: 'require("../../../config/' },
            // Services imports
            { from: /require\(["']\.\.\/\.\.\/services\//g, to: 'require("../../../services/' },
            // Jobs imports
            { from: /require\(["']\.\.\/\.\.\/jobs\//g, to: 'require("../../../jobs/' },
            // Utils imports
            { from: /require\(["']\.\.\/\.\.\/utils\//g, to: 'require("../../../utils/' },
            // Middleware imports
            { from: /require\(["']\.\.\/\.\.\/middleware\//g, to: 'require("../../../middleware/' },
            // Controllers imports
            { from: /require\(["']\.\.\/\.\.\/controllers\//g, to: 'require("../../../controllers/' }
        ];

        replacements.forEach(({ from, to }) => {
            const newContent = content.replace(from, to);
            if (newContent !== content) {
                content = newContent;
                modified = true;
            }
        });

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed imports in: ${filePath}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Function to recursively find and fix all JS files in a directory
function fixAllFiles(dirPath) {
    try {
        const files = fs.readdirSync(dirPath);
        let totalFixed = 0;

        files.forEach(file => {
            const fullPath = path.join(dirPath, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                totalFixed += fixAllFiles(fullPath);
            } else if (file.endsWith('.js')) {
                if (fixImportPaths(fullPath)) {
                    totalFixed++;
                }
            }
        });

        return totalFixed;
    } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error.message);
        return 0;
    }
}

// Fix all files in the routes directory
const routesPath = path.join(__dirname, 'src', 'routes');
console.log('Starting import path fixes...');
const fixedCount = fixAllFiles(routesPath);
console.log(`\nFixed import paths in ${fixedCount} files.`);

// Also fix controller files that might import models
const controllersPath = path.join(__dirname, 'src', 'controllers');
if (fs.existsSync(controllersPath)) {
    console.log('\nFixing controller imports...');
    const controllerFixedCount = fixAllFiles(controllersPath);
    console.log(`Fixed import paths in ${controllerFixedCount} controller files.`);
}

console.log('\nImport path fixing complete!');
