module.exports = async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const refresh_token = url.searchParams.get("refresh_token") || (req.query && req.query.refresh_token) || process.env.SPOTIFY_REFRESH_TOKEN;
  const bar_color = url.searchParams.get("bar_color") || (req.query && req.query.bar_color) || "780099";
  const bg_color = url.searchParams.get("background_color") || (req.query && req.query.background_color) || "121212";
  const client_id = process.env.SPOTIFY_CLIENT_ID || "bd7782fe715946f0bf753c52dcb0a5eb";
  const client_secret = process.env.SPOTIFY_SECRET_ID || "bb12c486ac734a389188ee8ed75e43f2";

  let songName = "Currently not playing", artistName = "Offline", statusText = "Offline", statusColor = "#ff1616";

  if (refresh_token) {
    try {
      const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
      const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(refresh_token)}`
      });
      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        const access_token = tokenData.access_token;
        if (access_token) {
          const nowRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", { headers: { Authorization: `Bearer ${access_token}` } });
          if (nowRes.status === 200) {
            const nowData = await nowRes.json();
            if (nowData && nowData.item) {
              songName = nowData.item.name || "Musica Desconhecida";
              artistName = (nowData.item.artists || []).map(a => a.name).join(", ") || "Artista Desconhecido";
              statusText = nowData.is_playing ? "Now playing on Spotify" : "Recently played";
              statusColor = nowData.is_playing ? "#1DB954" : "#780099";
            }
          }
          if (songName === "Currently not playing") {
            const recentRes = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", { headers: { Authorization: `Bearer ${access_token}` } });
            if (recentRes.status === 200) {
              const recentData = await recentRes.json();
              if (recentData && recentData.items && recentData.items.length > 0) {
                const track = recentData.items[0].track;
                songName = track.name || "Musica Desconhecida";
                artistName = (track.artists || []).map(a => a.name).join(", ") || "Artista Desconhecido";
                statusText = "Recently played";
                statusColor = "#780099";
              }
            }
          }
        }
      }
    } catch (e) { console.error(e); }
  }

  const cleanSong = songName.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const cleanArtist = artistName.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const svg = `<svg width="320" height="145" xmlns="http://www.w3.org/2000/svg" role="img">
  <rect width="100%" height="100%" rx="10" fill="#${bg_color}"/>
  <style>
    .status { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif; font-weight: bold; font-size: 13px; fill: ${statusColor}; }
    .song { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif; font-weight: bold; font-size: 16px; fill: #ffffff; }
    .artist { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif; font-size: 14px; fill: #b3b3b3; }
  </style>
  <text x="20" y="35" class="status">${statusText}</text>
  <text x="20" y="70" class="song">${cleanSong.slice(0, 28)}</text>
  <text x="20" y="95" class="artist">${cleanArtist.slice(0, 32)}</text>
  <rect x="20" y="115" width="280" height="4" rx="2" fill="#${bar_color}"/>
</svg>`;

  res.statusCode = 200;
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
  res.end(svg);
};
