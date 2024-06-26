FROM --platform=linux/amd64 node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install app dependencies
RUN yarn install

# Install OpenSSL
RUN apt-get update && apt install -y openssl

# prisma global
RUN npm i -g prisma

# run migration
RUN npx prisma generate

EXPOSE 3344
EXPOSE 5556

CMD [ "yarn", "dev" ]