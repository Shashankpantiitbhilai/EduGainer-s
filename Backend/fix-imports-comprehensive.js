const fs = require('fs');
const path = require('path');

// Function to calculate the correct relative path
function getRelativePath(fromPath, toDir) {
    const fromDir = path.dirname(fromPath);
    const srcDir = path.join(__dirname, 'src');
    const relativeFromSrc = path.relative(srcDir, fromDir);
    const depth = relativeFromSrc.split(path.sep).length;
    return '../'.repeat(depth) + toDir;
}

// Function to fix import paths in a file
function fixImportPaths(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Calculate the correct paths based on file location
        const modelsPath = getRelativePath(filePath, 'models');
        const configPath = getRelativePath(filePath, 'config');
        const servicesPath = getRelativePath(filePath, 'services');
        const jobsPath = getRelativePath(filePath, 'jobs');
        const utilsPath = getRelativePath(filePath, 'utils');
        const middlewarePath = getRelativePath(filePath, 'middleware');
        const controllersPath = getRelativePath(filePath, 'controllers');

        // Fix patterns - be more specific with regex
        const replacements = [
            // Models imports - match various patterns
            { from: /require\(["']\.\.\/\.\.\/\.\.\/models\//g, to: `require("${modelsPath}/` },
            { from: /require\(["']\.\.\/\.\.\/models\//g, to: `require("${modelsPath}/` },
            { from: /require\(["']\.\.\/models\//g, to: `require("${modelsPath}/` },
            
            // Config imports
            { from: /require\(["']\.\.\/\.\.\/\.\.\/config\//g, to: `require("${configPath}/` },
            { from: /require\(["']\.\.\/\.\.\/config\//g, to: `require("${configPath}/` },
            { from: /require\(["']\.\.\/config\//g, to: `require("${configPath}/` },
            
            // Services imports
            { from: /require\(["']\.\.\/\.\.\/\.\.\/services\//g, to: `require("${servicesPath}/` },
            { from: /require\(["']\.\.\/\.\.\/services\//g, to: `require("${servicesPath}/` },
            { from: /require\(["']\.\.\/services\//g, to: `require("${servicesPath}/` },
            
            // Jobs imports
            { from: /require\(["']\.\.\/\.\.\/\.\.\/jobs\//g, to: `require("${jobsPath}/` },
            { from: /require\(["']\.\.\/\.\.\/jobs\//g, to: `require("${jobsPath}/` },
            { from: /require\(["']\.\.\/jobs\//g, to: `require("${jobsPath}/` },
            
            // Utils imports
            { from: /require\(["']\.\.\/\.\.\/\.\.\/utils\//g, to: `require("${utilsPath}/` },
            { from: /require\(["']\.\.\/\.\.\/utils\//g, to: `require("${utilsPath}/` },
            { from: /require\(["']\.\.\/utils\//g, to: `require("${utilsPath}/` },
            
            // Middleware imports
            { from: /require\(["']\.\.\/\.\.\/\.\.\/middleware\//g, to: `require("${middlewarePath}/` },
            { from: /require\(["']\.\.\/\.\.\/middleware\//g, to: `require("${middlewarePath}/` },
            { from: /require\(["']\.\.\/middleware\//g, to: `require("${middlewarePath}/` },
            
            // Controllers imports
            { from: /require\(["']\.\.\/\.\.\/\.\.\/controllers\//g, to: `require("${controllersPath}/` },
            { from: /require\(["']\.\.\/\.\.\/controllers\//g, to: `require("${controllersPath}/` },
            { from: /require\(["']\.\.\/controllers\//g, to: `require("${controllersPath}/` }
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
            console.log(`Fixed imports in: ${path.relative(__dirname, filePath)}`);
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

// Fix all files in the src directory (excluding node_modules)
const srcPath = path.join(__dirname, 'src');
console.log('Starting comprehensive import path fixes...');
const fixedCount = fixAllFiles(srcPath);
console.log(`\nFixed import paths in ${fixedCount} files total.`);
console.log('\nImport path fixing complete!');
