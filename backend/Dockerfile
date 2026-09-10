# Development stage.
FROM node:24-alpine AS development

# Put the backend application into its own directory.
WORKDIR /app

# Copy package files first so dependency installation can be cached.
COPY package*.json ./

# Install all dependencies required for development.
RUN npm ci

# Copy the backend project files required for development and testing.
COPY . .

ENV NODE_ENV=development

ARG PORT=3000
ENV PORT=${PORT}

EXPOSE ${PORT}

USER node

CMD ["npm", "run", "dev:watch"]


# Test stage.
FROM development AS test

ENV NODE_ENV=test

CMD ["node", "./node_modules/jest/bin/jest.js", "--runInBand"]


# Production stage.
FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy package files and install production dependencies only.
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the application source code.
COPY src ./src

ARG PORT=3000
ENV PORT=${PORT}

EXPOSE ${PORT}

USER node

CMD ["npm", "start"]