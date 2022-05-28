FROM node:16.13.2 as todo-builder
RUN mkdir -p /home/node/todo/node_modules && chown -R cccuong:cccuong /home/node/todo
WORKDIR /home/node/todo
COPY package*.json .
COPY tsconfig*.json .
RUN npm config set unsafe-perm true
RUN yarn add -g typescript
RUN yarn add -g ts-node
USER cccuong
RUN yarn install
COPY --chown=cccuong:cccuong . .
RUN yarn build

FROM node:16.13.2 
RUN mkdir -p /home/node/todo/node_modules && chown -R cccuong:cccuong /home/node/todo
WORKDIR /home/node/todo
COPY package*.json
RUN yarn install --only=production
USER cccuong

RUN yarn install --production
