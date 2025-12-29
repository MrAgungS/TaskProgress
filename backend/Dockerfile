FROM node:20-alpine

WORKDIR /src

COPY package*.json ./
RUN npm install

COPY . .

RUN apk add --no-cache netcat-openbsd

COPY wait-for-mysql.sh /wait-for-mysql.sh

EXPOSE 5000

CMD [ "npm", "run", "start" ]