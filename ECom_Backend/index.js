import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import adminRouter from "./Admin/routes/router.js";
import userRouter from "./User/routes/router.js";
import categoryRoutes from "./Admin/routes/router.js";
import path from "path";
import { fileURLToPath } from "url";
// Serve static files (images)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Category Routes

const app = express();
app.use(express.json());

app.use('/api', categoryRoutes);
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// DataBase Connection
mongoose
  .connect(
    "mongodb+srv://nikhil77gautam:QH3FSsvbAbOdDvBL@cluster0.u4nfv2p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((error) => {
    console.log(error);
  });

// Admin and User Routers
app.use(adminRouter);
app.use(userRouter);

// If Single Router then use:
// app.use(router);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
