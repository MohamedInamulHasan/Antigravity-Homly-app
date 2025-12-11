import express from 'express';
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    updateUserByAdmin,
    deleteUser
} from '../controllers/userController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Admin routes
router.route('/')
    .get(protect, adminOnly, getAllUsers);

router.route('/:id')
    .put(protect, adminOnly, updateUserByAdmin)
    .delete(protect, adminOnly, deleteUser);

export default router;
