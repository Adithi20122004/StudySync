const express = require("express");
const dotenv  = require("dotenv");
const cors    = require("cors");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => { console.log("Incoming:", req.method, req.url); next(); });

connectDB();

app.use("/api/auth",      require("./routes/authRoutes"));
app.use("/api/tasks",     require("./routes/taskRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/groups",    require("./routes/groupRoutes"));
app.use("/api/resources", require("./routes/resourceRoutes"));

const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on http://localhost:${PORT}`));