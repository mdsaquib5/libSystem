import "dotenv/config";
import app from "../app.js";
import connectDb from "../configs/db.js";

// Connect DB on every request that hits this serverless function.
// Connection is cached in global scope so subsequent requests within
// the same warm instance reuse the existing connection (no delay).
export default async function handler(req, res) {
    await connectDb();
    return app(req, res);
}