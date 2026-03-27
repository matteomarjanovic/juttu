FROM node:24-alpine AS js-builder
WORKDIR /app
COPY embed/package.json embed/package-lock.json ./
RUN npm ci
COPY embed/ .
RUN node minify.js

FROM golang:1.25-alpine AS builder
WORKDIR /app
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ .
COPY --from=js-builder /app/juttu-embed.js .
RUN go build -o juttu .

FROM alpine:3.21
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=builder /app/juttu .
EXPOSE 8080
ENTRYPOINT ["./juttu"]
