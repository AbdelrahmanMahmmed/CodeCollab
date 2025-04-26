FROM node:20

WORKDIR /codeCollab

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start" , 'dev']