FROM node:24-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

RUN npm install -g pm2

COPY . .

EXPOSE 3000

CMD ["pm2-runtime", "server.js", "--name", "email-sender"]
