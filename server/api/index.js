import "dotenv/config";
import app from "../app.js";
import connectDb from "../configs/db.js";

connectDb();

export default app;