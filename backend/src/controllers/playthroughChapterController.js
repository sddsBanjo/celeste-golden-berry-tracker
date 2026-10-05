import * as playthroughChapterRepository from "../repositories/playthroughChapterRepository.js";
import * as playthroughRepository from "../repositories/playthroughRepository.js";
import * as chapterRepository from "../repositories/chapterRepository.js";

export function getAll(req, res) {
    const playthroughId = Number(req.params.id);

    const playthrough = playthroughRepository.getById(playthroughId);
    if (!playthrough) {
        return res.status(404).json({
            error: `Couldn't find a playthrough of ID ${playthroughId}.`
        });
    }

    const associations = playthroughChapterRepository.getAllByPlaythrough(playthroughId);

    const chapters = associations
        .map((association) => chapterRepository.getById(association.chapter_id))
        .filter((chapter) => chapter !== null)
        .sort((a, b) => a.number - b.number || a.side.localeCompare(b.side));

    res.json(chapters);
}

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

export function remove(req, res) {
    const playthroughId = Number(req.params.id);
    const chapterId = Number(req.params.chapterId);

    const playthrough = playthroughRepository.getById(playthroughId);
    if (!playthrough) {
        return res.status(404).json({
            error: `Couldn't find a playthrough of ID ${playthroughId}.`
        });
    }

    const removed = playthroughChapterRepository.remove(playthroughId, chapterId);
    if (!removed) {
        return res.status(404).json({
            error: `Chapter ${chapterId} is not associated with playthrough ${playthroughId}.`
        });
    }

    res.status(204).send();
}