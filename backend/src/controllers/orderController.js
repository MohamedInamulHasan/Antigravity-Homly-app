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
            total
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
            total
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
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product', 'title image')
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
            .populate('items.product', 'title image price');

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
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
