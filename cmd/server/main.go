package main

import (
	"log"
	"net/http"

	"github.com/WatskeBart/csrgen/internal/config"
	"github.com/WatskeBart/csrgen/internal/handler"
	"github.com/WatskeBart/csrgen/internal/service"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	cfg := config.Load()

	csrService := service.NewCSRService()

	csrHandler := handler.NewCSRHandler(csrService)

	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RealIP)

	r.Get("/", csrHandler.HomePage)
	r.Post("/api/csr", csrHandler.GenerateCSR)

	fileServer := http.FileServer(http.Dir("web/static"))
	r.Handle("/static/*", http.StripPrefix("/static/", fileServer))

	log.Printf("Starting server on %s", cfg.ServerAddress)
	log.Fatal(http.ListenAndServe(cfg.ServerAddress, r))
}
