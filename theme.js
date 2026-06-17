// Theme toggle — carregado antes do main.js
const btnTheme = document.getElementById('btn_theme');
const html = document.documentElement;

function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    btnTheme.textContent = theme === 'dark' ? '\uD83C\uDF19' : '\u2600\uFE0F';
    localStorage.setItem('km_theme', theme);
}

const saved = localStorage.getItem('km_theme') || 'dark';
applyTheme(saved);

btnTheme.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
});


const btnAutosave = document.getElementById('btn_autosave');

function applyAutosave(enabled) {
    btnAutosave.classList.toggle('disabled', !enabled);
    btnAutosave.setAttribute('aria-pressed', String(enabled));
    btnAutosave.title = enabled ? 'Salvamento automático ativado' : 'Salvamento automático desativado';
    localStorage.setItem('km_autosave', enabled ? '1' : '0');
}

function isAutosaveEnabled() {
    return localStorage.getItem('km_autosave') === '1'; // desativado por padrão
}

//function isAutosaveEnabled() {
//    return localStorage.getItem('km_autosave') !== '0'; // ativado por padrão
//}

applyAutosave(isAutosaveEnabled());

btnAutosave.addEventListener('click', () => {
    applyAutosave(!isAutosaveEnabled());
});