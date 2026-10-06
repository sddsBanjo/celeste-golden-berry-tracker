function isPositiveInteger(value) {
    return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isNonNegativeInteger(value) {
    return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isValidPlayedAt(value) {
    if (typeof value !== "string") return false;
    const date = new Date(value);
    return !Number.isNaN(date.getTime()) && date.getTime() <= Date.now();
}

function isOptionalBoolean(value) {
    return value === undefined || typeof value === "boolean";
}

export function validateSession(req, res, next) {
    const body = req.body ?? {};
    const errors = [];

    if (!isPositiveInteger(body.playthrough_chapter_id)) {
        errors.push({ field: "playthrough_chapter_id", message: "playthrough_chapter_id is required and must be a positive integer." });
    }
    if (!isValidPlayedAt(body.played_at)) {
        errors.push({ field: "played_at", message: "played_at is required, must be a valid date, and cannot be in the future." });
    }
    if (!isNonNegativeInteger(body.duration_seconds)) {
        errors.push({ field: "duration_seconds", message: "duration_seconds is required and must be an integer greater than or equal to 0." });
    }
    if (!isNonNegativeInteger(body.deaths)) {
        errors.push({ field: "deaths", message: "deaths is required and must be an integer greater than or equal to 0." });
    }
    if (!isOptionalBoolean(body.completed)) {
        errors.push({ field: "completed", message: "completed, if provided, must be a boolean." });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            error: "Invalid session! Check documentation for a better understanding of the expected format.",
            details: errors
        });
    }

    next();
}