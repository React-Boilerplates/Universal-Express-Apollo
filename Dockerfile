FROM mhart/alpine-node:8@sha256:6991164f63061cc4c3dea361982e64d7dc2d0057f36b123e78262c7729c5c4ec
WORKDIR /src
ADD . .
RUN npm install
EXPOSE 80
CMD ["npm", "run", "start:prod"]