import Registro from "../entidades/registro"

class SolicitudRegistro{

    constructor(puntaje = "", momentoTiempo = "", set = "", oportunidades = "", oportunidad = "",  esUltimo = false, id = ""){
        /*
        this.id = id;
        this.puntaje = puntaje;
        this.momentoTiempo = momentoTiempo;
        this.set = set;
        this.cantidadOportunidades = oportunidades
        this.momentoOportunidad = oportunidad
        this.esUltimoRegistro = esUltimo
        */
        this.marcador = new Registro(id, puntaje, momentoTiempo, set, oportunidades, oportunidad,  esUltimo, "")
    }

}
export default SolicitudRegistro