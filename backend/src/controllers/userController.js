import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id)
                }
            });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id)
                }
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.status(200).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    mobile: user.mobile,
                    address: user.address
                }
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.mobile = req.body.mobile || user.mobile;
            user.address = req.body.address || user.address;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.status(200).json({
                success: true,
                data: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    token: generateToken(updatedUser._id)
                }
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user by admin
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUserByAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.mobile = req.body.mobile || user.mobile;
        user.address = req.body.address || user.address;

        if (req.body.role) {
            user.role = req.body.role;
        }

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            data: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                mobile: updatedUser.mobile,
                address: updatedUser.address
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get saved products (wishlist)
// @route   GET /api/users/profile/saved-products
// @access  Private
export const getSavedProducts = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('savedProducts');

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        res.status(200).json({
            success: true,
            data: user.savedProducts || []
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle saved product (add/remove from wishlist)
// @route   POST /api/users/profile/saved-products
// @access  Private
export const toggleSavedProduct = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Initialize savedProducts if it doesn't exist
        if (!user.savedProducts) {
            user.savedProducts = [];
        }

        // Check if product is already saved
        const index = user.savedProducts.indexOf(productId);

        if (index > -1) {
            // Product exists, remove it
            user.savedProducts.splice(index, 1);
        } else {
            // Product doesn't exist, add it
            user.savedProducts.push(productId);
        }

        await user.save();

        // Return updated list
        const updatedUser = await User.findById(req.user._id).populate('savedProducts');

        res.status(200).json({
            success: true,
            data: updatedUser.savedProducts
        });
    } catch (error) {
        next(error);
    }
};
