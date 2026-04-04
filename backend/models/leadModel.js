const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    source: { type: String, default: 'Website' },
    status: { 
        type: String, 
        enum: ['new', 'contacted', 'converted'], 
        default: 'new' 
    },
    assignedTo: { type: String, default: 'Unassigned' },
    notes: [
        {
            text: String,
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
