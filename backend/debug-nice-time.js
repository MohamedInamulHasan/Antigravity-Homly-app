
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const checkProducts = async () => {
    await connectDB();

    // Define minimal schema
    const productSchema = new mongoose.Schema({}, { strict: false });
    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

    // Search specifically for Nice Time to match user's screenshot
    const products = await Product.find({ title: /Nice Time/i });

    console.log(`Found ${products.length} products matching "Nice Time"`);
    products.forEach(p => {
        console.log(`Product: ${p.title}`);
        console.log(`  _id: ${p._id}`);
        console.log(`  unit: '${p.unit}'`);
        console.log('---');
    });

    process.exit();
};

checkProducts();
