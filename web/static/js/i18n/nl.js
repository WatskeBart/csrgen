const translations = {
    title: "CSR Generator",
    commonName: {
        label: "Server naam",
        subtext: "Volledige domeinnaam (bijv. www.example.com)"
    },
    organization: {
        label: "Organisatie",
        subtext: "Juridische naam van uw organisatie"
    },
    organizationalUnit: {
        label: "Organisatie-eenheid", 
        subtext: "Afdeling of divisie naam (optioneel)"
    },
    country: {
        label: "Landcode (2 letters)",
        subtext: "Twee-letterige landcode (bijv. NL, BE)"
    },
    state: {
        label: "Provincie",
        subtext: "Volledige naam van de provincie"
    },
    locality: {
        label: "Plaats",
        subtext: "Stad of gemeentenaam"
    },
    emailAddress: {
        label: "E-mailadres",
        subtext: "Administratief contact e-mailadres"
    },
    keyType: {
        label: "Sleuteltype",
        subtext: "Kies encryptie algoritme type"
    },
    keySize: {
        label: "Sleutelgrootte",
        subtext: "Encryptie sleutellengte"
    },
    signatureAlgorithm: {
        label: "Onderteken algoritme",
        subtext: "Certificaat handtekening algoritme"
    },
    dnsNames: {
        label: "DNS Namen",
        subtext: "Extra domeinnamen (één per regel)"
    },
    ipAddresses: {
        label: "IP-adressen",
        subtext: "Extra IP-adressen (één per regel)"
    },
    buttons: {
        generate: "Genereer CSR",
        darkMode: "Donkere modus",
        advanced: "Geavanceerd",
        copy: "Kopieer",
        download: "Downloaden"
    },
    results: {
        generatedCSR: "Gegenereerde CSR:",
        privateKey: "Privé Sleutel:"
    },
    keyUsage: {
        label: "Sleutelgebruik",
        subtext: "Basis sleutelgebruik beperkingen"
    },
    extendedKeyUsage: {
        label: "Uitgebreid Sleutelgebruik",
        subtext: "Specifieke doel beperkingen"
    },
    keyUsageOptions: {
        digitalSignature: "Digitale Handtekening",
        nonRepudiation: "Niet-Weerlegbaarheid",
        keyEncipherment: "Sleutelvercijfering",
        dataEncipherment: "Gegevensvercijfering",
        keyAgreement: "Sleutelovereenkomst",
        certSign: "Certificaat Ondertekening",
        crlSign: "CRL Ondertekening",
        encipherOnly: "Alleen Versleutelen",
        decipherOnly: "Alleen Ontsleutelen"
    },
    extendedKeyUsageOptions: {
        serverAuth: "Server Authenticatie",
        clientAuth: "Client Authenticatie",
        codeSigning: "Code Ondertekening",
        emailProtection: "E-mail Beveiliging",
        timeStamping: "Tijdstempeling",
        OCSPSigning: "OCSP Ondertekening"
    },
    keyUsageTitle: "Sleutelgebruik",
    extKeyUsageTitle: "Uitgebreid Sleutelgebruik",
};