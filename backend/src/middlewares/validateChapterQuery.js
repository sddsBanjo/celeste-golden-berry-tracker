import { isNonEmptyString } from "../utils/validators.js";

function isNonNegativeIntegerText(value) {
    return typeof value === "string" && /^[0-9]+$/.test(value);
}

export function validateChapterQuery(req, res, next) {
    const { origin, side, number } = req.query;
    const errors = [];

    if (origin !== undefined && !isNonEmptyString(origin)) {
        errors.push({ field: "origin", message: "Origin, if provided, must be a single non-empty text." });
    }
    if (side !== undefined && !isNonEmptyString(side)) {
        errors.push({ field: "side", message: "Side, if provided, must be a single non-empty text." });
    }
    if (number !== undefined && !isNonNegativeIntegerText(number)) {
        errors.push({ field: "number", message: "Number, if provided, must be a single integer greater than or equal to 0." });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            error: "Invalid filters! Check documentation for a better understanding of the expected format.",
            details: errors
        });
    }

    next();
}