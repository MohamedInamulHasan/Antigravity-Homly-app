import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, 'src', '.env') });
// Fallback to root .env if src/.env not found or variables missing
dotenv.config({ path: path.join(__dirname, '.env') });

import Product from './src/models/Product.js';
import Store from './src/models/Store.js';

const checkImages = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected.');

        // Check Products
        const products = await Product.find({}, 'title image images').limit(10).lean();
        console.log('\n--- PRODUCT IMAGES (Sample) ---');
        products.forEach(p => {
            const imgType = p.image?.startsWith('data:image') ? 'BASE64' : (p.image?.startsWith('http') ? 'URL' : 'UNKNOWN/EMPTY');
            console.log(`[${imgType}] ${p.title}: ${p.image ? p.image.substring(0, 50) + '...' : 'None'}`);
        });

        // Check Stores
        const stores = await Store.find({}, 'name image').limit(10).lean();
        console.log('\n--- STORE IMAGES (Sample) ---');
        stores.forEach(s => {
            const imgType = s.image?.startsWith('data:image') ? 'BASE64' : (s.image?.startsWith('http') ? 'URL' : 'UNKNOWN/EMPTY');
            console.log(`[${imgType}] ${s.name}: ${s.image ? s.image.substring(0, 50) + '...' : 'None'}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkImages();
