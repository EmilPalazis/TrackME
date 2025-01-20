import express from 'express';
import * as mongoose from 'mongoose'
import * as dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url'; 
import Users from './src/models/Users.js';
import actionRoutes from './src/routes/actions.js';
import frontendRoutes from './src/routes/frontend.js'
import cors from 'cors'; 



const app = express();
dotenv.config();
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); // Resolve directory name

app.use(cors({
  origin: '*', // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));
app.use(express.static(path.join(__dirname,'src', 'public')));

app.use(express.json());
app.use('/api/actions', actionRoutes);
app.use('/api/frontend', frontendRoutes);
  
  const url = process.env.MONGODB;
  const options = {
      dbName: 'trackme',
  }
  mongoose.connect(url, options)
    .then(() => {
      console.log('Connected to the Database.');
    })
    .catch((error) => console.error(error));

// Serve the login page at the root URL
app.get('', (req, res) => {
  res.sendFile(path.join(__dirname, 'src','public', 'TrackME_login_page.html')); 
});

//port listening
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
