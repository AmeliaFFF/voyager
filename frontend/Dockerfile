# Development stage.
FROM node:24-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN chown -R node:node /app

ENV NODE_ENV=development

ARG VITE_API_BASE_URL=http://localhost:3000
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

EXPOSE 5173

USER node

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


# Test stage.
FROM development AS test

ENV NODE_ENV=test

CMD ["npm", "run", "test:run"]


# Build stage.
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_API_BASE_URL=http://localhost:3000
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build


# Production stage.
FROM nginx:alpine AS production

# Configure Nginx to support React Router client-side routes.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the production build from the build stage.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]