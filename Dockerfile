FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm rebuild
COPY . .

EXPOSE 4200

CMD ["npm", "start"] 