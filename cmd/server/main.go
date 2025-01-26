package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

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
	r := setupRouter(csrHandler)

	srv := &http.Server{
		Addr:    cfg.ServerAddress,
		Handler: r,
	}

	serverErrors := make(chan error, 1)

	go func() {
		log.Printf("Server listening on %s", cfg.ServerAddress)
		serverErrors <- srv.ListenAndServe()
	}()

	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, os.Interrupt, syscall.SIGTERM)

	select {
	case err := <-serverErrors:
		log.Fatalf("Error starting server: %v", err)

	case sig := <-shutdown:
		log.Printf("Start shutdown: %v", sig)

		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		if err := srv.Shutdown(ctx); err != nil {
			log.Printf("Could not stop server gracefully: %v", err)

			if err := srv.Close(); err != nil {
				log.Printf("Could not force close server: %v", err)
			}
		}
	}
}

func setupRouter(csrHandler *handler.CSRHandler) *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RealIP)

	r.Get("/", csrHandler.HomePage)
	r.Post("/api/csr", csrHandler.GenerateCSR)

	fileServer := http.FileServer(http.Dir("web/static"))
	r.Handle("/static/*", http.StripPrefix("/static/", fileServer))

	return r
}
