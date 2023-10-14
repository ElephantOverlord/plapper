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
docker run -p 9110:6001 --env-file .env quay.io/soketi/soketi:1.5-16-debian
```

## Production Deployment

Pull the repository, copy `.env.prod.example` to `.env` and make the necessary adjustments. You can now run the stack:

```bash
docker-compose up -d --build
```

Make sure Nginx is installed on your server and create the necessary reverse proxy:

```
server {
  listen 80;
  listen [::]:80;
  server_name plapper.ch www.plapper.ch;

  if ($host = plapper.ch) {
      return 301 $scheme://www.$host$request_uri;
  }

  location / {
    proxy_pass http://127.0.0.1:9100;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location /app/ {
    proxy_pass http://127.0.0.1:9110;
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


Install [Certbot](https://certbot.eff.org) and get a free SSL certificate from Let's Encrypt. Don't forget to add HTTP2
support to the generated Nginx configuration file:

```bash
sed -i "s/443 ssl/443 ssl http2/" /etc/nginx/sites-available/plapper.ch
```

