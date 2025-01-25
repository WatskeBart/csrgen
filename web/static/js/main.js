document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const advancedToggle = document.getElementById('advanced-toggle');
    const advancedFields = document.querySelectorAll('.advanced-field');
    
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }
    
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    const advancedVisible = localStorage.getItem('advanced') === 'true';
    if (advancedVisible) {
        advancedFields.forEach(field => field.style.display = 'block');
        advancedToggle.checked = true;
    }

    advancedToggle.addEventListener('change', function() {
        const display = this.checked ? 'block' : 'none';
        advancedFields.forEach(field => field.style.display = display);
        localStorage.setItem('advanced', this.checked);
    });

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
            const response = await fetch('/api/csr', {
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
});