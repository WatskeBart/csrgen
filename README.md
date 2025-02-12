# CSR Generator

A web-based Certificate Signing Request (CSR) generator written in Go, featuring an intuitive interface for creating CSRs with advanced cryptographic options.

## Features

- Generate CSRs with RSA or ECDSA keys
- Support for multiple key sizes (RSA: 2048-4096, ECDSA: P-256/384/521)
- Various signature algorithms (SHA256/384/512 with RSA/ECDSA)
- Various key usage options
- Multi-language support (English, Dutch)
- Dark/Light theme
- Basic and Advanced modes
- Support for SAN (Subject Alternative Names)
  - Multiple DNS names
  - Multiple IP addresses
- Copy-to-clipboard functionality
- Mobile-responsive design

## Requirements

- Go 1.22 or higher

## Installation

```bash
git clone https://github.com/WatskeBart/csrgen.git
cd csrgen
go mod download
```

## Quick Start

1. Start the server:

```bash
go run csrgen.go
```

1. Open your browser and navigate to [http://localhost:8080](http://localhost:8080)

## Build binary

>❗A Go binary by default is only built for the OS and architecture of the machine doing the compilation

```bash
go build -o csrgen csrgen.go
```

The `/web` folder is still needed with the built binary.

## Build container image

>Pick a image builder you like. `docker build` or `podman build` work as well.

```bash
buildah build -f Containerfile -t csrgen:mybuild .
```

## Usage

1. Fill in the required certificate information:
   - Common Name (domain name)
   - Organization details
   - Location information
   - Contact email

2. Optional: Toggle Advanced mode for additional settings:
   - Key type selection (RSA/ECDSA)
   - Key size configuration
   - Signature algorithm choice
   - Additional DNS names
   - IP addresses
   - Key usage or extended key usage

3. Click "Generate CSR" to create your Certificate Signing Request

4. Copy the generated CSR and private key

## Security Notes

- Private keys are generated locally in your browser
- No data is stored on the server
- Always keep your private key secure and confidential

## License

[BSD 3-Clause License](LICENSE)

## Screenshots

See [screenshots directory](screenshots/) for interface previews showing advanced mode and theme switching.
