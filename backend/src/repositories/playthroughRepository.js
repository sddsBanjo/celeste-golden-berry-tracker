const playthroughs = [];
let nextId = 1;

export function getAll() {
    return playthroughs;
}

export function getById(id) {
    return playthroughs.find((playthrough) => playthrough.id === id) ?? null;
}

export function create(data) {
    const newPlaythrough = {
        id: nextId++,
        name: data.name,
        description: data.description,
        created_at: new Date().toISOString()
    };
    playthroughs.push(newPlaythrough);
    return newPlaythrough;
}

export function update(playthrough, data) {
    playthrough.name = data.name;
    playthrough.description = data.description;
    return playthrough;
}

export function remove(id) {
    const index = playthroughs.findIndex((playthrough) => playthrough.id === id);
    if (index === -1) return false;
    playthroughs.splice(index, 1);
    return true;
}