import Order from '../models/Order.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res, next) => {
    try {
        const {
            items,
            shippingAddress,
            paymentMethod,
            subtotal,
            shipping,
            tax,
            discount,
            total,
            scheduledDeliveryTime
        } = req.body;

        if (!items || items.length === 0) {
            res.status(400);
            throw new Error('No order items');
        }

        const order = await Order.create({
            user: req.user?._id, // Optional for guest checkout
            items,
            shippingAddress,
            paymentMethod,
            subtotal,
            shipping,
            tax,
            discount,
            total,
            scheduledDeliveryTime
        });

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res, next) => {
    try {
        // If user is admin, return all orders
        // If user is customer, return only their orders
        const query = req.user && req.user.role === 'admin'
            ? {} // Admin sees all orders
            : { user: req.user._id }; // Customer sees only their orders

        const orders = await Order.find(query)
            .populate('items.product', 'title image')
            .populate('items.storeId', 'name')
            .populate('user', 'name email mobile') // Also populate user details for admin
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product', 'title image price')
            .populate('items.storeId', 'name');

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        // Check if the order belongs to the requesting user
        if (order.user.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to view this order');
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        order.status = req.body.status || order.status;

        if (req.body.status === 'Delivered') {
            order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();

        res.status(200).json({
            success: true,
            data: updatedOrder
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private
export const deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
