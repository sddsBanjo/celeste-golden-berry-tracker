import vanillaChapters from "../../database/seed/vanillaChapters.js";

const chapters = [];
let nextId = 1;

export function getAll({ origin, side, number } = {}) {
    return chapters.filter((chapter) =>
        (origin === undefined || chapter.origin.toLowerCase() === origin.toLowerCase()) &&
        (side === undefined || chapter.side.toLowerCase() === side.toLowerCase()) &&
        (number === undefined || chapter.number === number)
    );
}

export function getById(id) {
    return chapters.find((chapter) => chapter.id === id) ?? null;
}

export function getByIdentifier(identifier, exceptionId) {
    return (
        chapters.find(
            (chapter) =>
                chapter.identifier.toLowerCase() === identifier.toLowerCase() &&
                chapter.id !== exceptionId
        ) ?? null
    );
}

export function create(data) {
    const newChapter = {
        id: nextId++,
        ...data,
        created_at: new Date().toISOString()
    };
    chapters.push(newChapter);
    return newChapter;
}

export function update(chapter, data) {
    chapter.identifier = data.identifier;
    chapter.name = data.name;
    chapter.origin = data.origin;
    chapter.number = data.number;
    chapter.side = data.side;
    return chapter;
}

export function remove(id) {
    const index = chapters.findIndex((chapter) => chapter.id === id);
    if (index === -1) return false;
    chapters.splice(index, 1);
    return true;
}

export function buildVanillaChapters() {
    const result = [];
    for (const { number, name, sides } of vanillaChapters) {
        for (const side of sides) {
            result.push({ identifier: `Celeste${number}${side}`, name, origin: "Celeste", number, side });
        }
    }
    return result;
}