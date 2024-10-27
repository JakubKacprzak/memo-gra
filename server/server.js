import express, { json, urlencoded } from "express";
import { connect } from "mongoose";
import cors from "cors";
import gameRoutes from "../routes/gameRoutes.js";

const app = express();
const PORT = 5000;

const MONGO_URI =
  "mongodb+srv://jkacprzak263:123@memo.qpjqo.mongodb.net/?retryWrites=true&w=majority&appName=Memo";

connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/game", gameRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
