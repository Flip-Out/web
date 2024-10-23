ARG COMPILE_IMAGE="node:20"
ARG RUN_IMAGE="nginx:1.27-alpine-slim"
ARG APP_ENV=XXXXXXXX
# -----------------------------
FROM ${COMPILE_IMAGE} AS compile
ARG COMPILE_IMAGE
ARG APP_ENV
COPY . /app

WORKDIR /app
RUN corepack enable && \
    corepack prepare yarn@stable --activate && \
    yarn install && \
    yarn run build

# -----------------------------
FROM ${RUN_IMAGE}
ARG RUN_IMAGE
COPY --from=compile /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY .devops/docker/nginx.conf /etc/nginx/conf.d
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

