const fs = require('fs');
const path = require('path');

// Function to fix quote mismatches in a file
function fixQuoteMismatches(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Fix mismatched quotes in require statements
        const oldContent = content;
        
        // Fix patterns like require("path') to require("path")
        content = content.replace(/require\("([^"']*?)'\)/g, 'require("$1")');
        
        // Fix patterns like require('path") to require('path')
        content = content.replace(/require\('([^"']*?)"\)/g, "require('$1')");

        if (content !== oldContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed quote mismatches in: ${path.relative(__dirname, filePath)}`);
            modified = true;
        }

        return modified;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Function to recursively find and fix all JS files
function fixAllFiles(dirPath) {
    try {
        const files = fs.readdirSync(dirPath);
        let totalFixed = 0;

        files.forEach(file => {
            const fullPath = path.join(dirPath, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory() && file !== 'node_modules') {
                totalFixed += fixAllFiles(fullPath);
            } else if (file.endsWith('.js')) {
                if (fixQuoteMismatches(fullPath)) {
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

// Fix all files in the src directory
const srcPath = path.join(__dirname, 'src');
console.log('Starting quote mismatch fixes...');
const fixedCount = fixAllFiles(srcPath);
console.log(`\nFixed quote mismatches in ${fixedCount} files.`);
console.log('\nQuote mismatch fixing complete!');
