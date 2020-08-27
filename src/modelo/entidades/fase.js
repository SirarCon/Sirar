class Fase{

    constructor(id = "", descripcion = "", siglas = ""){
        this.setId(id);
        this.setDescripcion(descripcion);
        this.setSiglas(siglas);
    }

    setJson(json){
        if(json !== null && json !== undefined && json !== {}){
            if((json._id == null || json._id == undefined) && (json.id == null || json.id == undefined))
                this.setId(json)
            else{
                this.setId((json._id !== null && json._id !== undefined) ? json._id : json.id);
                this.setDescripcion(json.descripcion);
                this.setSiglas(json.siglas);
            }
        }
        return this;
    }

    getId(){ return this.id;}
    getDescripcion(){ return this.descripcion;}
    getSiglas(){ return this.siglas;}
    setId(id){ this.id = id;}
    setDescripcion(descripcion){ this.descripcion = descripcion;}
    setSiglas(siglas){ this.siglas = siglas;}
}

export default Fase;