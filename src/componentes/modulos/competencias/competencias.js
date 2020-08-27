import React, {Component} from 'react'
import Header from '../../estructura/header/header';
import FloatingActionButton from 'material-ui/FloatingActionButton';
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
import { Tabs, Tab, Paper } from 'material-ui';
import { Grid } from '@material-ui/core';
import Competencia from '../../../modelo/entidades/competencia';
import FormularioCompeticion from '../../formularios/formularioCompeticion/formularioCompeticion';
import Prueba from '../../../modelo/entidades/prueba';
import Evento from '../../../modelo/entidades/evento';
import SolicitudCompeticion from '../../../modelo/solicitud/solicitudCompeticion';
import Fase from '../../../modelo/entidades/fase';

class Competencias extends Component {

    datosSesion = DatosSesion.instancia();
    utilidades = Utilidades.instancia();

    constructor(){
        super();
        this.state = {
            editarCompetencia: false, tituloAlertaPop: "", mensajeAlertaPop: "", aceptarAlertaPop: "", botonesAlertaPop: 2, 
            alertaPop: false, estado: "", valorTab: "1", ejecutarRedireccion: false, buscarValor: "", banderaCarga: false, 
            competenciasAnterioresOriginal: [], competenciasActualesOriginal: [], competenciasProximosOriginal: [],
            competenciasAnterioresVista: [], competenciasActualesVista: [], competenciasProximosVista: [], deporteId: "", 
            pruebaId: "", faseId: "", generoId: "", atletas: [], equipos: [], fecha: "", ciudad: "", recinto: "", descripcion: "", 
            activoCompetencia: true, deporteValido: false, pruebaValido: false, fase: this.cargarFase(), faseValido: false, 
            generoValido: false, fechaValido: false, ciudadValido: false, prueba: this.cargarPrueba(), evento: this.cargarEvento()
        };
    }

    componentDidMount = () => {
        this.validarAcceso()
        if(this.datosSesion.refrescarListaCompetencias() == "true")
            this.consultarCompetencias()
        else
            this.cargarCompetencias()
    }

    validarAcceso = () => {
        var a = this.datosSesion.obtenerEventoDetalle();
        if(a === null || a === undefined)
            this.redireccionar("");
    }

    cargarPrueba = () => {
        var p = this.datosSesion.obtenerPrueba();
        return (p === null || p === undefined) ? new Prueba() : new Prueba().setJson(JSON.parse(p));
    }

    cargarFase = () => {
        var f = this.datosSesion.obtenerFaseId();
        return (f === null || f === undefined) ? new Fase() : new Fase().setJson(JSON.parse(f));
    }

    cargarEvento = () => {
        var e = this.datosSesion.obtenerEventoDetalle();
        return (e === null || e === undefined) ? new Evento() : new Evento().setJson(JSON.parse(e));
    }

    cargarCompetencias = () => {
        var c = this.datosSesion.obtenerCompetencias();
        if(c === null || c === undefined)
            this.consultarCompetencias()
        else{
            this.procesarCompetencias(JSON.parse(c));
            this.setState({banderaCarga: true});
        }
    }

    procesarCompetencias = (competencias) => {
        var comp = null
        competencias.map(c => {
            comp = new Competencia().setJson(c);
            if(this.datosSesion.esAdministrador() || this.datosSesion.esColaborador())
                this.clasificarCompetencia(comp)
            else
                comp.getActivo() ? this.clasificarCompetencia(comp) : null;
        });
        this.setState({competenciasAnterioresVista: this.state.competenciasAnterioresOriginal});
        this.setState({competenciasActualesVista: this.state.competenciasActualesOriginal});
        this.setState({competenciasProximosVista: this.state.competenciasProximosOriginal});
        this.setIndexTab()
    }

    clasificarCompetencia = (comp) => {
        if(comp.getEstado() == "0"){ // 0: ANTERIOR
            this.state.competenciasAnterioresOriginal.push(comp);
        }
        else if(comp.getEstado() == "1"){ // 1: ACTUAL
            this.state.competenciasActualesOriginal.push(comp);
        }
        else if(comp.getEstado() == "2"){ // 2: PROXIMO
            this.state.competenciasProximosOriginal.push(comp);
        }
    }

    setIndexTab = () => {
        this.setState({valorTab: 
            (this.state.competenciasActualesOriginal.length > 0) 
            ? "1" 
            : (this.state.competenciasProximosOriginal.length > 0) 
            ? "2"
            : (this.state.competenciasAnterioresOriginal.length > 0) 
            ? "0"
            : "1"
        })
    }

    redireccionar = (componente) => {
        this.setState({ejecutarRedireccion: true, destino: componente});
    }
    
    redireccion = () => {
        return (this.state.ejecutarRedireccion) ? <Redirect to={'/' + this.state.destino} /> : null;
    }

    busqueda = () => {
        return <SearchBar 
          className="barraBusquedaCompetencias"
          hintText="Buscar"
          value={this.state.buscarValor}
          onChange={(valor) => this.buscar("buscarValor", valor)}
          onRequestSearch={(v) => console.log("")}
          maxLength={30}
        />
    }

    limpiarBusqueda = () => {
        setTimeout(() => {
            this.buscar("ciudad", "")
        }, 350);
    }
    
    seleccionarCompetencia = (comp) => {
        this.setState({editarCompetencia: false})
        if(comp !== undefined){
            this.llenarFormCompetencia(comp);
            $(document).ready(() => {
                this.validarFormularioEdicion()
                $(".botonEliminarU").css("width", "0%");
                $(".botonEliminarU").css("transform", "scaleX(0)");
                $(".botonAgregarU").css("width", "100%");
            });
            this.manejoFormulario();
        }
    }

    manejoFormulario = () => {
        var comps =  "auto"
        if(this.state.banderaFormulario){
            $('#modalFormCompetencia').removeClass("abrirModalForm");
            $('#modalFormCompetencia').addClass("cerrarModalForm");
            $('#cuerpoCompetencias').show()
        }
        else{
            comps = "none";
            $('#modalFormCompetencia').removeClass("cerrarModalForm");
            $('#modalFormCompetencia').addClass("abrirModalForm");
            $('#cuerpoCompetencias').hide()
        }
        $('header').css('pointerEvents', comps);
        this.setState({banderaFormulario: !this.state.banderaFormulario});
    }

    llenarFormCompetencia = (c) => {
        (c == null)
        ? this.setState({formAgregarCompetencia: true, id: "", pruebaId: "", faseId: "", generoId: "", fecha: "", ciudad: "", recinto: "", descripcion: "", activoCompetencia: true})
        : this.setState({formAgregarCompetencia: false, id: c.getId(), eventoId: c.getEvento().getId(), pruebaId: c.getPrueba().getId(), faseId: c.getFase().getId(), generoId: c.getGenero(), fecha: c.getFecha(), ciudad: c.getCiudad(), recinto: c.getRecinto(), descripcion: c.getDescripcion(), activoCompetencia: c.getActivo()})
    }

    validarFormularioEdicion = () =>{
        this.datosFormulario("faseId", this.state.faseId)
        this.datosFormulario("fecha", this.state.fecha)
        this.datosFormulario("ciudad", this.state.ciudad)
    }

    verificarAgregar = () => {
        return this.state.formAgregarCompetencia;
    }

    getDatosCompetencia = (input) => {
        switch(input){
            case "pruebaId": return this.state.pruebaId;
            case "faseId": return this.state.faseId;
            case "generoId": return this.state.generoId;
            case "atletas": return this.state.atletas;
            case "equipos": return this.state.equipos;
            case "fecha": return this.formatoMostrarFecha(this.state.fecha);
            case "ciudad": return this.state.ciudad;
            case "recinto": return this.state.recinto;
            case "descripcion": return this.state.descripcion;
            case "activoCompetencia": return this.state.activoCompetencia;
            default: return "";
        }
    }

    formatoMostrarFecha = (fecha) => { 
        if(!this.utilidades.obtenerSupportDatePicker() && fecha.includes("T")){
            var TIndex = fecha.indexOf("T")
            var f = fecha.substring(0, TIndex)
            var h = fecha.substring(TIndex + 1)
            if(f == "" || h == "")
                return fecha
            var arrayF = f.split("-")
            var arrayH = h.split(":")
            if(arrayF.length != 3 || arrayH.length != 2)
                return fecha
            return arrayF[1] + "/" + arrayF[2] + "/" + arrayF[0] + " " + arrayH[0] + ":" + arrayH[1]
        }
        return fecha
    }

    setDatosCompetencia = (input, valor) => {
        this.setState({[input]: valor});
    }

    datosFormulario = (dato, valor) => {
        switch(dato){
            case 'faseId':
                this.setDatosCompetencia(dato, valor);
                this.setState({faseValido: (valor.toString().length > 0)});
                break;
            case 'fecha':
                this.setDatosCompetencia(dato, valor);
                this.setState({fechaValido: (valor.toString().length > 0)});
                break;
            case 'ciudad':
                this.setDatosCompetencia(dato, valor);
                this.setState({ciudadValido: (valor.toString().length > 0)});
                break;
            default:
                this.setDatosCompetencia(dato, valor);
                break;
        }
    }

    formValidacion = () => {
        return (this.state.faseValido && this.state.fechaValido && this.state.ciudadValido) ? true : false;
    }

    mostrarDetalle = (comp) => {
        if(this.state.editarCompetencia){
            this.seleccionarCompetencia(comp)
        }
        else{
            if(comp !== undefined && comp !== null && comp !== ""){
                this.datosSesion.guardarCompetenciaDetalle(comp);
                this.datosSesion.guardarEsCompetenciaAtletaDetalle(false);
                this.redireccionar("detalleCompetencia");
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

    filtrar(competencias){
        var resultados = [];
        competencias.map((c) => {
            if(this.state.buscarValor === "" || c.getDescripcion().toLowerCase().includes(this.state.buscarValor.toLowerCase()) 
            || c.getCiudad().toLowerCase().includes(this.state.buscarValor.toLowerCase()) 
            || c.getFecha().toLowerCase().includes(this.state.buscarValor.toLowerCase())
            || c.getRecinto().toLowerCase().includes(this.state.buscarValor.toLowerCase())){
                if(this.state.estado === "" || c.getEstado() == this.state.estado){
                    resultados.push(c);
                }
            }
        });
        return resultados;
    }

    buscar = (dato, valor) => {
        this.setState({ [dato]: valor });
        setTimeout(() => {
            this.setState({competenciasAnterioresVista: this.filtrar(this.state.competenciasAnterioresOriginal)});
            this.setState({competenciasActualesVista: this.filtrar(this.state.competenciasActualesOriginal)});
            this.setState({competenciasProximosVista: this.filtrar(this.state.competenciasProximosOriginal)});
        }, 0);
    }

    estructuraSkeleton = () => {
        var tabla = [];
        var fila = [];
        var filaID = 0;
        var columnaID = 0;
        var cantidadColumnas = (this.utilidades.obtenerEsMovil()) ? 1 : parseInt(window.innerWidth / 300);
        var cantidadFilas = 3
        while(filaID < cantidadFilas){
            fila.push(<tr key={filaID}><div className="cardCompetencia cardSkeleton"><Skeleton></Skeleton></div></tr>)
            filaID++;
        }
        while(columnaID < cantidadColumnas){
          tabla.push(<td key={columnaID}>{fila}</td>);
          columnaID++;
        }
        return tabla;
    }

    desplegarCompetencias = (comps) => {
        var tabla = [];
        var index = 0;
        var cantidadColumnas = (this.utilidades.obtenerEsMovil()) ? 1 : parseInt(window.innerWidth / 300);
        var cantidadFilas = Math.ceil(comps.length / cantidadColumnas);
        var filaID = 0;
        var columnas = [];
        while(filaID < cantidadFilas){
            columnas = this.crearColumnasCompetencias(cantidadColumnas, index, comps)
            index = index + (columnas.length)
            tabla.push(<tr key={filaID}>{columnas}</tr>);
            filaID++;
        }
        return tabla;
    }

    crearColumnasCompetencias = (cantidadColumnas, index, comps) => {
        var columna = [];
        var columnaID = 0;
        var comp = null;
        while(columnaID < cantidadColumnas){
            if (index < comps.length){
                comp = comps[index];
                    columna.push(<td key={columnaID}>
                        <div className={"cardCompetencia" + (!comp.getActivo() ? " desactivo" : "")} name={index} onClick={this.mostrarDetalle.bind(this, comp)}>
                            {this.state.editarCompetencia ? <button name={index}><i className="far fa-edit"></i></button> : null}
                            <div id="info">
                                <div className="datosCompetencia" >
                                    <div>
                                        <p id="fecha"><i className="far fa-calendar-alt"></i> {this.utilidades.fechaFormatoFinal(comp.getFecha())}</p>
                                        <p id="hora"><i className="far fa-clock"></i> {this.utilidades.horaFormatoFinal(comp.getFecha())}</p>
                                        <p id="recinto">{(comp.getRecinto()) ? <i className="fas fa-map-marker-alt"></i> : null} {comp.getRecinto()}</p>
                                        <p id="recinto">{comp.getDescripcion()}</p>
                                    </div>
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
            {this.desplegarCompetencias(this.state.competenciasAnterioresVista)}
        }
        else if(event == "1"){ // 1: ACTUAL
            {this.desplegarCompetencias(this.state.competenciasActualesVista)}
        }
        else if(event == "2"){ // 2: PROXIMO
            {this.desplegarCompetencias(this.state.competenciasProximosVista)}
        }
    };

    validarContenido = () => {        
        if(this.state.valorTab == "0"){ // 0: ANTERIOR
            return this.desplegarContenido(this.state.competenciasAnterioresVista)
        }
        else if(this.state.valorTab == "1"){ // 1: ACTUAL
            return this.desplegarContenido(this.state.competenciasActualesVista)
        }
        else if(this.state.valorTab == "2"){ // 2: PROXIMO
            return this.desplegarContenido(this.state.competenciasProximosVista)
        }
    };

    desplegarContenido(comps){
        return <section>
        { (comps.length > 0) ?
            <table>
                {this.desplegarCompetencias(comps)}
            </table>
        : <p className="mensajeSinRegistros">Sin resultados</p>
        } 
        </section>
    }

    render(){
        return(
            <div className="contenidoBody">
                <Header titulo = "Competencias" />
                <div className="contenedorPagina" id="contenedorCompetencias">
                    <div id="encabezadoCompetencias">
                        <div id="accionAtras">
                            <button onClick={e => this.redireccionar('detalleDeporte')}><i className="fas fa-chevron-left"></i></button>
                        </div>
                        <div id="tituloRefrescar">
                            <p>Competencias</p>
                        </div>
                        {this.busqueda()}
                    </div>
                    <div className="infoGeneral">
                        <Grid container spacing={1}>
                            <Grid item xs={6} sm={3}>
                                <Button onClick={e => this.redireccionar('detalleEvento')}>{this.state.evento.getNombre()}</Button>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Button onClick={e => this.redireccionar('detalleDeporte')}>{this.state.prueba.getNombre()}</Button>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Button onClick={e => this.redireccionar('detalleDeporte')}>{this.state.fase.getDescripcion()}</Button>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Button onClick={e => this.redireccionar('detalleDeporte')}>{this.state.prueba.getGeneroNombre()}</Button>
                            </Grid>
                        </Grid>
                    </div>
                    <div className="tabs">
                        <Paper square="true">
                            <Tabs
                                value={this.state.valorTab}
                                onChange={this.handleTabChange}
                            >
                                <Tab label="Finalizadas" value="0"/>
                                <Tab label="En Vivo" value="1"/>
                                <Tab label="Próximas" value="2"/>
                            </Tabs>
                        </Paper>
                    </div>
                    <div id="cuerpoCompetencias" >
                        { this.state.banderaCarga ?
                            <section key="">
                            {this.validarContenido()}
                            {(this.datosSesion.esAdministrador()  || this.datosSesion.esColaborador()) ? 
                                <section>
                                    <FloatingActionButton 
                                        className="botonHabilitarEdicionCompetencia"
                                        onClick={() => this.setState({editarCompetencia: !this.state.editarCompetencia})}
                                    >
                                        { this.state.editarCompetencia ? <i className="fas fa-times"></i> : <i className="far fa-edit"></i>}
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
                    <div id="modalFormCompetencia">
                        <FloatingActionButton 
                            className="botonCerrarForm"
                            onClick={() => this.seleccionarCompetencia(null)}
                        >
                            <svg aria-hidden="true" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-times fa-w-10 fa-3x">
                                <path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z">
                                </path>
                            </svg>
                        </FloatingActionButton>
                        {
                        <FormularioCompeticion
                            agregarForm = {this.verificarAgregar}
                            getCompeticion = {this.getDatosCompetencia}
                            //agregarCompeticion = {this.agregarCompeticion}
                            edicion = {true}
                            editarCompeticion = {this.editarCompetencia}
                            datosFormulario = {this.datosFormulario}
                            formValidacion = {this.formValidacion}
                        ></FormularioCompeticion>
                        }
                    </div>
                    {this.alertaPop()}
                    {this.redireccion()}
                </div>
            </div>
        )
    }

    consultarCompetencias = () => {
        this.setState({competenciasAnterioresOriginal: [], competenciasActualesOriginal: [], competenciasProximosOriginal: [],
            competenciasAnterioresVista: [], competenciasActualesVista: [], competenciasProximosVista: [], banderaCarga: false, buscarValor: ""});
        var competencia = null;
        Conexion.instancia().solicitar('get', (this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 'api/listarCompetenciasEventoPruebaFase/' : 'listarCompetenciasEventoPruebaFase/', this.state.evento.getId() + "/" + this.state.prueba.getId() + "/" + this.state.prueba.getGenero() + "/" + this.state.fase.getId(), null, this.datosSesion.obtenerTokenPush())
            .then(x => {
                var respuesta = new RespuestaBase(x);
                if(respuesta.exito){
                    this.datosSesion.guardarRefrescarListaCompetencias(false)
                    this.procesarCompetencias(respuesta.mensaje);
                    if(respuesta.mensaje != null || respuesta.mensaje != undefined)
                        this.datosSesion.guardarCompetencias(respuesta.mensaje);
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

    editarCompetencia = () => {
        this.utilidades.mostrarCargador();
        var competicionModificada = new SolicitudCompeticion(this.state.eventoId, this.state.pruebaId, this.state.generoId, this.state.faseId, this.state.fecha + ":00", this.state.ciudad, this.state.recinto, this.state.descripcion, this.state.id, this.state.activoCompetencia);
        Conexion.instancia().solicitar('put', 'api/competencia/', this.state.id, JSON.stringify(competicionModificada))
        .then(x => {
            var respuesta = new RespuestaBase(x);
            if(respuesta.exito){
                this.utilidades.ocultarCargador();
                this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);
                this.seleccionarCompetencia(null);
                this.consultarCompetencias();
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

export default Competencias