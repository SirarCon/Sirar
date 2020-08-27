class SolicitudFederacion{

    constructor(id = "", nombre = "", escudoUrl = "", paginaWeb = "", ubicacion = "", telefono1 = "", telefono2 = "", 
        correoFederacion = "", presidente = "", correoPresidente = "", activo = true){
        this.id = id;
        this.nombre = nombre;
        this.escudoUrl = escudoUrl;
        this.paginaWeb = paginaWeb;
        this.ubicacion = ubicacion;
        this.telefonos = [telefono1, telefono2];
        this.correoFederacion = (correoFederacion == "") ? undefined : correoFederacion;;
        this.presidente = (presidente == "") ? undefined : presidente;;
        this.correoPresidente = (correoPresidente == "") ? undefined : correoPresidente;
        this.activo = activo;
    }

}
export default SolicitudFederacion;