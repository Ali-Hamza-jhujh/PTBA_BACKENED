import express from 'express';
import ConnectToMongo from './db.js';
import cors from 'cors';
import router from './auth/users.js';
import caserouter from './auth/caseshearing.js';
import Allhearings from './auth/crobs.js';
import dotenv from 'dotenv';
import compression from "compression";

dotenv.config();

const app = express();
app.set('trust proxy', 1);
// ✅ PROPER CORS CONFIGURATION
const corsOptions = {
  origin: [
    'https://alihamzajhujh.netlify.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));



app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/user', router);
app.use('/api/case', caserouter);

app.get('/', (req, res) => {
  res.send('🚀 BAR ASSOCIATION API is running.');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ error: err.message });
});

ConnectToMongo()
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    Allhearings.start();
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📡 CORS: Enabled for Netlify frontend`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});
