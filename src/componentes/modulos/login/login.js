// REACT
import React, {Component} from 'react';
import $ from 'jquery';
import {GridList, GridTile} from 'material-ui/GridList';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
// COMPONENTES
import conLogo from '../../../assets/logos/conLogo.png';
import Conexion from '../../../proveedores/conexion';
import SolicitudLogin from '../../../modelo/solicitud/solicitudLogin';
import SolicitudReestablecerClave from '../../../modelo/solicitud/solicitudReestablecerClave';
import { Redirect } from 'react-router-dom'
import DatosSesion from '../../../proveedores/datosSesion';
import Usuario from '../../../modelo/entidades/usuario';
import RespuestaBase from '../../../modelo/respuesta/respuestaBase';
import Utilidades from '../../../proveedores/utilidades';
import { Link } from 'react-router-dom'


class Login extends Component {

  datosSesion = DatosSesion.instancia();
  utilidades = Utilidades.instancia();

    constructor(){
      super();
      this.state = {
        estilos: { 
          underlineFocusStyle: {
            borderBottomColor: "#00478A"
          },
          floatingLabelShrinkStyle: {
            color: "#336CA1"
          }
        },
        correo: "",
        clave: "",
        correoRecuperar: "",
        ejecutarRedireccion: false,
        correoValido: false,
        claveValida: false,
        correoRecuperarValido: false
      };
      $(document).ready(() => {
        $('#claveUsuario').attr({
          oncopy: 'return false',
          oncut: 'return false',
          onpaste: 'return false'
        });
      });
    }

    componentDidMount = () => {
      if(this.datosSesion.obtenerUsuario() !== null)
        this.redireccionar('');
      else{
        if(this.datosSesion.obtenerParamURL() === 'nueva'){
          this.datosSesion.guardarParamURL("");
          this.utilidades.mostrarAlerta('alertaInfo', 'Ya puede iniciar sesión');
        }
      }
    }

    olvidoContrasenaVista = () => {
      $(document).ready( () => {
        $('#login').css('display', 'none');
        $('#recuperacion').css('display', 'block');
      });
      this.setState({correo: "", clave: ""});
    }

    iniciarSesionVista = () => {
      $(document).ready( () => {
        $('#recuperacion').css('display', 'none');
        $('#login').css('display', 'block');
      });
      this.setState({correoRecuperar: ""});
    }

    formValidoLogin = () => {
      return (this.state.correoValido && this.state.claveValida) ? true : false;
    }

    formValidoReestablecer = () => {
      return this.state.correoRecuperarValido;
    }

    redireccionar = (componente) => {
      this.setState({ejecutarRedireccion: true, destino: componente});
    }
  
    redireccion = () => {
      return (this.state.ejecutarRedireccion) ? <Redirect to={'/' + this.state.destino} /> : null;
    }

    datosFormulario = (dato, valor) => {
      switch(dato){
        case 'correo':
          valor = this.utilidades.limitarDato('correo', valor);
          this.setState({correo: valor, correoValido: this.utilidades.validezDato('correo', valor)});
          break;
        case 'clave':
          valor = this.utilidades.limitarDato('clave', valor);
          this.setState({clave: valor, claveValida: this.utilidades.validezDato('clave', valor)});
          break;
        case 'correoRecuperar':
          valor = this.utilidades.limitarDato('correo', valor);
          this.setState({correoRecuperar: valor, correoRecuperarValido: this.utilidades.validezDato('correo', valor)});
          break;
        default:
          break;
      }
    }

    render(){
      return(
        <div className="contenidoBody">
          <div id="bloqueAutenticacion">
            <div className="wrapperContenido" id="login">
              <GridList cellHeight={120} cols={2} id="encabezadoLogin">
                <GridTile>
                  <Link to="/"><img alt="" src={conLogo} /></Link>
                </GridTile>
                <GridTile>
                  <div id="leyendaLogin">
                    <p className="textoGrande">Iniciar sesión</p>
                    <p className="textoPequenno">Sistema Integrado de Resultados de Alto Rendimiento</p>
                  </div>
                </GridTile>
              </GridList>
              <div id="formLogin" className="container">
                <form>
                  <div id="inputs">
                    <TextField
                      id="correoUsuarioLogin" 
                      type="email"
                      fullWidth={true}
                      underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                      floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                      floatingLabelText="Correo Electrónico"
                      value={this.state.correo}
                      onChange={e => this.datosFormulario('correo', e.target.value)}
                      maxLength="40"
                    />
                    <TextField
                      id="claveUsuario" 
                      type="password"
                      fullWidth={true}
                      underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                      floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                      floatingLabelText="Contraseña"
                      value={this.state.clave}
                      onChange={e => this.datosFormulario('clave', e.target.value)}
                      maxLength="16"
                    />
                  </div>
                  <RaisedButton 
                    label="Iniciar" 
                    className={ (this.formValidoLogin()) ? "" : "botonDeshabilitado"}
                    labelPosition="before"
                    fullWidth={true} 
                    onClick={this.iniciarSesion}
                    icon={<i className="fas fa-ban"></i>}
                  />
                </form>
                <div id="olvContraseña">
                    <p>¿<a onClick={this.olvidoContrasenaVista}>Olvidó su contraseña</a>?</p>
                    <a onClick={e => this.redireccionar('')}>Inicio</a>
                </div>
              </div>
            </div>
            <div className="wrapperContenido" id="recuperacion">
              <div id="encabezadoReestablecer" className="container">
                <div id="leyendaReestablecer">
                  <p className="textoGrande">Restablecer contraseña</p>
                  <p className="textoPequenno">Se enviará un enlace a su correo electrónico</p>
                </div>
              </div>
              <div id="formLogin" className="container">
                <form>
                <div id="inputs">
                    <TextField
                      id="correoUsuarioRecuperacion" 
                      type="email"
                      fullWidth={true}
                      underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                      floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                      floatingLabelText="Correo Electrónico"
                      value={this.state.correoRecuperar}
                      onChange={e => this.datosFormulario('correoRecuperar', e.target.value)}
                      maxLength="40"
                    />
                  </div>
                  <RaisedButton 
                    label="Enviar" 
                    className={ (this.formValidoReestablecer()) ? "" : "botonDeshabilitado"}
                    fullWidth={true} 
                    onClick={this.enviarCorreo}
                    labelPosition="before"
                    icon={<i className="fas fa-ban"></i>}/>
                </form>
                <div id="olvContraseña">
                  <p><a onClick={this.iniciarSesionVista}>Iniciar Sesión</a></p>
                </div>
              </div>
            </div>
          </div>
          {this.redireccion()}
        </div>
      )
    }

    iniciarSesion = () => {
      this.utilidades.mostrarCargador();
      var solicitud = new SolicitudLogin(this.state.correo, this.state.clave);
      Conexion.instancia().solicitar('post', 'login/', '', solicitud)
      .then(x => {
        var respuesta = new RespuestaBase(x);
        if(respuesta.exito){
          var usuario = new Usuario().setJson(respuesta.mensaje);
          this.datosSesion.guardarUsuario(usuario);
          this.utilidades.ocultarCargador();
          this.datosSesion.guardarParamURL("sesion");
          this.redireccionar('');
        }
        else{
          this.setState({clave: ''});
          this.utilidades.ocultarCargador();
          this.utilidades.mostrarAlerta("alertaError", respuesta.mensaje);
        }
        this.datosSesion.guardarTokenPersonal(respuesta.token);
      })
      .catch( data => { 
        this.setState({clave: ''});
        this.utilidades.ocultarCargador();
        this.utilidades.mostrarAlerta("alertaError", Conexion.instancia().errorGenerico);
      });
    }

    enviarCorreo = () => {
      this.utilidades.mostrarCargador();
      var solicitud = new SolicitudReestablecerClave(this.state.correoRecuperar);
      Conexion.instancia().solicitar('post', 'rps/', '', solicitud)
      .then(x => {
        var respuesta = new RespuestaBase(x);
        if(respuesta.exito){
          this.setState({correoRecuperar: ''});
          this.utilidades.ocultarCargador();
          this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);
          this.iniciarSesionVista();
        }
        else{
          this.setState({correoRecuperar: ''});
          this.utilidades.ocultarCargador();
          this.utilidades.mostrarAlerta("alertaError", respuesta.mensaje);
        }
      })
      .catch( data => { 
        this.utilidades.ocultarCargador();
        this.utilidades.mostrarAlerta("alertaError", Conexion.instancia().errorGenerico);
      });    
    } 

  }
  
  export default Login