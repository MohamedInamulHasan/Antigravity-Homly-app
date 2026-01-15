import express from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Import routes
import productRoutes from './routes/products.js';
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';
import storeRoutes from './routes/stores.js';
import newsRoutes from './routes/news.js';
import adRoutes from './routes/ads.js';
import categoryRoutes from './routes/categories.js';
import serviceRoutes from './routes/services.js';
import serviceRequestRoutes from './routes/serviceRequests.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware (Force Restart)
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.CLIENT_URL,
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'https://localhost',  // Capacitor Android WebView
            'http://localhost'    // Capacitor Android WebView
        ];

        // Allow requests with no origin (like mobile apps, Capacitor, or curl requests)
        if (!origin) return callback(null, true);

        // Allow Capacitor apps (they use capacitor:// or file:// protocol or localhost)
        if (origin.startsWith('capacitor://') ||
            origin.startsWith('file://') ||
            origin.startsWith('ionic://') ||
            origin === 'https://localhost' ||
            origin === 'http://localhost') {
            return callback(null, true);
        }

        // Allow allowed origins, any Vercel app, and the backend itself
        if (allowedOrigins.includes(origin) ||
            origin.endsWith('.vercel.app') ||
            origin.endsWith('.onrender.com')) {
            return callback(null, true);
        }

        console.log('CORS blocked origin:', origin);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

// Enable compression for all responses (reduces payload size by 60-80%)
app.use(compression());

app.use(express.json({ limit: '50mb' })); // Increased limit for Base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Homly E-commerce API',
        version: '1.0.0',
        endpoints: {
            products: '/api/products',
            users: '/api/users',
            orders: '/api/orders',
            stores: '/api/stores',
            news: '/api/news',
            ads: '/api/ads',
            categories: '/api/categories',
            services: '/api/services'
        }
    });
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/service-requests', serviceRequestRoutes);

// Error handler middleware (must be last)
app.use(errorHandler);

// DEBUG: Temporary Email Test Route
import { sendOrderNotificationEmail } from './services/emailService.js';
app.get('/api/debug-email', async (req, res) => {
    try {
        console.log('🧪 Triggering Test Email...');
        // Mock order object
        const mockOrder = {
            _id: 'TEST_ORDER_' + Date.now(),
            shippingAddress: {
                name: 'Test Admin',
                email: process.env.ADMIN_EMAIL || 'mohamedinamulhasan0@gmail.com',
                mobile: '0000000000',
                street: 'Test St',
                city: 'Test City',
                zip: '00000'
            },
            items: [{ name: 'Test Product', quantity: 1, price: 100 }],
            total: 100,
            subtotal: 100,
            shipping: 0,
            createdAt: new Date()
        };

        const result = await sendOrderNotificationEmail(mockOrder);

        if (result.success) {
            res.json({
                success: true,
                message: '✅ Email Sent Successfully!',
                details: result,
                config: {
                    user: process.env.EMAIL_USER ? 'Set' : 'Missing',
                    pass: process.env.EMAIL_PASS ? 'Set' : 'Missing',
                    admin: process.env.ADMIN_EMAIL
                }
            });
        } else {
            res.status(500).json({
                success: false,
                message: '❌ Email Failed',
                error: result.error,
                config: {
                    host: process.env.SMTP_HOST || 'DEFAULT (Gmail)',
                    port: process.env.SMTP_PORT || 'DEFAULT (587)',
                    user: process.env.SMTP_USER || process.env.EMAIL_USER || 'MISSING'
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '❌ Critical Error',
            error: error.message,
            stack: error.stack
        });
    }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
