
document.addEventListener('DOMContentLoaded', () => {

    document
        .getElementById('backButton')
        .addEventListener('click', () => {
            window.location.href = 'index.html';
        });

    const getMessage = (key, fallback = '') => {

        if (
            typeof chrome !== 'undefined' &&
            chrome.i18n &&
            chrome.i18n.getMessage
        ) {
            return chrome.i18n.getMessage(key);
        }

        return fallback;
    };

    const setText = (id, key, fallback) => {
        document.getElementById(id).textContent =
            getMessage(key, fallback);
    };

    setText(
        'whatIsTitle',
        'whatIsTitle',
        'What is KeyMaker?'
    );

    setText(
        'whatIsText',
        'whatIsText',
        'KeyMaker generates deterministic passwords based on information you already know.'
    );

    setText(
        'howWorksTitle',
        'howWorksTitle',
        'How does it work?'
    );

    setText('step1', 'step1', 'Enter the website name.');
    setText('step2', 'step2', 'Enter one or more keywords.');
    setText('step3', 'step3', 'Select the toggles to use different parts of the keyword or the entire keyword.');
    setText('step4', 'step4', 'Click Generate Password.');
    setText('step5', 'step5', 'Use the generated password on that website.');
    setText('step6', 'step6', 'Click \"Save pattern\" to store your configuration.');
    setText('step7', 'step7', 'On any future sign-up or login, KeyMaker detects the password field and offers to fill it automatically using the current sites domain and your saved pattern.');

    setText(
        'sameInputText',
        'sameInputText',
        'Using the same inputs will always generate the same password.'
    );

    setText(
        'privacyTitle',
        'privacyTitle',
        'Privacy'
    );

    setText(
        'privacyText',
        'privacyText',
        'All password generation happens locally in your browser. No information is sent to external servers.'
    );

    setText(
        'supportText',
        'supportText',
        'KeyMaker is free, open-source and developed independently.'
    );

    setText(
        'backButton',
        'backButton',
        '← Back'
    );

    setText(
        'supportTitle',
        'supportTitle',
        '❤️ Support KeyMaker'
    );

});
