export default async function handler(req, res) {
    const offset = req.query.offset || 0;

    const r = await fetch(
        `https://api.scratch.mit.edu/users/himazin0239/followers/?limit=40&offset=${offset}`
    );

    const data = await r.json();

    res.status(200).json(data);
}