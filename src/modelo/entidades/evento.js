import DatosSesion from "../../proveedores/datosSesion";

class Evento{

    constructor(id = "", nombre = "", fotoUrl = "", pais = "", nombrePais = "", bandera = "", ciudad = "", fechaInicio = "", fechaFinal = "", anno = "", estado = "", activo = true){
        this.setId(id);
        this.setNombre(nombre);
        this.setFoto(fotoUrl);
        this.setCodigoPais(pais);
        this.setNombrePais(nombrePais);
        this.setBandera(bandera);
        this.setCiudad(ciudad);
        this.setInicial(fechaInicio);
        this.setFinal(fechaFinal);
        this.setAnno(anno);
        this.setActivo(activo);
        this.setEstado(estado);
    }

    setJson(json){
        if(json !== null && json !== undefined && json !== {}){
            this.setId((json._id !== null && json._id !== undefined) ? json._id : json.id);
            this.setNombre(json.nombre);
            this.setFoto(json.fotoUrl);
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
            this.setCiudad(json.ciudad);
            this.setInicial(json.fechaInicio);
            this.setFinal(json.fechaFinal);
            this.setAnno(json.anno);
            this.setEstado(json.estado);
            this.setActivo((json.activo !== null && json.activo !== undefined) ? json.activo : true);
        }
        return this;
    }

    getId(){ return this.id;}
    getNombre(){ return this.nombre;}
    getFoto(){ return this.fotoUrl;}
    getCodigoPais(){ return this.pais;}
    getCiudad(){ return this.ciudad;}
    getInicial(){ return this.fechaInicio;}
    getFinal(){ return this.fechaFinal;}
    getAnno(){ return this.anno;}
    getActivo(){ return this.activo;}
    setId(id){ this.id = id;}
    setNombre(nombre){ this.nombre = nombre;}
    setFoto(fotoUrl){ this.fotoUrl = (fotoUrl !== undefined && fotoUrl !== null) ? fotoUrl : "";}
    setCodigoPais(pais){ this.pais = pais;}
    setCiudad(ciudad){ this.ciudad = ciudad;}
    setInicial(fechaInicio){ this.fechaInicio = fechaInicio;}
    setFinal(fechaFinal){ this.fechaFinal = fechaFinal;}
    setAnno(anno){ this.anno = anno;}
    setActivo(activo){ this.activo = activo}
    getNombrePais(){ return this.nombrePais;}
    setNombrePais(nombrePais){ this.nombrePais = this.validarDato(nombrePais);}
    getBandera(){ return this.bandera;}
    setBandera(bandera){ this.bandera = this.validarDato(bandera);}
    setEstado(estado){ this.estado = estado;} // 0: ANTERIOR, 1: ACTUAL, 2: PROXIMO
    getEstado(){ return this.estado;}

    validarDato(dato, bool = false){
        if(dato == null || dato == undefined)
            return (bool) ? true : "";
        return dato;
    }
}

export default Evento;