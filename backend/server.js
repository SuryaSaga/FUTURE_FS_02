const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Serve Frontend
if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

// Start server on all environments EXCEPT Vercel Serverless
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
