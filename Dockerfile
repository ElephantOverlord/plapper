FROM node:18 AS docker-plapper-node

COPY . /opt/plapper
WORKDIR /opt/plapper

RUN npm ci
RUN npm run build


FROM httpd:2.4 AS docker-plapper-apache

COPY --from=docker-plapper-node /opt/plapper/dist /opt/plapper

RUN rm -rf /usr/local/apache2/htdocs
RUN ln -s /opt/plapper /usr/local/apache2/htdocs
