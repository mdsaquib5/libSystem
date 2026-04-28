import "dotenv/config";
import app from "./app.js";
import connectDb from "./configs/db.js";

connectDb();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port localhost:${PORT}`);
});