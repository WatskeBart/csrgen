package service

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"fmt"
	"net"

	"github.com/yourusername/csrgen/internal/model"
)

type CSRService interface {
	GenerateCSR(req model.CSRRequest) (model.CSRResponse, error)
}

type csrService struct{}

func NewCSRService() CSRService {
	return &csrService{}
}

func (s *csrService) GenerateCSR(req model.CSRRequest) (model.CSRResponse, error) {
	// Generate private key
	var privateKey interface{}
	var err error

	switch req.KeyType {
	case "RSA":
		privateKey, err = rsa.GenerateKey(rand.Reader, req.KeySize)
	case "ECDSA":
		var curve elliptic.Curve
		switch req.KeySize {
		case 256:
			curve = elliptic.P256()
		case 384:
			curve = elliptic.P384()
		case 521:
			curve = elliptic.P521()
		default:
			return model.CSRResponse{}, fmt.Errorf("invalid ECDSA key size: %d", req.KeySize)
		}
		privateKey, err = ecdsa.GenerateKey(curve, rand.Reader)
	default:
		return model.CSRResponse{}, fmt.Errorf("invalid key type: %s", req.KeyType)
	}

	if err != nil {
		return model.CSRResponse{}, fmt.Errorf("failed to generate private key: %w", err)
	}

	// Parse IP addresses
	var ipAddresses []net.IP
	for _, ip := range req.IPAddresses {
		if parsedIP := net.ParseIP(ip); parsedIP != nil {
			ipAddresses = append(ipAddresses, parsedIP)
		} else {
			return model.CSRResponse{}, fmt.Errorf("invalid IP address: %s", ip)
		}
	}

	// Set signature algorithm
	var sigAlgo x509.SignatureAlgorithm
	switch req.SignatureAlgorithm {
	case "SHA256WithRSA":
		sigAlgo = x509.SHA256WithRSA
	case "SHA384WithRSA":
		sigAlgo = x509.SHA384WithRSA
	case "SHA512WithRSA":
		sigAlgo = x509.SHA512WithRSA
	case "ECDSAWithSHA256":
		sigAlgo = x509.ECDSAWithSHA256
	case "ECDSAWithSHA384":
		sigAlgo = x509.ECDSAWithSHA384
	case "ECDSAWithSHA512":
		sigAlgo = x509.ECDSAWithSHA512
	default:
		return model.CSRResponse{}, fmt.Errorf("invalid signature algorithm: %s", req.SignatureAlgorithm)
	}

	// Create CSR template
	template := &x509.CertificateRequest{
		Subject: pkix.Name{
			CommonName:         req.CommonName,
			Organization:       []string{req.Organization},
			OrganizationalUnit: []string{req.OrganizationalUnit},
			Country:            []string{req.Country},
			Province:           []string{req.State},
			Locality:           []string{req.Locality},
		},
		SignatureAlgorithm: sigAlgo,
		DNSNames:           req.DNSNames,
		IPAddresses:        ipAddresses,
		EmailAddresses:     []string{req.EmailAddress},
	}

	// Generate CSR
	csrBytes, err := x509.CreateCertificateRequest(rand.Reader, template, privateKey)
	if err != nil {
		return model.CSRResponse{}, fmt.Errorf("failed to create CSR: %w", err)
	}

	// Encode CSR to PEM
	csrPEM := pem.EncodeToMemory(&pem.Block{
		Type:  "CERTIFICATE REQUEST",
		Bytes: csrBytes,
	})

	// Encode private key to PEM
	var privateKeyBytes []byte
	var privateKeyType string

	switch k := privateKey.(type) {
	case *rsa.PrivateKey:
		privateKeyBytes = x509.MarshalPKCS1PrivateKey(k)
		privateKeyType = "RSA PRIVATE KEY"
	case *ecdsa.PrivateKey:
		privateKeyBytes, err = x509.MarshalECPrivateKey(k)
		if err != nil {
			return model.CSRResponse{}, fmt.Errorf("failed to encode private key: %w", err)
		}
		privateKeyType = "EC PRIVATE KEY"
	}

	privateKeyPEM := pem.EncodeToMemory(&pem.Block{
		Type:  privateKeyType,
		Bytes: privateKeyBytes,
	})

	return model.CSRResponse{
		CSR:        string(csrPEM),
		PrivateKey: string(privateKeyPEM),
	}, nil
}
