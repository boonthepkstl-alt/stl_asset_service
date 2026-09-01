# Build stage
FROM golang:1.23-alpine AS build

WORKDIR /app

# Cache module downloads separately from source changes
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /out/server .

# Runtime stage
FROM alpine:3.20

RUN apk add --no-cache ca-certificates

WORKDIR /app
COPY --from=build /out/server ./server

EXPOSE 8080

ENTRYPOINT ["./server"]
