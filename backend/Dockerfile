FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN chmod +x node_modules/.bin/ts-node

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"] 