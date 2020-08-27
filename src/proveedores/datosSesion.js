import Usuario from "../modelo/entidades/usuario";
import Pais from "../modelo/entidades/pais";
import Deporte from "../modelo/entidades/deporte";
import Catalogos from "./catalogos";
import Fase from "../modelo/entidades/fase";
import Federacion from "../modelo/entidades/federacion";

class DatosSesion{

    paramURL = "";

    static _instancia = null;
    static instancia(){
      this._instancia = (this._instancia == null) ? new DatosSesion() : this._instancia;
      return this._instancia;
    }

    cerrarSesion(){
        this.borrarUsuario();
        this.borrarTokenPersonal();
    }

    obtenerParamURL(){
        return this.paramURL;
    }

    guardarParamURL(param){
        this.paramURL = param;
    }

    borrarUsuario(){
        localStorage.removeItem('usuario');
    }

    guardarUsuario(usu){
        localStorage.setItem('usuario', JSON.stringify(usu));
    }

    obtenerUsuario(){
        var usuario = localStorage.getItem('usuario');
        usuario = JSON.parse(usuario);
        return (usuario === null)
        ? null
        : new Usuario().setJson(usuario);
    }

    esAdministrador(){
        return (this.obtenerUsuario() !== null && this.obtenerUsuario().getRol() === 1);
    }

    esColaborador(){
        return (this.obtenerUsuario() !== null && this.obtenerUsuario().getRol() === 0);
    }

    guardarTokenPush(token){
        localStorage.setItem('tokenPush', token);
    }

    guardarMsjPushError(msj){
        localStorage.setItem('pushMsjError', msj);
    }

    guardarUltimaPantalla(pantalla){
        localStorage.setItem('ultimaPantalla', pantalla);
    }

    obtenerUltimaPantalla(){
        var pantalla = localStorage.getItem('ultimaPantalla');
        return (pantalla === null) ? "" : pantalla;
    }

    obtenerMsjPushError(){
        var msj = localStorage.getItem('pushMsjError');
        return (msj === null) ? "" : msj;
    }

    obtenerTokenPush(){
        var token = localStorage.getItem('tokenPush');
        return (token === null) ? "" : token;
    }

    guardarTokenPersonal(token){
        localStorage.setItem('token', token);
    }

    obtenerTokenPersonal(){
        var token = localStorage.getItem('token');
        return (token === null) ? "" : token;
    }

    borrarTokenPersonal(){
        localStorage.removeItem('token');
    }

    guardarCatalogoPaises(paises){
        sessionStorage.setItem('paises', JSON.stringify(paises));
    }

    guardarEsCompetenciaAtletaDetalle(es){
        sessionStorage.setItem('esCompetenciaAtletaDetalle', es);
    }

    guardarEsCompetenciaPush(es){
        sessionStorage.setItem('esCompetenciaPush', es);
    }

    guardarAtletaDetalle(atleta){
        sessionStorage.setItem('atletaDetalle', JSON.stringify(atleta));
    }

    guardarFederacionDetalle(federacion){
        sessionStorage.setItem('federacionDetalle', JSON.stringify(federacion));
    }

    guardarDeporteDetalle(deporte){
        sessionStorage.setItem('deporteDetalle', JSON.stringify(deporte));
    }

    guardarEventoDetalle(evento){
        sessionStorage.setItem('eventoDetalle', JSON.stringify(evento));
    }

    guardarCompetencias(competencias){
        sessionStorage.setItem('competencias', JSON.stringify(competencias));
    }

    guardarPrueba(prueba){
        sessionStorage.setItem('prueba', JSON.stringify(prueba));
    }

    guardarCompetenciaDetalle(comp){
        sessionStorage.setItem('competenciaDetalle', JSON.stringify(comp));
    }

    guardarFaseId(fase){
        sessionStorage.setItem('fase', JSON.stringify(fase));
    }

    guardarRefrescarListaCompetencias(refrescar){
        sessionStorage.setItem('refrescarListaCompetencias', refrescar);
    }

    guardarEquipoDetalle(equipo){
        sessionStorage.setItem('equipoDetalle', JSON.stringify(equipo));
    }

    obtenerAtletaDetalle(){
        return sessionStorage.getItem('atletaDetalle');
    }

    obtenerFederacionDetalle(){
        return sessionStorage.getItem('federacionDetalle');
    }

    obtenerDeporteDetalle(){
        return sessionStorage.getItem('deporteDetalle');
    }

    obtenerEventoDetalle(){
        return sessionStorage.getItem('eventoDetalle');
    }

    obtenerCompetencias(){
        return sessionStorage.getItem('competencias');
    }

    obtenerPrueba(){
        return sessionStorage.getItem('prueba');
    }

    obtenerFaseId(){
        return sessionStorage.getItem('fase');
    }

    obtenerCompetenciaDetalle(){
        return sessionStorage.getItem('competenciaDetalle');
    }

    obtenerEquipoDetalle(){
        return sessionStorage.getItem('equipoDetalle');
    }

    obtenerEsCompetenciaAtletaDetalle(){
        return sessionStorage.getItem('esCompetenciaAtletaDetalle');
    }

    obtenerEsCompetenciaPush(){
        return sessionStorage.getItem('esCompetenciaPush');
    }

    refrescarListaCompetencias(){
        return sessionStorage.getItem('refrescarListaCompetencias');
    }

    obtenerCatalogoPaises(){
        var paisesJSON = JSON.parse(sessionStorage.getItem('paises'));
        var paisesObj = [];
        if(paisesJSON == [] || paisesJSON == null)
            Catalogos.instancia().cargarPaises();
        else{
            paisesJSON.map(p => {
                paisesObj.push(new Pais().setJson(p));
            });
        }
        return paisesObj;
    }

    guardarCatalogoDeportes(deportes){
        sessionStorage.setItem('deportes', JSON.stringify(deportes));
    }

    guardarCatalogoFases(fases){
        sessionStorage.setItem('fases', JSON.stringify(fases));
    }

    guardarCatalogoFederaciones(federaciones){
        sessionStorage.setItem('federaciones', JSON.stringify(federaciones));
    }

    deportesActualizados(date){
        sessionStorage.setItem('ultimaActualizacionDeportes', date);
    }

    obtenerActualizacionDeportes(){
        return sessionStorage.getItem('ultimaActualizacionDeportes');
    }

    obtenerCatalogoDeportes(){
        var date = new Date().getTime()
        var ultimo = this.obtenerActualizacionDeportes()
        if(ultimo != null && ultimo != undefined){
            var diff = date - ultimo
            if(diff > 200000){
                Catalogos.instancia().cargarDeportes()
                this.deportesActualizados(date)
            }
        }
        else{
            Catalogos.instancia().cargarDeportes()
            this.deportesActualizados(date)
        }
        return this.recuperarCatalogoDeportes()
    }

    recuperarCatalogoDeportes(){
        var deportesJSON = JSON.parse(sessionStorage.getItem('deportes'));
        var deportesObj = [];
        if(deportesJSON != [] && deportesJSON != null && deportesJSON != undefined){
            deportesJSON.map(d => {
                deportesObj.push(new Deporte().setJson(d));
            });
        }
        return deportesObj;
    }

    fasesActualizados(date){
        sessionStorage.setItem('ultimaActualizacionFases', date);
    }

    obtenerActualizacionFases(){
        return sessionStorage.getItem('ultimaActualizacionFases');
    }

    obtenerCatalogoFases(){
        var date = new Date().getTime()
        var ultimo = this.obtenerActualizacionFases()
        if(ultimo != null && ultimo != undefined){
            var diff = date - ultimo
            if(diff > 200000){
                Catalogos.instancia().cargarFases()
                this.fasesActualizados(date)
            }
        }
        else{
            Catalogos.instancia().cargarFases()
            this.fasesActualizados(date)
        }
        return this.recuperarCatalogoFases()
    }

    recuperarCatalogoFases(){
        var fasesJSON = JSON.parse(sessionStorage.getItem('fases'));
        var fasesObj = [];
        if(fasesJSON != [] && fasesJSON != null && fasesJSON != undefined){
            fasesJSON.map(f => {
                fasesObj.push(new Fase().setJson(f));
            });
        }
        return fasesObj;
    }

    federacionesActualizados(date){
        sessionStorage.setItem('ultimaActualizacionFederaciones', date);
    }

    obtenerActualizacionFederaciones(){
        return sessionStorage.getItem('ultimaActualizacionFederaciones');
    }

    obtenerCatalogoFederaciones(){
        var date = new Date().getTime()
        var ultimo = this.obtenerActualizacionFederaciones()
        if(ultimo != null && ultimo != undefined){
            var diff = date - ultimo
            if(diff > 200000){
                Catalogos.instancia().cargarFederaciones()
                this.federacionesActualizados(date)
            }
        }
        else{
            Catalogos.instancia().cargarFederaciones()
            this.federacionesActualizados(date)
        }
        return this.recuperarCatalogoFederaciones()
    }

    recuperarCatalogoFederaciones(){
        var federacionesJSON = JSON.parse(sessionStorage.getItem('federaciones'));
        var federacionesObj = [];
        if(federacionesJSON != [] && federacionesJSON != null && federacionesJSON != undefined){
            federacionesJSON.map(f => {
                federacionesObj.push(new Federacion().setJson(f));
            });
        }
        return federacionesObj;
    }

    filtrarAtletasPorDeporte(idDeporte){
        sessionStorage.setItem('filtroAtletasPorDeporte', idDeporte);
    }

    obtenerFiltroAtletasPorDeporte(){
        return sessionStorage.getItem('filtroAtletasPorDeporte');
    }

    limpiarFiltroAtletasPorDeporte(){
        this.filtrarAtletasPorDeporte("")
    }
}

export default DatosSesion;