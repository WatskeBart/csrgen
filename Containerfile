FROM golang:1.23.5-alpine3.21 as builder
WORKDIR /go/src
COPY . /go/src
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o /go/bin/csrgen cmd/server/main.go
RUN chmod +x /go/bin/csrgen

FROM scratch
COPY --from=builder /go/src/web/ /web
COPY --from=builder /go/bin/csrgen /csrgen
EXPOSE 8080
CMD ["/csrgen"]