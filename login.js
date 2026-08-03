export default function handler(req, res) {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const base_url = (process.env.BASE_URL || "").replace(/\/$/, "");
  const redirect_uri = `${base_url}/callback`;
  const scope = "user-read-currently-playing user-read-recently-played";
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
  return res.redirect(authUrl);
}
