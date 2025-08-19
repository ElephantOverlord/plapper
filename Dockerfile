FROM public.ecr.aws/docker/library/node:22-alpine AS docker-plapper-node

COPY . /opt/plapper
WORKDIR /opt/plapper

RUN npm ci
RUN npm run build


FROM public.ecr.aws/docker/library/nginx:stable-alpine AS docker-plapper-nginx

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=docker-plapper-node /opt/plapper/dist /opt/plapper
