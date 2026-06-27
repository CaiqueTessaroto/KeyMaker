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
            let url = window.location.hostname; // ex: "www.github.com"
            url = url.replace(/^www\./, '');    // ex: "github.com"
            url = url.split('.')[0];            // ex: "github"
            return url;
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
        // Clonar os fields e substituir o valor do campo 0 pelo site atual
        const fields = pattern.fields.map((f, i) => {
            if (i === 0) {
                // Manter checkboxes e ordem, trocar só o valor pelo domínio atual
                const word = sitename || f.value || '';
                const newLen = word.length;
                const oldChecks = f.checkedStates;
                const oldLen = oldChecks.length;

                // Remapear proporcionalmente preservando quantidade e bordas
                const selectedCount = oldChecks.filter(Boolean).length;
                const oldIndices = oldChecks
                    .map((c, i) => c ? i : -1)
                    .filter(i => i !== -1);

                const newChecks = new Array(newLen).fill(false);

                oldIndices.forEach(oldIdx => {
                    // Mapear posição proporcional ao novo tamanho
                    const ratio = oldLen > 1 ? oldIdx / (oldLen - 1) : 0;
                    const newIdx = newLen > 1 ? Math.round(ratio * (newLen - 1)) : 0;
                    newChecks[Math.min(newIdx, newLen - 1)] = true;
                });

                return { ...f, value: word, checkedStates: newChecks };
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
                    const init = i * lyrics_size;
                    for (let x = init; x < wordsize; x++) {
                        if (x < lyrics_size + init) result += word[x];
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
