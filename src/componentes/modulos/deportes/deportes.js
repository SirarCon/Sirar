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
import Deporte from '../../../modelo/entidades/deporte';
import DatosSesion from '../../../proveedores/datosSesion';
import { Redirect } from 'react-router-dom';
import Dialog from 'material-ui/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button'; 
import FormularioDeporte from '../../formularios/formularioDeporte/formularioDeporte';
import SolicitudDeporte from '../../../modelo/solicitud/solicitudDeporte';

class Deportes extends Component {

    datosSesion = DatosSesion.instancia();
    utilidades = Utilidades.instancia();

    constructor(){
        super();
        this.state = {
            buscarValor: "", deportesOriginal: [], deportesVista: [], banderaCarga: false, ejecutarRedireccion: false,
            indexDeporte: 0, editarDeporte: false, tituloAlertaPop: "", mensajeAlertaPop: "", aceptarAlertaPop: "", 
            botonesAlertaPop: 2, alertaPop: false, nombreValido: false, federacionValido: false, nombre: "", federacion: "",
            activo: true
        };
    }

    componentDidMount = () => {
       this.cargarDeportes();
    }

    redireccionar = (componente) => {
        this.setState({ejecutarRedireccion: true, destino: componente});
    }
    
    redireccion = () => {
        return (this.state.ejecutarRedireccion) ? <Redirect to={'/' + this.state.destino} /> : null;
    }

    busqueda = () => {
        return <SearchBar 
          className="barraBusquedaDeportes"
          hintText="Buscar"
          value={this.state.buscarValor}
          onChange={(valor) => this.buscar("buscarValor", valor)}
          onRequestSearch={(v) => console.log("")}
          maxLength={30}
        />
    }

    seleccionarDeporte = (deporte) => {
        this.setState({editarDeporte: false})
        if(deporte !== undefined){
            this.llenarFormDeporte(deporte);
            $(document).ready(() => {
                this.validarFormularioEdicion()
                if(!this.state.formAgregarDeporte){
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
            $('#modalFormDeporte').removeClass("abrirModalForm");
            $('#modalFormDeporte').addClass("cerrarModalForm");
            $('#cuerpo').show()
        }
        else{
            eventos = "none";
            $('#modalFormDeporte').removeClass("cerrarModalForm");
            $('#modalFormDeporte').addClass("abrirModalForm");
            $('#cuerpo').hide()
        }
        $('header').css('pointerEvents', eventos);
        this.setState({banderaFormulario: !this.state.banderaFormulario});
    }

    llenarFormDeporte = (d) => {
        (d == null)
        ? this.setState({formAgregarDeporte: true, id: "", nombre: "", federacion: "", activo: true})
        : this.setState({formAgregarDeporte: false, id: d.getId(), nombre: d.getNombre(), federacion: d.getFederacion(), activo: d.getActivo()});
    }

    verificarAgregar = () => {
        return this.state.formAgregarDeporte;
    }

    getDatosDeporte = (input) => {
        switch(input){
            case "nombre": return this.state.nombre;
            case "federacion": return this.state.federacion;
            case "activo": return this.state.activo;
            default: return "";
        }
    }

    setDatosDeporte = (input, valor) => {
        this.setState({[input]: valor});
    }

    validarFormularioEdicion = () =>{
        this.datosFormulario("nombre", this.state.nombre)
        this.datosFormulario("federacion", this.state.federacion)
    }

    datosFormulario = (dato, valor) => {
        switch(dato){
            case 'nombre':
                valor = this.utilidades.limitarDato('alfanumericoespacio', valor);
                this.setDatosDeporte(dato, valor);
                this.setState({nombreValido: (valor.length > 2)});
                break;
            case 'federacion':
                this.setDatosDeporte(dato, valor);
                this.setState({federacionValido: (valor.toString().length > 0)});
                break;
            default:
                this.setDatosDeporte(dato, valor);
                break;
        }
    }

    formValidacion = () => {
        return (this.state.nombreValido && this.state.federacionValido) ? true : false;
    }

    mostrarDetalle = (deporte) => {
        if(this.state.editarDeporte){
            this.seleccionarDeporte(deporte)
        }
        else{
            if(deporte !== undefined && deporte !== null && deporte !== ""){
                this.datosSesion.guardarDeporteDetalle(deporte);
                this.redireccionar("detalleDeporte");
            }
        }
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

    buscar = (dato, valor) => {
        this.setState({ [dato]: valor });
        setTimeout(() => {
            var resultados = [];
            this.state.deportesOriginal.map((d) => {
                if(this.state.buscarValor === "" || d.getNombre().toLowerCase().includes(this.state.buscarValor.toLowerCase()))
                    resultados.push(d);
            });
            this.setState({deportesVista: resultados});
        }, 0);
    }

    estructuraSkeleton = () => {
        var tabla = [];
        var fila = [];
        var filaID = 0;
        var columnaID = 0;
        var cantidadColumnas = (this.utilidades.obtenerEsMovil()) ? 1 : parseInt(window.innerWidth / 200) - 1;
        var cantidadFilas = 3
        while(filaID < cantidadFilas){
            fila.push(<tr key={filaID}><div className="cardDeporte cardSkeleton"><Skeleton></Skeleton></div></tr>)
            filaID++;
        }
        while(columnaID < cantidadColumnas){
          tabla.push(<td key={columnaID}>{fila}</td>);
          columnaID++;
        }
        return tabla;
    }

    desplegarDeportes = () => {
        var tabla = [];
        var index = 0;
        var cantidadColumnas = (this.utilidades.obtenerEsMovil()) ? 1 : parseInt(window.innerWidth / 200) - 1;
        var cantidadFilas = Math.ceil(this.state.deportesVista.length / cantidadColumnas);
        var filaID = 0;
        var columnas = [];
        while(filaID < cantidadFilas){
            columnas = this.crearColumnasDeportes(cantidadColumnas, index)
            index = index + (columnas.length)
            tabla.push(<tr key={filaID}>{columnas}</tr>);
            filaID++;
        }
        return tabla;
    }

    crearColumnasDeportes = (cantidadColumnas, index) => {
        var columna = [];
        var columnaID = 0;
        var deporte = null;
        while(columnaID < cantidadColumnas){
            if (index < this.state.deportesVista.length){
                deporte = this.state.deportesVista[index];
                    columna.push(<td key={columnaID}>
                        <div className={deporte.getActivo() ? "cardDeporte" : "cardDeporte desactivo"} name={index} onClick={this.mostrarDetalle.bind(this, deporte)}>
                            {this.state.editarDeporte ? <button name={index}><i className="far fa-edit"></i></button> : null}
                            <div id="info">
                                <p id="nombre">{deporte.getNombre()}</p>
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
                <Header titulo = "Deportes" />
                <div className="contenedorPagina" id="contenedorDeportes">
                    <div id="encabezadoDeportes" className="segundoMenu">     
                        <div id="tituloRefrescar">
                            <p>Deportes</p>
                        </div>
                        {this.busqueda()}
                    </div>
                    <div id="cuerpo" >
                        { this.state.banderaCarga ?
                            <section key="">
                            { (this.state.deportesVista.length > 0) ?
                                <table>
                                    {this.desplegarDeportes()}
                                </table>
                            : <p className="mensajeSinRegistros">Sin resultados</p>
                            }
                            {this.datosSesion.esAdministrador() ? 
                                <section>
                                    <FloatingActionButton 
                                        className="botonHabilitarEdicionDeporte"
                                        onClick={() => this.setState({editarDeporte: !this.state.editarDeporte})}
                                    >
                                        { this.state.editarDeporte ? <i className="fas fa-times"></i> : <i className="far fa-edit"></i>}
                                    </FloatingActionButton>
                                    <FloatingActionButton 
                                        className="botonAgregarDeporte"
                                        onClick={() => this.seleccionarDeporte(null)}
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
                    <div id="modalFormDeporte">
                        <FloatingActionButton 
                            className="botonCerrarForm"
                            onClick={() => this.seleccionarDeporte(null)}
                        >
                            <svg aria-hidden="true" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-times fa-w-10 fa-3x">
                                <path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z">
                                </path>
                            </svg>
                        </FloatingActionButton>
                        <FormularioDeporte
                            agregarForm = {this.verificarAgregar}
                            getDeporte = {this.getDatosDeporte} 
                            agregarDeporte = {this.agregarDeporte}
                            editarDeporte = {this.editarDeporte}
                            datosFormulario = {this.datosFormulario}
                            formValidacion = {this.formValidacion}
                        ></FormularioDeporte>
                    </div>
                    {this.alertaPop()}
                    {this.redireccion()}
                </div>
            </div>
        )
    }

    cargarDeportes = () => {
        this.setState({deportesOriginal: [], deportesVista: [], banderaCarga: false, buscarValor: ""});
        var deporte = null;
        Conexion.instancia().solicitar('get', (this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 'api/deportes/' : 'deportes/', '', null)
            .then(x => {
                var respuesta = new RespuestaBase(x);
                if(respuesta.exito){
                    respuesta.mensaje.map(a => {
                        deporte = new Deporte().setJson(a);
                        if(this.datosSesion.esAdministrador())
                            this.state.deportesOriginal.push(deporte);
                        else
                            deporte.getActivo() ? this.state.deportesOriginal.push(deporte) : null;
                    });
                    this.setState({deportesVista: this.state.deportesOriginal});
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

    agregarDeporte = () => {
        this.utilidades.mostrarCargador();
        var deporteNuevo = new SolicitudDeporte(this.state.id,this.state.nombre,this.state.federacion,this.state.activo);
        Conexion.instancia().solicitar('post', 'api/deportes/', '', JSON.stringify(deporteNuevo))
        .then(x => {
            var respuesta = new RespuestaBase(x);
            if(respuesta.exito){
                this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);
                this.utilidades.ocultarCargador();
                this.seleccionarDeporte(null);
                this.cargarDeportes();
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

    editarDeporte = () => {
        this.utilidades.mostrarCargador();
        var deporteModificado = new SolicitudDeporte(this.state.id,this.state.nombre,this.state.federacion,this.state.activo);
        Conexion.instancia().solicitar('put', 'api/deporte/', this.state.id, JSON.stringify(deporteModificado))
        .then(x => {
            var respuesta = new RespuestaBase(x);
            if(respuesta.exito){
                this.utilidades.ocultarCargador();
                this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);          
                this.seleccionarDeporte(null);
                this.cargarDeportes();
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

export default Deportes