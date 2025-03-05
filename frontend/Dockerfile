# frontend/Dockerfile
FROM node:22

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

COPY frontend/.env.local .env.local

COPY frontend/ ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
