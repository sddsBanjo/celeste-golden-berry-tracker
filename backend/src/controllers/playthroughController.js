const playthroughs = [];
let nextId = 1;

export function getAll(req, res) {
    res.json(playthroughs);
}

export function create(req, res) {
    const name = req.body.name.trim();
    const description = (req.body.description ?? "").trim(); 

    const newPlaythrough = {
        id: nextId++,
        name,
        description,
        created_at: new Date().toISOString()
    };

    playthroughs.push(newPlaythrough);

    res.status(201).json(newPlaythrough);
}