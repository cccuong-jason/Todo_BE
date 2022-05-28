FROM node:16.13.2
RUN useradd -m -d /home/cccuong cccuong
RUN id -u cccuong | awk '{print $1+1}' | xargs -I{} usermod -u {} cccuong
RUN mkdir -p /home/cccuong/todo/node_modules && chown -R cccuong:cccuong /home/cccuong/todo
WORKDIR /home/cccuong/todo
COPY package*.json .
COPY tsconfig*.json .
RUN npm config set unsafe-perm true
USER cccuong
RUN yarn install && yarn cache clean
ENV PATH=/home/cccuong/todo/node_modules/.bin:$PATH
COPY --chown=cccuong:cccuong . .
RUN ls
EXPOSE 8000
CMD ["yarn", "dev"]
