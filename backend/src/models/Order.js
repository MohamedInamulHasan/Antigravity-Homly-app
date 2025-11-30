import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow guest checkout
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        },
        image: String
    }],
    shippingAddress: {
        name: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: String,
        zip: {
            type: String,
            required: true
        },
        country: {
            type: String,
            default: 'India'
        },
        mobile: {
            type: String,
            required: true
        }
    },
    paymentMethod: {
        type: {
            type: String,
            default: 'Cash on Delivery'
        },
        last4: String
    },
    subtotal: {
        type: Number,
        required: true,
        default: 0
    },
    shipping: {
        type: Number,
        required: true,
        default: 20
    },
    tax: {
        type: Number,
        required: true,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    deliveredAt: Date
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
