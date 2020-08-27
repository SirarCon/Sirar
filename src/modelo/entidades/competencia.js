import Prueba from "./prueba";
import Fase from "./fase";
import Deporte from "./deporte";
import Evento from "./evento";

class Competencia{

    constructor(id = "", descripcion = "", ciudad = "", enVivo = "", evento = "", fase = "", fechaHora = "", genero = "", prueba = "", recinto = "", activo = true, tieneAlerta = false){
        this.setId(id);
        this.setDescripcion(descripcion);
        this.setCiudad(ciudad);
        this.setEstado(enVivo); // 0 -> finalizó , 1 -> en vivo, 2 proximo
        this.setEvento(evento);
        this.setFase(fase);
        this.setFecha(fechaHora);
        this.setGenero(genero);
        this.setPrueba(prueba);
        this.setRecinto(recinto);
        this.setActivo(activo);
        this.setTieneAlerta(tieneAlerta);
    }

    setJson(json, nombreEvento = ""){
        if(json !== null && json !== undefined && json !== {}){
            this.setId((json._id !== null && json._id !== undefined) ? json._id : json.id);
            this.setDescripcion(json.descripcion);    
            this.setCiudad(json.ciudad);
            this.setEstado((json.enVivo !== null && json.enVivo !== undefined) ? json.enVivo : json.estado);
            this.setFase(new Fase().setJson(json.fase));
            this.setTieneAlerta((json.tieneAlerta !== null && json.tieneAlerta !== undefined) ? json.tieneAlerta : false);
            if((json.evento.id == null || json.evento.id == undefined) && (json.evento._id == null || json.evento._id == undefined))
                this.setEvento(new Evento(json.evento, nombreEvento))
            else
                this.setEvento(new Evento().setJson(json.evento))
            if(json.fechaHora !== null && json.fechaHora !== undefined && json.fechaHora.length > 15)
                this.setFecha(json.fechaHora.substring(0,16));
            this.setGenero(json.genero);
            this.setPrueba(new Prueba().setJson(json.prueba, json.genero));
            this.setRecinto(json.recinto);
            this.setActivo(json.activo);
            if(json.prueba.deporte !== null && json.prueba.deporte !== undefined)
                this.setDeporte(new Deporte(json.prueba.deporte))
            else if(json.deporte !== null && json.deporte !== undefined)
                this.setDeporte(new Deporte().setJson(json.deporte))
        }
        return this;
    }

    getId(){ return this.id;}
    getDescripcion(){ return this.descripcion;}
    getCiudad(){ return this.ciudad;}
    getEstado(){ return this.estado;}
    getEvento(){ return this.evento;}
    getFase(){ return this.fase;}
    getFecha(){ return this.fechaHora;}
    getGenero(){ return this.genero;}
    getPrueba(){ return this.prueba;}
    getRecinto(){ return this.recinto;}
    getActivo(){ return this.activo;}
    getDeporte(){ return this.deporte;}
    setId(id){ this.id = id;}
    setDeporte(deporte){ this.deporte = deporte;}
    setDescripcion(descripcion){ this.descripcion = descripcion;}
    setCiudad(ciudad){ this.ciudad = ciudad;}
    setEstado(estado){ this.estado = estado;}
    setEvento(evento){ this.evento = evento;}
    setFase(fase){ this.fase = fase;}
    setFecha(fechaHora){ this.fechaHora = fechaHora;}
    setGenero(genero){ this.genero = genero;}
    setPrueba(prueba){ this.prueba = prueba;}
    setRecinto(recinto){ this.recinto = recinto;}
    setActivo(activo){ this.activo = activo;}
    getTieneAlerta(){ return this.tieneAlerta;}
    setTieneAlerta(tieneAlerta){ this.tieneAlerta = tieneAlerta;}
}

export default Competencia;