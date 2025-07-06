#!/usr/bin/env node

/**
 * Backend Cleanup Script - Remove Redundant Files
 * 
 * This script safely removes redundant files after migration to standardized structure.
 * It performs safety checks before deletion to ensure files exist in new locations.
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Starting Backend Cleanup - Removing Redundant Files');
console.log('');

// Safety check function
function safetyCheck(oldFile, newFile, description) {
    const oldExists = fs.existsSync(oldFile);
    const newExists = fs.existsSync(newFile);
    
    console.log(`📋 Checking: ${description}`);
    console.log(`   Old: ${oldFile} - ${oldExists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
    console.log(`   New: ${newFile} - ${newExists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
    
    if (oldExists && newExists) {
        console.log(`   ✅ Safe to remove old file`);
        return true;
    } else if (!oldExists && newExists) {
        console.log(`   ℹ️ Old file already removed`);
        return false;
    } else if (oldExists && !newExists) {
        console.log(`   ⚠️ WARNING: New file missing! Cannot remove old file safely`);
        return false;
    } else {
        console.log(`   ℹ️ Neither file exists`);
        return false;
    }
}

// Remove function with confirmation
function removeFile(filePath, description) {
    try {
        if (fs.existsSync(filePath)) {
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                fs.rmSync(filePath, { recursive: true, force: true });
                console.log(`   🗑️ Removed directory: ${filePath}`);
            } else {
                fs.unlinkSync(filePath);
                console.log(`   🗑️ Removed file: ${filePath}`);
            }
        } else {
            console.log(`   ℹ️ File already removed: ${filePath}`);
        }
    } catch (error) {
        console.log(`   ❌ Error removing ${filePath}: ${error.message}`);
    }
}

console.log('='.repeat(60));
console.log('PHASE 1: Safety Checks');
console.log('='.repeat(60));

// Define files to check and remove
const filesToCleanup = [
    {
        old: 'db.js',
        new: 'src/config/database.js',
        description: 'Database configuration'
    },
    {
        old: 'redis.js',
        new: 'src/config/redis.js',
        description: 'Redis configuration'
    },
    {
        old: 'multer.js',
        new: 'src/middleware/upload.js',
        description: 'File upload middleware'
    },
    {
        old: 'cronJobs.js',
        new: 'src/jobs/cronJobs.js',
        description: 'Cron jobs'
    },
    {
        old: 'triggers.js',
        new: 'src/jobs/triggers.js',
        description: 'Database triggers'
    },
    {
        old: 'emailSender.js',
        new: 'src/services/email/emailSender.js',
        description: 'Email service'
    }
];

// Check directories
const directoriesToCleanup = [
    {
        old: 'controllers',
        new: 'src/controllers',
        description: 'Controllers directory'
    },
    {
        old: 'models',
        new: 'src/models',
        description: 'Models directory'
    },
    {
        old: 'routes',
        new: 'src/routes/api/v1',
        description: 'Routes directory'
    }
];

// Perform safety checks
let safeToRemove = [];
let unsafeToRemove = [];

console.log('\n🔍 Checking individual files:');
filesToCleanup.forEach(item => {
    console.log('');
    if (safetyCheck(item.old, item.new, item.description)) {
        safeToRemove.push(item);
    } else {
        unsafeToRemove.push(item);
    }
});

console.log('\n🔍 Checking directories:');
directoriesToCleanup.forEach(item => {
    console.log('');
    if (safetyCheck(item.old, item.new, item.description)) {
        safeToRemove.push(item);
    } else {
        unsafeToRemove.push(item);
    }
});

// Check if old entry point exists
console.log('');
const oldEntryPoint = 'index.js';
const newEntryPoint = 'server.js';
if (safetyCheck(oldEntryPoint, newEntryPoint, 'Main entry point')) {
    safeToRemove.push({
        old: oldEntryPoint,
        new: newEntryPoint,
        description: 'Old main entry point'
    });
}

console.log('\n' + '='.repeat(60));
console.log('PHASE 2: Cleanup Summary');
console.log('='.repeat(60));

console.log(`\n✅ Safe to remove (${safeToRemove.length} items):`);
safeToRemove.forEach(item => {
    console.log(`   - ${item.old} (${item.description})`);
});

if (unsafeToRemove.length > 0) {
    console.log(`\n⚠️ NOT safe to remove (${unsafeToRemove.length} items):`);
    unsafeToRemove.forEach(item => {
        console.log(`   - ${item.old} (${item.description})`);
    });
}

console.log('\n' + '='.repeat(60));
console.log('PHASE 3: Performing Cleanup');
console.log('='.repeat(60));

if (safeToRemove.length === 0) {
    console.log('\n✨ No files to remove - cleanup already complete!');
} else {
    console.log(`\n🗑️ Removing ${safeToRemove.length} redundant items:`);
    
    safeToRemove.forEach(item => {
        console.log(`\n📄 ${item.description}:`);
        removeFile(item.old, item.description);
    });
}

console.log('\n' + '='.repeat(60));
console.log('CLEANUP COMPLETE');
console.log('='.repeat(60));

console.log('\n✅ Backend structure cleanup finished!');
console.log('');
console.log('📁 Current structure:');
console.log('Backend/');
console.log('├── src/                    # New standardized source');
console.log('│   ├── config/            # Configuration files');
console.log('│   ├── controllers/       # Business logic');
console.log('│   ├── middleware/        # Custom middleware');
console.log('│   ├── models/            # Database models');
console.log('│   ├── routes/            # API routes');
console.log('│   ├── services/          # Business services');
console.log('│   ├── utils/             # Utility functions');
console.log('│   ├── jobs/              # Background jobs');
console.log('│   └── app.js             # Express app');
console.log('├── uploads/               # File uploads');
console.log('├── node_modules/          # Dependencies');
console.log('├── .env                   # Environment variables');
console.log('├── package.json           # Project config');
console.log('└── server.js              # New entry point');
console.log('');
console.log('🚀 Ready to start with: npm start');
console.log('📖 See README_BACKEND_STRUCTURE.md for details');

if (unsafeToRemove.length > 0) {
    console.log('');
    console.log('⚠️ IMPORTANT: Some files were not removed for safety reasons.');
    console.log('   Please manually verify these files are no longer needed:');
    unsafeToRemove.forEach(item => {
        console.log(`   - ${item.old}`);
    });
}
