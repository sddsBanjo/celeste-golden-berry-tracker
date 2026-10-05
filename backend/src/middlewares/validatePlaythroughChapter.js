function isPositiveIntegerBody(value) {
    return typeof value === "number" && Number.isInteger(value) && value > 0;
}

export function validatePlaythroughChapter(req, res, next) {
    const body = req.body ?? {};
    const errors = [];

    if (!isPositiveIntegerBody(body.chapter_id)) {
        errors.push({ field: "chapter_id", message: "chapter_id is required and must be a positive integer." });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            error: "Invalid request! Check documentation for a better understanding of the expected format.",
            details: errors
        });
    }

    next();
}