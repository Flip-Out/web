ARG COMPILE_IMAGE="node:20"
ARG RUN_IMAGE="nginx:1.27-alpine-slim"
ARG APP_ENV=XXXXXXXX
ARG TERRAFORM_VERSION=1.9.7
ARG INFRA_GPG_KEY

FROM ubuntu:24.04 AS config
ARG TERRAFORM_VERSION
ARG APP_ENV
ARG INFRA_GPG_KEY
COPY .devops/terraform/app-config /app
WORKDIR /app
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    gnupg2 \
  && rm -rf /var/lib/apt/lists/*

RUN wget --quiet https://releases.hashicorp.com/terraform/$TERRAFORM_VERSION/terraform_${TERRAFORM_VERSION}_linux_amd64.zip \
  && unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip \
  && mv terraform /usr/bin \
  && rm terraform_${TERRAFORM_VERSION}_linux_amd64.zip \
  && echo ${INFRA_GPG_KEY} | base64 -d -w 0 | gpg --import \
  && terraform init \
  && terraform apply -var "deploy_env=${APP_ENV}" -auto-approve -no-color

# -----------------------------
FROM ${COMPILE_IMAGE} AS compile
ARG COMPILE_IMAGE
ARG APP_ENV
COPY . /app
COPY --from=config /app/.env /app/

WORKDIR /app
RUN yarn install && \
    yarn run build

# -----------------------------
FROM ${RUN_IMAGE}
ARG RUN_IMAGE
COPY --from=compile /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY .devops/docker/nginx.conf /etc/nginx/conf.d
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

