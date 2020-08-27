class Deporte{

    constructor(id = "", nombre = "", imagenDeporteUrl = "", federacion = "", activo = true){
        this.setId(id);
        this.setNombre(nombre);
        this.setFoto(imagenDeporteUrl);
        this.setFederacion(federacion);
        this.setActivo(activo);
    }

    setJson(json){
        if(json !== null && json !== undefined && json !== {}){
            this.setId((json._id !== null && json._id !== undefined) ? json._id : json.id);
            this.setNombre(json.nombre);
            this.setFoto(json.imagenDeporteUrl);
            this.setFederacion(json.federacion);
            this.setActivo((json.activo !== null && json.activo !== undefined) ? json.activo : true);
            this.evento = (json.evento !== undefined) ? json.evento : false;
        }
        return this;
    }

    getId(){ return this.id;}
    getNombre(){ return this.nombre;}
    getFoto(){ return this.imagenDeporteUrl;}
    getFederacion(){ return this.federacion;}
    setId(id){ this.id = id;}
    setNombre(nombre){ this.nombre = nombre;}
    setFoto(imagenDeporteUrl){ this.imagenDeporteUrl = (imagenDeporteUrl !== undefined && imagenDeporteUrl !== null) ? imagenDeporteUrl : "";}
    setFederacion(federacion){ this.federacion = federacion;}
    getActivo(){ return this.activo;}
    setActivo(activo){ this.activo = activo}
}

export default Deporte;