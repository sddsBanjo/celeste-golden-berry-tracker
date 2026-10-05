import * as sessionRepository from "../repositories/sessionRepository.js";
import * as playthroughChapterRepository from "../repositories/playthroughChapterRepository.js";

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