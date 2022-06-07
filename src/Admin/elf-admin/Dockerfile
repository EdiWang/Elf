FROM node:16.15-alpine as build
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist/elf-admin /usr/share/nginx/html
EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
# docker run -p 80:80 \
# --env ELF_API_BASE_URL="<URL>" \
# --env CLIENT_ID="<GUID>" \
# --env TENANT_ID="<GUID>" \ 
# --env APPLICATION_ID_URI="<URI>" \
# --env APPLICATION_INSIGHT_KEY="<GUID>" \
# ediwang/elf-admin
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]