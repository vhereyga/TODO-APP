FROM oven/bun:1-slim AS base
WORKDIR /app

# Copy dependency files
COPY package.json bun.lock ./
COPY prisma ./prisma/

# Install dependencies and generate Prisma Client
RUN bun install --frozen-lockfile
RUN bunx prisma generate

# Copy source files
COPY . .

# Expose port
EXPOSE 3000

# Push schema to database and start Elysia server
CMD ["sh", "-c", "bunx prisma db push && bun src/index.ts"]
