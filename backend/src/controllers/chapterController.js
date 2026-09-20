const chapters = [];
let nextId = 1;

export function getAll(req, res) {
    res.json(chapters);
}

export function create(req, res) {
    const { identifier, name, origin, number, side } = req.body;

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