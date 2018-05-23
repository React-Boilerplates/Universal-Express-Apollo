FROM mhart/alpine-node:8@sha256:72344934ed265582ba93d2ca7df98665d6deba1418c4d717d625c6337ea026fb
WORKDIR /src
ADD . .
RUN npm install
EXPOSE 80
CMD ["npm", "run", "start:prod"]