// REACT
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Conexion from '../../../proveedores/conexion';
import SolicitudValidarToken from '../../../modelo/solicitud/solicitudValidarToken';
import RespuestaBase from '../../../modelo/respuesta/respuestaBase';
import { Redirect } from 'react-router-dom'
import SolicitudEstablecerClave from '../../../modelo/solicitud/solicitudEstablecerClave';
import DatosSesion from '../../../proveedores/datosSesion';
import Utilidades from '../../../proveedores/utilidades';
import $ from 'jquery';

class ReestablecerContrasena extends Component {

  datosSesion = DatosSesion.instancia();
  utilidades = Utilidades.instancia();

  constructor(props){
    super(props);
    var t = this.props.location.search;
    var tokenSeguridad = null;
    var tipo = 0; // 0 -> usuario nuevo, 1 -> usuario existente
    t = (t !== null && t !== undefined) ? t.split("?") : null;
    if(t !== null){
      tokenSeguridad = (t[1] !== undefined) ? t[1] : null;
      tipo = (t[2] === "1") ? 1 : 0;
    }
    this.state = {
      estilos: { 
        underlineFocusStyle: {borderBottomColor: "#00478A"},
        floatingLabelShrinkStyle: { color: "#336CA1" }
      },
      idUsuario: "",
      correoUsuario: "",
      nombreUsuario: "",
      claveNueva: "",
      claveRepetida: "",
      tokenTemp: tokenSeguridad,
      tipoConsulta: tipo,
      ejecutarRedireccion: false,
      destino: "",
      claveNuevaValida: false,
      claveRepetidaValida: false
    };
    $(document).ready(() => {
      $('#nuevaContrasena, #repetirContrasena').attr({
        oncopy: 'return false',
        oncut: 'return false',
        onpaste: 'return false'
      });
    });
  }

  componentDidMount = () => {
    this.utilidades.mostrarCargador();
    if(this.state.tokenTemp !== null && this.state.tokenTemp !== "")
      this.validarToken();
    else{
      this.utilidades.ocultarCargador();
      this.redireccionar('');
    }
  }

  redireccionar = (componente) => {
    this.setState({ejecutarRedireccion: true, destino: componente});
  }

  redireccion = () => {
    return (this.state.ejecutarRedireccion) ? <Redirect to={'/' + this.state.destino} /> : null;
  }

  formValido = () => {
    return (this.state.claveNuevaValida && this.state.claveRepetidaValida) ? true : false;
  }

  datosFormulario = (dato, valor) => {
    switch(dato){
      case 'claveNueva':
        valor = this.utilidades.limitarDato('clave', valor);
        this.setState({claveNueva: valor, claveNuevaValida: this.utilidades.validezDato('clave', valor)});
        break;
      case 'claveRepetida':
        valor = this.utilidades.limitarDato('clave', valor);
        this.setState({claveRepetida: valor, claveRepetidaValida: this.utilidades.validezDato('clave', valor)});
        break;
      default:
        break;
    }
  }

  render(){
    return(
      <div className="contenidoBody">
        <div id="bloqueReestablecer">
          <div className="wrapperContenido">
            <div id="encabezadoLogin" className="container">
              <div id="leyenda">
                <p className="textoGrande">{(this.state.tipoConsulta === 0) ? "Establecer contraseña" : "Restablecer contraseña"}</p>
                <p className="textoPequenno">{this.state.nombreUsuario}</p>
              </div>
            </div>
            <div id="formLogin" className="container">
              <form>
                <div id="inputs">
                  <TextField
                    id="nuevaContrasena" 
                    type="password"
                    fullWidth={true}
                    underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                    floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                    floatingLabelText="Nueva contraseña"
                    value={this.state.claveNueva}
                    onChange={e => this.datosFormulario('claveNueva', e.target.value)}
                    maxLength="16"
                    onFocus={e => this.utilidades.mostrarAlerta("alertaInfo", "La contraseña debe de contener como mínimo una minúscula, una mayúscula y un número. Además debe de tener una extensión mínima de 8 caracteres y máxima 16", 0)}
                    onBlur={e => this.utilidades.ocultarAlerta()}
                  />
                  <TextField
                    id="repetirContrasena" 
                    type="password"
                    fullWidth={true}
                    underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                    floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                    floatingLabelText="Repetir contraseña"
                    value={this.state.claveRepetida}
                    onChange={e => this.datosFormulario('claveRepetida', e.target.value)}
                    maxLength="16"
                  />
                </div>
                <RaisedButton 
                  label="Enviar" 
                  className={ (this.formValido()) ? "" : "botonDeshabilitado"}
                  fullWidth={true} 
                  onClick={this.enviarNuevaClave}
                  labelPosition="before"
                  icon={<i className="fas fa-ban"></i>}/>
              </form>
              {(this.state.tipoConsulta === 1) 
                ? <div id="olvContraseña">
                    <p><a><Link to='/autenticacion'>Inicie sesión</Link></a> si no desea restablecerla</p>
                  </div>
                : null
              }
            </div>
          </div>
        </div>
        {this.redireccion()}
      </div>
    )
  }

  validarToken = () => {
      var solicitud = new SolicitudValidarToken(this.state.tokenTemp);
      Conexion.instancia().solicitar('put', 'rps/', '', solicitud)
      .then(x => {
        var respuesta = new RespuestaBase(x);
        if(respuesta.exito){
          var datos = respuesta.mensaje;
          this.setState({idUsuario: datos.identificacion, correoUsuario: datos.correo, nombreUsuario: datos.nombre});
          this.utilidades.ocultarCargador();
        }
        else{
          this.utilidades.ocultarCargador();
          this.redireccionar('');
        }
      })
      .catch( data => { 
        this.utilidades.ocultarCargador();
        this.redireccionar('');
      }); 
  }

  enviarNuevaClave = () => {
    if(this.state.claveNueva === this.state.claveRepetida){
      this.utilidades.mostrarCargador();
      var solicitud = new SolicitudEstablecerClave(this.state.idUsuario, this.state.claveNueva, null, this.state.claveRepetida);
        Conexion.instancia().solicitar('post', 'rps/cambiar', '', solicitud)
        .then(x => {
          var respuesta = new RespuestaBase(x);
          if(respuesta.exito){
            this.datosSesion.guardarParamURL('nueva');
            this.utilidades.ocultarCargador();
            this.redireccionar('autenticacion');
          }
          else{
            this.setState({claveNueva: ''});
            this.utilidades.ocultarCargador();
            this.utilidades.mostrarAlerta("alertaError", respuesta.mensaje);
          }
        })
        .catch( data => { 
          this.setState({claveNueva: ''});
          this.utilidades.ocultarCargador();
          this.utilidades.mostrarAlerta("alertaError", Conexion.instancia().errorGenerico);
        }); 
      }
      else{
        this.setState({claveNueva: '', claveRepetida: ''});
        this.utilidades.mostrarAlerta("alertaError", "Las contraseñas deben de ser iguales.");
      }
  }

}
  
  export default ReestablecerContrasena