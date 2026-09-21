const chapters = [];
let nextId = 1;

export function getAll(req, res) {
    res.json(chapters);
}

export function getById(req, res) {
    const id = Number(req.params.id);

    const result = chapters.find((chapter) => chapter.id === id);
    if (!result) {
        return res.status(404).json({
            error: `Couldn't find a chapter of ID ${id}.`
        });
    }

    res.json(result);
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

export function update(req, res) {
    const id = Number(req.params.id);

    const result = chapters.find((chapter) => chapter.id === id);
    if (!result) {
        return res.status(404).json({
            error: `Couldn't find a chapter of ID ${id}.`
        });
    }

    const identifier = req.body.identifier.trim();

    const existing = chapters.find((chapter) =>
        chapter.identifier.toLowerCase() === identifier.toLowerCase() && chapter.id !== id
    );
    if (existing) {
        return res.status(409).json({
            error: `A chapter with identifier '${existing.identifier}' already exists.`
        });
    }

    result.identifier = identifier;
    result.name = req.body.name.trim();
    result.origin = req.body.origin.trim();
    result.number = req.body.number;
    result.side = req.body.side.trim();

    res.json(result);
}

export function remove(req, res) {
    const id = Number(req.params.id);

    const index = chapters.findIndex((chapter) => chapter.id === id);
    if (index === -1) {
        return res.status(404).json({
            error: `Couldn't find a chapter of ID ${id}.`
        });
    }

    chapters.splice(index, 1);

    res.status(204).send();
}