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