package handler

import (
	"encoding/json"
	"html/template"
	"net/http"

	"github.com/WatskeBart/csrgen/internal/model"
	"github.com/WatskeBart/csrgen/internal/service"
)

type CSRHandler struct {
	service service.CSRService
	tmpl    *template.Template
}

func NewCSRHandler(service service.CSRService) *CSRHandler {
	tmpl := template.Must(template.ParseGlob("web/templates/*.html"))
	return &CSRHandler{
		service: service,
		tmpl:    tmpl,
	}
}

func (h *CSRHandler) HomePage(w http.ResponseWriter, r *http.Request) {
	h.tmpl.ExecuteTemplate(w, "index.html", nil)
}

func (h *CSRHandler) GenerateCSR(w http.ResponseWriter, r *http.Request) {
	var req model.CSRRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		return
	}

	resp, err := h.service.GenerateCSR(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
