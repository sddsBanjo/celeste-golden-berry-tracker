import { isNonEmptyString } from "../utils/validators.js";

function isValidIdentifier(value) {
    return typeof value === "string" && /^[A-Za-z0-9]+$/.test(value.trim());
}

function isNonNegativeInteger(value) {
    return Number.isInteger(value) && value >= 0;
}

export function validateChapter(req, res, next) {
    const body = req.body ?? {};
    const errors = [];
    const { identifier, name, origin, number, side } = body;

    if (!isValidIdentifier(identifier)) {
        errors.push({ field: "identifier", message: "Identifier is required and must contain only letters and numbers, without spaces (e.g. Celeste1A)." });
    }
    if (!isNonEmptyString(name)) {
        errors.push({ field: "name", message: "Name is required and must be a non-empty string." });
    }
    if (!isNonEmptyString(origin)) {
        errors.push({ field: "origin", message: "Origin is required and must be a non-empty string." });
    }
    if (!isNonNegativeInteger(number)) {
        errors.push({ field: "number", message: "Number is required and must be an integer greater than or equal to 0." });
    }
    if (!isNonEmptyString(side)) {
        errors.push({ field: "side", message: "Side is required and must be a non-empty string." });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            error: "Invalid chapter! Check documentation for a better understanding of the expected format.",
            details: errors
        });
    }

    next();
}