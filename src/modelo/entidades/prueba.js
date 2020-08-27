class Prueba{

    constructor(id = "", nombre = "", tipo = "", tipoMarcador = "", activo = true){
        this.setId(id);
        this.setNombre(nombre);
        this.setTipo(tipo); // 1 -> equipos, 0 -> atletas
        this.setActivo(activo);
        this.setTipoMarcador(tipoMarcador); // 1 -> puntos, 2 -> tiempo, 3 -> distancia
    }

    setJson(json, genero = ""){
        if(json !== null && json !== undefined && json !== {}){
            this.setId((json._id !== null && json._id !== undefined) ? json._id : json.id);
            if(this.getId() == "")
                this.setId((json.prueba !== null && json.prueba !== undefined) ? json.prueba : "");
            this.setNombre(json.nombre);
            this.setTipo(json.tipo);
            this.setGenero((json.genero !== null && json.genero !== undefined) ? json.genero : genero);
            this.setTipoMarcador((json.tipoMarcador !== null && json.tipoMarcador !== undefined) ? json.tipoMarcador : "");
            this.setActivo((json.activo !== null && json.activo !== undefined) ? json.activo : true);
        }
        return this;
    }

    getId(){ return this.id;}
    getNombre(){ return this.nombre;}
    getTipo(){ return this.tipo;}
    setId(id){ this.id = id;}
    setNombre(nombre){ this.nombre = nombre;}
    setTipo(tipo){ this.tipo = tipo;}
    getActivo(){ return this.activo;}
    setActivo(activo){ this.activo = activo}
    getGenero(){ return this.genero;}
    getGeneroNombre(){ return this.generoNombre;}
    setGenero(genero){ this.genero = genero; (genero == "0") ? this.setGeneroNombre("Femenino") : (genero == "1") ? this.setGeneroNombre("Masculino") : ""}
    setGeneroNombre(generoNombre){ this.generoNombre = generoNombre}
    getTipoMarcador(){ return this.tipoMarcador;}
    setTipoMarcador(tipoMarcador){ this.tipoMarcador = tipoMarcador}
}

export default Prueba;