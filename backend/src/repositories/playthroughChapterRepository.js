const playthroughChapters = [];
let nextId = 1;

export function getAllByPlaythrough(playthroughId) {
    return playthroughChapters.filter(
        (association) => association.playthrough_id === playthroughId
    );
}

export function getByPlaythroughAndChapter(playthroughId, chapterId) {
    return (
        playthroughChapters.find(
            (association) =>
                association.playthrough_id === playthroughId &&
                association.chapter_id === chapterId
        ) ?? null
    );
}

export function create(data) {
    const newAssociation = {
        id: nextId++,
        playthrough_id: data.playthrough_id,
        chapter_id: data.chapter_id,
        created_at: new Date().toISOString()
    };
    playthroughChapters.push(newAssociation);
    return newAssociation;
}

export function remove(playthroughId, chapterId) {
    const index = playthroughChapters.findIndex(
        (association) =>
            association.playthrough_id === playthroughId &&
            association.chapter_id === chapterId
    );
    if (index === -1) return false;
    playthroughChapters.splice(index, 1);
    return true;
}