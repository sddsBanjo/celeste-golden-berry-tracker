import * as playthroughRepository from "../repositories/playthroughRepository.js";

export function getAll(req, res) {
    res.json(playthroughRepository.getAll());
}

export function getById(req, res) {
    const id = Number(req.params.id);

    const result = playthroughRepository.getById(id);
    if (!result) {
        return res.status(404).json({
            error: `Couldn't find a playthrough of ID ${id}.`
        });
    }

    res.json(result);
}

export function create(req, res) { 
    const name = req.body.name.trim();
    const description = (req.body.description ?? "").trim();

    const newPlaythrough = playthroughRepository.create({ name, description });

    res.status(201).json(newPlaythrough);
}

export function update(req, res) {
    const id = Number(req.params.id);

    const playthrough = playthroughRepository.getById(id);
    if (!playthrough) {
        return res.status(404).json({
            error: `Couldn't find a playthrough of ID ${id}.`
        });
    }

    const name = req.body.name.trim();
    const description = (req.body.description ?? "").trim();

    const updated = playthroughRepository.update(playthrough, {
        name,
        description
    });

    res.json(updated);
}

export function remove(req, res) {
    const id = Number(req.params.id);

    const removed = playthroughRepository.remove(id);
    if (!removed) {
        return res.status(404).json({
            error: `Couldn't find a playthrough of ID ${id}.`
        });
    }

    res.status(204).send();
}