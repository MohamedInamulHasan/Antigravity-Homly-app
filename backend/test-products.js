import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';

dotenv.config();

const testProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        const products = await Product.find({});
        console.log(`\nTotal products in database: ${products.length}\n`);

        if (products.length > 0) {
            console.log('First 3 products:');
            products.slice(0, 3).forEach((product, index) => {
                console.log(`\n${index + 1}. ${product.title}`);
                console.log(`   Category: ${product.category}`);
                console.log(`   Price: ₹${product.price}`);
                console.log(`   ID: ${product._id}`);
            });
        } else {
            console.log('⚠️  No products found in database!');
        }

        await mongoose.connection.close();
        console.log('\nDisconnected from MongoDB');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

testProducts();
