import React, {Component} from 'react'
import Header from '../../../estructura/header/header';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Utilidades from '../../../../proveedores/utilidades';
import Skeleton  from 'react-loading-skeleton';
import Conexion from '../../../../proveedores/conexion';
import RespuestaBase from '../../../../modelo/respuesta/respuestaBase';
import $ from 'jquery';
import DatosSesion from '../../../../proveedores/datosSesion';
import { Redirect } from 'react-router-dom';
import Dialog from 'material-ui/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { RaisedButton, Tabs, Tab, Paper, GridList, GridTile } from 'material-ui';
import { InputLabel, Grid } from '@material-ui/core';
import Competencia from '../../../../modelo/entidades/competencia';
import Prueba from '../../../../modelo/entidades/prueba';
import Evento from '../../../../modelo/entidades/evento';
import Fase from '../../../../modelo/entidades/fase';
import Participante from '../../../../modelo/entidades/participante';
import Atleta from '../../../../modelo/entidades/atleta';
import Equipo from '../../../../modelo/entidades/equipo';
import Deporte from '../../../../modelo/entidades/deporte';
import MultiSelect from '../../../estructura/selectCustom';
import SolicitudParticipantesCompeticion from '../../../../modelo/solicitud/solicitudParticipantesCompeticion';
import live from '../../../../assets/live.gif';
import SolicitudCambiarEstado from '../../../../modelo/solicitud/solicitudCambiarEstado';
import FormularioRegistro from '../../../formularios/formularioRegistro/formularioRegistro';
import SolicitudRegistro from '../../../../modelo/solicitud/solicitudRegistro';
import PushNotifications from '../../../../proveedores/pushNotifications/pushNotifications';

class DetalleCompetencia extends Component {

    datosSesion = DatosSesion.instancia();
    utilidades = Utilidades.instancia();
    push = PushNotifications.instancia();

    constructor(){
        super();
        this.state = {
            tituloAlertaPop: "", mensajeAlertaPop: "", aceptarAlertaPop: "", botonesAlertaPop: 2, 
            alertaPop: false, ejecutarRedireccion: false, banderaCarga: false, competencia: this.cargarCompetencia(), 
            deporte: this.cargarDeporte(), fase: this.cargarFase(), prueba: this.cargarPrueba(), evento: this.cargarEvento(), valorTab: "0", 
            participantes: [], registros: [], borrarParticipante: false, alertaAgregarPart: false, posiblesParticipantes: [], 
            nuevosAtletas: [], alertaConfirmacionBorrar: false, participantePorBorrar: null, alertaEstado: false, editarRegistro: false,
            esUltimo: false, idRegistro: "", set: "", puntaje: "", momentoTiempo: "", oportunidad: "", oportunidades: "", puntajeValido: false,
            participanteSeleccionado: "", participanteValido: "", editarRegistro: false, esDetalleAtleta: this.datosSesion.obtenerEsCompetenciaAtletaDetalle(), backUrl: ""
        };
    }

    componentDidMount = () => {
        this.validarAcceso()
        this.cargarParticipantes()
        this.setState({backUrl: (this.datosSesion.obtenerEsCompetenciaPush() == "true") 
                                ? ""
                                : (this.state.esDetalleAtleta == "true") 
                                ? this.datosSesion.obtenerUltimaPantalla()
                                : 'competencias'});
    }

    validarAcceso = () => {
        var a = this.datosSesion.obtenerCompetenciaDetalle();
        if(a === null || a === undefined)
            this.redireccionar("");
    }

    cargarCompetencia = () => {
        var c = this.datosSesion.obtenerCompetenciaDetalle();
        if(c === null || c === undefined){
            this.redireccionar("competencias");
            return new Competencia();
        }
        return new Competencia().setJson(JSON.parse(c));
    }

    cargarPrueba = () => {
        if(this.datosSesion.obtenerEsCompetenciaAtletaDetalle() == "true")
            return new Competencia().setJson(JSON.parse(this.datosSesion.obtenerCompetenciaDetalle())).getPrueba()
        var p = this.datosSesion.obtenerPrueba();
        return (p === null || p === undefined) ? new Prueba() : new Prueba().setJson(JSON.parse(p));
    }

    cargarFase = () => {
        if(this.datosSesion.obtenerEsCompetenciaAtletaDetalle() == "true")
            return new Competencia().setJson(JSON.parse(this.datosSesion.obtenerCompetenciaDetalle())).getFase()
        var f = this.datosSesion.obtenerFaseId();
        return (f === null || f === undefined) ? new Fase() : new Fase().setJson(JSON.parse(f));
    }

    cargarEvento = () => {
        if(this.datosSesion.obtenerEsCompetenciaAtletaDetalle() == "true")
            return new Competencia().setJson(JSON.parse(this.datosSesion.obtenerCompetenciaDetalle())).getEvento()
        var e = this.datosSesion.obtenerEventoDetalle();
        return (e === null || e === undefined) ? new Evento() : new Evento().setJson(JSON.parse(e));
    }

    cargarDeporte = () => {
        if(this.datosSesion.obtenerEsCompetenciaAtletaDetalle() == "true")
            return new Competencia().setJson(JSON.parse(this.datosSesion.obtenerCompetenciaDetalle())).getDeporte()
        var d = this.datosSesion.obtenerDeporteDetalle();
        return (d === null || d === undefined) ? new Deporte() : new Deporte().setJson(JSON.parse(d));
    }

    obtenerPrueba = () =>{
        return this.state.prueba
    }

    redireccionar = (componente) => {
        this.setState({ejecutarRedireccion: true, destino: componente});
    }
    
    redireccion = () => {
        return (this.state.ejecutarRedireccion) ? <Redirect to={'/' + this.state.destino} /> : null;
    }

    getParticipantes = () =>{
        return this.state.participantes;
    } 

    seleccionarRegistro = (reg) => {
        if(reg !== undefined){
            this.llenarFormRegistro(reg);
            $(document).ready(() => {
                this.validarFormularioEdicion()
                if(!this.state.formAgregarRegistro){
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
        var comps =  "auto"
        if(this.state.banderaFormulario){
            $('#modalFormRegistro').removeClass("abrirModalForm");
            $('#modalFormRegistro').addClass("cerrarModalForm");
            $('#cuerpoCompetencia').show()
        }
        else{
            comps = "none";
            $('#modalFormRegistro').removeClass("cerrarModalForm");
            $('#modalFormRegistro').addClass("abrirModalForm");
            $('#cuerpoCompetencia').hide()
        }
        $('header').css('pointerEvents', comps);
        this.setState({banderaFormulario: !this.state.banderaFormulario});
    }
    
    llenarFormRegistro = (r) => {
        (r == null)
        ? this.setState({formAgregarRegistro: true, idRegistro: "", esUltimo: false, set: "", puntaje: "", momentoTiempo: "", oportunidad: "", oportunidades: "", participanteSeleccionado: ""})
        : this.setState({formAgregarRegistro: false, idRegistro: r.getId(), esUltimo: r.getEsUltimo(), set: r.getSet(), puntaje: r.getPuntaje(), momentoTiempo: r.getMomento(), oportunidad: r.getOportunidad(), oportunidades: r.getOportunidades(), participanteSeleccionado: r.getParticipante()})
    }

    validarFormularioEdicion = () =>{
        this.datosFormulario("participanteSeleccionado", this.state.participanteSeleccionado)
        this.datosFormulario("puntaje", this.state.puntaje)
    }

    verificarAgregar = () => {
        return this.state.formAgregarRegistro;
    }

    getDatosRegistro = (input) => {
        switch(input){
            case "esUltimo": return this.state.esUltimo;
            case "set": return this.state.set;
            case "puntaje": return this.state.puntaje;
            case "momentoTiempo": return this.state.momentoTiempo;
            case "oportunidad": return this.state.oportunidad;
            case "oportunidades": return this.state.oportunidades;
            case "participanteSeleccionado": return this.state.participanteSeleccionado;
            default: return "";
        }
    }

    setDatosRegistro = (input, valor) => {
        this.setState({[input]: valor});
    }

    datosFormulario = (dato, valor) => {
        switch(dato){
            case 'participanteSeleccionado':
                this.setDatosRegistro(dato, valor);
                this.setState({participanteValido: (valor.toString().length > 0)});
                break;
            case 'puntaje':
                this.setDatosRegistro(dato, valor);
                this.setState({puntajeValido: (valor.toString().length > 0)});
                break;
            default:
                this.setDatosRegistro(dato, valor);
                break;
        }
    }

    formValidacion = () => {
        return (this.state.participanteValido && this.state.puntajeValido) ? true : false;
    }

    mostrarDetalleParticipante = (p) => {
        this.setState({borrarParticipante: false})
        if(this.state.borrarParticipante)
            this.mostrarAlertaBorrar(p)
        else{
            if(this.state.prueba.getTipo() == "0")
                this.consultarDetalleAtleta(p.getAtleta().getId())
            else
                this.consultarDetalleEquipo(p.getEquipo().getId())
        }
    }

    mostrarDetalleRegistro = (r) => {
        this.setState({editarRegistro: false})
        if(this.state.editarRegistro)
            this.seleccionarRegistro(r)
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
        var cantidadColumnas = 1;
        var cantidadFilas = 3
        while(filaID < cantidadFilas){
            fila.push(<tr key={filaID}><div className={((this.state.valorTab == "0") ? "cardParticipante" : "cardRegistro") + " cardSkeleton"}><Skeleton></Skeleton></div></tr>)
            filaID++;
        }
        while(columnaID < cantidadColumnas){
          tabla.push(<td key={columnaID}>{fila}</td>);
          columnaID++;
        }
        return tabla;
    }

    desplegarElementos = (elementos, tipo) => {
        var tabla = [];
        var index = 0;
        var cantidadColumnas = 1;
        var cantidadFilas = Math.ceil(elementos.length / cantidadColumnas);
        var filaID = 0;
        var columnas = [];
        while(filaID < cantidadFilas){
            columnas = (tipo == "0") ? this.crearColumnasParticipantes(cantidadColumnas, index, elementos, (filaID == 0)) : this.crearColumnasRegistros(cantidadColumnas, index, elementos) 
            index = index + (columnas.length)
            tabla.push(<tr key={filaID}>{columnas}</tr>);
            filaID++;
        }
        return tabla;
    }

    getNombreTipoMarcador(){
        var tipo = this.state.prueba.getTipoMarcador()
        return (tipo == "1") ? "Puntos: " : (tipo == "2") ? "Tiempo: " : (tipo == "3") ? "Distancia: " : ""
    }

    crearColumnasRegistros = (cantidadColumnas, index, regs) => {
        var columna = [];
        var columnaID = 0;
        var reg = null;
        while(columnaID < cantidadColumnas){
            if (index < regs.length){
                reg = regs[index];
                    columna.push(<td key={columnaID}>
                        <div className="cardRegistro" name={index} onClick={this.mostrarDetalleRegistro.bind(this, reg)}>
                            {this.state.editarRegistro ? <button name={index}><i className="fas fa-times"></i></button> : null}
                            <div id="info">
                                <div className="datosRegistro">
                                    <div>
                                        <img id="bandera" src={reg.getBandera()} alt=""/>
                                        <p id="nombre">{reg.getNombre()}</p>
                                    </div>
                                </div>
                                <div className="datosExtra">
                                    <div>
                                        {(reg.getPuntaje() != "" && reg.getPuntaje() != null) ? <p id="puntaje">{this.getNombreTipoMarcador() + reg.getPuntaje()}</p> : null}
                                        {(reg.getMomento() != "" && reg.getMomento() != null) ? <p id="momento">Momento: {reg.getMomento()}</p> : null}
                                        {(reg.getSet() != "" && reg.getSet() != null) ? <p id="set">Set: {reg.getSet()}</p> : null}
                                        {(reg.getOportunidades() != "" && reg.getOportunidades() != null) ? <p id="oportunidades">Cantidad máxima de oportunidades: {reg.getOportunidades()}</p> : null}
                                        {(reg.getOportunidad() != "" && reg.getOportunidad() != null) ? <p id="oportunidad">Oportunidad: {reg.getOportunidad()}</p> : null}
                                        <p id="ultimo">{(reg.getEsUltimo()) ? "Último registro" : ""}</p>
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

    crearColumnasParticipantes = (cantidadColumnas, index, parts, first) => {
        var columna = [];
        var columnaID = 0;
        var part = null;
        var atleta = null;
        while(columnaID < cantidadColumnas){
            if (index < parts.length){
                part = parts[index];
                atleta = (this.state.prueba.getTipo() == "0") ? part.getAtleta() : part.getEquipo()
                    columna.push(<td key={columnaID}>
                        <div className="cardParticipante" name={index} onClick={this.mostrarDetalleParticipante.bind(this, part)}>
                            {this.state.borrarParticipante ? <button name={index}><i className="fas fa-times"></i></button> : null}
                            <div id="info">
                                <div className="datosParticipante">
                                    <div>
                                        <img id="bandera" src={atleta.getBandera()} alt=""/>
                                        <p id="nombre">{atleta.getNombre()}</p>
                                        { (part.getPuntaje() !== -999999999 && part.getPuntaje() !== 999999999) ?
                                            <div id="puntaje" className={(first) ? "gold" : ""}>
                                                <p>{part.getPuntaje()}</p>
                                            </div>
                                        : null}
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
        this.setState({borrarParticipante: false, editarRegistro: false})
        this.setState({valorTab: event});
    }

    validarContenido = () => {        
        if(this.state.valorTab == "0"){ // 0: Participantes
            return this.desplegarContenido(this.state.participantes, "0")
        }
        else if(this.state.valorTab == "1"){ // 1: Registros
            return this.desplegarContenido(this.state.registros, "1")
        }
    };

    desplegarContenido(elementos, tipo){
        return <section>
        { (elementos.length > 0) ?
            <table>
                {this.desplegarElementos(elementos, tipo)}
            </table>
        : <p className="mensajeSinRegistros">Sin resultados</p>
        } 
        </section>
    }

    cerrarAlertaAgregarPart = () => {
        this.setState({alertaAgregarPart: false, posiblesParticipantes: [], nuevosAtletas: []});
    }

    mostrarAlertaAgregarPart = () => {
        this.setState({borrarParticipante: false, editarRegistro: false})
        if(this.state.competencia.getPrueba().getTipo() == "0")
            this.cargarPosiblesAtletas()
        else if(this.state.competencia.getPrueba().getTipo() == "1"){
            this.cargarPosiblesEquipos()
        }
    }

    cargarPosiblesAtletas = () => {
        this.utilidades.mostrarCargador();
        var atleta = null;
        var opciones = [];
        Conexion.instancia().solicitar('get', 'atletas/', '', null)
        .then(x => {
            var respuesta = new RespuestaBase(x);
            if(respuesta.exito){
                respuesta.mensaje.map(a => {
                    var existe = false
                    atleta = new Atleta().setJson(a);
                    if(atleta.getActivo() && !atleta.getRetirado() && atleta.getGenero() == this.state.competencia.getGenero() 
                    && atleta.getDeporte().getId() == this.state.deporte.getId()){
                        for (var i = 0; i < this.state.participantes.length; i++) {
                            if(this.state.participantes[i].getAtleta().getId() == atleta.getId()){
                                existe = true;
                                break;
                            }
                        }
                        if(!existe)
                            opciones.push({value: atleta.getId(), label: atleta.getNombre() + ", "+ atleta.getNombrePais()})
                    }
                });
                this.utilidades.ocultarCargador();
                this.setState({posiblesParticipantes: opciones});
                if(opciones.length == 0)
                  this.utilidades.mostrarAlerta("alertaInfo", "No existen más atletas para esta competición");
                else
                    this.setState({alertaAgregarPart: true});
            }
            else{
              this.setState({posiblesParticipantes: []});
              this.utilidades.ocultarCargador();
              this.utilidades.mostrarAlerta("alertaError", respuesta.mensaje);
            }        
        })
        .catch( data => { 
          this.setState({posiblesParticipantes: []});
          this.utilidades.ocultarCargador();
          this.utilidades.mostrarAlerta("alertaError", Conexion.instancia().errorGenerico);
        });
    }

    cargarPosiblesEquipos = () => {
        this.utilidades.mostrarCargador();
        var equipo = null;
        var opciones = [];
        Conexion.instancia().solicitar('get', 'equipos/', this.state.evento.getId(), null)
        .then(x => {
            var respuesta = new RespuestaBase(x);
            if(respuesta.exito){
                respuesta.mensaje.map(e => {
                    var existe = false
                    equipo = new Equipo().setJson(e);
                    if(equipo.getActivo() && !equipo.getRetirado() && equipo.getGenero() == this.state.competencia.getGenero() 
                    && equipo.getDeporte().getId() == this.state.deporte.getId()){
                        for (var i = 0; i < this.state.participantes.length; i++) {
                            if(this.state.participantes[i].getEquipo().getId() == equipo.getId()){
                                existe = true;
                                break;
                            }
                        }
                        if(!existe)
                            opciones.push({value: equipo.getId(), label: equipo.getNombre() + ", "+ equipo.getNombrePais()})
                    }
                });
                this.utilidades.ocultarCargador();
                this.setState({posiblesParticipantes: opciones});
                if(opciones.length == 0)
                  this.utilidades.mostrarAlerta("alertaInfo", "No existen más equipos para esta competición");
                else
                    this.setState({alertaAgregarPart: true});
            }
            else{
              this.setState({posiblesParticipantes: []});
              this.utilidades.ocultarCargador();
              this.utilidades.mostrarAlerta("alertaError", respuesta.mensaje);
            }        
        })
        .catch( data => { 
          this.setState({posiblesParticipantes: []});
          this.utilidades.ocultarCargador();
          this.utilidades.mostrarAlerta("alertaError", Conexion.instancia().errorGenerico);
        });
    }

    alertaAgregarPart = () => {
        return <Dialog open={this.state.alertaAgregarPart} onClose={this.cerrarAlertaAgregarPart} className="alertaPop alertaAgregarPart" scroll="none">
            <DialogTitle><Button onClick={this.cerrarAlertaAgregarPart} className="alertaPopCancelar"><i className="fas fa-times"></i></Button></DialogTitle>
            <DialogContent scroll='none'>
                <section className="multiSelect">
                    <section className="placeholder" id="atletasSelectPL">
                    <InputLabel>{(this.state.prueba.getTipo() == "0") ? "Atletas" : "Equipos"}</InputLabel>
                    </section>
                    <MultiSelect
                    id="atletasSelect"
                    placeholderId="atletasSelectPL"
                    isMulti
                    options={this.state.posiblesParticipantes}
                    classNamePrefix="select"
                    placeholder=""
                    noOptionsMessage={function(){ return "Sin resultados"; }}
                    value={this.state.nuevosAtletas}
                    onChange={e => this.setState({nuevosAtletas: e})}
                    />
                </section>
                <RaisedButton 
                    label="Agregar" 
                    className={ (this.state.nuevosAtletas != null  && this.state.nuevosAtletas.length > 0) ? "botonAgregarU" : "botonAgregarU botonDeshabilitado"}
                    fullWidth={true} 
                    onClick={this.agregarParticipantesCompeticion}
                    labelPosition="before"
                    icon={<i className="fas fa-ban"></i>}/>
            </DialogContent>
        </Dialog>
    }

    cerrarAlertaBorrar = () => {
        this.setState({alertaConfirmacionBorrar: false, participantePorBorrar: null});
    }
    
    mostrarAlertaBorrar = (p) => {
        this.setState({alertaConfirmacionBorrar: true, participantePorBorrar: p});
    }
    
    alertaConfirmacionBorrar = () => {
        return <Dialog open={this.state.alertaConfirmacionBorrar} onClose={this.cerrarAlertaBorrar} className="alertaPop">
            <DialogTitle className="alertaPopTitulo">Atención</DialogTitle>
            <DialogContent>
            <DialogContentText className="alertaPopMensaje">¿Desea borrar el {((this.state.prueba.getTipo() == "0") 
                                                                                ? ("atleta " + ((this.state.participantePorBorrar != null) ? this.state.participantePorBorrar.getAtleta().getNombre() : "")) 
                                                                                : ("equipo " + ((this.state.participantePorBorrar != null) ? this.state.participantePorBorrar.getEquipo().getNombre() : ""))
                                                                            )}?</DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={this.borrarParticipanteCompeticion} className="alertaPopAceptar">
                Aceptar
            </Button>
            <Button onClick={this.cerrarAlertaBorrar} className="alertaPopCancelar">
                Cancelar
            </Button>
            </DialogActions>
        </Dialog>
    }

    cerrarAlertaEstado = () => {
        this.setState({alertaEstado: false});
    }

    mostrarAlertaEstado = () => {
        this.setState({borrarParticipante: false, editarRegistro: false})
        this.setState({alertaEstado: true});
    }

    alertaEstado = () => {
        return <Dialog open={this.state.alertaEstado} onClose={this.cerrarAlertaEstado} className="alertaPop alertaFases" scroll="body">
            <DialogTitle>Estado<Button onClick={this.cerrarAlertaEstado} className="buttonCerrarFases"><i className="fas fa-times"></i></Button></DialogTitle>
            <DialogContent scroll='body'>
                {/* 0 -> finalizó , 1 -> en vivo, 2 proximo*/}
                <Button onClick={e => this.cambiarEstado(0)} disabled={this.state.competencia.getEstado() == "0"} className="buttonFase">Finalizó</Button>
                <Button onClick={e => this.cambiarEstado(1)} disabled={this.state.competencia.getEstado() == "1"} className="buttonFase enVivo">En Vivo</Button>
                <Button onClick={e => this.cambiarEstado(2)} disabled={this.state.competencia.getEstado() == "2"} className="buttonFase">Próxima</Button>
            </DialogContent>
        </Dialog>
    }

    header = () => {
        if(this.utilidades.obtenerEsMovil()){
            return (this.state.competencia.getEstado() == "1") 
            ? <Header titulo="En Vivo" img={<img alt="" src={live}/>}/> 
            : (this.state.competencia.getEstado() == "0") 
            ? <Header titulo="Finalizó"/> 
            : <Header titulo="Competencia"/>
        }
        else
            return <Header titulo="Competencia"/>
    }

    render(){
        return(
            <div className="contenidoBody">
                {this.header()}
                <div className="contenedorPagina" id="contenedorCompetencia">
                    <div className="infoGeneral">
                        <Grid container spacing={1}>
                            <Grid item xs={6} sm={3}>
                                <Button disabled={this.state.esDetalleAtleta == "true"} onClick={e => this.redireccionar('detalleEvento')}>{this.state.evento.getNombre()}</Button>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Button disabled={this.state.esDetalleAtleta == "true"} onClick={e => this.redireccionar('detalleDeporte')}>{this.state.prueba.getNombre()}</Button>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Button disabled={this.state.esDetalleAtleta == "true"} onClick={e => this.redireccionar('detalleDeporte')}>{this.state.fase.getDescripcion()}</Button>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Button disabled={this.state.esDetalleAtleta == "true"} onClick={e => this.redireccionar('detalleDeporte')}>{this.state.prueba.getGeneroNombre()}</Button>
                            </Grid>
                        </Grid>
                    </div>
                    <div className="tabs">
                        <Paper square="true">
                            <Tabs
                                value={this.state.valorTab}
                                onChange={this.handleTabChange}
                            >
                                <Tab label="Participantes" value="0"/>
                                <Tab label="Registros" value="1"/>
                            </Tabs>
                        </Paper>
                    </div>
                    <div id="cuerpoCompetencia" >
                        <div id="infoCompetenciaContenedor">
                            <div id="accionAtras">
                                <button onClick={e => this.redireccionar(this.state.backUrl) /*(this.state.esDetalleAtleta == "true") ? ((this.state.prueba.getTipo() == "0") ? 'detalleAtleta' : 'detalleEquipo') : 'competencias')*/}><i className="fas fa-chevron-left"></i></button>
                            </div>
                            {(this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 
                                <div id="cambiarEstado">
                                    <button onClick={e => this.mostrarAlertaEstado()}><i className="fas fa-sliders-h"></i></button>
                                </div>
                            : null }
                            <div id="tituloRefrescar">
                                {(this.state.competencia.getEstado() == "1") ? <img alt="" src={live}/> : null}    
                                <p>{(this.state.competencia.getEstado() == "0") ? "Finalizó" : 
                                    (this.state.competencia.getEstado() == "1") ? "En Vivo": ""}
                                </p>
                            </div>
                            <div id="infoCompetencia">
                                <div id="data"  className={(this.state.evento.getFoto() !== "") ? "" : "evSinFoto"}>
                                    <div id="main">
                                        <p id="fecha"><i className="far fa-calendar-alt"></i> {this.utilidades.fechaFormatoFinal(this.state.competencia.getFecha())} <i className="far fa-clock"></i> {this.utilidades.horaFormatoFinal(this.state.competencia.getFecha())}</p>
                                        <p id="recinto">{(this.state.competencia.getRecinto()) ? <i className="fas fa-map-marker-alt"></i> : null} {this.state.competencia.getRecinto()}</p>
                                        <p id="desc">{this.state.competencia.getDescripcion()}</p>
                                    </div>
                                    {/*<button className="masInfo" onClick={() => this.mostrarAlertaParticipantes()}>Participantes</button>*/}
                                </div>
                            </div>
                        </div>
                        <div id="redesEquipo">
                            <GridList padding={0} cellHeight={35} cols={1} id="redesSociales">
                                {
                                <GridTile>
                                {<a onClick={e => this.push.togglePushCompetencia(this.state.competencia, this.successPush, this.failurePush)}>{(this.state.competencia.getTieneAlerta()) ? <i className="fas fa-star gold"></i> : <i className="far fa-star blink"></i>}</a>}
                                </GridTile>
                                }
                            </GridList>
                        </div>
                        { this.state.banderaCarga ?
                            <section key="">
                                {this.validarContenido()}
                                {(this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 
                                    (this.state.valorTab == "0") ?
                                        <section>
                                            {(this.state.participantes.length > 0) ?
                                                <FloatingActionButton 
                                                    className="botonBorrarParticipante"
                                                    onClick={() => this.setState({borrarParticipante: !this.state.borrarParticipante})}
                                                >
                                                    <i className="fas fa-times"></i>
                                                </FloatingActionButton>
                                            : null}
                                            <FloatingActionButton 
                                                className="botonAgregarParticipante"
                                                onClick={() => this.mostrarAlertaAgregarPart()}
                                            >
                                                <ContentAdd />
                                            </FloatingActionButton>
                                        </section>
                                    : 
                                        (this.state.participantes.length > 0) ?
                                            <section>
                                                <FloatingActionButton 
                                                    className="botonEditarRegistro"
                                                    onClick={() => this.setState({editarRegistro: !this.state.editarRegistro})}
                                                >
                                                    { this.state.editarRegistro ? <i className="fas fa-times"></i> : <i className="far fa-edit"></i>}
                                                </FloatingActionButton>
                                                <FloatingActionButton 
                                                    className="botonAgregarRegistro"
                                                    onClick={() => this.seleccionarRegistro(null)}
                                                >
                                                    <ContentAdd />
                                                </FloatingActionButton>
                                            </section>
                                        : null
                                : null}
                            </section>
                        :
                            <table>
                                {this.estructuraSkeleton()}
                            </table>
                        }
                    </div>
                    <div id="modalFormRegistro">
                        <FloatingActionButton 
                            className="botonCerrarForm"
                            onClick={() => this.seleccionarRegistro(null)}
                        >
                            <svg aria-hidden="true" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-times fa-w-10 fa-3x">
                                <path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z">
                                </path>
                            </svg>
                        </FloatingActionButton>
                        {
                            <FormularioRegistro
                                agregarForm = {this.verificarAgregar}
                                getRegistro = {this.getDatosRegistro} 
                                agregarRegistro = {this.agregarRegistro}
                                editarRegistro = {this.editarRegistro}
                                borrarRegistro = {this,this.borrarRegistro}
                                datosFormulario = {this.datosFormulario}
                                formValidacion = {this.formValidacion}
                                getParticipantes = {this.getParticipantes}
                                getPrueba = {this.obtenerPrueba}
                            ></FormularioRegistro>
                        }
                    </div>
                    {this.alertaPop()}
                    {this.redireccion()}
                    {this.alertaAgregarPart()}
                    {this.alertaConfirmacionBorrar()}
                    {this.alertaEstado()}
                </div>
            </div>
        )
    }

    successPush = (respuesta) => {
        this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);
        this.state.competencia.setTieneAlerta(!this.state.competencia.getTieneAlerta());
        this.datosSesion.guardarCompetenciaDetalle(this.state.competencia)
        window.location.reload(false);
    }

    failurePush = (respuesta, msj = Conexion.instancia().errorGenerico) => {
        if(respuesta != null){
            (respuesta.codigo === 403)
            ? this.mostrarAlertaPop("Atención", respuesta.mensaje, "sesionV", 1)
            : this.utilidades.mostrarAlerta("alertaError", respuesta.mensaje);
        }
        else
            this.utilidades.mostrarAlerta("alertaError", msj);
    }

    esNumero = (value) => {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    obtenerPuntajeNumerico = (puntaje) => {
        return (this.esNumero(puntaje)) ? puntaje : parseInt(puntaje.toString().replace(/[^\d]/g, ""))
    }

    ordenarParticipantes = () => {
        this.setState({participantes: this.state.participantes.sort((a,b) => {
            var puntajeA = this.obtenerPuntajeNumerico(a.getPuntaje())
            var puntajeB = this.obtenerPuntajeNumerico(b.getPuntaje())
            return (this.state.prueba.getTipoMarcador().toString() == "2") ? puntajeA-puntajeB : puntajeB-puntajeA
        })});
    }

    ordenarRegistros = () => {
        this.setState({registros: this.state.registros.sort((a,b) => {
             return b.getRegistro()-a.getRegistro()
        })});
    }

    cargarParticipantes = () => {
        this.setState({participantes: [], registros: [], banderaCarga: false});
        var participante = null;
        var url = (this.state.prueba.getTipo() == "0") ? "listarAtletasPorCompetencia/" : "listarEquiposPorCompetencia/"
        Conexion.instancia().solicitar('get', (this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 'api/' + url : url, this.state.competencia.getId(), null)
            .then(x => {
                var respuesta = new RespuestaBase(x);
                if(respuesta.exito){
                    respuesta.mensaje.map(p => {
                        participante = new Participante().setJson(p, this.state.prueba.getTipoMarcador());
                        this.state.participantes.push(participante);
                        this.setState({registros: this.state.registros.concat(participante.getRegistros())})
                    });
                    this.ordenarParticipantes()
                    this.ordenarRegistros()
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

    agregarParticipantesCompeticion = () => {
        this.utilidades.mostrarCargador();
        if(this.state.prueba.getTipo() == "0")
            this.agregarParticipantes(this.state.nuevosAtletas, "api/atletasCompetencia/", true)
        else
            this.agregarParticipantes(this.state.nuevosAtletas, "api/equiposCompetencia/", false)
    }

    agregarParticipantes = (participantes, url, sonAtletas) => {
        var participantesNuevos = new SolicitudParticipantesCompeticion(this.state.competencia.getId(), participantes, sonAtletas);
        Conexion.instancia().solicitar('post', url, '', JSON.stringify(participantesNuevos))
        .then(x => {
            var respuesta = new RespuestaBase(x);
            this.utilidades.ocultarCargador();
            if(respuesta.exito){
                this.cerrarAlertaAgregarPart()
                this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);
                this.cargarParticipantes();
            }
            else{
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

    borrarParticipanteCompeticion = () => {
        this.cerrarAlertaBorrar()
        this.setState({borrarParticipante: false})
        this.utilidades.mostrarCargador();
        if(this.state.prueba.getTipo() == "0")
            this.borrarParticipante("api/atletaCompetencia/")
        else if(this.state.prueba.getTipo() == "1")
            this.borrarParticipante("api/equipoCompetencia/")
        else
            this.utilidades.ocultarCargador();
    }

    borrarParticipante = (url) => {
        Conexion.instancia().solicitar('delete', url, this.state.participantePorBorrar.getId(), null)
        .then(x => {
            var respuesta = new RespuestaBase(x);
            this.utilidades.ocultarCargador();
            if(respuesta.exito){
                this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);
                this.setState({borrarParticipante: false, editarRegistro: false})
                this.cargarParticipantes();
            }
            else{
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

    consultarDetalleAtleta = (id) => {
        this.utilidades.mostrarCargador();
        Conexion.instancia().solicitar('get', (this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 'api/atleta/' : 'atleta/', id, null, this.datosSesion.obtenerTokenPush())
            .then(x => {
                var respuesta = new RespuestaBase(x);
                this.utilidades.ocultarCargador();
                if(respuesta.exito){
                    this.datosSesion.guardarAtletaDetalle(new Atleta().setJson(respuesta.mensaje));
                    this.redireccionar("detalleAtleta");
                }
                else{
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

    consultarDetalleEquipo = (id) => {
        this.utilidades.mostrarCargador();
        Conexion.instancia().solicitar('get', (this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 'api/equipo/' : 'equipo/', id, null, this.datosSesion.obtenerTokenPush())
            .then(x => {
                var respuesta = new RespuestaBase(x);
                this.utilidades.ocultarCargador();
                if(respuesta.exito){
                    this.datosSesion.guardarEquipoDetalle(new Equipo().setJson(respuesta.mensaje));
                    this.redireccionar("detalleEquipo");
                }
                else{
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

    cambiarEstado = (id) => {
        this.utilidades.mostrarCargador();
        var estado = new SolicitudCambiarEstado(id);
        Conexion.instancia().solicitar('put', 'api/activarCompetencia/', this.state.competencia.getId(), JSON.stringify(estado))
        .then(x => {
            var respuesta = new RespuestaBase(x);
            if(respuesta.exito){
                this.state.competencia.setEstado(id)
                this.datosSesion.guardarCompetenciaDetalle(this.state.competencia)
                this.cerrarAlertaEstado()
                this.utilidades.ocultarCargador()
                this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje)
                this.datosSesion.guardarRefrescarListaCompetencias(true)
                if(this.utilidades.obtenerEsMovil())
                    window.location.reload(false);
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

    agregarRegistro = () => {
        this.gestionRegistro("1")
    }

    editarRegistro = () => {
        this.gestionRegistro("2")
    }

    borrarRegistro = () => {
        this.gestionRegistro("0")
    }

    gestionRegistro = (gestion) => { // 1 -> agregar, 0 -> eliminar, 2 -> editar
        this.utilidades.mostrarCargador();
        var url = ""
        var urlSection = ""
        if(this.state.prueba.getTipo() == "0"){
            url = 'api/marcadoresAtletaCompetencia/'
            urlSection = this.state.participanteSeleccionado + "/" + gestion
            if(gestion == "2"){
                url = "api/modificarMarcadorAtletaCompetencia/"
                urlSection = this.state.participanteSeleccionado
            }
        }
        else{
            url = 'api/marcadoresEquipoCompetencia/'
            urlSection = this.state.participanteSeleccionado + "/" + gestion
            if(gestion == "2"){
                url = "api/modificarMarcadorEquipoCompetencia/"
                urlSection = this.state.participanteSeleccionado
            }
        }
        var solRegistro = new SolicitudRegistro(this.state.puntaje, this.state.momentoTiempo, this.state.set, this.state.oportunidades, this.state.oportunidad, this.state.esUltimo, this.state.idRegistro)
        Conexion.instancia().solicitar('put', url, urlSection, JSON.stringify(solRegistro))
        .then(x => {
            var respuesta = new RespuestaBase(x);
            this.utilidades.ocultarCargador()
            if(respuesta.exito){
                this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje)
                this.seleccionarRegistro(null);
                this.setState({borrarParticipante: false, editarRegistro: false})
                this.cargarParticipantes()
            }
            else{
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

}

export default DetalleCompetencia