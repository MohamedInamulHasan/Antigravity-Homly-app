
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

    // Define minimal schema to read products
    const productSchema = new mongoose.Schema({}, { strict: false });
    // Use a different model name to avoid conflicts if previously compiled (though this is a new process)
    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

    const products = await Product.find({}).limit(10);

    console.log('--- Checking first 10 products ---');
    products.forEach(p => {
        console.log(`Product: ${p.title}`);
        console.log(`  _id: ${p._id}`);
        console.log(`  unit: ${p.unit} (Type: ${typeof p.unit})`);
        console.log('---');
    });

    process.exit();
};

checkProducts();
