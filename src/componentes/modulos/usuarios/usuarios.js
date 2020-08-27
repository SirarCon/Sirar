// REACT
import React, {Component} from 'react';
import $ from 'jquery';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import Header from '../../estructura/header/header';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import SearchBar from 'material-ui-search-bar';
import FormularioUsuario from '../../formularios/formularioUsuario/formularioUsuario';
import Usuario from '../../../modelo/entidades/usuario';
import Conexion from '../../../proveedores/conexion';
import RespuestaBase from '../../../modelo/respuesta/respuestaBase';
import SolicitudUsuario from '../../../modelo/solicitud/solicitudUsuario';
import DatosSesion from '../../../proveedores/datosSesion';
import Dialog from 'material-ui/Dialog';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Utilidades from '../../../proveedores/utilidades';
import RaisedButton from 'material-ui/RaisedButton';


class Usuarios extends Component {

  datosSesion = DatosSesion.instancia();
  utilidades = Utilidades.instancia();

  constructor(){
    super();
    this.state = {
      u: this.datosSesion.obtenerUsuario(),
      usuariosOriginal: [],
      usuariosVista: [],
      banderaCarga: false,
      banderaFormulario: false,
      id: "",
      nombre: "",
      foto: "",
      email: "",
      telefono: "",
      rol: 1,
      formAgregarUsuario: true,
      ejecutarRedireccion: false,
      alertaPop: false,
      tituloAlertaPop: "", 
      mensajeAlertaPop: "", 
      aceptarAlertaPop: "", 
      botonesAlertaPop: 2,
      idValido: false,
      nombreValido: false,
      telefonoValido: true,
      correoValido: false,
      buscarValor: ""
    };
  }

  componentDidMount = () => {
    if(this.datosSesion.obtenerUsuario() === null)
      this.redireccionar('');
    else
      this.cargarUsuarios();
  }

  manejoFormulario = () => {
    if(this.utilidades.obtenerEsMovil()){
      var eventos =  "auto"
      if(this.state.banderaFormulario){
        $('#modalFormUsuario').removeClass("abrirModalForm");
        $('#modalFormUsuario').addClass("cerrarModalForm");
        $('#cuerpoUsuarios').fadeIn(1500);
      }
      else{
        eventos = "none";
        $('#modalFormUsuario').removeClass("cerrarModalForm");
        $('#modalFormUsuario').addClass("abrirModalForm");
        $('#cuerpoUsuarios').fadeOut('fast');
      }
      $('header').css('pointerEvents', eventos);
    }
    this.setState({banderaFormulario: !this.state.banderaFormulario});
  }

  funcionamientoBotonAgregar = () => {
    ($("body").height() < window.innerHeight) ? $('.botonAgregarUsuario').addClass('subirBoton') : null;
      var alturaContenedor = $("body").height() - $("footer").height();
      $(window).scroll(function() {
        $('.botonAgregarUsuario').toggleClass('subirBoton', ($(document).scrollTop() > alturaContenedor))
      });
  }

  estructuraSkeleton = () => {
    var items = [];
    var iterador = 0;
    var cantidadItems = parseInt(window.innerHeight / 102) - 1;
    while(iterador < cantidadItems){
      items.push(
        <section key={iterador}>
          <ListItem
            className="itemUsuario"
            leftAvatar={<p id="fotoSkeleton"><Skeleton/></p>}
            hoverColor="transparent"
            primaryText={<div style={{width: "80%"}}><Skeleton/></div>}
            secondaryText={<div style={{height: "fit-content"}}><div style={{width: "60%"}}><Skeleton/></div><div style={{width: "50%"}}><Skeleton/></div><div style={{width: "30%"}}><Skeleton/></div></div>}
            secondaryTextLines={2}
          />
          <Divider inset={true} />
        </section>
      );
      iterador++;
    }
    return items;
  }

  busqueda = () => {
    return <SearchBar 
      className="barraBusquedaUsuarios"
      hintText="Buscar"
      value={this.state.buscarValor}
      onChange={(valor) => this.buscar(valor)}
      onRequestSearch={(v) => console.log("")}
      maxLength={30}
    />
  }

  buscar = (valor) => {
    this.setState({ buscarValor: valor });
    if(valor === "")
      this.setState({usuariosVista: this.state.usuariosOriginal});
    else{
      var resultados = [];
      valor = valor.toLowerCase();
      this.state.usuariosOriginal.map((u) => {
        if(u.getNombre().toLowerCase().includes(valor) 
        || u.getEmail().toLowerCase().includes(valor) 
        || u.getTelefono().includes(valor) 
        || u.getRolNombre().toLowerCase().includes(valor))
          resultados.push(u);
      });
      this.setState({usuariosVista: resultados});
    }
  }

  redireccionar = (componente) => {
    this.setState({ejecutarRedireccion: true, destino: componente});
  }

  redireccion = () => {
    return (this.state.ejecutarRedireccion) ? <Redirect to={'/' + this.state.destino} /> : null;
  }

  seleccionarUsuario = (usuario) => {
    this.llenarFormUsuario(usuario);
    $(document).ready(() => {
      if(!this.state.formAgregarUsuario){
        this.setState({idValido: true, nombreValido: true, telefonoValido: true, correoValido: true});
        $(".botonAgregarU").css("width", "45%");
        $(".botonEliminarU").css("width", "45%");
        $(".botonEliminarU").css("transform", "scaleX(1)");
        $('#grupoInputs > div:first-child').hide();
        $('#idLabel p').show();
      }
      else{
        this.setState({idValido: false, nombreValido: false, telefonoValido: true, correoValido: false});
        $(".botonEliminarU").css("width", "0%");
        $(".botonEliminarU").css("transform", "scaleX(0)");
        $(".botonAgregarU").css("width", "100%");
        $('#grupoInputs > div:first-child').show();
        $('#idLabel p').hide();
      }
    });
    this.manejoFormulario();
  }

  llenarFormUsuario = (u) => {
    (u == null)
    ? this.setState({formAgregarUsuario: true, nombre: "", email: "", id: "", foto: "", telefono: "", rol: 1})
    : this.setState({formAgregarUsuario: false, nombre: u.getNombre(), email: u.getEmail(), id: u.getId(), foto: u.getFoto(), telefono: u.getTelefono(), rol: u.getRol()});
  }

  getDatosUsuario = (input) => {
    switch(input){
      case "nombre": return this.state.nombre;
      case "id": return this.state.id;
      case "foto": return this.state.foto;
      case "email": return this.state.email;
      case "rol": return this.state.rol;
      case "telefono": return this.state.telefono;
      default: return this.state.nombre;
    }
  }

  setDatosUsuario = (input, valor) => {
    this.setState({
      [input]: valor
    });
  }

  formVacio = () => {
    return (this.getDatosUsuario("nombre") !== "" || this.getDatosUsuario("id") !== "" || this.getDatosUsuario("foto") !== "" 
    || this.getDatosUsuario("email") !== "" || this.getDatosUsuario("telefono") !== "") ? false : true;
  }

  verificarAgregar = () => {
    return this.state.formAgregarUsuario;
  } 

  cerrarAlertaPop = () => {
    this.setState({alertaPop: false});
  }

  mostrarAlertaPop = (titulo, mensaje, aceptar, botones) => {
    this.setState({tituloAlertaPop: titulo, mensajeAlertaPop: mensaje, 
      aceptarAlertaPop: aceptar, botonesAlertaPop: botones, alertaPop: true});
  }

  formValidacion = () => {
    return (this.state.idValido && this.state.nombreValido && this.state.correoValido && this.state.telefonoValido) ? true : false;
  }

  datosFormulario = (dato, valor) => {
    switch(dato){
      case 'email':
        valor = this.utilidades.limitarDato('correo', valor);
        this.setDatosUsuario(dato, valor);
        this.setState({correoValido: this.utilidades.validezDato('correo', valor)});
        break;
      case 'nombre':
        valor = this.utilidades.limitarDato('alfanumericoespacio', valor);
        this.setDatosUsuario(dato, valor);
        this.setState({nombreValido: (valor.length > 4)});
        break;
      case 'telefono':
        valor = this.utilidades.limitarDato('numerico', valor);
        this.setDatosUsuario(dato, valor);
        this.setState({telefonoValido: (valor.length === 0 || valor.length === 8)});
        break;
      case 'id':
        valor = this.utilidades.limitarDato('alfanumerico', valor);
        this.setDatosUsuario(dato, valor);
        this.setState({idValido: (valor.length > 8)});
        break;
      case 'foto':
      case 'rol':
        this.setDatosUsuario(dato, valor);
        break;
      default:
        break;
    }
  }

  alertaPop = () => {
    return <Dialog open={this.state.alertaPop} onClose={this.cerrarAlertaPop} className="alertaPop">
      <DialogTitle className="alertaPopTitulo">{this.state.tituloAlertaPop}</DialogTitle>
      <DialogContent>
        <DialogContentText className="alertaPopMensaje">{this.state.mensajeAlertaPop}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={
            (this.state.aceptarAlertaPop === "eliminarU") 
            ? this.eliminarUsuario 
            : (this.state.aceptarAlertaPop === "sesionV")
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

    render(){
      return(
        <div className="contenidoBody">
            <Header titulo = "Usuarios" />
            <div className="contenedorPagina" id="contenedorUsuarios">

              <div id="encabezadoUsuarios" className="segundoMenu">     
                <div id="tituloRefrescar">
                    <p>Usuarios</p>
                </div>
                {this.busqueda()}
                <RaisedButton 
                    label={<i className="fas fa-retweet"></i>} 
                    className={(this.state.banderaCarga) ? "botonRefrescar desbloqueado" : "botonRefrescar bloqueado"}
                    onClick={this.cargarUsuarios}
                    labelPosition="before"
                />
              </div>
              
              <div id="cuerpoUsuarios">
                <div id="formularioUsuarios">
                  {!this.formVacio() ?
                    <FloatingActionButton 
                      className="botonCerrarForm"
                      onClick={() => this.seleccionarUsuario(null)}
                    >
                      <svg aria-hidden="true" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-times fa-w-10 fa-3x">
                        <path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z">
                        </path>
                      </svg>
                    </FloatingActionButton>
                    : null
                  }
                  <FormularioUsuario 
                  agregarForm = {this.verificarAgregar}
                  getUsuario = {this.getDatosUsuario} 
                  agregarUsuario = {this.agregarUsuario}
                  editarUsuario = {this.editarUsuario}
                  eliminarUsuario = {this.comprobarEliminarUsuario}
                  datosFormulario = {this.datosFormulario}
                  formValidacion = {this.formValidacion}
                  ></FormularioUsuario>
                </div>
                <div id="listadoUsuarios">
                  { this.state.banderaCarga ?
                    <section>
                      <List>
                        {
                          (this.state.usuariosVista.length > 0) ?
                            this.state.usuariosVista.map((u) => 
                              <section key={u.getId()}>
                                <ListItem
                                  className="itemUsuario"
                                  leftAvatar={<Avatar src={u.getFoto()} />}
                                  hoverColor="transparent"
                                  primaryText={u.getNombre()}
                                  onClick={() => this.seleccionarUsuario(u)}
                                  secondaryText={
                                    <p>
                                      <span>{u.getEmail()}</span><br/>
                                      {(u.getTelefono() !== "" && u.getTelefono() !== undefined && u.getTelefono() !== null)
                                        ? <section><span>{u.getTelefono()}</span><br/></section>
                                        : null}
                                      <span id="labelRolUsuario" style={{color: "#C91D32"}}>
                                        {u.getRolNombre()}
                                      </span>
                                    </p>
                                  }
                                  secondaryTextLines={2}
                                />
                                <Divider inset={true} />
                              </section>
                            )
                          :
                            <p className="mensajeSinRegistros">Sin resultados</p>
                        }
                      </List>
                      <FloatingActionButton 
                        className="botonAgregarUsuario"
                        onClick={() => this.seleccionarUsuario(null)}
                      >
                          <ContentAdd />
                      </FloatingActionButton>
                    </section>
                  :
                    <List>
                      <SkeletonTheme>
                        {this.estructuraSkeleton()}
                      </SkeletonTheme>
                    </List>
                  }
                </div>
              </div> 
              <div id="modalFormUsuario">
                <FloatingActionButton 
                  className="botonCerrarForm"
                  onClick={() => this.seleccionarUsuario(null)}
                >
                  <svg aria-hidden="true" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-times fa-w-10 fa-3x">
                    <path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z">
                    </path>
                  </svg>
                </FloatingActionButton>
                <FormularioUsuario 
                  agregarForm = {this.verificarAgregar}
                  getUsuario = {this.getDatosUsuario} 
                  agregarUsuario = {this.agregarUsuario}
                  editarUsuario = {this.editarUsuario}
                  eliminarUsuario = {this.comprobarEliminarUsuario}
                  datosFormulario = {this.datosFormulario}
                  formValidacion = {this.formValidacion}
                ></FormularioUsuario>
              </div>
              {this.alertaPop()}
              {this.redireccion()}
            </div>
        </div>
      )
    }

    cargarUsuarios = () => {
      this.setState({usuariosOriginal: [], usuariosVista: [], banderaCarga: false, buscarValor: ""});
      Conexion.instancia().solicitar('get', 'api/usuarios/', this.state.u.getId(), null)
      .then(x => {
        var respuesta = new RespuestaBase(x);
        if(respuesta.exito){
          respuesta.mensaje.map(u => {
            this.state.usuariosOriginal.push(new Usuario().setJson(u));
          });
          this.setState({usuariosVista: this.state.usuariosOriginal});
        }
        else{
          if(respuesta.codigo === 403)
            this.mostrarAlertaPop("Atención", respuesta.mensaje, "sesionV", 1);
          else
            this.utilidades.mostrarAlerta("alertaError", respuesta.mensaje);
        }
        this.datosSesion.guardarTokenPersonal(respuesta.token);
        this.setState({banderaCarga: true});
        this.funcionamientoBotonAgregar();
      })
      .catch( data => { 
        this.setState({banderaCarga: true});
        this.utilidades.mostrarAlerta("alertaError", Conexion.instancia().errorGenerico);
      }); 
    }

    agregarUsuario = () => {
      this.utilidades.mostrarCargador();
      var usuNuevo = new SolicitudUsuario(this.state.nombre, this.state.foto, this.state.email, this.state.id, this.state.telefono, this.state.rol);
      Conexion.instancia().solicitar('post', 'api/usuarios/', '', JSON.stringify(usuNuevo))
      .then(x => {
        var respuesta = new RespuestaBase(x);
        if(respuesta.exito){
          this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);
          this.utilidades.ocultarCargador();
          this.seleccionarUsuario(null);
          this.cargarUsuarios();
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

    editarUsuario = () => {
      this.utilidades.mostrarCargador();
      var usuModificado = new SolicitudUsuario(this.state.nombre, this.state.foto, this.state.email, this.state.id, this.state.telefono, this.state.rol);
      Conexion.instancia().solicitar('put', 'api/usuario/', this.state.id, JSON.stringify(usuModificado))
      .then(x => {
        var respuesta = new RespuestaBase(x);
        if(respuesta.exito){
          this.utilidades.ocultarCargador();
          this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);          
          this.seleccionarUsuario(null);
          this.cargarUsuarios();
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

    comprobarEliminarUsuario = () => {
      this.mostrarAlertaPop("Eliminar", "¿ Desea eliminar al usuario " +this.state.nombre+ " ?", "eliminarU", 2);
    }

    eliminarUsuario = () => {
      this.cerrarAlertaPop();
      this.utilidades.mostrarCargador();
      Conexion.instancia().solicitar('delete', 'api/usuario/', this.state.id, null)
      .then(x => {
        var respuesta = new RespuestaBase(x);
        if(respuesta.exito){
          this.utilidades.ocultarCargador();
          this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);          
          this.seleccionarUsuario(null);
          this.cargarUsuarios();    
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

    sesionVencida = () => {
      this.datosSesion.cerrarSesion();
      this.redireccionar('autenticacion');
    }

  }
  
  export default Usuarios