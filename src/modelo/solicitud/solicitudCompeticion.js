class SolicitudCompeticion{

    constructor(evento = "", prueba = "", genero = "", fase = "", fechaHora = "", ciudad = "", recinto = "", descripcion = "", id = "", activo = true){
        this.id = id;
        this.evento = evento;
        this.prueba = prueba;
        this.genero = genero;
        this.fase = fase;
        this.fechaHora = fechaHora;
        this.ciudad = ciudad;
        this.recinto = recinto;
        this.descripcion = descripcion;
        this.activo = activo;
    }
    
}
export default SolicitudCompeticion;