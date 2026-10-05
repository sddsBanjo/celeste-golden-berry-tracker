const sessions = [];
let nextId = 1;

export function getAll({ playthrough_chapter_id } = {}) {
    return sessions.filter(
        (session) =>
            playthrough_chapter_id === undefined ||
            session.playthrough_chapter_id === playthrough_chapter_id
    );
}

export function getById(id) {
    return sessions.find((session) => session.id === id) ?? null;
}

export function create(data) {
    const newSession = {
        id: nextId++,
        playthrough_chapter_id: data.playthrough_chapter_id,
        played_at: data.played_at,
        duration_seconds: data.duration_seconds,
        deaths: data.deaths,
        completed: data.completed,
        created_at: new Date().toISOString()
    };
    sessions.push(newSession);
    return newSession;
}

export function remove(id) {
    const index = sessions.findIndex((session) => session.id === id);
    if (index === -1) return false;
    sessions.splice(index, 1);
    return true;
}