import * as chapterRepository from "../repositories/chapterRepository.js";

export function getAll(req, res) {
    const { origin, side } = req.query;
    const number = req.query.number === undefined ? undefined : Number(req.query.number);

    const result = chapterRepository.getAll({ origin, side, number });
    res.json(result);
}

export function getById(req, res) {
    const id = Number(req.params.id);

    const chapter = chapterRepository.getById(id);
    if (!chapter) {
        return res.status(404).json({
            error: `Couldn't find a chapter of ID ${id}.`
        });
    }

    res.json(chapter);
}

export function create(req, res) {
    const identifier = req.body.identifier.trim();
    const name = req.body.name.trim();
    const origin = req.body.origin.trim();
    const { number } = req.body;
    const side = req.body.side.trim();

    const existing = chapterRepository.getByIdentifier(identifier);
    if (existing) {
        return res.status(409).json({
            error: `A chapter with identifier '${existing.identifier}' already exists.`
        });
    }

    const newChapter = chapterRepository.create({ identifier, name, origin, number, side });
    res.status(201).json(newChapter);
}

export function update(req, res) {
    const id = Number(req.params.id);

    const chapter = chapterRepository.getById(id);
    if (!chapter) {
        return res.status(404).json({
            error: `Couldn't find a chapter of ID ${id}.`
        });
    }

    const identifier = req.body.identifier.trim();

    const existing = chapterRepository.getByIdentifier(identifier, id);
    if (existing) {
        return res.status(409).json({
            error: `A chapter with identifier '${existing.identifier}' already exists.`
        });
    }

    const updated = chapterRepository.update(chapter, {
        identifier,
        name: req.body.name.trim(),
        origin: req.body.origin.trim(),
        number: req.body.number,
        side: req.body.side.trim()
    });

    res.json(updated);
}

export function remove(req, res) {
    const id = Number(req.params.id);

    const removed = chapterRepository.remove(id);
    if (!removed) {
        return res.status(404).json({
            error: `Couldn't find a chapter of ID ${id}.`
        });
    }

    res.status(204).send();
}