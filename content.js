/* KeyMaker — content.js
   Detecta campos de senha, pega o domínio atual como "campo 0",
   aplica o padrão salvo (campos 1..N) e gera a senha na hora.
*/

(function () {
    'use strict';

    const POPUP_ID = 'km-autofill-popup';
    let activeField = null;
    let hideTimer = null;

    // ---------- domínio atual ----------

    function getSitename() {
        try {
            const host = window.location.hostname.toLowerCase();
            const parts = host.split('.');

            if (parts.length <= 2) return parts[0]; // "facebook.com" -> "facebook"

            // TLDs compostos: co.uk, com.br, org.uk, etc.
            // Se o último rótulo é um country-code (2 letras) e o penúltimo
            // é um sufixo genérico curto, o domínio real está 3 posições do fim.
            const secondLevelSuffixes = ['co', 'com', 'org', 'net', 'gov', 'edu', 'ac', 'mil'];
            const last = parts[parts.length - 1];
            const secondLast = parts[parts.length - 2];

            if (last.length === 2 && secondLevelSuffixes.includes(secondLast)) {
                return parts[parts.length - 3]; // "facebook.co.uk" -> "facebook"
            }

            return secondLast; // "pt-br.facebook.com" -> "facebook"
        } catch (e) {
            return '';
        }
    }

    // ---------- storage ----------

    function getPattern(cb) {
        chrome.storage.local.get('km_saved_pattern', (res) => {
            cb(res.km_saved_pattern ? JSON.parse(res.km_saved_pattern) : null);
        });
    }

    // ---------- geração de senha ----------
    // Reproduz exatamente o algoritmo do main.js, mas injeta o
    // domínio atual no lugar do campo 0 (campo "Site / domain").

    function generateFromPattern(pattern, sitename) {
        // Clonar os fields e substituir só o VALOR do campo 0 pelo domínio atual.
        // As checkedStates ficam do jeito que foram salvas — sem remap por
        // tamanho de palavra. O modelo é "1 caixa = 1/N da palavra", e o
        // próprio cálculo de lyrics_size (abaixo) já se adapta a qualquer
        // wordsize novo automaticamente, igual o Gerate() faz.
        const fields = pattern.fields.map((f, i) => {
            if (i === 0) {
                const word = sitename || f.value || '';
                let checkedStates = f.checkedStates;

                // Único ajuste necessário: se sobrarem mais caixas do que letras
                // no novo domínio, trunca do fim (mesma regra do Remove_Checkbox
                // no Gerate() — não pode ter caixa "menor que 1 letra").
                if (checkedStates.length > word.length) {
                    checkedStates = checkedStates.slice(0, word.length);
                }

                return { ...f, value: word, checkedStates };
            }
            return f;
        });

        // Ordenar campos conforme a ordem salva
        const withIdx = fields.map((f, i) => ({ v: parseInt(f.order, 10) - 1, i }));
        withIdx.sort((a, b) => a.v - b.v);
        const sorted = withIdx.map(x => x.i);

        let result = '';

        sorted.forEach(idx => {
            const field = fields[idx];
            const word = field.value || '';
            const checks = field.checkedStates || [];
            const wordsize = word.length;
            if (wordsize === 0 || checks.length === 0) return;

            const amount = checks.length;
            const percentage = (100 / amount) / 100;
            const lyrics_size = wordsize * percentage;

            checks.forEach((checked, i) => {
                if (!checked) return;

                if (lyrics_size === 1) {
                    if (word[i] != null) result += word[i];
                } else {
                    // igual ao Gerate(): Math.floor pra nunca cair em índice fracionário
                    const init = Math.floor(i * lyrics_size);
                    const end = Math.min(Math.floor(init + lyrics_size), wordsize);
                    for (let x = init; x < end; x++) {
                        result += word[x];
                    }
                }
            });
        });

        return result;
    }

    // ---------- popup ----------

    function createPopup() {
        if (document.getElementById(POPUP_ID)) return;

        const popup = document.createElement('div');
        popup.id = POPUP_ID;
        popup.innerHTML = `
            <div class="km-popup-inner">
                <span class="km-logo">🔑 KeyMaker</span>
                <button class="km-btn-fill" id="km-btn-fill">Generate & fill</button>
                <button class="km-btn-close" id="km-btn-close" aria-label="Dismiss">✕</button>
            </div>
        `;
        document.body.appendChild(popup);

        document.getElementById('km-btn-fill').addEventListener('mousedown', (e) => {
            // mousedown antes do blur do campo, evita que o popup suma antes do clique
            e.preventDefault();
        });

        document.getElementById('km-btn-fill').addEventListener('click', () => {
            getPattern((pattern) => {
                if (!pattern || !activeField) return;
                const sitename = getSitename();
                const pwd = generateFromPattern(pattern, sitename);
                if (pwd && activeField) {
                    activeField.value = pwd;
                    activeField.dispatchEvent(new Event('input', { bubbles: true }));
                    activeField.dispatchEvent(new Event('change', { bubbles: true }));
                    activeField.focus();
                }
                hidePopup();
            });
        });

        document.getElementById('km-btn-close').addEventListener('mousedown', (e) => {
            e.preventDefault();
        });

        document.getElementById('km-btn-close').addEventListener('click', () => {
            hidePopup(true);
        });
    }

    function positionPopup(field) {
        const popup = document.getElementById(POPUP_ID);
        if (!popup) return;
        const rect = field.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollX = window.scrollX || window.pageXOffset;
        popup.style.top = (rect.bottom + scrollY + 6) + 'px';
        popup.style.left = (rect.left + scrollX) + 'px';
        popup.style.minWidth = Math.max(rect.width, 220) + 'px';
    }

    function showPopup(field) {
        clearTimeout(hideTimer);

        getPattern((pattern) => {
            if (!pattern) return; // sem padrão salvo → não incomoda

            createPopup();
            activeField = field;
            positionPopup(field);
            document.getElementById(POPUP_ID).classList.add('km-visible');
        });
    }

    function hidePopup(permanent) {
        clearTimeout(hideTimer);
        const popup = document.getElementById(POPUP_ID);
        if (popup) popup.classList.remove('km-visible');
        if (permanent) activeField = null;
    }

    // ---------- detecção de campos ----------

    function isPasswordField(el) {
        if (el.tagName !== 'INPUT') return false;
        const type = (el.type || '').toLowerCase();
        if (type === 'password') return true;
        const ac = (el.autocomplete || '').toLowerCase();
        if (ac === 'new-password' || ac === 'current-password') return true;
        return false;
    }

    function attachToField(field) {
        field.addEventListener('focus', () => {
            clearTimeout(hideTimer);
            showPopup(field);
        });

        field.addEventListener('blur', () => {
            hideTimer = setTimeout(() => hidePopup(), 150);
        });
    }

    function scanAndAttach() {
        document.querySelectorAll('input').forEach(el => {
            if (!el.dataset.kmAttached && isPasswordField(el)) {
                el.dataset.kmAttached = '1';
                attachToField(el);
            }
        });
    }

    scanAndAttach();

    const observer = new MutationObserver(() => scanAndAttach());
    observer.observe(document.body, { childList: true, subtree: true });

})();
