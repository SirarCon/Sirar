class Registro{

    constructor(id = "", puntaje = "", momentoTiempo = "", set = "", oportunidades = "", oportunidad = "",  esUltimo = false, momentoRegistro = ""){
        this.setId(id)
        this.setPuntaje(puntaje)
        this.setMomento(momentoTiempo)
        this.setSet(set)
        this.setOportunidades(oportunidades)
        this.setOportunidad(oportunidad)
        this.setEsUltimo(esUltimo)
        this.setRegistro(momentoRegistro)
    }

    setJson(json, idParticipante = "", bandera = "", nombre = ""){
        this.setParticipante(idParticipante)
        this.setBandera(bandera)
        this.setNombre(nombre)
        if(json !== null && json !== undefined && json !== {}){
            this.setId((json._id !== null && json._id !== undefined) ? json._id : json.id);
            this.setPuntaje((json.puntaje !== null) ? json.puntaje : "");
            this.setMomento((json.momentoTiempo !== null) ? json.momentoTiempo : "");
            this.setSet((json.set !== null) ? json.set : "");
            this.setOportunidades((json.cantidadOportunidades !== null) ? json.cantidadOportunidades : "");
            this.setOportunidad((json.momentoOportunidad !== null) ? json.momentoOportunidad : "");
            this.setEsUltimo(json.esUltimoRegistro)
            this.setRegistro(json.momentoRegistro)
        }
        return this;
    }

    getId(){ return this.idMarcador;}
    getParticipante(){ return this.participante;}
    getPuntaje(){ return this.puntaje;}
    getMomento(){ return this.momentoTiempo;}
    getSet(){ return this.set;}
    getOportunidades(){ return this.cantidadOportunidades;}
    getOportunidad(){ return this.momentoOportunidad;}
    getEsUltimo(){ return this.esUltimoRegistro;}
    getRegistro(){ return this.momentoRegistro;}
    getBandera(){ return this.bandera;}
    getNombre(){ return this.nombre;}
    setId(idMarcador){ this.idMarcador = idMarcador;}
    setParticipante(participante){ this.participante = participante;}
    setPuntaje(puntaje){ this.puntaje = puntaje;}
    setMomento(momento){ this.momentoTiempo = momento;}
    setSet(set){ this.set = set;}
    setOportunidades(oportunidades){ this.cantidadOportunidades = oportunidades}
    setOportunidad(oportunidad){ this.momentoOportunidad = oportunidad}
    setEsUltimo(esUltimo){ this.esUltimoRegistro = esUltimo}
    setRegistro(registro){ this.momentoRegistro = registro}
    setBandera(bandera){ this.bandera = bandera}
    setNombre(nombre){ this.nombre = nombre}
}

export default Registro;