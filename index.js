import express, { urlencoded } from 'express';
import ConnectToMongo from './db.js';
import cors from 'cors';
import router from './auth/users.js';
import caserouter from './auth/caseshearing.js';
import Allhearings from './auth/crobs.js';
import dotenv from 'dotenv'
const app = express();
dotenv.config();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/user', router);
app.use('/api/case', caserouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});



ConnectToMongo().then(() => {
    console.log("MongoDB connected successfully!");


    Allhearings.start();
const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error("MongoDB connection failed:", err);
});
