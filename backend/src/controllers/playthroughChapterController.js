import * as playthroughChapterRepository from "../repositories/playthroughChapterRepository.js";
import * as playthroughRepository from "../repositories/playthroughRepository.js";
import * as chapterRepository from "../repositories/chapterRepository.js";

export function create(req, res) {
    const playthroughId = Number(req.params.id);
    const chapterId = Number(req.body.chapter_id);

    const playthrough = playthroughRepository.getById(playthroughId);
    if (!playthrough) {
        return res.status(404).json({
            error: `Couldn't find a playthrough of ID ${playthroughId}.`
        });
    }

    const chapter = chapterRepository.getById(chapterId);
    if (!chapter) {
        return res.status(404).json({
            error: `Couldn't find a chapter of ID ${chapterId}.`
        });
    }

    const existing = playthroughChapterRepository.getByPlaythroughAndChapter(playthroughId, chapterId);
    if (existing) {
        return res.status(409).json({
            error: `Chapter ${chapterId} is already associated with playthrough ${playthroughId}.`
        });
    }

    const association = playthroughChapterRepository.create({
        playthrough_id: playthroughId,
        chapter_id: chapterId
    });

    res.status(201).json(association);
}