# CI API-prod
FROM node:14-alpine
ENV NODE_ENV=production
ENV PORT 9000
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 9000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
