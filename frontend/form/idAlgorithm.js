
function getVerifyingDigit(id) {
    // Eliminar puntos y guiones
    id = id.replace(/\.|-/g, "");

    // Verificar que tenga 8 dígitos
    if (id.length !== 8) {
        return false;
    }

    // Coeficientes para el cálculo del dígito verificador
    const coeficientes = [2, 9, 8, 7, 6, 3, 4];
    let suma = 0;

    // Calcular la suma de los productos de los coeficientes

    for (let i = 0; i < 7; i++) {
        suma += parseInt(id.charAt(i)) * coeficientes[i];
    }
  
    // Calcular el dígito verificador
    const digitoVerificador = (10 - (suma % 10)) % 10;

    return digitoVerificador;
}

function isValidFormatId(id) {
    return /^\d{1}\.\d{3}\.\d{3}-\d{1}$/.test(id);
}

function isValidId(id) {
    console.log("Cédula ingresada:", id);
    if (isValidFormatId(id)) {
        const idWithoutFormatting = id.replace(/\.|-/g, "");
        const verifyingDigit = getVerifyingDigit(id);
        const actualVerifier = parseInt(idWithoutFormatting.charAt(7)); // The 8th digit
        return verifyingDigit === actualVerifier;
    }
    return false;
}