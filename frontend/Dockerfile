# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite bakes VITE_* vars into the bundle at build time, not runtime -- accept them as
# build args (see docker-compose.yml's build.args) rather than an .env file, since a
# container's env at `docker run` time is too late to affect an already-built bundle.
ARG VITE_API_BASE_URL=http://localhost:8080/api
ARG VITE_APP_ENV=production
# Default true in this Docker build specifically: the whole point of this 3-container
# stack is to exercise the real go-template-main backend, unlike the plain `npm run dev`
# workflow, which defaults every one of these to false/unset (in-memory mock data, no
# backend required) -- see frontend/.env.example and frontend/src/config/featureFlags.ts.
ARG VITE_AUTH_API_ENABLED=true
ARG VITE_ASSET_API_ENABLED=true
ARG VITE_EMPLOYEE_API_ENABLED=true
ARG VITE_TICKET_API_ENABLED=true
ARG VITE_AUDIT_API_ENABLED=true
ARG VITE_DASHBOARD_API_ENABLED=true
# No ENV re-declaration needed: Docker already exposes ARG values as environment
# variables to every subsequent instruction (including the RUN below) within this same
# build stage, and this stage's environment is discarded anyway -- only /app/dist is
# copied into the runtime image.

RUN npm run build

# Runtime stage
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
