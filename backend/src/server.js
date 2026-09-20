import express, { Router } from "express";
import chapterRoutes from "./routes/chapterRoutes.js";
import playthroughRoutes from "./routes/playthroughRoutes.js";

process.loadEnvFile();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const apiRouter = Router();
apiRouter.get("/health", (req, res) => {
    res.json({ status: "ok" });
});
apiRouter.use("/chapters", chapterRoutes);
apiRouter.use("/playthroughs", playthroughRoutes);

app.use("/api", apiRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});