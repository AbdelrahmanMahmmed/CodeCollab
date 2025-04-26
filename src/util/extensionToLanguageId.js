const path = require('path');

const extensionToLanguageId = {
    'c': 50,
    'cpp': 54,
    'java': 62,
    'py': 71,
    'js': 63,
    'go': 60,
    'rb': 72,
    'php': 68,
    'cs': 51,
    'swift': 83,
    'kt': 78,
    'r': 80,
    'rs': 73,
    'ts': 74,
    'dart': 85,
    'scala': 81,
    'hs': 61,
};


const validateFileExtensionMatchesLanguage = (fileName, languageId) => {
    const ext = path.extname(fileName).replace('.', '').toLowerCase();
    const expectedLanguageId = extensionToLanguageId[ext];
    if (!expectedLanguageId) {
        throw new Error('Unsupported file extension');
    }
    if (expectedLanguageId !== languageId) {
        throw new Error(`Language ID ${languageId} does not match file extension .${ext}`);
    }
};

module.exports = validateFileExtensionMatchesLanguage;