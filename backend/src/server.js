import express from "express";

process.loadEnvFile();

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});