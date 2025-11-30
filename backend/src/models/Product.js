import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a product title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a product description']
    },
    price: {
        type: Number,
        required: [true, 'Please add a product price'],
        min: 0
    },
    category: {
        type: String,
        required: [true, 'Please add a product category'],
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Please add a product image']
    },
    images: [{
        type: String
    }],
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    unit: {
        type: String,
        default: 'kg'
    },
    featured: {
        type: Boolean,
        default: false
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: false // Optional for now, or true if every product MUST belong to a store
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
