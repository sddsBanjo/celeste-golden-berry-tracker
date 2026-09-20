import express, { Router } from "express";

process.loadEnvFile();

const app = express();
const port = process.env.PORT || 3000;

const apiRouter = Router();
apiRouter.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api", apiRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});