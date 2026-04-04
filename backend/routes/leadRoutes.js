const express = require('express');
const Lead = require('../models/leadModel');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// @desc    Test route
// @route   GET /api/leads/test
router.get('/test', (req, res) => {
    res.json({ message: 'Lead routes working' });
});

// @desc    Get dashboard stats
// @route   GET /api/leads/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        const total = await Lead.countDocuments();
        const stats = await Lead.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        
        const sources = await Lead.aggregate([
            { $group: { _id: "$source", count: { $sum: 1 } } }
        ]);

        const result = {
            total,
            status: stats.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
            sources: sources.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {})
        };
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
router.get('/', protect, async (req, res) => {
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    res.json(leads);
});

// @desc    Create a lead (Website form submission)
// @route   POST /api/leads
// @access  Public
router.post('/', async (req, res) => {
    const { name, email, source } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Please provide name and email' });
    }

    const lead = await Lead.create({
        name,
        email,
        source: source || 'Website'
    });

    res.status(201).json(lead);
});

// @desc    Update lead status or add notes
// @route   PUT /api/leads/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    const { status, note } = req.body;
    const lead = await Lead.findById(req.params.id);

    if (lead) {
        if (status) lead.status = status;
        if (note) {
            lead.notes.push({ text: note });
        }

        const updatedLead = await lead.save();
        res.json(updatedLead);
    } else {
        res.status(404).json({ message: 'Lead not found' });
    }
});

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
        await lead.deleteOne();
        res.json({ message: 'Lead removed' });
    } else {
        res.status(404).json({ message: 'Lead not found' });
    }
});

// @desc    Assign lead to user
// @route   PUT /api/leads/:id/assign
// @access  Private
router.put('/:id/assign', protect, async (req, res) => {
    const { assignedTo } = req.body;
    const lead = await Lead.findById(req.params.id);

    if (lead) {
        lead.assignedTo = assignedTo;
        const updatedLead = await lead.save();
        res.json(updatedLead);
    } else {
        res.status(404).json({ message: 'Lead not found' });
    }
});

module.exports = router;
