import { messaging } from "./init-fcm";
import DatosSesion from "../datosSesion";
const { default: Conexion } = require("../conexion");
const { default: Utilidades } = require("../utilidades");
const { default: SolicitudPush } = require("../../modelo/solicitud/solicitudPush");
const { default: RespuestaBase } = require("../../modelo/respuesta/respuestaBase");

class PushNotifications{

  datosSesion = DatosSesion.instancia();
  utilidades = Utilidades.instancia();

  static _instancia = null;
  static instancia(){
    this._instancia = (this._instancia == null) ? new PushNotifications() : this._instancia;
    return this._instancia;
  }

  togglePushAtleta(atleta, success, failure){
    (atleta.getTieneAlerta()) 
    ? this.gestionar("delete", "removerDispositivoAtleta/", 0, atleta.getId(), success, failure)
    : this.gestionar("post", "registrarDispositivoAtleta/", 0, atleta.getId(), success, failure)
  }

  togglePushEquipo(equipo, success, failure){
    (equipo.getTieneAlerta())
    ? this.gestionar("delete", "removerDispositivoEquipo/", 1, equipo.getId(), success, failure)
    : this.gestionar("post", "registrarDispositivoEquipo/", 1, equipo.getId(), success, failure)
  }

  togglePushCompetencia(competencia, success, failure){
    (competencia.getTieneAlerta())
    ? this.gestionar("delete", "removerDispositivoCompetencia/", 2, competencia.getId(), success, failure)
    : this.gestionar("post", "registrarDispositivoCompetencia/", 2, competencia.getId(), success, failure)
  }

  gestionar(verbose, url, tipo, id, success, failure){
    let token = this.datosSesion.obtenerTokenPush()
    if(token == "")
      failure(null, this.datosSesion.obtenerMsjPushError())
    else{
      this.utilidades.mostrarCargador();
      var push = new SolicitudPush(tipo, id, token);
      Conexion.instancia().solicitar(verbose, url, '', JSON.stringify(push))
      .then(x => {
          var respuesta = new RespuestaBase(x);
          this.utilidades.ocultarCargador();
          (respuesta.exito) ? success(respuesta) : failure(respuesta)
      })
      .catch( data => { 
          this.utilidades.ocultarCargador();
          failure(null)
      }); 
    }
  }

}

export default PushNotifications;