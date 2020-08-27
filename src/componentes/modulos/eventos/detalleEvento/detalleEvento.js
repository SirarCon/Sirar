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
import Evento from '../../../../modelo/entidades/evento';
import { FloatingActionButton } from 'material-ui';
import FormularioCompeticion from '../../../formularios/formularioCompeticion/formularioCompeticion';
import SolicitudCompeticion from '../../../../modelo/solicitud/solicitudCompeticion';
import SolicitudParticipantesCompeticion from '../../../../modelo/solicitud/solicitudParticipantesCompeticion';


class DetalleEvento extends Component {

    datosSesion = DatosSesion.instancia();
    utilidades = Utilidades.instancia();

    constructor(){
        super();
        this.state = {
            banderaCarga: false, ejecutarRedireccion: false, deportes: [],
            evento: this.cargarEvento(), eventoInfo: false, modalFoto: false, alertaInfo: false, banderaFormulario: false,
            formAgregarCompeticion: true, deporteId: "", pruebaId: "", faseId: "", generoId: "", atletas: [], equipos: [], 
            fecha: "", ciudad: "", recinto: "", descripcion: "", activoCompeticion: true,
            deporteValido: false, pruebaValido: false, faseValido: false, generoValido: false, fechaValido: false,
            ciudadValido: false, tituloAlertaPop: "", mensajeAlertaPop: "", aceptarAlertaPop: "", botonesAlertaPop: 2,
            alertaPop: false,
        };
    }

    componentDidMount = () => {
        this.validarAcceso()
        this.cargarDeportes();
    }

    validarAcceso = () => {
        var a = this.datosSesion.obtenerEventoDetalle();
        if(a === null || a === undefined)
            this.redireccionar("");
    }

    cargarEvento = () => {
        var e = this.datosSesion.obtenerEventoDetalle();
        if(e === null || e === undefined){
            this.redireccionar("eventos");
            return new Evento();
        }
        return new Evento().setJson(JSON.parse(e));
    }

    redireccionar = (componente) => {
        this.setState({ejecutarRedireccion: true, destino: componente});
    }
    
    redireccion = () => {
        return (this.state.ejecutarRedireccion) ? <Redirect to={'/' + this.state.destino} /> : null;
    }
    
    estructuraSkeleton = () => {
        var tabla = [];
        var fila = [];
        var filaID = 0;
        var columnaID = 0;
        var cantidadColumnas = (this.utilidades.obtenerEsMovil()) ? 1 : parseInt(window.innerWidth / 200) - 1;
        var cantidadFilas = 2
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
        var cantidadFilas = Math.ceil(this.state.deportes.length / cantidadColumnas);
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
            if (index < this.state.deportes.length){
                deporte = this.state.deportes[index];
                    columna.push(<td key={columnaID}>
                        <div className="cardDeporte" name={index} onClick={this.abrirDetalleDeporte.bind(this, deporte)}>
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

    abrirDetalleDeporte = (deporte) =>{
        deporte.evento = true
        this.datosSesion.guardarDeporteDetalle(deporte);
        this.redireccionar("detalleDeporte");
    }

    verFoto = () => {
        this.setState({modalFoto: true, opcionesFoto: false});
    };

    cerrarFoto = () => {
        this.setState({modalFoto: false});
    };
    
    sesionVencida = () => {
        this.datosSesion.cerrarSesion();
        this.redireccionar('autenticacion');
    }

    seleccionarCompeticion = (comp) => {
        if(comp !== undefined){
            this.llenarFormCompeticion(comp);
            $(document).ready(() => {
                this.validarFormularioEdicion()
                //if(!this.state.formAgregarPrueba){
                    $(".botonAgregarU").css("width", "45%");
                    $(".botonEliminarU").css("width", "45%");
                    $(".botonEliminarU").css("transform", "scaleX(1)");
                /*}
                else{
                    $(".botonEliminarU").css("width", "0%");
                    $(".botonEliminarU").css("transform", "scaleX(0)");
                    $(".botonAgregarU").css("width", "100%");
                }*/
            });
            this.manejoFormulario();
        }
    }

    manejoFormulario = () => {
        var eventos =  "auto"
        if(this.state.banderaFormulario){
            $('#modalFormCompeticion').removeClass("abrirModalForm");
            $('#modalFormCompeticion').addClass("cerrarModalForm");
            $('#cuerpoDetalleEvento').show();
        }
        else{
            eventos = "none";
            $('#modalFormCompeticion').removeClass("cerrarModalForm");
            $('#modalFormCompeticion').addClass("abrirModalForm");
            $('#cuerpoDetalleEvento').hide();
        }
        $('header').css('pointerEvents', eventos);
        this.setState({banderaFormulario: !this.state.banderaFormulario});
    }

    llenarFormCompeticion = (c) => {
        (c == null)
        ? this.setState({formAgregarCompeticion: true, deporteId: "", pruebaId: "", faseId: "", generoId: "", atletas: [], equipos: [], fecha: "", ciudad: "", recinto: "", descripcion: "", activoCompeticion: true})
        : null
    }

    validarFormularioEdicion = () =>{
        this.datosFormulario("deporteId", this.state.deporteId)
        this.datosFormulario("pruebaId", this.state.pruebaId)
        this.datosFormulario("faseId", this.state.faseId)
        this.datosFormulario("generoId", this.state.generoId)
        this.datosFormulario("fecha", this.state.fecha)
    }

    verificarAgregar = () => {
        return this.state.formAgregarCompeticion;
    }

    getDatosCompeticion = (input) => {
        switch(input){
            case "deporteId": return this.state.deporteId;
            case "pruebaId": return this.state.pruebaId;
            case "faseId": return this.state.faseId;
            case "generoId": return this.state.generoId;
            case "atletas": return this.state.atletas;
            case "equipos": return this.state.equipos;
            case "fecha": return this.state.fecha;
            case "ciudad": return this.state.ciudad;
            case "recinto": return this.state.recinto;
            case "descripcion": return this.state.descripcion;
            case "activoCompeticion": return this.state.activoCompeticion;
            default: return "";
        }
    }

    setDatosCompeticion = (input, valor) => {
        this.setState({[input]: valor});
    }

    datosFormulario = (dato, valor) => {
        switch(dato){
            case 'deporteId':
                this.setDatosCompeticion(dato, valor);
                this.setState({deporteValido: (valor.toString().length > 0)});
                break;
            case 'pruebaId':
                this.setDatosCompeticion(dato, valor);
                this.setState({pruebaValido: (valor.toString().length > 0)});
                break;
            case 'faseId':
                this.setDatosCompeticion(dato, valor);
                this.setState({faseValido: (valor.toString().length > 0)});
                break;
            case 'generoId':
                this.setDatosCompeticion(dato, valor);
                this.setState({generoValido: (valor.toString().length > 0)});
                break;
            case 'fecha':
                this.setDatosCompeticion(dato, valor);
                this.setState({fechaValido: (valor.toString().length > 0)});
                break;
            case 'ciudad':
                this.setDatosCompeticion(dato, valor);
                this.setState({ciudadValido: (valor.toString().length > 0)});
                break;
            default:
                this.setDatosCompeticion(dato, valor);
                break;
        }
    }

    formValidacion = () => {
        return (this.state.deporteValido && this.state.pruebaValido && this.state.faseValido && this.state.generoValido && this.state.fechaValido && this.state.ciudadValido) ? true : false;
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

    render(){
        return(
            <div className="contenidoBody">
                <Header titulo = "Evento" />
                <div className="contenedorPagina" id="contenedorDetalleEvento">
                    <div id="encabezadoDetalleEvento" className="segundoMenu">
                        <div id="accionAtras">
                            <button onClick={e => this.redireccionar('eventos')}><i className="fas fa-chevron-left"></i></button>
                        </div>
                        <div id="tituloRefrescar">
                            <p><a onClick={e => this.redireccionar('eventos')}>Eventos</a></p>
                        </div>
                    </div>
                    <div id="cuerpoDetalleEvento">
                        <div id="encabezadoEvento">
                            {(this.state.evento.getFoto() !== "")
                                ? 
                                <div id="imgBorder">
                                    <img className="cover" src={this.state.evento.getFoto()} alt="" onClick={this.verFoto}/>
                                </div>
                                : 
                                null
                            }
                            <div id="infoPersonalEvento">
                                <div id="data" className={(this.state.evento.getFoto() !== "") ? "" : "evSinFoto"}>
                                    <div id="main">
                                        <p>{this.state.evento.getNombre()}</p>
                                        <p>{this.state.evento.getNombrePais()}</p>
                                        <p>{this.state.evento.getCiudad()}</p>
                                        <p>{this.state.evento.getInicial() + " - " + this.state.evento.getFinal()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="contenedorDerEvento">
                            <div id="infoDeportesEvento">
                                { this.state.banderaCarga ?
                                    <section key="">
                                        { (this.state.deportes.length > 0) ?
                                            <table>
                                                {this.desplegarDeportes()}
                                            </table>
                                            : <p className="mensajeSinRegistros">Sin deportes asociados</p>
                                        }
                                        {(this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 
                                            <section>
                                                <Button 
                                                    className="botonAgregarCompeticion"
                                                    onClick={() => this.seleccionarCompeticion(null)}>
                                                    <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
                                                    Competición
                                                </Button>
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
                    <div id="modalFormCompeticion">
                        <FloatingActionButton 
                            className="botonCerrarForm"
                            onClick={() => this.seleccionarCompeticion(null)}
                        >
                            <svg aria-hidden="true" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-times fa-w-10 fa-3x">
                                <path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z">
                                </path>
                            </svg>
                        </FloatingActionButton>
                        <FormularioCompeticion
                            agregarForm = {this.verificarAgregar}
                            getCompeticion = {this.getDatosCompeticion}
                            agregarCompeticion = {this.agregarCompeticion}
                            //editarCompeticion = {this.editarCompeticion}
                            edicion={false}
                            datosFormulario = {this.datosFormulario}
                            formValidacion = {this.formValidacion}
                        ></FormularioCompeticion>
                    </div>
                    {this.alertaPop()}
                    {this.redireccion()}
                </div>
                <Dialog
                    overlayClassName="fotoOverlay"
                    contentClassName="fotoModal"
                    open={this.state.modalFoto}
                    onRequestClose={this.cerrarFoto}
                    style={(this.utilidades.obtenerEsMovil()) ? {zIndex: 1500} : {zIndex: 2100}}
                >
                    <img alt="Imagen no disponible" src={this.state.evento.getFoto()} />
                </Dialog>
            </div>
        )
    }
    
    cargarDeportes = () => {
        this.setState({deportes: [], banderaCarga: false});
        var deporte = null;
        Conexion.instancia().solicitar('get', (this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 'api/deportesPorEvento/' : 'deportesPorEvento/', this.state.evento.getId(), null)
            .then(x => {
                var respuesta = new RespuestaBase(x);
                if(respuesta.exito){
                    respuesta.mensaje.map(d => {
                        deporte = new Deporte().setJson(d);
                        this.state.deportes.push(deporte);
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

    formatoEnvioFecha = (fecha) => {
        if(!this.utilidades.obtenerSupportDatePicker() && fecha.includes(" ") && fecha.length > 11){
            var spaceIndex = fecha.indexOf(" ")
            var f = fecha.substring(0, spaceIndex)
            var h = fecha.substring(spaceIndex + 1)
            if(f == "" || h == "")
                return fecha
            var arrayF = f.split("/")
            var arrayH = h.split(":")
            if(arrayF.length != 3 || arrayH.length != 2)
                return fecha
            for(var i = 0; i < arrayF.length; i++){
                if(arrayF[i].length == 1)
                    arrayF[i] = "0" + arrayF[i]
            }
            for(var i = 0; i < arrayH.length; i++){
                if(arrayH[i].length == 1)
                    arrayH[i] = "0" + arrayH[i]
            }
            return arrayF[2] + "-" + arrayF[0] + "-" + arrayF[1] + "T" + arrayH[0] + ":" + arrayH[1]
        }
        return fecha
    }

    agregarCompeticion = () => {
        this.utilidades.mostrarCargador();
        var competicionNueva = new SolicitudCompeticion(this.state.evento.getId(), JSON.parse(this.state.pruebaId).id, this.state.generoId, this.state.faseId, this.formatoEnvioFecha(this.state.fecha) + ":00", this.state.ciudad, this.state.recinto, this.state.descripcion);
        Conexion.instancia().solicitar('post', 'api/competencia/', '', JSON.stringify(competicionNueva))
        .then(x => {
            var respuesta = new RespuestaBase(x);
            if(respuesta.exito)
                this.agregarParticipantesCompeticion(respuesta.mensaje);
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

    agregarParticipantesCompeticion = (competencia) => {
        if(this.state.atletas.length > 0 && competencia != ""){
            this.agregarParticipantes(competencia, this.state.atletas, "api/atletasCompetencia/", true)
        }
        else if(this.state.equipos.length > 0 && competencia != ""){
            this.agregarParticipantes(competencia, this.state.equipos, "api/equiposCompetencia/", false)
        }
        else{
            this.competenciaAgregada()
        }
    }

    agregarParticipantes = (competencia, participantes, url, sonAtletas) => {
        var participantesNuevos = new SolicitudParticipantesCompeticion(competencia, participantes, sonAtletas);
        Conexion.instancia().solicitar('post', url, '', JSON.stringify(participantesNuevos))
        .then(x => {
            var respuesta = new RespuestaBase(x);
            if(respuesta.exito)
                this.competenciaAgregada()
            else{
                if(respuesta.codigo === 403){
                    this.mostrarAlertaPop("Atención", respuesta.mensaje, "sesionV", 1);
                    this.utilidades.ocultarCargador();
                }
                else
                    this.competenciaAgregada()
            }
            this.datosSesion.guardarTokenPersonal(respuesta.token);
        })
        .catch( data => { 
            this.competenciaAgregada()
        }); 
    }

    competenciaAgregada = () => {
        this.utilidades.ocultarCargador();
        this.utilidades.mostrarAlerta("alertaExito", "La competencia se ha creado");
        this.seleccionarCompeticion(null);
        this.cargarDeportes();
    }

}

export default DetalleEvento