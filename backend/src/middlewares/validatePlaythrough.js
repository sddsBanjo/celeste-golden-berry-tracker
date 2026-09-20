function isNonEmptyString(value) {
    return typeof value === "string" && value.trim() !== "";
}

function isOptionalString(value) {
    return value === undefined || value === null || typeof value === "string";
}

export function validatePlaythrough(req, res, next) {
    const body = req.body ?? {};
    const errors = [];
    const { name, description } = body;

    if (!isNonEmptyString(name)) {
        errors.push({ field: "name", message: "Name is required and must be a non-empty string." });
    }
    if (!isOptionalString(description)) {
        errors.push({ field: "description", message: "Description is optional, but if provided must be a string." });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            error: "Invalid playthrough! Check documentation for a better understanding of the expected format.",
            details: errors
        });
    }

    next();
}