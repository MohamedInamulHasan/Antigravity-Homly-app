import express from 'express';
import {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    deleteOrder
} from '../controllers/orderController.js';

const router = express.Router();

router.route('/')
    .post(createOrder)
    .get(getOrders);

router.route('/:id')
    .get(getOrder)
    .put(updateOrderStatus)
    .delete(deleteOrder);

export default router;
