import $ from 'jquery';
import EXIF from 'exif-js';
import Conexion from './conexion';
import DatosSesion from './datosSesion';
import Competencia from '../modelo/entidades/competencia';
import RespuestaBase from '../modelo/respuesta/respuestaBase';

class Utilidades{

    alfanumerico = /([^A-Za-z0-9ñÑáéíóúÁÉÍÓÚ])/g;
    alfanumericoEspacio = /([^A-Za-z0-9 ñÑáéíóúÁÉÍÓÚ])/g;
    numerico = /[^0-9]/g;
    correoLimite = /([^A-Za-z0-9ñÑáéíóúÁÉÍÓÚ@!#$%&*()_=+~{}[;:,<>./¿¡\]?])/g;
    correoFormato = new RegExp(/([^.@]+)(\.[^.@]+)*@([^.@]+\.)+([^.@]+)/);
    claveLimite = /([^A-Za-z0-9ñÑáéíóúÁÉÍÓÚ])/g;
    claveFormato = new RegExp(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/);
    fotoReducida = "";
    esMovil = false;
    supportDatePicker = true;
    claseRotacion = "";
    meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];
    datosSesion = DatosSesion.instancia();

    static _instancia = null;
    static instancia(){
      this._instancia = (this._instancia == null) ? new Utilidades() : this._instancia;
      return this._instancia;
    }

    constructor(){
        this.esMovil = (window.innerWidth < 830) ? true : false;
        let info = this.obtenerInfoExplorador()
        if(!this.obtenerEsMovil()){
            if(info.toLowerCase().includes('safari') || info.toLowerCase().includes('firefox')){
                this.supportDatePicker = false
            }
        }
    }

    obtenerSupportDatePicker(){
        return this.supportDatePicker;
    }

    obtenerEsMovil(){
        return this.esMovil;
    }

    obtenerInfoExplorador(){
        var ua = navigator.userAgent, tem, 
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem =  /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE '+(tem[1] || '');
        }
        if(M[1] === 'Chrome'){
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if(tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem = ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    }

    ocultarCargador = () => { $('.cargador').fadeOut(); }
    mostrarCargador = () => { $('.cargador').fadeIn(); }

    mostrarAlerta(tipo, mensaje, tiempo = 4000){
        $('#alerta').css('top', 'auto');
        $('#alerta').removeClass();
        $('#alerta').addClass(tipo);
        $('#alerta span').text(mensaje);
        $('#alerta #iconoTipoAlerta').removeClass();
        var icono = (tipo === "alertaExito") ? "fas fa-check-circle" : (tipo === "alertaInfo") ? "fas fa-info-circle" : "fas fa-exclamation-triangle";
        $('#alerta #iconoTipoAlerta').addClass(icono);
        $('#alerta').slideDown();
        if(tiempo > 0)
            setTimeout(() => $('#alerta').slideUp(), tiempo);
        else{
            if(this.obtenerEsMovil())
                $('#alerta').css('top', '0px');
        }
    }

    ocultarAlerta(){
        $('#alerta').slideUp();
    }

    mostrarPush(mensaje, id){
        $('#alertaPush').removeClass();
        $('#alertaPush').addClass("alertaInfo");
        $('#alertaPush span').text(mensaje);
        $('#alertaPush .ir').attr("name", id);
        $('#alertaPush #iconoTipoAlerta').removeClass();
        $('#alertaPush #iconoTipoAlerta').addClass("alertaInfo");
        $('#alertaPush').slideDown();
        setTimeout(() => $('#alertaPush').slideUp(), 10000);
    }

    ocultarPush(){
        $('#alertaPush').slideUp();
    }

    accionPush = (id) => {
        if(id != "")
            this.consultarDetalleCompetencia(id)
        this.ocultarPush()
    }

    consultarDetalleCompetencia = (id) => {
        this.mostrarCargador();
        Conexion.instancia().solicitar('get', (this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 'api/competencia/' : 'competencia/', id, null, this.datosSesion.obtenerTokenPush())
            .then(x => {
                var respuesta = new RespuestaBase(x);
                this.ocultarCargador();
                if(respuesta.exito){
                    this.datosSesion.guardarCompetenciaDetalle(new Competencia().setJson(respuesta.mensaje));
                    this.datosSesion.guardarEsCompetenciaAtletaDetalle(true);
                    this.datosSesion.guardarEsCompetenciaPush(true);
                    window.location.replace("/detalleCompetencia");
                }
                else{
                    if(respuesta.codigo === 403)
                        this.mostrarAlertaPop("Atención", respuesta.mensaje, "sesionV", 1);
                    else
                        this.mostrarAlerta("alertaError", respuesta.mensaje);
                }
                this.datosSesion.guardarTokenPersonal(respuesta.token);
            })
            .catch( data => { 
                this.ocultarCargador();
                this.mostrarAlerta("alertaError", Conexion.instancia().errorGenerico);
            }); 
    }

    limitarDato(tipo, valor){
        if(valor !== undefined && valor !== null && valor !== ""){
            switch(tipo){
                case 'numerico': return valor.replace(this.numerico, "");
                case 'alfanumerico': return valor.replace(this.alfanumerico, "");
                case 'alfanumericoespacio': return valor.replace(this.alfanumericoEspacio, "");
                case 'correo': return valor.replace(this.correoLimite, "");
                case 'clave': return valor.replace(this.claveLimite, "");
                default: return valor.replace(this.alfanumericoEspacio, "");
            }
        }
        else return "";
    }

    validezDato(tipo, valor){
        if(valor !== undefined && valor !== null && valor !== ""){
            switch(tipo){
                case 'correo': return this.correoFormato.test(valor);
                case 'clave': return this.claveFormato.test(valor);
                default: return true;
            }
        }
        else return false;
    }

    prepararFoto(img, tamanno){
        var self = this;
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        var width = img.width;
        var height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height);
        EXIF.getData(img, () => {
            self.orientacion = EXIF.getTag(img,"Orientation");
        });
        canvas.width = width;
        canvas.height = height;
        if (4 < this.orientacion && this.orientacion < 9) {
            canvas.width = height;
            canvas.height = width;
        }
        switch (this.orientacion) {
            case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
            case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
            case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
            case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
            case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
            case 7: ctx.transform(0, -1, -1, 0, height , width); break;
            case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
            default: break;
        }
        ctx.drawImage(img, 0, 0);
        var calidad = (tamanno > 3) ? 0.2 : (tamanno > 1) ? 0.3 : 1;
        return canvas.toDataURL("image/jpeg", calidad);
    }

    fechaFormatoFinal(fecha){
        let date = new Date(fecha)
        let result = date.getDate() + " " + this.meses[date.getMonth()] + ", " + date.getFullYear()
        return result
    }

    horaFormatoFinal(fecha){
        let date = new Date(fecha)
        let result = date.getHours() + ":" + date.getMinutes()
        return result
    }

}

export default Utilidades;