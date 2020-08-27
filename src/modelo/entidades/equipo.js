import DatosSesion from "../../proveedores/datosSesion";
import Deporte from "./deporte";
import Atleta from "./atleta";

class Equipo{

    constructor(id = "", nombre = "", deporte = new Deporte(), pais = "", nombrePais = "", bandera = "", evento = "", genero = "",  atletas = "", retirado = false, activo = true, tieneAlerta = false){
        this.setId(id);
        this.setNombre(nombre);
        this.setCodigoPais(pais);
        this.setNombrePais(nombrePais);
        this.setBandera(bandera);
        this.setEvento(evento);
        this.setDeporte(deporte);
        this.setGenero(genero);
        this.setAtletas(atletas);
        this.setRetirado(retirado);
        this.setActivo(activo);
        this.setTieneAlerta(tieneAlerta);
    }

    setJson(json, eventoNombre = ""){
        if(json !== null && json !== undefined && json !== {}){
            this.setId((json._id !== null && json._id !== undefined) ? json._id : json.id);
            this.setNombre(json.nombre);
            this.setEvento(json.evento);
            this.setGenero(json.genero);
            this.setTieneAlerta((json.tieneAlerta !== null && json.tieneAlerta !== undefined) ? json.tieneAlerta : false);
            if(json.atletas !== null && json.atletas !== undefined && json.atletas.length > 0){
                let atl = null
                var atls = []
                json.atletas.map(a => {
                    atl = new Atleta().setJson(a);
                    atls.push(atl);
                })
                this.setAtletas(atls)
            }
            this.setCodigoPais(json.pais);
            if(json.nombrePais === undefined || json.bandera === undefined){
                var p = DatosSesion.instancia().obtenerCatalogoPaises().filter(p => p.getId() === this.getCodigoPais());
                if(p.length > 0){
                    this.setBandera(p[0].getBandera());
                    this.setNombrePais(p[0].getNombre());
                }
            }
            else{
                this.setBandera(json.bandera);
                this.setNombrePais(json.nombrePais);
            }
            this.setEventoNombre((json.eventoNombre !== null && json.eventoNombre !== undefined) ? json.eventoNombre : eventoNombre);
            this.setDeporte(new Deporte().setJson(json.deporte))
            this.setRetirado((json.retirado !== null && json.retirado !== undefined) ? json.retirado : true);
            this.setActivo((json.activo !== null && json.activo !== undefined) ? json.activo : true);
        }
        return this;
    }

    getId(){ return this.id;}
    getNombre(){ return this.nombre;}
    getEvento(){ return this.evento;}
    getEventoNombre(){ return this.eventoNombre;}
    getGenero(){ return this.genero;}
    getAtletas(){ return this.atletas;}
    getCodigoPais(){ return this.pais;}
    getNombrePais(){ return this.nombrePais;}
    getBandera(){ return this.bandera;}
    getDeporte(){ return this.deporte;}
    getRetirado(){ return this.retirado;}
    getActivo(){ return this.activo;}
    setId(id){ this.id = id;}
    setNombre(nombre){ this.nombre = nombre;}
    setEvento(evento){ this.evento = evento;}
    setEventoNombre(eventoNombre){ this.eventoNombre = eventoNombre;}
    getGeneroNombre(){ return this.generoNombre;}
    setGenero(genero){ this.genero = genero; (genero == "0") ? this.setGeneroNombre("Femenino") : (genero == "1") ? this.setGeneroNombre("Masculino") : ""}
    setGeneroNombre(generoNombre){ this.generoNombre = generoNombre}
    setAtletas(atletas){ this.atletas = atletas;}
    setCodigoPais(pais){ this.pais = pais;}
    setNombrePais(nombrePais){ this.nombrePais = this.validarDato(nombrePais);}
    setBandera(bandera){ this.bandera = this.validarDato(bandera);}
    setRetirado(retirado){ this.retirado = retirado}
    setActivo(activo){ this.activo = activo}
    setDeporte(deporte){ this.deporte = deporte}
    getTieneAlerta(){ return this.tieneAlerta;}
    setTieneAlerta(tieneAlerta){ this.tieneAlerta = this.validarDato(tieneAlerta, true);}

    validarDato(dato, bool = false){
        if(dato == null || dato == undefined)
            return (bool) ? true : "";
        return dato;
    }
}

export default Equipo;