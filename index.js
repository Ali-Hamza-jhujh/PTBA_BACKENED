import express, { urlencoded } from 'express';
import ConnectToMongo from './db.js';
import cors from 'cors';
import router from './auth/users.js';
import caserouter from './auth/caseshearing.js';
import Allhearings from './auth/crobs.js';

const app = express();
const port = 5000;

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

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
}).catch(err => {
    console.error("MongoDB connection failed:", err);
});
