const translations = {
    title: "CSR Generator",
    commonName: {
        label: "Common Name",
        subtext: "Fully qualified domain name (e.g., www.example.com)"
    },
    organization: {
        label: "Organization",
        subtext: "Legal name of your organization"
    },
    organizationalUnit: {
        label: "Organizational Unit",
        subtext: "Department or division name (optional)"
    },
    country: {
        label: "Country (2 letters)",
        subtext: "Two-letter country code (e.g., US, GB)"
    },
    state: {
        label: "State",
        subtext: "Full state or province name"
    },
    locality: {
        label: "Locality",
        subtext: "City or town name"
    },
    emailAddress: {
        label: "Email Address",
        subtext: "Administrative contact email"
    },
    keyType: {
        label: "Key Type",
        subtext: "Choose encryption algorithm type"
    },
    keySize: {
        label: "Key Size",
        subtext: "Encryption key length"
    },
    signatureAlgorithm: {
        label: "Signature Algorithm",
        subtext: "Certificate signing algorithm"
    },
    dnsNames: {
        label: "DNS Names",
        subtext: "Additional domain names (one per line)"
    },
    ipAddresses: {
        label: "IP Addresses",
        subtext: "Additional IP addresses (one per line)"
    },
    buttons: {
        generate: "Generate CSR",
        darkMode: "Dark Mode",
        advanced: "Advanced",
        copy: "Copy",
        download: "Download"
    },
    results: {
        generatedCSR: "Generated CSR:",
        privateKey: "Private Key:"
    },
    keyUsage: {
        label: "Key Usage",
        subtext: "Basic key usage constraints"
    },
    extendedKeyUsage: {
        label: "Extended Key Usage",
        subtext: "Specific purpose constraints"
    },
    keyUsageOptions: {
        digitalSignature: "Digital Signature",
        nonRepudiation: "Non-Repudiation",
        keyEncipherment: "Key Encipherment",
        dataEncipherment: "Data Encipherment",
        keyAgreement: "Key Agreement",
        certSign: "Certificate Sign",
        crlSign: "CRL Sign",
        encipherOnly: "Encipher Only",
        decipherOnly: "Decipher Only"
    },
    extendedKeyUsageOptions: {
        serverAuth: "Server Authentication",
        clientAuth: "Client Authentication",
        codeSigning: "Code Signing",
        emailProtection: "Email Protection",
        timeStamping: "Time Stamping",
        OCSPSigning: "OCSP Signing"
    },
    keyUsageTitle: "Key Usage",
    extKeyUsageTitle: "Extended Key Usage",
};