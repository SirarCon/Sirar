class SolicitudEstablecerClave{

    constructor(identificacion, password, passwordActual, passwordConfirmacion){
        this.identificacion = identificacion;
        this.password = password;
        this.passwordVieja = passwordActual;
        this.passwordConfirmacion = passwordConfirmacion;
    }
}
export default SolicitudEstablecerClave;