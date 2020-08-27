import Deporte from './deporte.js';
import DatosSesion from '../../proveedores/datosSesion';

class Atleta{

    constructor(id = "", nombre = "", fotoUrl = "", correo = "", telefono = "", fechaNacimiento = "", pasaporte = "", genero = "", lateralidad = "", 
    beneficiario = "", cedulaBeneficiario = "", visaAmericana = "", venceVisa = "", tallaCamisa = "", pantaloneta = "", tallaJacket = "", 
    tallaBuzo = "", tallaTenis = "", infoPersonal = "", fechaDebut = "", facebookUrl = "", instagramUrl = "", twitterUrl = "", altura = "", 
    codigoPais = "", activo = true, deporte = new Deporte(), nombrePais = "", bandera = "", edad = "", retirado = "", tieneAlerta = ""){
        this.setId(id);
        this.setNombre(nombre);
        this.setFotoUrl(fotoUrl);
        this.setCorreo(correo);
        this.setTelefono(telefono);
        this.setFechaNacimiento(fechaNacimiento);
        this.setPasaporte(pasaporte);
        this.setGenero(genero);
        this.setLateralidad(lateralidad);
        this.setBeneficiario(beneficiario);
        this.setCedulaBeneficiario(cedulaBeneficiario);
        this.setVisaAmericana(visaAmericana);
        this.setVenceVisa(venceVisa);
        this.setTallaCamisa(tallaCamisa);
        this.setPantaloneta(pantaloneta);
        this.setTallaJacket(tallaJacket);
        this.setTallaBuzo(tallaBuzo);
        this.setTallaTennis(tallaTenis);
        this.setInfoPersonal(infoPersonal);
        this.setFechaDebut(fechaDebut);
        this.setFacebookUrl(facebookUrl);
        this.setInstagramUrl(instagramUrl);
        this.setTwitterUrl(twitterUrl);
        this.setAltura(altura);
        this.setCodigoPais(codigoPais);
        this.setActivo(activo);
        this.setDeporte(deporte);
        this.setNombrePais(nombrePais);
        this.setBandera(bandera);
        this.setEdad(edad);
        this.setRetirado(retirado);
        this.setTieneAlerta(tieneAlerta);
    }

    setJson(json){
        if(json !== null && json !== undefined && json !== {}){
            this.setId((json._id !== null && json._id !== undefined) ? json._id : json.id);
            this.setNombre(json.nombre);
            this.setFotoUrl(json.fotoUrl);
            this.setCorreo(json.correo);
            this.setTelefono(json.telefono);
            this.setFechaNacimiento(json.fechaNacimiento);
            this.setPasaporte(json.pasaporte);
            this.setGenero(json.genero);
            this.setLateralidad(json.lateralidad);
            this.setBeneficiario(json.beneficiario);
            this.setCedulaBeneficiario(json.cedulaBeneficiario);
            this.setVisaAmericana(json.visaAmericana);
            this.setVenceVisa(json.venceVisa);
            this.setTallaCamisa(json.tallaCamisa);
            this.setPantaloneta(json.pantaloneta);
            this.setTallaJacket(json.tallaJacket);
            this.setTallaBuzo(json.tallaBuzo);
            this.setTallaTennis(json.tallaTenis);
            this.setInfoPersonal(json.infoPersonal);
            this.setFechaDebut(json.fechaDebut);
            this.setFacebookUrl(json.facebookUrl);
            this.setInstagramUrl(json.instagramUrl);
            this.setTwitterUrl(json.twitterUrl);
            this.setAltura(json.altura);
            this.setCodigoPais(json.pais);
            this.setEdad(json.edad);
            this.setRetirado(json.retirado);
            this.setTieneAlerta((json.tieneAlerta !== null && json.tieneAlerta !== undefined) ? json.tieneAlerta : false);
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
            this.setActivo((json.activo !== null && json.activo !== undefined) ? json.activo : true);
            this.setDeporte(new Deporte().setJson(json.deporte));
        }
        return this;
    }

    getId(){ return this.id;}
    setId(id){ this.id = this.validarDato(id);}
    getNombre(){ return this.nombre;}
    setNombre(nombre){ this.nombre = this.validarDato(nombre);}
    getFotoUrl(){ return this.fotoUrl;}
    setFotoUrl(fotoUrl){ this.fotoUrl = this.validarDato(fotoUrl);}
    getCorreo(){ return this.correo;}
    setCorreo(correo){ this.correo = this.validarDato(correo);}
    getTelefono(){ return this.telefono;}
    setTelefono(telefono){ this.telefono = this.validarDato(telefono);}
    getFechaNacimiento(){ return this.fechaNacimiento;}
    setFechaNacimiento(fechaNacimiento){ this.fechaNacimiento = this.validarDato(fechaNacimiento);}
    getPasaporte(){ return this.pasaporte;}
    setPasaporte(pasaporte){ this.pasaporte = this.validarDato(pasaporte);}
    getGenero(){ return this.genero;}
    setGenero(genero){ this.genero = this.validarDato(genero);}
    getLateralidad(){ return this.lateralidad;}
    setLateralidad(lateralidad){ this.lateralidad = this.validarDato(lateralidad);}
    getBeneficiario(){ return this.beneficiario;}
    setBeneficiario(beneficiario){ this.beneficiario = this.validarDato(beneficiario);}
    getCedulaBeneficiario(){ return this.cedulaBeneficiario;}
    setCedulaBeneficiario(cedulaBeneficiario){ this.cedulaBeneficiario = this.validarDato(cedulaBeneficiario);}
    getVisaAmericana(){ return this.visaAmericana;}
    setVisaAmericana(visaAmericana){ this.visaAmericana = this.validarDato(visaAmericana);}
    getVenceVisa(){ return this.venceVisa;}
    setVenceVisa(venceVisa){ this.venceVisa = this.validarDato(venceVisa);}
    getTallaCamisa(){ return this.tallaCamisa;}
    setTallaCamisa(tallaCamisa){ this.tallaCamisa = this.validarDato(tallaCamisa);}
    getPantaloneta(){ return this.pantaloneta;}
    setPantaloneta(pantaloneta){ this.pantaloneta = this.validarDato(pantaloneta);}
    getTallaJacket(){ return this.tallaJacket;}
    setTallaJacket(tallaJacket){ this.tallaJacket = this.validarDato(tallaJacket);}
    getTallaBuzo(){ return this.tallaBuzo;}
    setTallaBuzo(tallaBuzo){ this.tallaBuzo = this.validarDato(tallaBuzo);}
    getTallaTennis(){ return this.tallaTenis;}
    setTallaTennis(tallaTenis){ this.tallaTenis = this.validarDato(tallaTenis);}
    getInfoPersonal(){ return this.infoPersonal;}
    setInfoPersonal(infoPersonal){ this.infoPersonal = this.validarDato(infoPersonal);}
    getFechaDebut(){ return this.fechaDebut;}
    setFechaDebut(fechaDebut){ this.fechaDebut = this.validarDato(fechaDebut);}
    getFacebookUrl(){ return this.facebookUrl;}
    setFacebookUrl(facebookUrl){ this.facebookUrl = this.validarDato(facebookUrl);}
    getInstagramUrl(){ return this.instagramUrl;}
    setInstagramUrl(instagramUrl){ this.instagramUrl = this.validarDato(instagramUrl);}
    getTwitterUrl(){ return this.twitterUrl;}
    setTwitterUrl(twitterUrl){ this.twitterUrl = this.validarDato(twitterUrl);}
    getAltura(){ return this.altura;}
    setAltura(altura){ this.altura = this.validarDato(altura);}
    getCodigoPais(){ return this.codigoPais;}
    setCodigoPais(codigoPais){ this.codigoPais = this.validarDato(codigoPais);}
    getActivo(){ return this.activo;}
    setActivo(activo){ this.activo = this.validarDato(activo, true);}
    getDeporte(){ return this.deporteId;}
    setDeporte(deporteId){ this.deporteId = this.validarDato(deporteId);}
    getNombrePais(){ return this.nombrePais;}
    setNombrePais(nombrePais){ this.nombrePais = this.validarDato(nombrePais);}
    getBandera(){ return this.bandera;}
    setBandera(bandera){ this.bandera = this.validarDato(bandera);}
    getEdad(){ return this.edad;}
    setEdad(edad){ this.edad = this.validarDato(edad);}
    getRetirado(){ return this.retirado;}
    setRetirado(retirado){ this.retirado = this.validarDato(retirado);}
    getTieneAlerta(){ return this.tieneAlerta;}
    setTieneAlerta(tieneAlerta){ this.tieneAlerta = this.validarDato(tieneAlerta, true);}

    validarDato(dato, bool = false){
        if(dato == null || dato == undefined)
            return (bool) ? true : "";
        return dato;
    }
}

export default Atleta;