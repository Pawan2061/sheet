FROM node:alpine
WORKDIR /app
RUN npm install -g pnpm
COPY ./package.json .
COPY ./pnpm-lock.yaml .
COPY ./pnpm-workspace.yaml .

COPY ./turbo.json .
COPY  packages ./packages 
COPY apps/ws-server ./apps/ws-server 




RUN pnpm install



RUN pnpm build



EXPOSE 8080
CMD ["pnpm","start:ws"]



