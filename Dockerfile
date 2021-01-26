FROM node

WORKDIR /app

COPY package*.json ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 8080

CMD ["yarn", "start", "--", "-a", "0.0.0.0"]
