import axios from 'axios';
import DatosSesion from './datosSesion';
import Utilidades from './utilidades';

class Conexion {

    //urlConexion = "https://sirarcon.herokuapp.com/"; // SIRAR DESARROLLO
    urlConexion = "https://sirartestapi.herokuapp.com/"; // SIRAR PRUEBAS CON
    tokenConexion = "token d89fgk";
    errorGenerico = "Ha ocurrido un error, intente nuevamente.";
    offline = "No tiene conexión a internet, esta navegando en modo offline";
    datosSesion = DatosSesion.instancia();
    utilidades = Utilidades.instancia();
    networkDataReceived = false;

    static _instancia = null;
    static instancia(){
      this._instancia = (this._instancia == null) ? new Conexion() : this._instancia;
      return this._instancia;
    }

    solicitarCache(urlFinal, resolve){
      caches.match(urlFinal)
        .then(respuesta => {
          if (!respuesta) throw Error();
          return respuesta.json()
        }).then(data => {
          if (!this.networkDataReceived) {
            resolve(data)
          }
        }).catch((error) => {
          //console.log("Respuesta Caché Error: ", error);
          resolve({exito: false, error: 99, mensaje: this.errorGenerico});
        });
    }

    solicitar(accion, metodo, clave, solicitud, pushToken = null){
      var urlFinal = this.urlConexion + metodo + clave;
      /*
      console.log("***** " + accion + " *****");
      console.log("Metodo: ", metodo);
      console.log("Clave: ", clave);
      console.log("Solicitud: ", solicitud);
      console.log("Token Personal: ", this.datosSesion.obtenerTokenPersonal());
      if(pushToken != null)
        console.log("Token Push: ", this.datosSesion.obtenerTokenPush());
      console.log("Url: ", urlFinal);
      */
      this.networkDataReceived = false;
      return new Promise((resolve) => {
        if(!navigator.onLine && accion === "get"){
          this.solicitarCache(urlFinal, resolve)
        }
        else{
          if(navigator.onLine){
            let headers = {  
              'Content-Type': 'application/json',    
              'general': this.tokenConexion,
              'authorization' : this.datosSesion.obtenerTokenPersonal(),
              'tokenDispositivo' : ((pushToken == null) ? "" : pushToken)
            }
            //console.log("ONLINE")
            //console.log("Headers: ", headers)
            axios({
              method: accion,
              url: urlFinal,
              timeout: 40000,
              data: solicitud,
              headers: headers
            })
            .then(respuesta => {
              //console.log("Respuesta: ", respuesta);
              this.networkDataReceived = true;
              resolve(respuesta.data);
            })
            .catch((error) => {
              //console.log("Respuesta Network Error: ", error);
              this.solicitarCache(urlFinal, resolve)
            });
          }
          /*
          else{
            console.log("OFFLINE")
          }*/
        }
      });
    }

  }

  export default Conexion;