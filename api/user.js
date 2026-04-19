export default async function handler(req, res) {
    const r = await fetch("https://api.scratch.mit.edu/users/himazin0239/");
    const data = await r.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
}