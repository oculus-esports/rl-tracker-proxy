export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { platform, username } = req.query;

  if (!platform || !username) {
    return res.status(400).json({ error: 'Missing platform or username' });
  }

  // Ensure environment variable is loaded
  const apiKey = process.env.TRN_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'TRN_API_KEY is not defined in Vercel Environment Variables.' });
  }

  const trackerUrl = `https://public-api.tracker.gg/v2/rocket-league/standard/profile/${platform}/${encodeURIComponent(username)}`;

  try {
    const apiRes = await fetch(trackerUrl, {
      method: 'GET',
      headers: {
        'TRN-Api-Key': apiKey,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    const data = await apiRes.json();
    return res.status(apiRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
