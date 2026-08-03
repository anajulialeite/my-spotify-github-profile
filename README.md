# 🎵 Meu Spotify no Perfil do GitHub

Crie um cartão em tempo real com a música que você está ouvindo no Spotify para exibir no seu perfil do GitHub!

Rodando nativamente em Serverless Functions na Vercel de forma 100% gratuita e autônoma.

## 📌 Sumário
- [Conectar e Conceder Permissão](#-conectar-e-conceder-permissão)
- [Exemplos de Temas](#-exemplos-de-temas)
- [Como Configurar o Projeto](#-como-configurar-o-projeto)
  - [1. Configurar na Vercel](#1-configurar-na-vercel)
  - [2. Configurar no Spotify Developer](#2-configurar-no-spotify-developer)
- [Executando Localmente](#-executando-localmente)
- [Créditos](#-créditos)

---

## 🔐 Conectar e Conceder Permissão

Clique no botão abaixo para conectar sua conta do Spotify ao seu aplicativo:

[<img src="https://raw.githubusercontent.com/kittinan/spotify-github-profile/master/img/btn-spotify.png" alt="Conectar com o Spotify">](https://my-spotify-github-profile-c16z.vercel.app/api/login)

---

## 🎨 Exemplos de Temas

- **Tema Padrão (Default)**

![spotify-github-profile](https://raw.githubusercontent.com/kittinan/spotify-github-profile/master/img/default.svg)

- **Tema Compacto (Compact)**

![spotify-github-profile](https://raw.githubusercontent.com/kittinan/spotify-github-profile/master/img/compact.svg)

- **Tema Natemoo-re**

![spotify-github-profile](https://raw.githubusercontent.com/kittinan/spotify-github-profile/master/img/natemoo-re.svg)

- **Tema Novatorem**

![spotify-github-profile](https://raw.githubusercontent.com/kittinan/spotify-github-profile/master/img/novatorem.svg)

- **Tema Karaoke**

![spotify-github-profile](https://raw.githubusercontent.com/kittinan/spotify-github-profile/master/img/karaoke.svg)

- **Tema Player do Spotify (Spotify Embed)**

![spotify-github-profile](https://raw.githubusercontent.com/kittinan/spotify-github-profile/master/img/spotify-embed.svg)

---

## ⚙️ Como Configurar o Projeto

### 1. Configurar na Vercel
1. Importe este repositório para o seu painel da Vercel.
2. Em **Settings > Environment Variables**, adicione as seguintes variáveis de ambiente:
   - `SPOTIFY_CLIENT_ID`: ID do seu aplicativo no Spotify.
   - `SPOTIFY_SECRET_ID`: Chave secreta do seu aplicativo no Spotify.
   - `BASE_URL`: O link da sua API na Vercel (Exemplo: `https://my-spotify-github-profile-c16z.vercel.app/api`).

### 2. Configurar no Spotify Developer
1. Acesse o [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Abra o seu aplicativo e vá em **Settings**.
3. Em **Redirect URIs**, adicione a URL exata do seu callback:
   `https://my-spotify-github-profile-c16z.vercel.app/api/callback`
4. Salve as alterações.

---

## 💻 Executando Localmente

Para rodar o projeto na sua máquina:

1. Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
   ```env
   BASE_URL='http://localhost:3000/api'
   SPOTIFY_CLIENT_ID='seu_client_id'
   SPOTIFY_SECRET_ID='seu_client_secret'
   ```

2. Acesse a rota de login local no navegador:
   `http://localhost:3000/api/login`

---

## 👏 Créditos

- Projeto original por [@kittinan](https://github.com/kittinan/spotify-github-profile)
- Inspirado por [@natemoo-re](https://github.com/natemoo-re)
