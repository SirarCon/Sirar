
class SolicitudUsuario{

    constructor(nombre = "", fotoUrl = "", correo = "", identificacion = "", telefono = "", rol = 0){
        this.nombre = nombre;
        this.fotoUrl = fotoUrl;
        this.correo = correo;
        this.identificacion = identificacion;
        this.telefono = telefono;
        this.rol = rol;
    }
}
export default SolicitudUsuario;