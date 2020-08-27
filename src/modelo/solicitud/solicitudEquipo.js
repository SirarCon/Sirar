
class SolicitudEquipo{

    constructor(nombre = "", genero = "", pais = "", deporte = "", evento = "", atletas = "", retirado = false, id = "", activo = true){
        this.id = id;
        this.nombre = nombre;
        this.genero = genero;
        this.pais = pais;
        this.deporte = deporte;
        this.evento = evento;
        this.activo = activo;
        this.retirado = retirado;
        this.atletas = []
        atletas.map(a => {
            this.atletas.push(a.value)
        });
    }

}
export default SolicitudEquipo;