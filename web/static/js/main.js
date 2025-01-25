document.getElementById('csrForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        commonName: formData.get('commonName'),
        organization: formData.get('organization'),
        organizationalUnit: formData.get('organizationalUnit'),
        country: formData.get('country'),
        state: formData.get('state'),
        locality: formData.get('locality'),
        emailAddress: formData.get('emailAddress'),
        keyType: formData.get('keyType'),
        keySize: parseInt(formData.get('keySize')),
        signatureAlgorithm: formData.get('signatureAlgorithm'),
        dnsNames: formData.get('dnsNames').split('\n').filter(x => x.trim()),
        ipAddresses: formData.get('ipAddresses').split('\n').filter(x => x.trim())
    };
    
    try {
        const response = await fetch('/generate-csr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        const result = await response.json();
        if (result.error) {
            alert(result.error);
            return;
        }
        
        document.getElementById('result').style.display = 'block';
        document.getElementById('csrText').textContent = result.csr;
        document.getElementById('privateKeyText').textContent = result.privateKey;
    } catch (error) {
        alert('Error generating CSR: ' + error);
    }
});