const express = require('express')
const mongoose = require('mongoose');
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config();
require('./config/passport')
const passportLib = require('passport');

const response = require('./middleware/response');

const app = express();

// Security middleware
app.use(helmet());

// HTTP request logger
app.use(morgan('dev'))

// Enhanced CORS configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001,http://192.168.1.74:3000')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

console.log('🌐 Allowed CORS Origins:', allowedOrigins);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Response middleware
app.use(response);

// Initialize passport
app.use(passportLib.initialize());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/doctor', require('./routes/doctor'))
app.use('/api/patient', require('./routes/patient'))
app.use('/api/appointment', require('./routes/appointment'))
app.use('/api/payment',require('./routes/payment'))

// Health check
app.get('/health', (req,res) => res.ok({
  time: new Date().toISOString(),
  server: 'Backend Server',
  status: 'Running',
  clientIP: req.ip
}, 'OK'))

// Test endpoint for mobile
app.get('/api/test-mobile', (req, res) => {
  res.ok({
    message: 'Mobile connection successful!',
    clientIP: req.ip,
    timestamp: new Date().toISOString()
  }, 'Mobile test working');
});

const PORT = process.env.PORT || 5000;

// FIX: Listen on all network interfaces for mobile access
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n🚀 Server started successfully!');
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 Network: http://192.168.1.74:${PORT}`);
  console.log(`📱 Mobile access: http://192.168.1.74:${PORT}`);
  console.log('✅ Backend ready for mobile testing!');
});