import express from "express";

process.loadEnvFile();

const app = express();
const port = process.env.PORT || 3000;

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});