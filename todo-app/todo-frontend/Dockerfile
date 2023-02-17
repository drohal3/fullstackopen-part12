# The first FROM is now a stage called build-stage
FROM node:16 AS base

WORKDIR /usr/src/app

COPY . .

RUN npm instal

# backend URL
ENV REACT_APP_BACKEND_URL=http://127.0.0.1:3000/

RUN npm run build

FROM base as test

COPY . .

RUN CI=true npm run test

# This is a new stage, everything before this is gone, except the files we want to COPY
FROM nginx:1.20-alpine

# COPY the directory build from build-stage to /usr/share/nginx/html
# The target location here was found from the docker hub page
COPY --from=test /usr/src/app/build /usr/share/nginx/html
# build copied from test to force docker to not skip the stage and run the tests