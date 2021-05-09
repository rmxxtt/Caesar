const caesarCipher = (data) => {
    const char = {
        minUpper: 65,
        maxUpper: 90,
        minLetter: 97,
        maxLetter: 122
    }
    const positionUpper = options.shift >= 0 ? char.minUpper : char.maxUpper;
    const positionLetter = options.shift >= 0 ? char.minLetter : char.maxLetter;
    if(options.action === 'decode'){
        options.shift = options.shift * -1
    }
    return data.toString().replace(/[a-zA-Z]/g, char => {
        if (char === char.toUpperCase()) {
            return String.fromCharCode(
                (char.charCodeAt() - positionUpper + options.shift) % 26 + positionUpper
            );
        } else {
            return String.fromCharCode(
                (char.charCodeAt() - positionLetter + options.shift) % 26 + positionLetter
            );
        }
    });
}

module.exports = { caesarCipher }
