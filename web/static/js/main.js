document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const advancedToggle = document.getElementById('advanced-toggle');
    const advancedFields = document.querySelectorAll('.advanced-field');
    const langSelect = document.getElementById('langSelect');
    
    const currentLang = localStorage.getItem('lang') || 'en';
    langSelect.value = currentLang;
    loadTranslations(currentLang);

    langSelect.addEventListener('change', function(event) {
        const lang = event.target.value;
        localStorage.setItem('lang', lang);
        loadTranslations(lang);
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

document.addEventListener('DOMContentLoaded', function() {
    const currentLang = localStorage.getItem('lang') || 'en';
    loadTranslations(currentLang);
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

    document.querySelector('[data-i18n="generate"]').textContent = translations.buttons.generate;
    document.querySelector('[data-i18n="darkMode"]').textContent = translations.buttons.darkMode;
    document.querySelector('[data-i18n="advanced"]').textContent = translations.buttons.advanced;
    document.querySelectorAll('[data-i18n="copy"]').forEach(element => {
        element.textContent = translations.buttons.copy;
    });
}

function handleLanguageChange(event) {
    const lang = event.target.value;
    localStorage.setItem('lang', lang);
    loadTranslations(lang);
}

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        const button = document.querySelector(`#${elementId}`).previousElementSibling.querySelector('.copy-button');
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