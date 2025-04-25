function generateIdCommit() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const getRandomLetters = (count) =>
        Array.from({ length: count }, () => letters[Math.floor(Math.random() * letters.length)]).join('');

    const getRandomDigits = (count) =>
        Array.from({ length: count }, () => Math.floor(Math.random() * 10)).join('');

    return (
        getRandomLetters(2) +  // ab
        getRandomDigits(2) +   // 12
        getRandomLetters(2) +  // bn
        getRandomDigits(2)     // 34
    );
}
module.exports = generateIdCommit;