import React, {Component} from 'react';
import Header from '../../estructura/header/header';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import $ from 'jquery';
import Skeleton from 'react-loading-skeleton';
import Dialog from 'material-ui/Dialog';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import Conexion from '../../../proveedores/conexion';
import RespuestaBase from '../../../modelo/respuesta/respuestaBase';
import DatosSesion from '../../../proveedores/datosSesion';
import Usuario from '../../../modelo/entidades/usuario';
import imagenDefault from '../../../assets/imagenes/defaultImage.png';
import SolicitudUsuario from '../../../modelo/solicitud/solicitudUsuario';
import { Redirect } from 'react-router-dom'
import SolicitudEstablecerClave from '../../../modelo/solicitud/solicitudEstablecerClave';
import Utilidades from '../../../proveedores/utilidades';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class Perfil extends Component {

  datosSesion = DatosSesion.instancia();
  utilidades = Utilidades.instancia();

  constructor(){
    super();
    $(document).ready(() => {
      this.ajusteTopForm(0);
      $('#actualContrasena, #nuevaContrasena, #repetirContrasena').attr({
        oncopy: 'return false',
        oncut: 'return false',
        onpaste: 'return false'
      });
    });
    this.state = {
      u: this.datosSesion.obtenerUsuario(),
      estilos: { 
        underlineFocusStyle: { borderBottomColor: "#00478A" },
        floatingLabelShrinkStyle: { color: "#336CA1" }
      },
      foto: '',
      nombre: '',
      correo: '',
      id: '',
      telefono: '',
      claveActual: '',
      claveNueva: '',
      claveRepetida: '',
      opcionesFoto: false,
      modalFoto: false,
      banderaCarga: false,
      indexTab: 0,
      alturaForm0: 0,
      ejecutarRedireccion: false,
      alertaPop: false,
      tituloAlertaPop: "", 
      mensajeAlertaPop: "", 
      aceptarAlertaPop: "", 
      botonesAlertaPop: 2,
      correoValido: true,
      nombreValido: true,
      telefonoValido: true,
      claveRepetidaValida: false,
      claveNuevaValida: false,
      claveActualValida: false
    };
  }

  componentDidMount = () => {
    if(this.datosSesion.obtenerUsuario() === null)
      this.redireccionar('');
    else
      this.cargarDatosUsuario();
  }

  ajusteTopForm = (value) => {
    if(!this.utilidades.obtenerEsMovil()){
      var mitadAlturaForm = ($('.formCentradoVertical' + value).height() / 2);
      var mitadPantalla = (window.innerHeight - 170) / 2;
      if(value === 0){
        if(this.state.alturaForm0 === 0)
          this.setState({alturaForm0: mitadAlturaForm});
        mitadAlturaForm = this.state.alturaForm0;
      }
      $('.formCentradoVertical' + value).css('margin-top', mitadPantalla - mitadAlturaForm);
    }
  }

  redireccionar = (componente) => {
    this.setState({ejecutarRedireccion: true, destino: componente});
  }

  redireccion = () => {
    return (this.state.ejecutarRedireccion) ? <Redirect to={'/' + this.state.destino} /> : null;
  }

  mostrarPopOverFoto = (event) => {
    event.preventDefault();
    this.setState({
      opcionesFoto: true,
      anchorEl: event.currentTarget,
    });
  };

  ocultarPopOverFoto = () => {
    this.setState({
      opcionesFoto: false
    });
  };

  verFoto = () => {
    this.setState({modalFoto: true, opcionesFoto: false});
  };

  eliminarFoto = () => {
    this.setState({foto: '', opcionesFoto: false});
  };

  cerrarFoto = () => {
    this.setState({modalFoto: false});
  };

  subirFoto = () => {
    $(document).ready(() => {
      $('#inputFoto').click();
    });
    this.setState({opcionesFoto: false});
  };

  actualizarFoto = (event) => {
    this.utilidades.mostrarCargador();
    if (event.target.files && event.target.files[0]) {
      var tamanno = (event.target.files[0].size / 1024 / 1024);
      if(tamanno < 5){
        let reader = new FileReader();
        reader.onload = (e) => {
          var img = new Image();
          img.src = e.target.result;
            img.onload = () => {
              this.setState({foto: this.utilidades.prepararFoto(img, tamanno)});
              this.utilidades.ocultarCargador();
            };
        };
        reader.readAsDataURL(event.target.files[0]);
      }
      else
        this.utilidades.mostrarAlerta("alertaError", "La foto supera los 5MB");
    }
  }

  mostrarAlertaPop = (titulo, mensaje, aceptar, botones) => {
    this.setState({tituloAlertaPop: titulo, mensajeAlertaPop: mensaje, 
      aceptarAlertaPop: aceptar, botonesAlertaPop: botones, alertaPop: true});
  }

  alertaPop = () => {
    return <Dialog open={this.state.alertaPop} onClose={this.cerrarAlertaPop} className="alertaPop">
      <DialogTitle className="alertaPopTitulo">{this.state.tituloAlertaPop}</DialogTitle>
      <DialogContent>
        <DialogContentText className="alertaPopMensaje">{this.state.mensajeAlertaPop}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={
            (this.state.aceptarAlertaPop === "sesionV")
            ? this.sesionVencida
            : this.cerrarAlertaPop
          } 
          className="alertaPopAceptar">
          Aceptar
        </Button>
        {(this.state.botonesAlertaPop === 2)
          ?  <Button onClick={this.cerrarAlertaPop} className="alertaPopCancelar">
              Cancelar
            </Button>
          : null 
        }
      </DialogActions>
    </Dialog>
  }

  cambiarIndexTabs = (value) => {
    this.recargarDatosPantallas();
    this.ajusteTopForm(value);
    this.setState({
      indexTab: value,
    });
  };

  recargarDatosPantallas = () => {
    this.setState({u: this.datosSesion.obtenerUsuario()});
    this.setState({claveActual: "", claveNueva: "", claveRepetida: "", foto: this.state.u.getFoto(), nombre: this.state.u.getNombre(), 
    correo: this.state.u.getEmail(), id: this.state.u.getId(), telefono: this.state.u.getTelefono(), correoValido: true, nombreValido: true, 
    telefonoValido: true, claveActualValida: false, claveNuevaValida: false, claveRepetidaValida: false});
  }

  formValidoPerfil = () => {
    return (this.state.nombreValido && this.state.correoValido && this.state.telefonoValido) ? true : false;
  }

  formValidoClave = () => {
    return (this.state.claveActualValida && this.state.claveNuevaValida && this.state.claveRepetidaValida) ? true : false;
  }

  datosFormulario = (dato, valor) => {
    switch(dato){
      case 'correo':
        valor = this.utilidades.limitarDato('correo', valor);
        this.setState({correo: valor, correoValido: this.utilidades.validezDato('correo', valor)});
        break;
      case 'nombre':
        valor = this.utilidades.limitarDato('alfanumericoespacio', valor);
        this.setState({nombre: valor, nombreValido: (valor.length > 4)});
        break;
      case 'telefono':
        valor = this.utilidades.limitarDato('numerico', valor);
        this.setState({telefono: valor, telefonoValido: (valor.length === 0 || valor.length === 8)});
        break;
      case 'claveActual':
        valor = this.utilidades.limitarDato('clave', valor);
        this.setState({claveActual: valor, claveActualValida: this.utilidades.validezDato('clave', valor)});
        break;
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
        <Header titulo = "Perfil" />
        <div className="contenedorPagina" id="contenedorPerfil">
          <Tabs
            className="tabs segundoMenu"
            inkBarStyle={{backgroundColor: '#C91D32'}}
            onChange={this.cambiarIndexTabs}
            value={this.state.indexTab}
          >
            <Tab label="Datos Personales" value={0} />
            <Tab label="Cambio Contraseña" value={1} />
          </Tabs>
          <SwipeableViews
            index={this.state.indexTab}
            onChangeIndex={this.cambiarIndexTabs}
          >
            <div id="formPerfil" className="container formCentradoVertical0">
              { this.state.banderaCarga ?
                <form>
                  <div id="inputs">
                      <div id="fotoPerfil">
                        <img id="fotoPerfil" alt="Imagen no disponible" src={(this.state.foto !== '') ? this.state.foto : imagenDefault}/>
                        <i className="fas fa-cog" onClick={this.mostrarPopOverFoto}></i>
                        <input id="inputFoto" type="file"  accept="image/*" onChange={this.actualizarFoto}/>
                      </div>
                      <Popover
                        open={this.state.opcionesFoto}
                        anchorEl={this.state.anchorEl}
                        onRequestClose={this.ocultarPopOverFoto}
                        anchorOrigin={{horizontal:'middle', vertical:'bottom'}}
                        targetOrigin={{horizontal:'left', vertical:'bottom'}}
                      >
                        <Menu className="opcionesPopover">
                          { (this.state.foto !== '')
                            ? <section>
                                <MenuItem primaryText="Ver" onClick={this.verFoto}/>
                                <MenuItem primaryText="Cambiar" onClick={this.subirFoto}/>
                                <MenuItem primaryText="Eliminar" onClick={this.eliminarFoto}/>
                              </section>
                            : <MenuItem primaryText="Agregar" onClick={this.subirFoto}/>
                          }
                        </Menu>
                      </Popover>
                      <TextField
                        value={this.state.nombre}
                        id="nombrePerfil" 
                        type="text"
                        fullWidth={true}
                        underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                        floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                        floatingLabelText="Nombre"
                        onChange={e => this.datosFormulario('nombre', e.target.value)}
                        maxLength="40"
                      />
                      <TextField
                        value={this.state.correo}
                        id="emailPerfil" 
                        type="text"
                        fullWidth={true}
                        underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                        floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                        floatingLabelText="Correo Electrónico"
                        onChange={e => this.datosFormulario('correo', e.target.value)}
                        maxLength="40"
                      />
                      <TextField
                        value={this.state.telefono}
                        id="telefonoPerfil" 
                        type="tel"
                        fullWidth={true}
                        underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                        floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                        floatingLabelText="Teléfono"
                        onChange={e => this.datosFormulario('telefono', e.target.value)}
                        maxLength="8"
                      />
                  </div>
                  <RaisedButton 
                  label="Guardar" 
                  className={ (this.formValidoPerfil()) ? "" : "botonDeshabilitado"}
                  fullWidth={true} 
                  onClick={this.editarPerfil}
                  labelPosition="before"
                  icon={<i className="fas fa-ban"></i>}/>
                </form>
              :
                <div id="inputsSkeleton">
                  <div id="fotoSkeleton">
                    <Skeleton/>
                  </div>
                  <div id="cuerpoSkeleton">
                    <Skeleton/>
                    <Skeleton/>
                    <Skeleton/>
                  </div>
                </div>
              }
            </div>
            <div id="formPerfil" className="container formCentradoVertical1">
              <form>
                <div id="inputs">
                  <TextField
                    id="actualContrasena" 
                    type="password"
                    fullWidth={true}
                    underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                    floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                    floatingLabelText="Actual contraseña"
                    value={this.state.claveActual}
                    onChange={e => this.datosFormulario('claveActual', e.target.value)}
                    maxLength="16"
                  />
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
                    floatingLabelText="Repetir nueva contraseña"
                    value={this.state.claveRepetida}
                    onChange={e => this.datosFormulario('claveRepetida', e.target.value)}
                    maxLength="16"
                  />
                </div>
                <RaisedButton 
                  label="Guardar" 
                  className={ (this.formValidoClave()) ? "" : "botonDeshabilitado"}
                  fullWidth={true} 
                  onClick={this.cambiarClave}
                  labelPosition="before"
                  icon={<i className="fas fa-ban"></i>}/>
              </form>
            </div>
          </SwipeableViews>
          <Dialog
            overlayClassName="fotoOverlay"
            contentClassName="fotoModal"
            open={this.state.modalFoto}
            onRequestClose={this.cerrarFoto}
          >
            <img alt="" src={this.state.foto} />
          </Dialog>
        </div>
        {this.alertaPop()}
        {this.redireccion()}
      </div>
    )
  }

  cargarDatosUsuario = () => {
    Conexion.instancia().solicitar('get', 'api/usuario/', this.state.u.getId(), null)
      .then(x => {
        var respuesta = new RespuestaBase(x);
        if(respuesta.exito){
          this.datosSesion.guardarUsuario(new Usuario().setJson(respuesta.mensaje));
          this.recargarDatosPantallas();
        }
        else{
          if(respuesta.codigo === 403)
            this.mostrarAlertaPop("Atención", respuesta.mensaje, "sesionV", 1);
          else{
            this.utilidades.mostrarAlerta("alertaError", respuesta.mensaje);
          }
        }
        this.datosSesion.guardarTokenPersonal(respuesta.token);
        this.setState({banderaCarga: true});
      })
      .catch( data => { 
        this.setState({banderaCarga: true});
        this.utilidades.mostrarAlerta("alertaError", Conexion.instancia().errorGenerico);
      }); 
  }

  editarPerfil = () => {
    this.utilidades.mostrarCargador();
    var usuModificado = new SolicitudUsuario(this.state.nombre, this.state.foto, this.state.correo, this.state.id, this.state.telefono, this.state.u.getRol());
    Conexion.instancia().solicitar('put', 'api/usuario/', this.state.u.getId(), JSON.stringify(usuModificado))
    .then(x => {
      var respuesta = new RespuestaBase(x);
      if(respuesta.exito){
        this.utilidades.ocultarCargador();
        this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);
        this.cargarDatosUsuario();
      }
      else{
        if(respuesta.codigo === 403){
          this.mostrarAlertaPop("Atención", respuesta.mensaje, "sesionV", 1);
          this.utilidades.ocultarCargador();
        }
        else{
          this.utilidades.ocultarCargador();
          this.utilidades.mostrarAlerta("alertaError", respuesta.mensaje);
        }
      }
      this.datosSesion.guardarTokenPersonal(respuesta.token);
    })
    .catch( data => { 
      this.utilidades.ocultarCargador();
      this.utilidades.mostrarAlerta("alertaError", Conexion.instancia().errorGenerico);
    }); 
  }

  cambiarClave = () => {
    if(this.state.claveNueva === this.state.claveRepetida){
      if(this.state.claveActual !== this.state.claveNueva){
        this.utilidades.mostrarCargador();
        var solicitud = new SolicitudEstablecerClave(this.state.u.getId(), this.state.claveNueva, this.state.claveActual, this.state.claveRepetida);
        Conexion.instancia().solicitar('post', 'rps/cambiar', '', solicitud)
        .then(x => {
          var respuesta = new RespuestaBase(x);
          if(respuesta.exito){
            this.setState({claveActual: "", claveNueva: "", claveRepetida: ""});
            this.utilidades.ocultarCargador();
            this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);
          }
          else{
            if(respuesta.codigo === 403){
              this.mostrarAlertaPop("Atención", respuesta.mensaje, "sesionV", 1);
              this.utilidades.ocultarCargador();
            }
            else{
              this.setState({claveActual: "", claveNueva: "", claveRepetida: ""});
              this.utilidades.ocultarCargador();
              this.utilidades.mostrarAlerta("alertaError", respuesta.mensaje);
            }
          }
          this.datosSesion.guardarTokenPersonal(respuesta.token);
        })
        .catch( data => { 
          this.setState({claveActual: "", claveNueva: "", claveRepetida: ""});
          this.utilidades.ocultarCargador();
          this.utilidades.mostrarAlerta("alertaError", Conexion.instancia().errorGenerico);
        }); 
      }
      else{
        this.setState({claveNueva: '', claveRepetida: ''});
        this.utilidades.mostrarAlerta("alertaError", "La contraseña actual y la contraseña nueva deben de ser diferentes.");
      }
    }
    else{
      this.setState({claveNueva: '', claveRepetida: ''});
      this.utilidades.mostrarAlerta("alertaError", "Nueva contraseña y Repetir nueva contraseña deben de ser iguales.");
    }
  }

  sesionVencida = () => {
    this.datosSesion.cerrarSesion();
    this.redireccionar('autenticacion');
  }

}
  
export default Perfil