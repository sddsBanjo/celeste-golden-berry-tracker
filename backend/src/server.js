import express, { Router } from "express";
import chapterRoutes from "./routes/chapterRoutes.js";

process.loadEnvFile();

const app = express();
const port = process.env.PORT || 3000;

const apiRouter = Router();
apiRouter.get("/health", (req, res) => {
    res.json({ status: "ok" });
});
apiRouter.use("/chapters", chapterRoutes);

app.use("/api", apiRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});