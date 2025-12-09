import Ad from '../models/Ad.js';

// @desc    Get all ads
// @route   GET /api/ads
// @access  Public
export const getAds = async (req, res, next) => {
    try {
        const ads = await Ad.find({ isActive: true }).sort({ order: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: ads.length,
            data: ads
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single ad
// @route   GET /api/ads/:id
// @access  Public
export const getAd = async (req, res, next) => {
    try {
        const ad = await Ad.findById(req.params.id);

        if (!ad) {
            res.status(404);
            throw new Error('Ad not found');
        }

        res.status(200).json({
            success: true,
            data: ad
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new ad
// @route   POST /api/ads
// @access  Private/Admin
export const createAd = async (req, res, next) => {
    try {
        const ad = await Ad.create(req.body);

        res.status(201).json({
            success: true,
            data: ad
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update ad
// @route   PUT /api/ads/:id
// @access  Private/Admin
export const updateAd = async (req, res, next) => {
    try {
        const ad = await Ad.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!ad) {
            res.status(404);
            throw new Error('Ad not found');
        }

        res.status(200).json({
            success: true,
            data: ad
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete ad
// @route   DELETE /api/ads/:id
// @access  Private/Admin
export const deleteAd = async (req, res, next) => {
    try {
        const ad = await Ad.findByIdAndDelete(req.params.id);

        if (!ad) {
            res.status(404);
            throw new Error('Ad not found');
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
