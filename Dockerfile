FROM mhart/alpine-node:8@sha256:ba8cf023012a93729c995ef406bc596ed52cb3498a0fa82282897a0dc727d756
WORKDIR /src
ADD . .
RUN npm install
EXPOSE 80
CMD ["npm", "run", "start:prod"]