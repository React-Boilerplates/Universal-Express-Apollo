FROM mhart/alpine-node:8@sha256:3b4f810f7184aacea35894aa436e3c47b40df3ff75fca142f4fbf776eacf57bf
WORKDIR /src
ADD . .
RUN npm install
EXPOSE 80
CMD ["npm", "run", "start:prod"]