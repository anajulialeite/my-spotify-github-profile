export default async function handler(req, res) {
  const code = req.query.code;
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_SECRET_ID;
  const base_url = (process.env.BASE_URL || "").replace(/\/$/, "");
  const redirect_uri = `${base_url}/callback`;

  if (!code) {
    return res.status(400).send("Erro: Codigo nao recebido.");
  }

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri,
    }),
  });
  const data = await tokenRes.json();
  const refresh_token = data.refresh_token;

  if (!refresh_token) {
    return res.status(400).send(`Erro na autorizacao: ${JSON.stringify(data)}`);
  }

  const final_url = `${base_url}/view?refresh_token=${refresh_token}&bar_color=780099`;
  const markdown = `<p align="center">\n  <a href="https://github.com/anajulialeite">\n    <img src="${final_url}">\n  </a>\n</p>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Spotify Conectado!</title></head>
    <body style="font-family: sans-serif; text-align: center; padding: 40px; background: #121212; color: white;">
        <h1 style="color: #7D00FF;">?? Seu Spotify Pessoal esta Ativo!</h1>
        <p>Copie o codigo abaixo e cole no seu README.md do GitHub:</p>
        <textarea style="width: 85%; height: 120px; font-size: 14px; padding: 15px; background: #1e1e2f; color: #b77eff; border: 2px solid #7D00FF; border-radius: 10px; font-family: monospace;" readonly>${markdown}</textarea>
    </body>
    </html>
  `);
}
