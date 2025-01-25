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

	// Initialize services
	csrService := service.NewCSRService()

	// Initialize handlers
	csrHandler := handler.NewCSRHandler(csrService)

	// Router setup
	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RealIP)

	// Routes
	r.Get("/", csrHandler.HomePage)
	r.Post("/api/csr", csrHandler.GenerateCSR)

	// Serve static files
	fileServer := http.FileServer(http.Dir("web/static"))
	r.Handle("/static/*", http.StripPrefix("/static/", fileServer))

	// Start server
	log.Printf("Starting server on %s", cfg.ServerAddress)
	log.Fatal(http.ListenAndServe(cfg.ServerAddress, r))
}
