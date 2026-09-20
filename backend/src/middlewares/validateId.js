function isValidId(value) {
    return /^[0-9]+$/.test(value) && Number(value) > 0;
}

export function validateId(req, res, next) {
    const id = req.params.id;

    if (!isValidId(id)) {
        return res.status(400).json({
            error: "Invalid ID!",
            details: [{ field: "id", message: `The ID must be a positive integer, unlike '${id}'.` }]
        });
    }

    next();
}