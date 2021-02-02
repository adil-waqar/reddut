FROM node:15

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

ARG NEXT_PUBLIC_GRAPHQL_SERVER_URL
ENV NEXT_PUBLIC_GRAPHQL_SERVER_URL=${NEXT_PUBLIC_GRAPHQL_SERVER_URL}

COPY . .
RUN yarn build

ENV NODE_ENV production

EXPOSE 3000

CMD [ "yarn", "start" ]