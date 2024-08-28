function calculateVerifyingDigit(rut) {
    // Convert string to array of numbers
    const x = Array.from(rut, Number);
    let s = 0;
    const values = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]; // Weights

    // Ensure we only use the first 11 digits
    for (let i = 0; i < 11; i++) {
        s += x[i] * values[i];
    }

    const rest = s % 11;
    return rest === 0 ? 0 : 11 - rest;
}

function isValidFormat(rut) {
    return /^\d{12}$/.test(rut); // Ensures the RUT has 12 digits
}

function isValidRut(rut) {
    if (isValidFormat(rut)) {
        const rutWithoutVerifier = rut.slice(0, -1); // Take the first 11 digits
        const verifyingDigit = calculateVerifyingDigit(rutWithoutVerifier);
        const actualVerifier = parseInt(rut.charAt(11)); // Get the last digit (verifier)
        return verifyingDigit === actualVerifier;
    }
    return false;
}

// Example usage
console.log(isValidRut('123456789012')); // true