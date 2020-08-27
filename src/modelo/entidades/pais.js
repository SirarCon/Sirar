class Pais{

    constructor(id = "", nombre = "", bandera = ""){
        this.setId(id);
        this.setNombre(nombre);
        this.setBandera(bandera);
    }

    setJson(json){
        if(json !== null && json !== undefined && json !== {}){
            this.setId((json._id !== null && json._id !== undefined) ? json._id : json.id);
            this.setNombre(json.name);
            this.setBandera(json.flag);
        }
        return this;
    }

    getId(){ return this.id;}
    getNombre(){ return this.nombre;}
    getBandera(){ return this.bandera;}
    setId(id){ this.id = id;}
    setNombre(nombre){ this.nombre = nombre;}
    setBandera(bandera){ this.bandera = (bandera !== undefined && bandera !== null) ? bandera : "";}
}

export default Pais;