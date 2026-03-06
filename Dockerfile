FROM oven/bun:1.3.10 AS build

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY tsconfig.json ./
COPY ./src ./src

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--sourcemap \
	--external pino-opentelemetry-transport \
	--external pino-pretty \
	--outfile server \
	src/index.ts

FROM oven/bun:1.3.10-slim AS external-deps

WORKDIR /app

RUN echo '{"dependencies":{"pino-opentelemetry-transport":"*","pino-pretty":"*"}}' > package.json

RUN bun install --production

FROM gcr.io/distroless/cc AS runtime

WORKDIR /app

COPY --from=build /app/server server
COPY --from=external-deps /app/node_modules node_modules

ENV NODE_ENV=production

EXPOSE 3333

CMD ["./server"]
