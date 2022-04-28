FROM node:16.14.2-alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist/elf-admin /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
#CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]