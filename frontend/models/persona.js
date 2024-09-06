class Persona {
    constructor(name, lastname, email, countryId, rut, password, repeatPassword) {
        this.id = 0;
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.countryId = countryId;
        this.rut = rut;
        this.password = password;
        this.repeatPassword = repeatPassword;
    }
}

export default Persona;