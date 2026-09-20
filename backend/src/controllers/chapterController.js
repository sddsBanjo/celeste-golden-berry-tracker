const chapters = [];
let nextId = 1;

export function getAll(req, res) {
    res.json(chapters);
}

export function create(req, res) {
    const identifier = req.body.identifier.trim();
    const name = req.body.name.trim();
    const origin = req.body.origin.trim();
    const { number } = req.body;
    const side = req.body.side.trim();

    const existing = chapters.find(
        (chapter) => chapter.identifier.toLowerCase() === identifier.toLowerCase()
    );
    if (existing) {
        return res.status(409).json({
            error: `A chapter with identifier '${existing.identifier}' already exists.`
        });
    }

    const newChapter = {
        id: nextId++,
        identifier,
        name,
        origin,
        number,
        side,
        created_at: new Date().toISOString()
    };

    chapters.push(newChapter);

    res.status(201).json(newChapter);
}