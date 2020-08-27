import React, {Component} from 'react'
import Header from '../../../estructura/header/header';
import Utilidades from '../../../../proveedores/utilidades';
import $ from 'jquery';
import DatosSesion from '../../../../proveedores/datosSesion';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from 'material-ui/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Skeleton  from 'react-loading-skeleton';
import RespuestaBase from '../../../../modelo/respuesta/respuestaBase';
import Deporte from '../../../../modelo/entidades/deporte';
import Conexion from '../../../../proveedores/conexion';
import Prueba from '../../../../modelo/entidades/prueba';
import Federacion from '../../../../modelo/entidades/federacion';
import { FloatingActionButton, Tab, Tabs, Paper} from 'material-ui';
import { ContentAdd } from 'material-ui/svg-icons';
import SolicitudPrueba from '../../../../modelo/solicitud/solicitudPrueba';
import FormularioPrueba from '../../../formularios/formularioPrueba/formularioPrueba';
import Evento from '../../../../modelo/entidades/evento';
import puntajeIcon from '../../../../assets/imagenes/puntaje.png';
import Fase from '../../../../modelo/entidades/fase';

class DetalleDeporte extends Component {

    datosSesion = DatosSesion.instancia();
    utilidades = Utilidades.instancia();

    constructor(){
        super();
        this.state = {
            banderaCarga: false, ejecutarRedireccion: false, pruebas: [], deporte: this.cargarDeporte(), 
            evento: this.cargarEvento(), editarPrueba: false, valorTab: "0", pruebasFemenino: [], pruebasMasculino: [], 
            alertaFases: false, pruebaSeleccionada: "", fasesDePrueba: [], alertaPop: false, tipoPrueba: "", tipoMarcador: "",
        };
    }

    componentDidMount = () => {
        this.validarAcceso()
        this.cargarDatos()
    }

    cargarDatos = () => {
        (this.state.deporte.evento) ? this.cargarPruebasPorEvento() : this.cargarPruebas();
    }

    validarAcceso = () => {
        var a = this.datosSesion.obtenerDeporteDetalle();
        if(a === null || a === undefined)
            this.redireccionar("");
    }

    cargarDeporte = () => {
        var d = this.datosSesion.obtenerDeporteDetalle();
        if(d === null || d === undefined){
            this.redireccionar("deportes");
            return new Deporte();
        }
        return new Deporte().setJson(JSON.parse(d));
    }

    cargarEvento = () => {
        var e = this.datosSesion.obtenerEventoDetalle();
        return new Evento().setJson(JSON.parse(e));
    }

    redireccionar = (componente) => {
        this.setState({ejecutarRedireccion: true, destino: componente});
    }
    
    redireccion = () => {
        return (this.state.ejecutarRedireccion) ? <Redirect to={'/' + this.state.destino} /> : null;
    }

    handleTabChange = (event) => {
        this.setState({valorTab: event});
        if(event == "0"){ // 0: Femenino
            this.desplegarPruebas(this.state.pruebasFemenino)
        }
        else if(event == "1"){ // 1: Masculino
            this.desplegarPruebas(this.state.pruebasMasculino)
        }
    };

    validarContenido = () => {        
        if(this.state.valorTab == "0"){ // 0: Femenino
            return this.desplegarContenido(this.state.pruebasFemenino)
        }
        else if(this.state.valorTab == "1"){ // 1: Masculino
            return this.desplegarContenido(this.state.pruebasMasculino)
        }
    };

    desplegarContenido(pruebas){
        return <section>
        { (pruebas.length > 0) ?
            <table>
                {this.desplegarPruebas(pruebas)}
            </table>
        : <p className="mensajeSinRegistros">Sin resultados</p>
        } 
        </section>
    }

    estructuraSkeleton = () => {
        var tabla = [];
        var fila = [];
        var filaID = 0;
        var columnaID = 0;
        var cantidadColumnas = (this.utilidades.obtenerEsMovil()) ? 1 : parseInt(window.innerWidth / 350) - 1;
        var cantidadFilas = 2
        while(filaID < cantidadFilas){
            fila.push(<tr key={filaID}><div className="cardPrueba cardSkeleton"><Skeleton></Skeleton></div></tr>)
            filaID++;
        }
        while(columnaID < cantidadColumnas){
          tabla.push(<td key={columnaID}>{fila}</td>);
          columnaID++;
        }
        return tabla;
    }

    desplegarPruebas = (pruebas) => {
        var tabla = [];
        var index = 0;
        var cantidadColumnas = (this.utilidades.obtenerEsMovil()) ? 1 : parseInt(window.innerWidth / 350) - 1;
        var cantidadFilas = Math.ceil(pruebas.length / cantidadColumnas);
        var filaID = 0;
        var columnas = [];
        while(filaID < cantidadFilas){
            columnas = this.crearColumnasPruebas(cantidadColumnas, index, pruebas)
            index = index + (columnas.length)
            tabla.push(<tr key={filaID}>{columnas}</tr>);
            filaID++;
        }
        return tabla;
    }

    crearColumnasPruebas = (cantidadColumnas, index, pruebas) => {
        var columna = [];
        var columnaID = 0;
        var prueba = null;
        while(columnaID < cantidadColumnas){
            if (index < pruebas.length){
                prueba = pruebas[index];
                    columna.push(<td key={columnaID}>
                        <div className={prueba.getActivo() ? "cardPrueba" : "cardPrueba desactivo"} name={index} onClick={this.mostrarDetalle.bind(this, prueba)}>
                            {this.state.editarPrueba ? <button name={index}><i className="far fa-edit"></i></button> : null}
                            <div id="info">
                                <i id="iconoTipoPart" className={(prueba.getTipo() == "1") ? "fas fa-users" : "fas fa-user"}></i>
                                <p id="nombre">{prueba.getNombre()}</p>
                                { (prueba.getTipoMarcador() == "2") ? <i className="iconoTipoMarc far fa-clock"/>
                                : (prueba.getTipoMarcador() == "3") ? <i className="iconoTipoMarc fas fa-arrows-alt-h"/>
                                : (prueba.getTipoMarcador() == "1") ? <img className="iconoTipoMarc" src={puntajeIcon}/> : "" 
                                }
                            </div>
                        </div>
                    </td>)
            }
            columnaID++;
            index++;
        }
        return columna;
    }

    cerrarAlertaInfo = () => {
        this.setState({alertaInfo: false});
    }

    mostrarAlertaInfo = () => {
        this.setState({alertaInfo: true});
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

    cerrarAlertaFases = () => {
        this.setState({alertaFases: false, pruebaSeleccionada: "", fasesDePrueba: []});
    }

    mostrarAlertaFases = (prueba, fases) => {
        if(fases.length > 0)
            this.setState({alertaFases: true, pruebaSeleccionada: prueba, fasesDePrueba: fases});
        else
            this.utilidades.mostrarAlerta("alertaError", Conexion.instancia().errorGenerico);
    }

    alertaFases = () => {
        return <Dialog open={this.state.alertaFases} onClose={this.cerrarAlertaFases} className="alertaPop alertaFases" scroll="body">
            <DialogTitle>Fases<Button onClick={this.cerrarAlertaFases} className="buttonCerrarFases"><i className="fas fa-times"></i></Button></DialogTitle>
            <DialogContent scroll='body'>
                {this.getOpcionesFases()}
            </DialogContent>
        </Dialog>
    }

    getOpcionesFases(){
        var opciones = [];
        var fase = null
        this.state.fasesDePrueba.map(f => {
            fase = new Fase().setJson((f.fase != undefined) ? f.fase : f)
            opciones.push(<Button key={fase.getId()} onClick={e => this.cargarCompetencias(fase)} value={fase.getId()} className="buttonFase">{fase.getDescripcion()}</Button>)
        });
        return opciones;
    }

    sesionVencida = () => {
        this.datosSesion.cerrarSesion();
        this.redireccionar('autenticacion');
    }

    seleccionarPrueba = (prueba) => {
        this.setState({editarPrueba: false})
        if(prueba !== undefined){
            this.llenarFormPrueba(prueba);
            $(document).ready(() => {
                this.validarFormularioEdicion()
                if(!this.state.formAgregarPrueba){
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

    mostrarDetalle = (prueba) => {
        if(this.state.deporte.evento){
            this.cargarFasesDePrueba(prueba)            
        }
        else{
            if(this.state.editarPrueba){
                this.seleccionarPrueba(prueba)
            }
        }
    }

    manejoFormulario = () => {
        var eventos =  "auto"
        if(this.state.banderaFormulario){
            $('#modalFormPrueba').removeClass("abrirModalForm");
            $('#modalFormPrueba').addClass("cerrarModalForm");
            $('#cuerpoDetalleDeporte').show()
        }
        else{
            eventos = "none";
            $('#modalFormPrueba').removeClass("cerrarModalForm");
            $('#modalFormPrueba').addClass("abrirModalForm");
            $('#cuerpoDetalleDeporte').hide();
        }
        $('header').css('pointerEvents', eventos);
        this.setState({banderaFormulario: !this.state.banderaFormulario});
    }

    llenarFormPrueba = (p) => {
        (p == null)
        ? this.setState({formAgregarPrueba: true, idPrueba: "", nombrePrueba: "", tipoPrueba: "", tipoMarcador: "", activoPrueba: true})
        : this.setState({formAgregarPrueba: false, idPrueba: p.getId(), nombrePrueba: p.getNombre(), tipoPrueba: p.getTipo(), tipoMarcador: p.getTipoMarcador(), activoPrueba: p.getActivo()});
    }

    validarFormularioEdicion = () =>{
        this.datosFormulario("nombrePrueba", this.state.nombrePrueba)
        this.datosFormulario("tipoPrueba", this.state.tipoPrueba)
        this.datosFormulario("tipoMarcador", this.state.tipoMarcador)
    }

    verificarAgregar = () => {
        return this.state.formAgregarPrueba;
    }

    getDatosPrueba = (input) => {
        switch(input){
            case "nombrePrueba": return this.state.nombrePrueba;
            case "tipoPrueba": return this.state.tipoPrueba;
            case "tipoMarcador": return this.state.tipoMarcador;
            case "activoPrueba": return this.state.activoPrueba;
            default: return "";
        }
    }

    setDatosPrueba = (input, valor) => {
        this.setState({[input]: valor});
    }

    datosFormulario = (dato, valor) => {
        switch(dato){
            case 'nombrePrueba':
                valor = this.utilidades.limitarDato('alfanumericoespacio', valor);
                this.setDatosPrueba(dato, valor);
                this.setState({nombrePruebaValido: (valor.length > 4)});
                break;
            case 'tipoPrueba':
                this.setDatosPrueba(dato, valor);
                this.setState({tipoPruebaValido: (valor.toString().length > 0)});
                break;
            case 'tipoMarcador':
                this.setDatosPrueba(dato, valor);
                this.setState({tipoMarcadorValido: (valor.toString().length > 0)});
                break;
            default:
                this.setDatosPrueba(dato, valor);
                break;
        }
    }

    formValidacion = () => {
        return (this.state.nombrePruebaValido && this.state.tipoPruebaValido && this.state.tipoMarcadorValido) ? true : false;
    }

    render(){
        return(
            <div className="contenidoBody">
                <Header titulo = "Deporte" />
                <div className="contenedorPagina" id="contenedorDetalleDeporte">
                    <div id="encabezadoDetalleDeporte" className="segundoMenu">
                        <div id="accionAtras">
                            <button onClick={e => this.redireccionar((this.state.deporte.evento) ? 'detalleEvento' : 'deportes')}><i className="fas fa-chevron-left"></i></button>
                        </div>
                        <div id="tituloRefrescar">
                            { (this.state.deporte.evento) 
                            ? <p><a onClick={e => this.redireccionar('detalleEvento')}>Evento</a></p>
                            : <p><a onClick={e => this.redireccionar('deportes')}>Deportes</a></p>
                            }
                        </div>
                    </div>
                    { (this.state.deporte.evento) ?
                        <section>
                            <div className="tabs" id="tabsPruebas">
                                <Paper square="true">
                                    <Tabs
                                        value={this.state.valorTab}
                                        onChange={this.handleTabChange}
                                    >
                                        <Tab label="Femenino" value="0"/>
                                        <Tab label="Masculino" value="1"/>
                                    </Tabs>
                                </Paper>
                            </div>
                        </section>
                        : null
                    }
                    <div id="cuerpoDetalleDeporte">
                        <div id="encabezadoDeporte">
                            <div id="infoPersonalDeporte">
                                <button className="btnLeft" onClick={() => this.abrirAtletas()}>Atletas</button>
                                <button className="btnRight" onClick={() => this.abrirFederacion()}>Federación</button>
                                <div id="data">
                                    <div id="main">
                                        <p>{this.state.deporte.getNombre()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="contenedorDerDeporte">
                            <div id="infoPruebasDeporte">
                                { (this.state.deporte.evento) 
                                ? 
                                <div id="pruebasPorGenero"> {
                                    this.state.banderaCarga ?
                                        <section key="">
                                            {this.validarContenido()}
                                        </section>
                                    :
                                        <table>
                                            {this.estructuraSkeleton()}
                                        </table>
                                } </div>
                                : 
                                (this.state.banderaCarga) ?
                                    <section key="">
                                        { (this.state.pruebas.length > 0) ?
                                            <table>
                                                {this.desplegarPruebas(this.state.pruebas)}
                                            </table>
                                            : <p className="mensajeSinRegistros">Sin pruebas registradas</p>
                                        }
                                        {this.datosSesion.esAdministrador() ?
                                            <section>
                                                <FloatingActionButton 
                                                    className="botonHabilitarEdicionPrueba"
                                                    onClick={() => this.setState({editarPrueba: !this.state.editarPrueba})}
                                                >
                                                    { this.state.editarPrueba ? <i className="fas fa-times"></i> : <i className="far fa-edit"></i>}
                                                </FloatingActionButton>
                                                <FloatingActionButton 
                                                    className="botonAgregarPrueba"
                                                    onClick={() => this.seleccionarPrueba(null)}
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
                        </div>
                    </div>
                    <div id="modalFormPrueba">
                        <FloatingActionButton 
                            className="botonCerrarForm"
                            onClick={() => this.seleccionarPrueba(null)}
                        >
                            <svg aria-hidden="true" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-times fa-w-10 fa-3x">
                                <path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z">
                                </path>
                            </svg>
                        </FloatingActionButton>
                        <FormularioPrueba
                            agregarForm = {this.verificarAgregar}
                            getPrueba = {this.getDatosPrueba}
                            agregarPrueba = {this.agregarPrueba}
                            editarPrueba = {this.editarPrueba}
                            datosFormulario = {this.datosFormulario}
                            formValidacion = {this.formValidacion}
                        ></FormularioPrueba>
                    </div>
                    {this.alertaPop()}
                    {this.redireccion()}
                    {this.alertaFases()}
                </div>
            </div>
        )
    }
    
    cargarPruebas = () => {
        this.setState({pruebas: [], banderaCarga: false});
        var prueba = null;
        Conexion.instancia().solicitar('get', (this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 'api/deporte/pruebas/' : 'deporte/pruebas/', this.state.deporte.getId(), null)
            .then(x => {
                var respuesta = new RespuestaBase(x);
                if(respuesta.exito){
                    respuesta.mensaje.map(p => {
                        prueba = new Prueba().setJson(p);
                        if(this.datosSesion.esAdministrador())
                            this.state.pruebas.push(prueba);
                        else
                            prueba.getActivo() ? this.state.pruebas.push(prueba) : null;
                    });
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

    cargarPruebasPorEvento = () => {
        this.setState({pruebasMasculino: [], pruebasFemenino: [], banderaCarga: false});
        Conexion.instancia().solicitar('get', (this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 'api/listarPruebasPorDeporte/' : 'listarPruebasPorDeporte/', this.state.evento.getId() + "/" + this.state.deporte.getId(), null)
            .then(x => {
                var respuesta = new RespuestaBase(x);
                if(respuesta.exito){
                    respuesta.mensaje.map(p => {
                        this.clasificarPruebas(new Prueba().setJson(p._id));
                    });
                    this.setState({valorTab: (this.state.pruebasFemenino.length == 0 && this.state.pruebasMasculino.length > 0) ? "1" : "0"});
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

    clasificarPruebas = (prueba) => {
        if(prueba.getGenero() == "0"){ // 0: Femenino
            this.state.pruebasFemenino.push(prueba);
        }
        else if(prueba.getGenero() == "1"){ // 1: Masculino
            this.state.pruebasMasculino.push(prueba);
        }
    }

    abrirFederacion = () => {
        this.utilidades.mostrarCargador();
        Conexion.instancia().solicitar('get', (this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 'api/federacion/' : 'federacion/', this.state.deporte.getFederacion(), null)
            .then(x => {
                var respuesta = new RespuestaBase(x);
                if(respuesta.exito){
                    var federacion = new Federacion().setJson(respuesta.mensaje);
                    this.datosSesion.guardarFederacionDetalle(federacion);
                    this.utilidades.ocultarCargador();
                    this.redireccionar("detalleFederacion");
                }
                else{
                    this.utilidades.ocultarCargador();
                    if(respuesta.codigo === 403)
                        this.mostrarAlertaPop("Atención", respuesta.mensaje, "sesionV", 1);
                    else
                        this.utilidades.mostrarAlerta("alertaError", respuesta.mensaje);
                }
                this.datosSesion.guardarTokenPersonal(respuesta.token);
            })
            .catch( data => { 
                this.utilidades.ocultarCargador();
                this.utilidades.mostrarAlerta("alertaError", Conexion.instancia().errorGenerico);
            }); 
    }

    abrirAtletas = () => {
        this.datosSesion.filtrarAtletasPorDeporte(this.state.deporte.getId());
        this.redireccionar("atletas");
    }

    agregarPrueba = () => {
        this.utilidades.mostrarCargador();
        var pruebaNueva = new SolicitudPrueba(this.state.idPrueba,this.state.nombrePrueba,this.state.tipoPrueba,this.state.tipoMarcador,this.state.deporte.getId(),this.state.activoPrueba);
        Conexion.instancia().solicitar('post', 'api/deporte/prueba/', this.state.deporte.getId(), JSON.stringify(pruebaNueva))
        .then(x => {
            var respuesta = new RespuestaBase(x);
            if(respuesta.exito){
                this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);
                this.utilidades.ocultarCargador();
                this.seleccionarPrueba(null);
                this.cargarPruebas();
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

    editarPrueba = () => {
        this.utilidades.mostrarCargador();
        var pruebaModificada = new SolicitudPrueba(this.state.idPrueba,this.state.nombrePrueba,this.state.tipoPrueba,this.state.tipoMarcador,this.state.deporte.getId(),this.state.activoPrueba);
        Conexion.instancia().solicitar('put', 'api/deporte/prueba/', this.state.deporte.getId() + "/" + this.state.idPrueba, JSON.stringify(pruebaModificada))
        .then(x => {
            var respuesta = new RespuestaBase(x);
            if(respuesta.exito){
                this.utilidades.ocultarCargador();
                this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);          
                this.seleccionarPrueba(null);
                this.cargarPruebas();
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

    cargarCompetencias = (fase) => {
        this.utilidades.mostrarCargador();
        Conexion.instancia().solicitar('get', (this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 'api/listarCompetenciasEventoPruebaFase/' : 'listarCompetenciasEventoPruebaFase/', this.state.evento.getId() + "/" + this.state.pruebaSeleccionada.getId() + "/" + this.state.pruebaSeleccionada.getGenero() + "/" + fase.getId(), null, this.datosSesion.obtenerTokenPush())
            .then(x => {
                var respuesta = new RespuestaBase(x);
                if(respuesta.exito){
                    this.utilidades.ocultarCargador();
                    if(respuesta.mensaje == null || respuesta.mensaje == undefined || respuesta.mensaje.length == 0)
                        this.utilidades.mostrarAlerta("alertaInfo", "No hay competencias registradas.");
                    else{
                        this.datosSesion.guardarPrueba(this.state.pruebaSeleccionada);
                        this.datosSesion.guardarFaseId(fase);
                        this.datosSesion.guardarCompetencias(respuesta.mensaje);
                        this.datosSesion.guardarRefrescarListaCompetencias(false)
                        this.redireccionar("competencias");
                    }
                }
                else{
                    if(respuesta.codigo === 403){
                        this.utilidades.ocultarCargador();
                        this.mostrarAlertaPop("Atención", respuesta.mensaje, "sesionV", 1);
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

    cargarFasesDePrueba = (prueba) => {
        this.utilidades.mostrarCargador();
        Conexion.instancia().solicitar('get', (this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 'api/listarFasesPruebaEvento/' : 'listarFasesPruebaEvento/', this.state.evento.getId() + "/" + prueba.getId() + "/" + prueba.getGenero(), null)
            .then(x => {
                var respuesta = new RespuestaBase(x);
                if(respuesta.exito){
                    this.utilidades.ocultarCargador();
                    if(respuesta.mensaje == null || respuesta.mensaje == undefined || respuesta.mensaje.length == 0)
                        this.mostrarAlertaFases(prueba, this.datosSesion.obtenerCatalogoFases())
                    else
                        this.mostrarAlertaFases(prueba, respuesta.mensaje)
                }
                else{
                    if(respuesta.codigo === 403){
                        this.utilidades.ocultarCargador();
                        this.mostrarAlertaPop("Atención", respuesta.mensaje, "sesionV", 1);
                    }
                    else{
                        this.utilidades.ocultarCargador();
                        this.mostrarAlertaFases(prueba, this.datosSesion.obtenerCatalogoFases())
                    }
                }
                this.datosSesion.guardarTokenPersonal(respuesta.token);
            })
            .catch( data => { 
                this.utilidades.ocultarCargador();
                this.mostrarAlertaFases(prueba, this.datosSesion.obtenerCatalogoFases())
            }); 
    }

}

export default DetalleDeporte