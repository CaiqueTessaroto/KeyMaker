# 🔑 KeyMaker

Generate deterministic and site-specific passwords directly in your browser.

KeyMaker is a lightweight, open-source browser extension that creates unique passwords for each website based on information you already know. The same inputs will always generate the same password, making it easier to remember and reproduce passwords without storing them.

## How It Works

1. Enter the website or service name.
2. Enter one or more keywords.
3. Click **Generate Password**.
4. Use the generated password on that website.

Using the same inputs will always produce the same password.

Example:

Website:

```text
github.com
```

Keyword:

```text
mySecretPhrase
```

Keyword:

```text
A#
```

Generated Password:

```text
githubmySecretPhraseA#
```

## Security

All password generation happens locally in your browser.

KeyMaker does not:

* Store passwords
* Send data to external servers
* Require an account
* Collect analytics

Your inputs never leave your device.

## Installation

### Chrome / Chromium Browsers

1. Download the extension.
2. Open `chrome://extensions`.
3. Enable **Developer Mode**.
4. Click **Load unpacked**.
5. Select the extension folder.

## Open Source

KeyMaker is open source and available on GitHub.

Contributions, bug reports, and suggestions are welcome.

## License

This project is licensed under the MIT License.

## Trademark

The KeyMaker name and logo are property of Caique Leandro Tessaroto.
