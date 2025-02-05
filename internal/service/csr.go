package service

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/asn1"
	"encoding/pem"
	"fmt"
	"net"

	"github.com/WatskeBart/csrgen/internal/model"
)

type CSRService interface {
	GenerateCSR(req model.CSRRequest) (model.CSRResponse, error)
}

type csrService struct{}

func NewCSRService() CSRService {
	return &csrService{}
}
func buildKeyUsageExtensions(keyUsage x509.KeyUsage, extKeyUsage []x509.ExtKeyUsage) []pkix.Extension {
	var exts []pkix.Extension
	if keyUsage != 0 {
		ext := pkix.Extension{
			Id:       []int{2, 5, 29, 15},
			Critical: true,
			Value:    []byte{3, 2, 0, byte(keyUsage)},
		}
		exts = append(exts, ext)
	}

	if len(extKeyUsage) > 0 {
		var extKeyUsageOIDs []asn1.ObjectIdentifier
		for _, usage := range extKeyUsage {
			switch usage {
			case x509.ExtKeyUsageServerAuth:
				extKeyUsageOIDs = append(extKeyUsageOIDs, []int{1, 3, 6, 1, 5, 5, 7, 3, 1})
			case x509.ExtKeyUsageClientAuth:
				extKeyUsageOIDs = append(extKeyUsageOIDs, []int{1, 3, 6, 1, 5, 5, 7, 3, 2})
			case x509.ExtKeyUsageCodeSigning:
				extKeyUsageOIDs = append(extKeyUsageOIDs, []int{1, 3, 6, 1, 5, 5, 7, 3, 3})
			case x509.ExtKeyUsageEmailProtection:
				extKeyUsageOIDs = append(extKeyUsageOIDs, []int{1, 3, 6, 1, 5, 5, 7, 3, 4})
			case x509.ExtKeyUsageTimeStamping:
				extKeyUsageOIDs = append(extKeyUsageOIDs, []int{1, 3, 6, 1, 5, 5, 7, 3, 8})
			case x509.ExtKeyUsageOCSPSigning:
				extKeyUsageOIDs = append(extKeyUsageOIDs, []int{1, 3, 6, 1, 5, 5, 7, 3, 9})
			}
		}

		if len(extKeyUsageOIDs) > 0 {
			extKeyUsageBytes, _ := asn1.Marshal(extKeyUsageOIDs)
			ext := pkix.Extension{
				Id:       []int{2, 5, 29, 37},
				Critical: false,
				Value:    extKeyUsageBytes,
			}
			exts = append(exts, ext)
		}
	}

	return exts
}

func (s *csrService) GenerateCSR(req model.CSRRequest) (model.CSRResponse, error) {
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

	var ipAddresses []net.IP
	for _, ip := range req.IPAddresses {
		if parsedIP := net.ParseIP(ip); parsedIP != nil {
			ipAddresses = append(ipAddresses, parsedIP)
		} else {
			return model.CSRResponse{}, fmt.Errorf("invalid IP address: %s", ip)
		}
	}

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

	var keyUsage x509.KeyUsage
	for _, usage := range req.KeyUsage {
		switch usage {
		case "digitalSignature":
			keyUsage |= x509.KeyUsageDigitalSignature
		case "nonRepudiation":
			keyUsage |= x509.KeyUsageContentCommitment
		case "keyEncipherment":
			keyUsage |= x509.KeyUsageKeyEncipherment
		case "dataEncipherment":
			keyUsage |= x509.KeyUsageDataEncipherment
		case "keyAgreement":
			keyUsage |= x509.KeyUsageKeyAgreement
		case "certSign":
			keyUsage |= x509.KeyUsageCertSign
		case "crlSign":
			keyUsage |= x509.KeyUsageCRLSign
		case "encipherOnly":
			keyUsage |= x509.KeyUsageEncipherOnly
		case "decipherOnly":
			keyUsage |= x509.KeyUsageDecipherOnly
		}
	}

	var extKeyUsage []x509.ExtKeyUsage
	for _, usage := range req.ExtendedKeyUsage {
		switch usage {
		case "serverAuth":
			extKeyUsage = append(extKeyUsage, x509.ExtKeyUsageServerAuth)
		case "clientAuth":
			extKeyUsage = append(extKeyUsage, x509.ExtKeyUsageClientAuth)
		case "codeSigning":
			extKeyUsage = append(extKeyUsage, x509.ExtKeyUsageCodeSigning)
		case "emailProtection":
			extKeyUsage = append(extKeyUsage, x509.ExtKeyUsageEmailProtection)
		case "timeStamping":
			extKeyUsage = append(extKeyUsage, x509.ExtKeyUsageTimeStamping)
		case "OCSPSigning":
			extKeyUsage = append(extKeyUsage, x509.ExtKeyUsageOCSPSigning)
		}
	}

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
		ExtraExtensions:    buildKeyUsageExtensions(keyUsage, extKeyUsage),
	}

	csrBytes, err := x509.CreateCertificateRequest(rand.Reader, template, privateKey)
	if err != nil {
		return model.CSRResponse{}, fmt.Errorf("failed to create CSR: %w", err)
	}

	csrPEM := pem.EncodeToMemory(&pem.Block{
		Type:  "CERTIFICATE REQUEST",
		Bytes: csrBytes,
	})

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
