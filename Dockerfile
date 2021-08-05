from node:lts-alpine

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN yarn build

CMD ["node", "dist/main.js"]
