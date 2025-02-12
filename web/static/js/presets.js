const presets = {
    webserver: {
        commonName: "server.example.com",
        organization: "Example Org",
        organizationalUnit: "IT Department",
        country: "US",
        state: "California",
        locality: "San Francisco",
        emailAddress: "admin@example.com",
        keyType: "ECDSA",
        keySize: "256",
        signatureAlgorithm: "ECDSAWithSHA256",
        keyUsage: ["digitalSignature", "keyEncipherment"],
        extendedKeyUsage: ["serverAuth"]
    },
    codesigning: {
        commonName: "code.example.com",
        organization: "Example Software",
        organizationalUnit: "Development",
        country: "US",
        state: "Washington",
        locality: "Seattle",
        emailAddress: "dev@example.com",
        keyType: "RSA",
        keySize: "4096",
        signatureAlgorithm: "SHA512WithRSA",
        keyUsage: ["digitalSignature"],
        extendedKeyUsage: ["codeSigning"]
    },
    email: {
        commonName: "mail.example.com",
        organization: "Example Mail",
        organizationalUnit: "Email Security",
        country: "US",
        state: "New York",
        locality: "New York",
        emailAddress: "security@example.com",
        keyType: "RSA",
        keySize: "2048",
        signatureAlgorithm: "SHA256WithRSA",
        keyUsage: ["digitalSignature", "keyEncipherment"],
        extendedKeyUsage: ["emailProtection"]
    }
};