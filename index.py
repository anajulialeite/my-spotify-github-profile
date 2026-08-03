from flask import Flask, redirect, request, Response
import requests
import json
import os
import base64

app = Flask(__name__)

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID", "")
SPOTIFY_SECRET_ID = os.getenv("SPOTIFY_SECRET_ID", "")
BASE_URL = os.getenv("BASE_URL", "").rstrip("/")

def get_auth_header():
    auth_str = f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_SECRET_ID}"
    b64_auth = base64.b64encode(auth_str.encode("utf-8")).decode("utf-8")
    return {"Authorization": f"Basic {b64_auth}"}

@app.route("/")
@app.route("/api")
def index():
    return redirect("/api/login")

@app.route("/api/login")
def login():
    redirect_uri = f"{BASE_URL}/callback"
    scope = "user-read-currently-playing user-read-recently-played"
    auth_url = (
        f"https://accounts.spotify.com/authorize?"
        f"client_id={SPOTIFY_CLIENT_ID}&response_type=code&"
        f"scope={scope}&redirect_uri={redirect_uri}"
    )
    return redirect(auth_url)

@app.route("/api/callback")
def callback():
    code = request.args.get("code")
    if not code:
        return "Erro: Codigo de autorizacao nao recebido.", 400

    redirect_uri = f"{BASE_URL}/callback"
    token_url = "https://accounts.spotify.com/api/token"
    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri,
    }
    headers = get_auth_header()
    res = requests.post(token_url, data=payload, headers=headers)
    data = res.json()

    refresh_token = data.get("refresh_token")
    if not refresh_token:
        return f"Erro na autorizacao do Spotify: {data}", 400

    final_svg_url = f"{BASE_URL}/view?refresh_token={refresh_token}&bar_color=780099"
    markdown_code = f'<p align="center">\n  <a href="https://github.com/anajulialeite">\n    <img src="{final_svg_url}">\n  </a>\n</p>'

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Spotify Conectado!</title>
        <meta charset="utf-8">
    </head>
    <body style="font-family: system-ui, sans-serif; text-align: center; padding: 40px; background: #121212; color: white;">
        <h1 style="color: #7D00FF;">?? Seu Spotify Pessoal esta Pronto!</h1>
        <p>Copie o codigo abaixo e cole no seu README.md do GitHub:</p>
        <textarea style="width: 85%; height: 120px; font-size: 14px; padding: 15px; background: #1e1e2f; color: #b77eff; border: 2px solid #7D00FF; border-radius: 10px; font-family: monospace;" readonly>{markdown_code}</textarea>
    </body>
    </html>
    """
    return html

@app.route("/api/view")
@app.route("/api/view.svg")
def view():
    refresh_token = request.args.get("refresh_token") or os.getenv("SPOTIFY_REFRESH_TOKEN", "")
    bar_color = request.args.get("bar_color", "780099")
    bg_color = request.args.get("background_color", "121212")

    song_name = "Currently not playing"
    artist_name = "Offline"
    status_text = "Offline"
    status_color = "#ff1616"

    if refresh_token:
        token_res = requests.post(
            "https://accounts.spotify.com/api/token",
            data={"grant_type": "refresh_token", "refresh_token": refresh_token},
            headers=get_auth_header()
        )
        if token_res.status_code == 200:
            token_data = token_res.json()
            access_token = token_data.get("access_token")
            if access_token:
                now_res = requests.get(
                    "https://api.spotify.com/v1/me/player/currently-playing",
                    headers={"Authorization": f"Bearer {access_token}"}
                )
                if now_res.status_code == 200:
                    now_data = now_res.json()
                    if now_data.get("is_playing"):
                        item = now_data.get("item", {})
                        song_name = item.get("name", "Musica Desconhecida")
                        artists = [a.get("name") for a in item.get("artists", [])]
                        artist_name = ", ".join(artists)
                        status_text = "Now playing on Spotify"
                        status_color = "#1DB954"

    svg = f"""<svg width="320" height="145" xmlns="http://www.w3.org/2000/svg" role="img">
  <rect width="100%" height="100%" rx="10" fill="#{bg_color}"/>
  <style>
    .status {{ font-family: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif; font-weight: bold; font-size: 13px; fill: {status_color}; }}
    .song {{ font-family: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif; font-weight: bold; font-size: 16px; fill: #ffffff; }}
    .artist {{ font-family: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif; font-size: 14px; fill: #b3b3b3; }}
  </style>
  <text x="20" y="35" class="status">{status_text}</text>
  <text x="20" y="70" class="song">{song_name[:28]}</text>
  <text x="20" y="95" class="artist">{artist_name[:32]}</text>
  <rect x="20" y="115" width="280" height="4" rx="2" fill="#{bar_color}"/>
</svg>"""
    return Response(svg, mimetype="image/svg+xml", headers={"Cache-Control": "s-maxage=1, stale-while-revalidate"})

if __name__ == "__main__":
    app.run(debug=True, port=3000)
