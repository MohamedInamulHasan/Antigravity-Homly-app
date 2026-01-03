import express from 'express';
const router = express.Router();
import {
    createServiceRequest,
    getServiceRequests,
    updateServiceRequestStatus
} from '../controllers/serviceRequestController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

router.route('/')
    .post(protect, createServiceRequest)
    .get(protect, adminOnly, getServiceRequests);

router.route('/:id')
    .put(protect, adminOnly, updateServiceRequestStatus);

export default router;
