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
import DatosSesion from '../../../proveedores/datosSesion';
import { Redirect } from 'react-router-dom';
import Dialog from 'material-ui/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Evento from '../../../modelo/entidades/evento';
import SolicitudEvento from '../../../modelo/solicitud/solicitudEvento';
import { Tabs, Tab, Paper } from 'material-ui';
import { FormControl, InputLabel, Select } from '@material-ui/core';
import FormularioEvento from '../../formularios/formularioEvento/formularioEvento';

class Eventos extends Component {

    datosSesion = DatosSesion.instancia();
    utilidades = Utilidades.instancia();

    constructor(){
        super();
        this.state = {
            buscarValor: "", eventosAnterioresOriginal: [], eventosActualesOriginal: [], eventosProximosOriginal: [],
            eventosAnterioresVista: [], eventosActualesVista: [], eventosProximosVista: [], banderaCarga: false, 
            ejecutarRedireccion: false, indexEvento: 0, editarEvento: false, tituloAlertaPop: "", mensajeAlertaPop: "", 
            aceptarAlertaPop: "", botonesAlertaPop: 2, alertaPop: false, nombreValido: false, paisValido: false, 
            inicioValido: false, finalValido: false, codigoPaisValido: false, nombre: "", foto: "", pais: "", codigoPais: "", 
            ciudad: "", inicio: "", final: "", activo: true, mostrarFiltros: false, estado: "", valorTab: "1"
        };
    }

    componentDidMount = () => {
       this.cargarEventos();
    }

    redireccionar = (componente) => {
        this.setState({ejecutarRedireccion: true, destino: componente});
    }
    
    redireccion = () => {
        return (this.state.ejecutarRedireccion) ? <Redirect to={'/' + this.state.destino} /> : null;
    }

    busqueda = () => {
        return <SearchBar 
          className="barraBusquedaEventos"
          hintText="Buscar"
          value={this.state.buscarValor}
          onChange={(valor) => this.buscar("buscarValor", valor)}
          onRequestSearch={(v) => console.log("")}
          maxLength={30}
        />
    }

    toggleFiltros = () => {
        this.setState({mostrarFiltros: !this.state.mostrarFiltros});
        let height = this.state.mostrarFiltros ? 52 : 150;
        $('document').ready(() => {
            $( "#filters" ).css('transform', 'scale(' + ((this.state.mostrarFiltros) ? 1 : 0) + ')');
            $( "#filters select" ).css("pointer-events", (this.state.mostrarFiltros) ? "auto" : "none");
            $( "#encabezadoEventos" ).animate({ height: height+'px'}, 200, 
            () => { $( "#filters" ).animate({ opacity: this.state.mostrarFiltros ? 1 : 0 }, 250,
            () => { $( "#cuerpoEventos" ).animate({ paddingTop: height+'px'}, 400) })});
        });
        (this.state.mostrarFiltros) ? this.limpiarBusqueda() : null;
    }

    limpiarBusqueda = () => {
        setTimeout(() => {
            this.setState({pais: ""});
            this.buscar("nombre", "")
        }, 350);
    }

    cambioFiltro = event => { this.buscar(event.target.name, event.target.value); };
    
    seleccionarEvento = (evento) => {
        this.setState({editarEvento: false})
        if(evento !== undefined){
            this.llenarFormEvento(evento);
            $(document).ready(() => {
                this.validarFormularioEdicion()
                if(!this.state.formAgregarEvento){
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
            $('#modalFormEvento').removeClass("abrirModalForm");
            $('#modalFormEvento').addClass("cerrarModalForm");
            $('#cuerpoEventos').show()
        }
        else{
            eventos = "none";
            $('#modalFormEvento').removeClass("cerrarModalForm");
            $('#modalFormEvento').addClass("abrirModalForm");
            $('#cuerpoEventos').hide()
        }
        $('header').css('pointerEvents', eventos);
        this.setState({banderaFormulario: !this.state.banderaFormulario});
    }

    llenarFormEvento = (e) => {
        (e == null)
        ? this.setState({formAgregarEvento: true, id: "", nombre: "", foto: "", codigoPais: "", ciudad: "", inicio: "", final: "", activo: true})
        : this.setState({formAgregarEvento: false, id: e.getId(), nombre: e.getNombre(), foto: e.getFoto(), codigoPais: e.getCodigoPais(), ciudad: e.getCiudad(), 
            inicio: e.getInicial(), final: e.getFinal(), activo: e.getActivo()})
    }

    verificarAgregar = () => {
        return this.state.formAgregarEvento;
    }

    getDatosEvento = (input) => {
        switch(input){
            case "nombre": return this.state.nombre;
            case "foto": return this.state.foto;
            case "codigoPais": return this.state.codigoPais;
            case "ciudad": return this.state.ciudad;
            case "inicio": return this.state.inicio;
            case "final": return this.state.final;
            case "activo": return this.state.activo;
            default: return "";
        }
    }

    setDatosEvento = (input, valor) => {
        this.setState({[input]: valor});
    }

    validarFormularioEdicion = () =>{
        this.datosFormulario("nombre", this.state.nombre)
        this.datosFormulario("codigoPais", this.state.codigoPais)
        this.datosFormulario("inicio", this.state.inicio)
        this.datosFormulario("final", this.state.final)
    }

    datosFormulario = (dato, valor) => {
        switch(dato){
            case 'nombre':
                valor = this.utilidades.limitarDato('alfanumericoespacio', valor);
                this.setDatosEvento(dato, valor);
                this.setState({nombreValido: (valor.length > 2)});
                break;
            case 'codigoPais':
                this.setDatosEvento(dato, valor);
                this.setState({paisValido: (valor.toString().length > 0)});
                break;
            case 'inicio':
                this.setDatosEvento(dato, valor);
                this.setState({inicioValido: (valor.length > 7)});
                break;
            case 'final':
                this.setDatosEvento(dato, valor);
                this.setState({finalValido: (valor.length > 7)});
                break;
            default:
                this.setDatosEvento(dato, valor);
                break;
        }
    }

    formValidacion = () => {
        return (this.state.nombreValido && this.state.paisValido && this.state.inicioValido && this.state.finalValido) ? true : false;
    }

    mostrarDetalle = (evento) => {
        if(this.state.editarEvento){
            this.seleccionarEvento(evento)
        }
        else{
            if(evento !== undefined && evento !== null && evento !== ""){
                this.datosSesion.guardarEventoDetalle(evento);
                this.redireccionar("detalleEvento");
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

    filtrar(eventos){
        var resultados = [];
        eventos.map((d) => {
            if(this.state.buscarValor === "" || d.getNombre().toLowerCase().includes(this.state.buscarValor.toLowerCase()) 
            || d.getCiudad().toLowerCase().includes(this.state.buscarValor.toLowerCase()) 
            || d.getInicial().toLowerCase().includes(this.state.buscarValor.toLowerCase())
            || d.getFinal().toLowerCase().includes(this.state.buscarValor.toLowerCase())){
                if(this.state.pais === "" || d.getCodigoPais() == this.state.pais){
                    if(this.state.estado === "" || d.getEstado() == this.state.estado){
                        resultados.push(d);
                    }
                }
            }
        });
        return resultados;
    }

    buscar = (dato, valor) => {
        this.setState({ [dato]: valor });
        setTimeout(() => {
            this.setState({eventosAnterioresVista: this.filtrar(this.state.eventosAnterioresOriginal)});
            this.setState({eventosActualesVista: this.filtrar(this.state.eventosActualesOriginal)});
            this.setState({eventosProximosVista: this.filtrar(this.state.eventosProximosOriginal)});
        }, 0);
    }

    opcionesPaises(){
        var opciones = [];
        this.datosSesion.obtenerCatalogoPaises().map(p => {
            opciones.push(<option value={p.getId()} key={p.getId()}>{p.getNombre()}</option>);
        });
        return opciones;
    }

    estructuraSkeleton = () => {
        var tabla = [];
        var fila = [];
        var filaID = 0;
        var columnaID = 0;
        var cantidadColumnas = (this.utilidades.obtenerEsMovil()) ? 1 : parseInt(window.innerWidth / 400);
        var cantidadFilas = 3
        while(filaID < cantidadFilas){
            fila.push(<tr key={filaID}><div className="cardEvento cardSkeleton"><Skeleton></Skeleton></div></tr>)
            filaID++;
        }
        while(columnaID < cantidadColumnas){
          tabla.push(<td key={columnaID}>{fila}</td>);
          columnaID++;
        }
        return tabla;
    }

    desplegarEventos = (eventos) => {
        var tabla = [];
        var index = 0;
        var cantidadColumnas = (this.utilidades.obtenerEsMovil()) ? 1 : parseInt(window.innerWidth / 400);
        var cantidadFilas = Math.ceil(eventos.length / cantidadColumnas);
        var filaID = 0;
        var columnas = [];
        while(filaID < cantidadFilas){
            columnas = this.crearColumnasEventos(cantidadColumnas, index, eventos)
            index = index + (columnas.length)
            tabla.push(<tr key={filaID}>{columnas}</tr>);
            filaID++;
        }
        return tabla;
    }

    crearColumnasEventos = (cantidadColumnas, index, eventos) => {
        var columna = [];
        var columnaID = 0;
        var evento = null;
        while(columnaID < cantidadColumnas){
            if (index < eventos.length){
                evento = eventos[index];
                    columna.push(<td key={columnaID}>
                        <div className={"cardEvento" + (!evento.getActivo() ? " desactivo" : "")} name={index} onClick={this.mostrarDetalle.bind(this, evento)}>
                            {this.state.editarEvento ? <button name={index}><i className="far fa-edit"></i></button> : null}
                            <div id="info">
                                <div className="imgEvento" hidden={evento.getFoto() == ""}>
                                    <img src={evento.getFoto()} alt=""/>
                                </div>
                                <div className={evento.getFoto() == "" ? "datosEventoW" : "datosEvento"} >
                                    <p id="nombre">{evento.getNombre()}</p>
                                    <p id="pais">{evento.getNombrePais() + " " + evento.getAnno()}</p>
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

    handleTabChange = (event) => {
        this.setState({valorTab: event});
        if(event == "0"){ // 0: ANTERIOR
            {this.desplegarEventos(this.state.eventosAnterioresVista)}
        }
        else if(event == "1"){ // 1: ACTUAL
            {this.desplegarEventos(this.state.eventosActualesVista)}
        }
        else if(event == "2"){ // 2: PROXIMO
            {this.desplegarEventos(this.state.eventosProximosVista)}
        }
    };

    validarContenido = () => {        
        if(this.state.valorTab == "0"){ // 0: ANTERIOR
            return this.desplegarContenido(this.state.eventosAnterioresVista)
        }
        else if(this.state.valorTab == "1"){ // 1: ACTUAL
            return this.desplegarContenido(this.state.eventosActualesVista)
        }
        else if(this.state.valorTab == "2"){ // 2: PROXIMO
            return this.desplegarContenido(this.state.eventosProximosVista)
        }
    };

    desplegarContenido(eventos){
        return <section>
        { (eventos.length > 0) ?
            <table>
                {this.desplegarEventos(eventos)}
            </table>
        : <p className="mensajeSinRegistros">Sin resultados</p>
        } 
        </section>
    }

    render(){
        return(
            <div className="contenidoBody">
                <Header titulo = "Eventos" />
                <div className="contenedorPagina" id="contenedorEventos">
                    <div id="encabezadoEventos" className="segundoMenu">     
                        <div id="tituloRefrescar">
                            <p>Eventos</p>
                        </div>
                        {this.busqueda()}
                        <div id="filters">
                            <form className="form" autoComplete="off">
                                <FormControl className="botonBusqAvanzada">
                                    <InputLabel htmlFor="pais-simple">País</InputLabel>
                                    <Select
                                        native
                                        value={this.state.pais}
                                        onChange={this.cambioFiltro}
                                        inputProps={{
                                            name: 'pais',
                                            id: 'pais-simple',
                                        }}
                                    >
                                        <option value=""/>
                                        {this.opcionesPaises()}
                                    </Select>
                                </FormControl>
                            </form>
                        </div>
                    </div>
                    <div className="tabs">
                        <Paper square="true">
                            <Tabs
                                value={this.state.valorTab}
                                onChange={this.handleTabChange}
                            >
                                <Tab label="Anteriores" value="0"/>
                                <Tab label="Actuales" value="1"/>
                                <Tab label="Próximos" value="2"/>
                            </Tabs>
                        </Paper>
                    </div>
                    <div id="cuerpoEventos" >
                        { this.state.banderaCarga ?
                            <section key="">
                            {this.validarContenido()}
                            {(this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ?
                                <section>
                                    <FloatingActionButton 
                                        className="botonHabilitarEdicionEvento"
                                        onClick={() => this.setState({editarEvento: !this.state.editarEvento})}
                                    >
                                        { this.state.editarEvento ? <i className="fas fa-times"></i> : <i className="far fa-edit"></i>}
                                    </FloatingActionButton>
                                    <FloatingActionButton 
                                        className="botonAgregarEvento"
                                        onClick={() => this.seleccionarEvento(null)}
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
                    <div id="modalFormEvento">
                        <FloatingActionButton 
                            className="botonCerrarForm"
                            onClick={() => this.seleccionarEvento(null)}
                        >
                            <svg aria-hidden="true" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-times fa-w-10 fa-3x">
                                <path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z">
                                </path>
                            </svg>
                        </FloatingActionButton>
                        {
                        <FormularioEvento
                            agregarForm = {this.verificarAgregar}
                            getEvento = {this.getDatosEvento} 
                            agregarEvento = {this.agregarEvento}
                            editarEvento = {this.editarEvento}
                            datosFormulario = {this.datosFormulario}
                            formValidacion = {this.formValidacion}
                        ></FormularioEvento>
                        }
                    </div>
                    {this.alertaPop()}
                    {this.redireccion()}
                </div>
            </div>
        )
    }

    clasificarEventos = (evento) => {
        if(evento.getEstado() == "0"){ // 0: ANTERIOR
            this.state.eventosAnterioresOriginal.push(evento);
        }
        else if(evento.getEstado() == "1"){ // 1: ACTUAL
            this.state.eventosActualesOriginal.push(evento);
        }
        else if(evento.getEstado() == "2"){ // 2: PROXIMO
            this.state.eventosProximosOriginal.push(evento);
        }
    }

    setIndexTab = () => {
        this.setState({valorTab: 
            (this.state.eventosActualesOriginal.length > 0) 
            ? "1" 
            : (this.state.eventosProximosOriginal.length > 0) 
            ? "2"
            : (this.state.eventosAnterioresOriginal.length > 0) 
            ? "0"
            : "1"
        })
    }

    cargarEventos = () => {
        this.setState({eventosAnterioresOriginal: [], eventosActualesOriginal: [], eventosProximosOriginal: [],
            eventosAnterioresVista: [], eventosActualesVista: [], eventosProximosVista: [], banderaCarga: false, buscarValor: ""});
        var evento = null;
        Conexion.instancia().solicitar('get', (this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 'api/eventos/' : 'eventos/', '', null)
            .then(x => {
                var respuesta = new RespuestaBase(x);
                if(respuesta.exito){
                    respuesta.mensaje.map(a => {
                        evento = new Evento().setJson(a);
                        if(this.datosSesion.esAdministrador() || this.datosSesion.esColaborador())
                            this.clasificarEventos(evento)
                        else
                            evento.getActivo() ? this.clasificarEventos(evento) : null;
                    });
                    this.setState({eventosAnterioresVista: this.state.eventosAnterioresOriginal});
                    this.setState({eventosActualesVista: this.state.eventosActualesOriginal});
                    this.setState({eventosProximosVista: this.state.eventosProximosOriginal});
                    this.setIndexTab()
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

    agregarEvento = () => {
        this.utilidades.mostrarCargador();
        var eventoNuevo = new SolicitudEvento(this.state.nombre, this.state.foto, this.state.codigoPais, this.state.ciudad, this.state.inicio, this.state.final);
        Conexion.instancia().solicitar('post', 'api/eventos/', '', JSON.stringify(eventoNuevo))
        .then(x => {
            var respuesta = new RespuestaBase(x);
            if(respuesta.exito){
                this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);
                this.utilidades.ocultarCargador();
                this.seleccionarEvento(null);
                this.cargarEventos();
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

    editarEvento = () => {
        this.utilidades.mostrarCargador();
        var eventoModificado = new SolicitudEvento(this.state.nombre, this.state.foto, this.state.codigoPais, this.state.ciudad, this.state.inicio, this.state.final, this.state.id, this.state.activo);
        Conexion.instancia().solicitar('put', 'api/evento/', this.state.id, JSON.stringify(eventoModificado))
        .then(x => {
            var respuesta = new RespuestaBase(x);
            if(respuesta.exito){
                this.utilidades.ocultarCargador();
                this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);          
                this.seleccionarEvento(null);
                this.cargarEventos();
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

export default Eventos