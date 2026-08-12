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

Install dependencies:

```bash
npm install
```

You can now run the frontend in development mode:

```bash
npm run dev
```

All games rely on a running instance of the Soketi Websocket Server:

```bash
docker run -p 9110:6001 --env-file .env quay.io/soketi/soketi:1.6-16-debian
```

## Production Deployment

Pull the repository, copy `.env.prod.example` to `.env` and make the necessary adjustments. You can now run the stack:

```bash
docker compose up -d --build
```

The container only ever listens on `127.0.0.1` at the port you mapped in
`compose.yaml` — it's never reachable from outside the VPS directly. The host's own Caddy (already installed and
managing SSL certificates on the VPS, outside of Docker) is what actually receives public traffic and forwards it
inward.

Add a block to your `/etc/caddy/Caddyfile`:

```caddy
plapper.ch {
    reverse_proxy 127.0.0.1:9100
}
```

Replace `plapper.ch` with your actual domain, and `9100` with whichever host port you mapped to the container
in `compose.yaml`. Make sure DNS for your domain already resolves to this VPS, and that port 80 is open in your
firewall — Caddy needs it briefly to complete the Let's Encrypt challenge, even though it'll redirect everything to 443
afterward.
