import * as sessionRepository from "../repositories/sessionRepository.js";
import * as playthroughChapterRepository from "../repositories/playthroughChapterRepository.js";

export function getAll(req, res) {
    const playthroughChapterId =
        req.query.playthrough_chapter_id === undefined
            ? undefined
            : Number(req.query.playthrough_chapter_id);

    const result = sessionRepository.getAll({ playthrough_chapter_id: playthroughChapterId });
    res.json(result);
}

export function getById(req, res) {
    const id = Number(req.params.id);

    const session = sessionRepository.getById(id);
    if (!session) {
        return res.status(404).json({
            error: `Couldn't find a session of ID ${id}.`
        });
    }

    res.json(session);
}

export function create(req, res) {
    const playthroughChapterId = req.body.playthrough_chapter_id;

    const association = playthroughChapterRepository.getById(playthroughChapterId);
    if (!association) {
        return res.status(404).json({
            error: `Couldn't find a playthrough chapter of ID ${playthroughChapterId}.`
        });
    }

    const newSession = sessionRepository.create({
        playthrough_chapter_id: playthroughChapterId,
        played_at: req.body.played_at,
        duration_seconds: req.body.duration_seconds,
        deaths: req.body.deaths,
        completed: req.body.completed ?? false
    });

    res.status(201).json(newSession);
}

export function remove(req, res) {
    const id = Number(req.params.id);

    const removed = sessionRepository.remove(id);
    if (!removed) {
        return res.status(404).json({
            error: `Couldn't find a session of ID ${id}.`
        });
    }

    res.status(204).send();
}