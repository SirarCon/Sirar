import React, {Component} from 'react'
import Header from '../../estructura/header/header';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import SearchBar from 'material-ui-search-bar';
import Utilidades from '../../../proveedores/utilidades';
import Skeleton  from 'react-loading-skeleton';
import Conexion from '../../../proveedores/conexion';
import RespuestaBase from '../../../modelo/respuesta/respuestaBase';
import $ from 'jquery';
import Federacion from '../../../modelo/entidades/federacion';
import DatosSesion from '../../../proveedores/datosSesion';
import { Redirect } from 'react-router-dom';
import Dialog from 'material-ui/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import FormularioFederacion from '../../formularios/formularioFederacion/formularioFederacion';
import SolicitudFederacion from '../../../modelo/solicitud/solicitudFederacion';

class Federaciones extends Component {

    datosSesion = DatosSesion.instancia();
    utilidades = Utilidades.instancia();

    constructor(){
        super();
        this.state = {
            buscarValor: "", federacionesOriginal: [], federacionesVista: [], banderaCarga: false, ejecutarRedireccion: false,
            indexFederaciones: 0, editarfederacion: false, tituloAlertaPop: "", mensajeAlertaPop: "", aceptarAlertaPop: "", 
            botonesAlertaPop: 2, alertaPop: false, formAgregarFederacion: true, id: "", nombre: "", escudo: "", 
            paginaWeb: "", ubicacion: "", telefono1: "", telefono2: "", correoFederacion: "", presidente: "", 
            correoPresidente: "", activo: true, nombreValido: false, telefono1Valido: false, telefono2Valido: false, 
            correoFederacionValido: false, correoPresidenteValido: false, editarFederacion: false, banderaFormulario: false
        };
    }

    componentDidMount = () => {
       this.cargarFederaciones();
    }

    redireccionar = (componente) => {
        this.setState({ejecutarRedireccion: true, destino: componente});
    }

    redireccion = () => {
        return (this.state.ejecutarRedireccion) ? <Redirect to={'/' + this.state.destino} /> : null;
    }

    busqueda = () => {
        return <SearchBar 
          className="barraBusquedaFederaciones"
          hintText="Buscar"
          value={this.state.buscarValor}
          onChange={(valor) => this.buscar("buscarValor", valor)}
          onRequestSearch={(v) => console.log("")}
          maxLength={30}
        />
    }

    buscar = (dato, valor) => {
        this.setState({ [dato]: valor });
        setTimeout(() => {
            var resultados = [];
            this.state.federacionesOriginal.map((d) => {
                if(this.state.buscarValor === "" || d.getNombre().toLowerCase().includes(this.state.buscarValor.toLowerCase()))
                    resultados.push(d);
            });
            this.setState({federacionesVista: resultados});
        }, 0);
    }

    mostrarDetalle = (federacion) => {
        if(this.state.editarFederacion){
            this.seleccionarFederacion(federacion)
        }
        else{
            if(federacion !== undefined && federacion !== null && federacion !== ""){
                this.datosSesion.guardarFederacionDetalle(federacion);
                this.redireccionar("detalleFederacion");
            }
        }
    }

    seleccionarFederacion = (federacion) => {
        this.setState({editarFederacion: false})
        if(federacion !== undefined){
            this.llenarFormFederacion(federacion);
            $(document).ready(() => {
                this.validarFormularioEdicion()
                if(!this.state.formAgregarFederacion){
                    $(".botonAgregarU").css("width", "45%");
                    $(".botonEliminarU").css("width", "45%");
                    $(".botonEliminarU").css("transform", "scaleX(1)");
                }
                else{
                    $(".botonEliminarU").css("width", "0%");
                    $(".botonEliminarU").css("transform", "scaleX(0)");
                    $(".botonAgregarU").css("width", "100%");
                }
            });
            this.manejoFormulario();
        }
    }

    manejoFormulario = () => {
        var eventos =  "auto"
        if(this.state.banderaFormulario){
            $('#modalFormFederacion').removeClass("abrirModalForm");
            $('#modalFormFederacion').addClass("cerrarModalForm");
            $('#cuerpoFederaciones').show();
        }
        else{
            eventos = "none";
            $('#modalFormFederacion').removeClass("cerrarModalForm");
            $('#modalFormFederacion').addClass("abrirModalForm");
            $('#cuerpoFederaciones').hide();
        }
        $('header').css('pointerEvents', eventos);
        this.setState({banderaFormulario: !this.state.banderaFormulario});
    }

    llenarFormFederacion = (f) => {
        (f == null)
        ? this.setState({formAgregarFederacion: true, id : "", nombre : "", escudo : "", paginaWeb : "", telefono1 : "", 
        telefono2 : "", ubicacion : "", correoFederacion : "", presidente : "", correoPresidente : "", activo : true})
        : this.setState({formAgregarFederacion: false, id: f.getId(), nombre: f.getNombre(), escudo: f.getFoto(), 
        paginaWeb: f.getWeb(), ubicacion: f.getUbicacion(), correoFederacion: f.getEmail(), telefono1: f.getTelefono1(), 
        telefono2: f.getTelefono2(), presidente: f.getNombrePresidente(), correoPresidente: f.getEmailPresidente(), 
        activo: f.getActivo()});
    }

    verificarAgregar = () => {
        return this.state.formAgregarFederacion;
    } 

    getDatosFederacion = (input) => {
        switch(input){
            case "nombre": return this.state.nombre;
            case "paginaWeb": return this.state.paginaWeb;
            case "ubicacion": return this.state.ubicacion;
            case "telefono1": return this.state.telefono1;
            case "telefono2": return this.state.telefono2;
            case "correoFederacion": return this.state.correoFederacion;
            case "presidente": return this.state.presidente;
            case "correoPresidente": return this.state.correoPresidente;
            case "activo": return this.state.activo;
            case "escudo": return this.state.escudo;
            default: return "";
        }
    }

    setDatosFederacion = (input, valor) => {
        this.setState({[input]: valor});
    }

    validarFormularioEdicion = () =>{
        this.datosFormulario("nombre", this.state.nombre)
        this.datosFormulario("telefono1", this.state.telefono1)
        this.datosFormulario("telefono2", this.state.telefono2)
        this.datosFormulario("correoFederacion", this.state.correoFederacion)
        this.datosFormulario("presidente", this.state.presidente)
        this.datosFormulario("correoPresidente", this.state.correoPresidente)
    }

    datosFormulario = (dato, valor) => {
        switch(dato){
            case 'nombre':
                valor = this.utilidades.limitarDato('alfanumericoespacio', valor);
                this.setDatosFederacion(dato, valor);
                this.setState({nombreValido: (valor.length > 4)});
                break;
            case 'telefono1':
                valor = this.utilidades.limitarDato('numerico', valor);
                this.setDatosFederacion(dato, valor);
                this.setState({telefono1Valido: (valor.length === 0 || valor.length === 8)});
                break;
            case 'telefono2':
                valor = this.utilidades.limitarDato('numerico', valor);
                this.setDatosFederacion(dato, valor);
                this.setState({telefono2Valido: (valor.length === 0 || valor.length === 8)});
                break;
            case 'correoFederacion':
                valor = this.utilidades.limitarDato('correo', valor);
                this.setDatosFederacion(dato, valor);
                this.setState({correoFederacionValido: (valor.length === 0 || this.utilidades.validezDato('correo', valor))});
                break;
            case 'presidente':
                valor = this.utilidades.limitarDato('alfanumericoespacio', valor);
                this.setDatosFederacion(dato, valor);
                this.setState({presidenteValido: true});
                break;
            case 'correoPresidente':
                valor = this.utilidades.limitarDato('correo', valor);
                this.setDatosFederacion(dato, valor);
                this.setState({correoPresidenteValido: (valor.length === 0 || this.utilidades.validezDato('correo', valor))});
                break;
            default:
                this.setDatosFederacion(dato, valor);
                break;
        }
    }

    formValidacion = () => {
        return (this.state.nombreValido && this.state.telefono1Valido && this.state.telefono2Valido &&
        this.state.correoFederacionValido && this.state.presidenteValido && this.state.correoPresidenteValido) ? true : false;
    }

    cerrarAlertaPop = () => {
        this.setState({alertaPop: false});
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

    sesionVencida = () => {
        this.datosSesion.cerrarSesion();
        this.redireccionar('autenticacion');
    }

    estructuraSkeleton = () => {
        var tabla = [];
        var fila = [];
        var filaID = 0;
        var columnaID = 0;
        var cantidadColumnas = (this.utilidades.obtenerEsMovil()) ? 1 : parseInt(window.innerWidth / 400);
        var cantidadFilas = 3
        while(filaID < cantidadFilas){
            fila.push(<tr key={filaID}><div className="cardFederacion cardSkeleton"><Skeleton></Skeleton></div></tr>)
            filaID++;
        }
        while(columnaID < cantidadColumnas){
          tabla.push(<td key={columnaID}>{fila}</td>);
          columnaID++;
        }
        return tabla;
    }

    desplegarFederaciones = () => {
        var tabla = [];
        var index = 0;
        var cantidadColumnas = (this.utilidades.obtenerEsMovil()) ? 1 : parseInt(window.innerWidth / 400);
        var cantidadFilas = Math.ceil(this.state.federacionesVista.length / cantidadColumnas);
        var filaID = 0;
        var columnas = [];
        while(filaID < cantidadFilas){
            columnas = this.crearColumnasFederaciones(cantidadColumnas, index)
            index = index + (columnas.length)
            tabla.push(<tr key={filaID}>{columnas}</tr>);
            filaID++;
        }
        return tabla;
    }

    crearColumnasFederaciones = (cantidadColumnas, index) => {
        var columna = [];
        var columnaID = 0;
        var federacion = null;
        while(columnaID < cantidadColumnas){
            if (index < this.state.federacionesVista.length){
                federacion = this.state.federacionesVista[index];
                    columna.push(<td key={columnaID}>
                        <div className={federacion.getActivo() ? "cardFederacion" : "cardFederacion desactivo"} name={index} onClick={this.mostrarDetalle.bind(this, federacion)}>
                            {this.state.editarFederacion ? <button name={index}><i className="far fa-edit"></i></button> : null}
                            <div id="info">
                                <div className="escudoFed" hidden={federacion.getFoto() == ""}>
                                    <img src={federacion.getFoto()} alt=""/>
                                </div>
                                <div className={federacion.getFoto() == "" ? "nombreW" : "nombre"} >
                                    <p>{federacion.getNombre()}</p>
                                </div>
                            </div>
                        </div>
                    </td>)
            }
            columnaID++;
            index++;
        }
        return columna;
    }

    render(){
        return(
            <div className="contenidoBody">
                <Header titulo = "Federaciones" />
                <div className="contenedorPagina" id="contenedorFederaciones">
                    <div id="encabezadoFederaciones" className="segundoMenu">     
                        <div id="tituloRefrescar">
                            <p>Federaciones</p>
                        </div>
                        {this.busqueda()}
                    </div>
                    <div id="cuerpoFederaciones" >
                        { this.state.banderaCarga ?
                            <section key="">
                            { (this.state.federacionesVista.length > 0) ?
                                <table>
                                    {this.desplegarFederaciones()}
                                </table>
                            : <p className="mensajeSinRegistros">Sin resultados</p>
                            }
                            {this.datosSesion.esAdministrador() ? 
                                <section>
                                    <FloatingActionButton 
                                        className="botonHabilitarEdicionFederacion"
                                        onClick={() => this.setState({editarFederacion: !this.state.editarFederacion})}
                                    >
                                        { this.state.editarFederacion ? <i className="fas fa-times"></i> : <i className="far fa-edit"></i>}
                                    </FloatingActionButton>
                                    <FloatingActionButton 
                                        className="botonAgregarFederacion"
                                        onClick={() => this.seleccionarFederacion(null)}
                                    >
                                        <ContentAdd />
                                    </FloatingActionButton>
                                </section>
                            : null}
                            </section>
                        :
                            <table>
                                {this.estructuraSkeleton()}
                            </table>
                        }
                    </div>
                    <div id="modalFormFederacion">
                        <FloatingActionButton 
                            className="botonCerrarForm"
                            onClick={() => this.seleccionarFederacion(null)}
                        >
                            <svg aria-hidden="true" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-times fa-w-10 fa-3x">
                                <path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z">
                                </path>
                            </svg>
                        </FloatingActionButton>
                        <FormularioFederacion
                            agregarForm = {this.verificarAgregar}
                            getFederacion = {this.getDatosFederacion} 
                            agregarFederacion = {this.agregarFederacion}
                            editarFederacion = {this.editarFederacion}
                            datosFormulario = {this.datosFormulario}
                            formValidacion = {this.formValidacion}
                        ></FormularioFederacion>
                    </div>
                    {this.alertaPop()}
                    {this.redireccion()}
                </div>
            </div>
        )
    }

    cargarFederaciones = () => {
        this.setState({federacionesOriginal: [], federacionesVista: [], banderaCarga: false, buscarValor: ""});
        var federacion = null;
        Conexion.instancia().solicitar('get', (this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 'api/federaciones/' : 'federaciones/', '', null)
            .then(x => {
                var respuesta = new RespuestaBase(x);
                if(respuesta.exito){
                    respuesta.mensaje.map(a => {
                        federacion = new Federacion().setJson(a);
                        if(this.datosSesion.esAdministrador())
                            this.state.federacionesOriginal.push(federacion);
                        else
                            federacion.getActivo() ? this.state.federacionesOriginal.push(federacion) : null;
                    });
                    this.setState({federacionesVista: this.state.federacionesOriginal});
                }
                else{
                    if(respuesta.codigo === 403)
                        this.mostrarAlertaPop("Atención", respuesta.mensaje, "sesionV", 1);
                    else
                        this.utilidades.mostrarAlerta("alertaError", respuesta.mensaje);
                }
                this.datosSesion.guardarTokenPersonal(respuesta.token);
                this.setState({banderaCarga: true});
            })
            .catch( data => { 
                this.setState({banderaCarga: true});
                this.utilidades.mostrarAlerta("alertaError", Conexion.instancia().errorGenerico);
            }); 
    }

    agregarFederacion = () => {
        this.utilidades.mostrarCargador();
        var federacionNueva = new SolicitudFederacion(this.state.id,this.state.nombre,this.state.escudo,this.state.paginaWeb,
            this.state.ubicacion,this.state.telefono1,this.state.telefono2,this.state.correoFederacion,this.state.presidente,
            this.state.correoPresidente,this.state.activo);
        Conexion.instancia().solicitar('post', 'api/federaciones/', '', JSON.stringify(federacionNueva))
        .then(x => {
            var respuesta = new RespuestaBase(x);
            if(respuesta.exito){
                this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);
                this.utilidades.ocultarCargador();
                this.seleccionarFederacion(null);
                this.cargarFederaciones();
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

    editarFederacion = () => {
        this.utilidades.mostrarCargador();
        var federacionModificada = new SolicitudFederacion(this.state.id,this.state.nombre,this.state.escudo,this.state.paginaWeb,
            this.state.ubicacion,this.state.telefono1,this.state.telefono2,this.state.correoFederacion,this.state.presidente,
            this.state.correoPresidente,this.state.activo);
        Conexion.instancia().solicitar('put', 'api/federacion/', this.state.id, JSON.stringify(federacionModificada))
        .then(x => {
            var respuesta = new RespuestaBase(x);
            if(respuesta.exito){
                this.utilidades.ocultarCargador();
                this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);          
                this.seleccionarFederacion(null);
                this.cargarFederaciones();
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
}

export default Federaciones