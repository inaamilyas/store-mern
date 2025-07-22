// server.js
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { createDefaultAdmin } from './utils/createDefaultAdmin.js';
import app from './app.js';
dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  createDefaultAdmin();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api/docs`);
  });
});
