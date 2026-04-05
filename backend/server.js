const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');

// Load .env from backend directory (works whether cwd is root or backend/)
dotenv.config({ path: path.join(__dirname, '.env') });
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Serve Frontend
if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // Only serve index.html for non-API routes
    app.get(/^(?!\/api).*/, (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

// Global error handler (must be before app.listen)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start server on all environments EXCEPT Vercel Serverless
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
