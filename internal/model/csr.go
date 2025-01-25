package model

type CSRRequest struct {
	CommonName         string   `json:"commonName"`
	Organization       string   `json:"organization"`
	OrganizationalUnit string   `json:"organizationalUnit"`
	Country            string   `json:"country"`
	State              string   `json:"state"`
	Locality           string   `json:"locality"`
	EmailAddress       string   `json:"emailAddress"`
	KeyType            string   `json:"keyType"`
	KeySize            int      `json:"keySize"`
	SignatureAlgorithm string   `json:"signatureAlgorithm"`
	DNSNames           []string `json:"dnsNames"`
	IPAddresses        []string `json:"ipAddresses"`
}

type CSRResponse struct {
	CSR        string `json:"csr"`
	PrivateKey string `json:"privateKey"`
	Error      string `json:"error,omitempty"`
}
