import Conexion from '../proveedores/conexion.js';
import DatosSesion from '../proveedores/datosSesion.js';
import RespuestaBase from '../modelo/respuesta/respuestaBase';

class Catalogos {

    datosSesion = DatosSesion.instancia();

    static _instancia = null;
    static instancia(){
      this._instancia = (this._instancia == null) ? new Catalogos() : this._instancia;
      return this._instancia;
    }

    cargarPaises = () => {
        Conexion.instancia().solicitar('get', 'paises/', '', null)
            .then(x => {
                var respuesta = new RespuestaBase(x);
                if(respuesta.exito)
                    this.datosSesion.guardarCatalogoPaises(respuesta.mensaje);
            })
            .catch( data => { 
            });
    }

    cargarDeportes = () => {
        Conexion.instancia().solicitar('get', 'deportes/', '', null)
            .then(x => {
                var respuesta = new RespuestaBase(x);
                if(respuesta.exito)
                    this.datosSesion.guardarCatalogoDeportes(respuesta.mensaje);
            })
            .catch( data => { 
            }); 
    }

    cargarFases = () => {
        Conexion.instancia().solicitar('get', 'fases/', '', null)
            .then(x => {
                var respuesta = new RespuestaBase(x);
                if(respuesta.exito)
                    this.datosSesion.guardarCatalogoFases(respuesta.mensaje);
            })
            .catch( data => { 
            }); 
    }

    cargarFederaciones = () => {
        Conexion.instancia().solicitar('get', 'federaciones/', '', null)
            .then(x => {
                var respuesta = new RespuestaBase(x);
                if(respuesta.exito)
                    this.datosSesion.guardarCatalogoFederaciones(respuesta.mensaje);
            })
            .catch( data => { 
            }); 
    }

}

export default Catalogos;