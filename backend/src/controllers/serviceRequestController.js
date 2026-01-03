import ServiceRequest from '../models/ServiceRequest.js';
import Service from '../models/Service.js';

// @desc    Create a new service request
// @route   POST /api/service-requests
// @access  Private
export const createServiceRequest = async (req, res) => {
    try {
        const { serviceId } = req.body;

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        const serviceRequest = new ServiceRequest({
            user: req.user._id,
            service: serviceId
        });

        const createdRequest = await serviceRequest.save();

        // Populate service details for the response
        await createdRequest.populate('service');
        await createdRequest.populate('user', 'name email mobile');

        res.status(201).json(createdRequest);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all service requests (Admin)
// @route   GET /api/service-requests
// @access  Private/Admin
export const getServiceRequests = async (req, res) => {
    try {
        const requests = await ServiceRequest.find({})
            .populate('user', 'name email mobile')
            .populate('service', 'name image mobile')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update service request status
// @route   PUT /api/service-requests/:id
// @access  Private/Admin
export const updateServiceRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const request = await ServiceRequest.findById(req.params.id);

        if (request) {
            request.status = status;
            const updatedRequest = await request.save();
            await updatedRequest.populate('user', 'name email mobile');
            await updatedRequest.populate('service', 'name image mobile');
            res.json(updatedRequest);
        } else {
            res.status(404).json({ message: 'Service Request not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
