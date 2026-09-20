const playthroughs = [];
let nextId = 1;

export function getAll(req, res) {
    res.json(playthroughs);
}

export function getById(req, res) {
    const id = Number(req.params.id);

    const result = playthroughs.find((playthrough) => playthrough.id === id);
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

    const newPlaythrough = {
        id: nextId++,
        name,
        description,
        created_at: new Date().toISOString()
    };

    playthroughs.push(newPlaythrough);

    res.status(201).json(newPlaythrough);
}

export function update(req, res) {
    const id = Number(req.params.id);

    const result = playthroughs.find((playthrough) => playthrough.id === id);
    if (!result) {
        return res.status(404).json({
            error: `Couldn't find a playthrough of ID ${id}.`
        });
    }

    result.name = req.body.name.trim();
    result.description = (req.body.description ?? "").trim();

    res.json(result);
}