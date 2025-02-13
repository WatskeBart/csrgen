document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const advancedToggle = document.getElementById('advanced-toggle');
    const advancedFields = document.querySelectorAll('.advanced-field');
    const presetSelect = document.getElementById('presetSelect');
    const keyTypeSelect = document.querySelector('select[name="keyType"]');
    const keySizeSelect = document.querySelector('select[name="keySize"]');
    const signatureAlgorithmSelect = document.querySelector('select[name="signatureAlgorithm"]');
    const flags = document.querySelectorAll('.flag-icon');

    // Language handling
    flags.forEach(flag => {
        flag.addEventListener('click', function() {
            const lang = this.dataset.lang;
            localStorage.setItem('lang', lang);
            loadTranslations(lang);
            flags.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Set active flag on load
    const currentLang = localStorage.getItem('lang') || 'en';
    document.querySelector(`[data-lang="${currentLang}"]`).classList.add('active');
    loadTranslations(currentLang);

    keyTypeSelect.addEventListener('change', function() {
        const selectedKeyType = this.value;
        keySizeSelect.innerHTML = '';
        signatureAlgorithmSelect.innerHTML = '';

        if (selectedKeyType === 'RSA') {
            const rsaKeySizes = [
                { value: '2048', text: '2048-bit' },
                { value: '3072', text: '3072-bit' },
                { value: '4096', text: '4096-bit' }
            ];
            
            rsaKeySizes.forEach(size => {
                const option = new Option(size.text, size.value);
                keySizeSelect.add(option);
            });
            
            const rsaSignatureAlgorithms = [
                { value: 'SHA256WithRSA', text: 'SHA256' },
                { value: 'SHA384WithRSA', text: 'SHA384' },
                { value: 'SHA512WithRSA', text: 'SHA512' }
            ];
            
            rsaSignatureAlgorithms.forEach(algo => {
                const option = new Option(algo.text, algo.value);
                signatureAlgorithmSelect.add(option);
            });
        } else if (selectedKeyType === 'ECDSA') {
            const ecdsaKeySizes = [
                { value: '256', text: 'P-256' },
                { value: '384', text: 'P-384' },
                { value: '521', text: 'P-521' }
            ];
            
            ecdsaKeySizes.forEach(size => {
                const option = new Option(size.text, size.value);
                keySizeSelect.add(option);
            });
            
            const ecdsaSignatureAlgorithms = [
                { value: 'ECDSAWithSHA256', text: 'SHA256' },
                { value: 'ECDSAWithSHA384', text: 'SHA384' },
                { value: 'ECDSAWithSHA512', text: 'SHA512' }
            ];
            
            ecdsaSignatureAlgorithms.forEach(algo => {
                const option = new Option(algo.text, algo.value);
                signatureAlgorithmSelect.add(option);
            });
        }
    });

    presetSelect.addEventListener('change', function() {
        const preset = presets[this.value];
        if (!preset) return;

        advancedToggle.checked = true;
        advancedFields.forEach(field => field.style.display = 'block');

        Object.entries(preset).forEach(([key, value]) => {
            if (key === 'keyUsage' || key === 'extendedKeyUsage') {
                document.querySelectorAll(`input[name="${key}"]`).forEach(checkbox => {
                    checkbox.checked = false;
                });
                value.forEach(usage => {
                    const checkbox = document.querySelector(`input[name="${key}"][value="${usage}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            } else {
                const element = document.querySelector(`[name="${key}"]`);
                if (element) element.value = value;
            }
        });

        keyTypeSelect.dispatchEvent(new Event('change'));
    });
    
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
            ipAddresses: formData.get('ipAddresses').split('\n').filter(x => x.trim()),
            keyUsage: Array.from(document.querySelectorAll('input[name="keyUsage"]:checked')).map(cb => cb.value),
            extendedKeyUsage: Array.from(document.querySelectorAll('input[name="extendedKeyUsage"]:checked')).map(cb => cb.value),
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

async function loadTranslations(lang) {
    try {
        const response = await fetch(`/static/js/i18n/${lang}.js`);
        const text = await response.text();
        const translations = (new Function(text + '; return translations;'))();
        translatePage(translations);
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

function translatePage(translations) {
    document.querySelector('h1').textContent = translations.title;
    
    Object.entries(translations).forEach(([key, value]) => {
        if (typeof value === 'object') {
            const element = document.querySelector(`[data-i18n="${key}"]`);
            if (element) {
                const label = element.querySelector('label');
                const subtext = element.querySelector('.subtext');
                if (label) label.childNodes[0].textContent = value.label + ':';
                if (subtext) subtext.textContent = value.subtext;
            }
        }
    });
    
    const resultDiv = document.getElementById('result');
    if (resultDiv) {
        const headings = resultDiv.getElementsByTagName('h2');
        headings[0].textContent = translations.results.generatedCSR;
        headings[1].textContent = translations.results.privateKey;
    }

    const keyUsageLabels = document.querySelector('[data-i18n="keyUsageOptions"]').querySelectorAll('label');
    const extKeyUsageLabels = document.querySelector('[data-i18n="extendedKeyUsageOptions"]').querySelectorAll('label');
    
    document.querySelectorAll('h3[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
    
    keyUsageLabels.forEach(label => {
        const input = label.querySelector('input').cloneNode(true);
        if (translations.keyUsageOptions[input.value]) {
            label.textContent = translations.keyUsageOptions[input.value];
            label.insertBefore(input, label.firstChild);
        }
    });
    
    extKeyUsageLabels.forEach(label => {
        const input = label.querySelector('input').cloneNode(true);
        if (translations.extendedKeyUsageOptions[input.value]) {
            label.textContent = translations.extendedKeyUsageOptions[input.value];
            label.insertBefore(input, label.firstChild);
        }
    });

    document.querySelector('[data-i18n="generate"]').textContent = translations.buttons.generate;
    document.querySelector('[data-i18n="darkMode"]').textContent = translations.buttons.darkMode;
    document.querySelector('[data-i18n="advanced"]').textContent = translations.buttons.advanced;
    document.querySelectorAll('[data-i18n="copy"]').forEach(element => {
        element.textContent = translations.buttons.copy;
    });
    document.querySelectorAll('[data-i18n="download"]').forEach(element => {
        element.textContent = translations.buttons.download;
    });
}

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        const button = document.querySelector(`#${elementId}`).nextElementSibling;
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.innerHTML = '<span class="copy-icon">📋</span> Copy';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

function downloadFile(elementId, filename) {
    const text = document.getElementById(elementId).textContent;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}