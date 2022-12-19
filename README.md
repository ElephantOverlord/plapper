# plapper.ch - Interactive Classroom Games for Foreign Language Learners

*plapper.ch* offers online, multiplayer, interactive classroom games for learners of foreign languages. All games are
based on the official Swiss cantonal schoolbook selection.

## Libraries and Frameworks
- [Vue 3](https://v3.vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Soketi Websocket Server](https://docs.soketi.app/)
- [Pusher JS](https://github.com/pusher/pusher-js)
- [anime.js](https://animejs.com/)
- [party.js](https://party.js.org/)
- [animate.css](https://animate.style/)
- [Eva Icons](https://akveo.github.io/eva-icons/#/)

## Development Environment

To run in development mode, copy `.env.dev.example` to `.env` and configure the environment variables.

You can now run the frontend in development mode:

```bash
npm run dev
```

All games rely on a running instance of the Soketi Websocket Server:

```bash
docker run -p 6001:6001 --env-file .env quay.io/soketi/soketi:1.5-16-debian
```

## Production Deployment

To build the frontend:

```bash
npm run build
```

The built frontend in the `dist` folder can now be deployed as a static webpage, for example via
[GitHub Pages](https://pages.github.com) through [GitHub Actions](https://github.com/marketplace/actions/deploy-to-github-pages).

The Soketi Websocket Server can be deployed on any VPS or cloud provider via Docker. You can use the following
command after setting up your `.env` file:

```bash
  docker run -d -p 6001:6001 --restart unless-stopped --env-file .env quay.io/soketi/soketi:1.5-16-distroless
```

If you need a reverse proxy, use Nginx with the following configuration. Don't forget to get a free SSL certificate from
Let's Encrypt!

```
server {
  listen 80;
  listen [::]:80;
  server_name websocket.plapper.ch;

  location /app/ {
    proxy_pass http://127.0.0.1:6001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

