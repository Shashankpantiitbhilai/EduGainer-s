#!/usr/bin/env node
/**
 * Database Environment Switcher
 * Usage: node switch-db.js [dev|prod]
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

function switchDatabase(env) {
    if (!fs.existsSync(envPath)) {
        console.error('❌ .env file not found!');
        process.exit(1);
    }

    let envContent = fs.readFileSync(envPath, 'utf8');
    
    if (env === 'dev') {
        // Switch to development
        envContent = envContent.replace(/NODE_ENV\s*=\s*"production"/, 'NODE_ENV ="development"');
        envContent = envContent.replace(/NODE_ENV\s*=\s*production/, 'NODE_ENV ="development"');
        
        console.log('🔄 Switching to Development Database...');
        console.log('📦 Database: EduGainer\'s-dev');
        console.log('🌍 Environment: development');
        
    } else if (env === 'prod') {
        // Switch to production
        envContent = envContent.replace(/NODE_ENV\s*=\s*"development"/, 'NODE_ENV ="production"');
        envContent = envContent.replace(/NODE_ENV\s*=\s*development/, 'NODE_ENV ="production"');
        
        console.log('🔄 Switching to Production Database...');
        console.log('📦 Database: EduGainer\'s');
        console.log('🌍 Environment: production');
        console.log('⚠️  WARNING: You are now using the PRODUCTION database!');
        
    } else {
        console.error('❌ Invalid environment. Use "dev" or "prod"');
        console.log('Usage: node switch-db.js [dev|prod]');
        process.exit(1);
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Database environment switched successfully!');
    console.log('🔄 Please restart your server to apply changes.');
}

// Get command line argument
const env = process.argv[2];

if (!env) {
    console.log('📊 Current Database Configuration:');
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const nodeEnv = envContent.match(/NODE_ENV\s*=\s*"?([^"\n]+)"?/);
    
    if (nodeEnv) {
        const environment = nodeEnv[1].trim();
        console.log(`🌍 Environment: ${environment}`);
        
        if (environment === 'production') {
            console.log('📦 Database: EduGainer\'s (Production)');
            console.log('⚠️  You are using the PRODUCTION database!');
        } else {
            console.log('📦 Database: EduGainer\'s-dev (Development)');
        }
    }
    
    console.log('\nUsage: node switch-db.js [dev|prod]');
    console.log('  dev  - Switch to development database');
    console.log('  prod - Switch to production database');
} else {
    switchDatabase(env);
}
