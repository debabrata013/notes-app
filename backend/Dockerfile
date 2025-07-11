From node:20-alpine as base 
Workdir /app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 5000

ENV JWT_SECRET=op_secretkey
ENV PORT=5000
ENV DB_HOST=localhost
ENV DB_USER=root
ENV DB_PASSWORD=root
ENV DB_NAME=notesdb
ENV DB_PORT=3306
ENV GEMINI_API_KEY=AIzaSyCXIN8mpvGqbeE8_h2I8tMtLAfOm-uZRL0
CMD ["npm", "start"]