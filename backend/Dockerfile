FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x node_modules/.bin/tsc
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]