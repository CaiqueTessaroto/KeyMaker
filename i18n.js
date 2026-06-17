document.addEventListener('DOMContentLoaded',()=>{
 const t=k=>chrome.i18n.getMessage(k)||k;
 document.querySelector('.app-subtitle').textContent=t('appSubtitle');
 document.getElementById('btn_theme').title=t('toggleTheme');
 document.getElementById('button_eyes').title=t('togglePasswords');
 document.querySelector('.btn-help').title=t('help');
 document.getElementById('password_0').placeholder=t('sitePlaceholder');
 document.getElementById('password_1').placeholder=t('keywordPlaceholder');
 document.getElementById('button_less').textContent=t('removeField');
 document.getElementById('button_more').textContent=t('addField');
 document.getElementById('button_play').textContent=t('generate');
 document.querySelector('.texto_aviso_resultado').textContent=t('result');
 document.getElementById('output').placeholder=t('generatedPassword');
});
