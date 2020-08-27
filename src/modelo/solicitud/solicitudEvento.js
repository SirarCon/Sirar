class SolicitudEvento{

    constructor(nombre = "", fotoUrl = "", pais = "", ciudad = "", fechaInicio = "", fechaFinal = "", id = "", activo = true){
        this.id = id;
        this.nombre = nombre;
        this.fotoUrl = fotoUrl;
        this.pais = pais;
        this.ciudad = ciudad;
        this.fechaInicio = fechaInicio;
        this.fechaFinal = fechaFinal;
        this.activo = activo;
    }
    
}
export default SolicitudEvento;