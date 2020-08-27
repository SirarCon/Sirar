import React, {Component} from 'react'
import Header from '../../../estructura/header/header';
import RaisedButton from 'material-ui/RaisedButton';
import Utilidades from '../../../../proveedores/utilidades';
import PushNotifications from '../../../../proveedores/pushNotifications/pushNotifications';
import Skeleton from 'react-loading-skeleton';
import $ from 'jquery';
import Equipo from '../../../../modelo/entidades/equipo';
import DatosSesion from '../../../../proveedores/datosSesion';
import { Redirect } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Conexion from '../../../../proveedores/conexion';
import RespuestaBase from '../../../../modelo/respuesta/respuestaBase';
import Button from '@material-ui/core/Button';
import Dialog from 'material-ui/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {GridList, GridTile} from 'material-ui/GridList';
import EventosAtleta from '../../../../modelo/entidades/eventosAtleta';
import live from '../../../../assets/live.gif';
import Atleta from '../../../../modelo/entidades/atleta';
import SolicitudEquipoAtleta from '../../../../modelo/solicitud/solicitudEquipoAtleta';

class DetalleEquipo extends Component {

    datosSesion = DatosSesion.instancia();
    utilidades = Utilidades.instancia();
    push = PushNotifications.instancia();

    constructor(){
        super();
        this.state = {
            banderaCarga: false,ejecutarRedireccion: false,eventos: [],equipo: this.cargarEquipo(),alertaAtletas: false,modalFoto: false,eventos: [],atletasOpciones: [],
            tituloAlertaPop: "", mensajeAlertaPop: "", aceptarAlertaPop: "", botonesAlertaPop: 2, alertaPop: false
        };
    }

    componentDidMount = () => {
        this.validarAcceso()
        this.cargarEventos();
    }

    validarAcceso = () => {
        var a = this.datosSesion.obtenerEquipoDetalle();
        if(a === null || a === undefined)
            this.redireccionar("");
    }

    cargarEquipo = () => {
        var a = this.datosSesion.obtenerEquipoDetalle();
        if(a === null || a === undefined){
            this.redireccionar("equipos");
            return new Equipo();
        }
        return new Equipo().setJson(JSON.parse(a));
    }

    redireccionar = (componente) => {
        this.setState({ejecutarRedireccion: true, destino: componente});
    }
    
    redireccion = () => {
        return (this.state.ejecutarRedireccion) ? <Redirect to={'/' + this.state.destino} /> : null;
    }

    mostrarDetalle = (comp) => {
        this.datosSesion.guardarCompetenciaDetalle(comp);
        this.datosSesion.guardarEsCompetenciaAtletaDetalle(true);
        this.datosSesion.guardarUltimaPantalla("detalleEquipo");
        this.redireccionar("detalleCompetencia");
    }

    estructuraSkeleton = () => {
        var tabla = [];
        var fila = [];
        var filaID = 0;
        var columnaID = 0;
        var cantidadColumnas = (this.utilidades.obtenerEsMovil()) ? 1 : parseInt(window.innerWidth / 300);
        var cantidadFilas = 2
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
                        <div className={"cardCompetencia"} name={index} onClick={this.mostrarDetalle.bind(this, comp)}>
                            {this.state.editarCompetencia ? <button name={index}><i className="far fa-edit"></i></button> : null}
                            <div id="info">
                                <div className="datosCompetencia" >
                                    <div>
                                        {(comp.getEstado() == "1") ? <img alt="" src={live}/> : null}
                                        <p id="prueba">{comp.getPrueba().getNombre()}</p>
                                        <p id="fase">{comp.getFase().getDescripcion()}</p>
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

    desplegarContenido = () => {
        let vista = []
        this.state.eventos.map(e => {
            vista.push(
            <div key={e.getId()} className="contenedorEvento">
                <p className="nombreEvento">{e.getNombre()}</p>
                <table>
                    {this.desplegarCompetencias(e.getCompetencias())}
                </table>
            </div>)
        })
        return vista
    }

    cerrarAlertaAtletas = () => {
        this.setState({alertaAtletas: false});
    }

    mostrarAlertaAtletas = () => {
        this.setState({atletaNuevo: ""});
        if(this.datosSesion.esAdministrador())
            this.getOpcionesAtletas()
        else
            this.setState({alertaAtletas: true});
    }

    alertaAtletas = () => {
        var alt = this.state.equipo;
        return <Dialog open={this.state.alertaAtletas} onClose={this.cerrarAlertaAtletas} className="alertaPop alertaEquipos" scroll="body">
            <DialogTitle>Atletas<Button onClick={this.cerrarAlertaAtletas} className="alertaPopCancelar">Cerrar</Button></DialogTitle>
            <DialogContent scroll='body'>
                <div className={"listaAtletas" + ((this.datosSesion.esAdministrador()) ? "" : " listaAtletasLarga")}>
                    {(this.state.equipo.getAtletas().length > 0) ? this.listarAtletas() : <p className="sinResultados">Sin atletas registrados</p>}
                </div>
                {this.datosSesion.esAdministrador() ?
                    <div className="formAgregarAtleta">
                        { (this.state.atletasOpciones.length > 0) ?
                            <div className="contenedor">
                                <FormControl className="selectControl">
                                    <InputLabel htmlFor="pais-simple">Nuevo Atleta</InputLabel>
                                    <Select
                                        native
                                        value={this.state.atletaNuevo}
                                        onChange={e => this.setState({atletaNuevo: e.target.value})}
                                    >
                                        <option value=""/>
                                        {this.opcionesAtletas()}
                                    </Select>
                                </FormControl>
                                <RaisedButton
                                    label="Agregar" 
                                    className={ (this.state.atletaNuevo != "") ? "botonAgregarU" : "botonAgregarU botonDeshabilitado"}
                                    fullWidth={true} 
                                    onClick={e => this.gestionarAtleta("1", this.state.atletaNuevo)}
                                    labelPosition="before"
                                    icon={<i className="fas fa-ban"></i>}
                                />
                            </div>
                            : <p>No existen atletas para agregar</p>
                        }
                    </div>
                : null}
            </DialogContent>
        </Dialog>
    }

    opcionesAtletas = () => {
        return this.state.atletasOpciones;
    }

    listarAtletas = () => {
        var lista = []
        this.state.equipo.getAtletas().map(a => {
            lista.push(<div key={a.getId()} className="atleta"> {this.datosSesion.esAdministrador() ? <button className="buttonEliminar" onClick={e => this.gestionarAtleta("0", a.getId())}><i className="fas fa-times"></i></button> : null}
                            <Button className={"buttonAtleta" + ((this.datosSesion.esAdministrador()) ? "" : " ancho")} onClick={e => this.consultarDetalleAtleta(a.getId())}>{a.getNombre()}</Button></div>)
        })
        return lista
    }

    sesionVencida = () => {
        this.datosSesion.cerrarSesion();
        this.redireccionar('autenticacion');
    }

    cerrarAlertaPop = () => {
        this.setState({alertaPop: false});
    }

    mostrarAlertaPop = (titulo, mensaje, aceptar, botones) => {
        this.setState({tituloAlertaPop: titulo, mensajeAlertaPop: mensaje, aceptarAlertaPop: aceptar, botonesAlertaPop: botones, alertaPop: true});
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
                <Header titulo = "Equipo" />
                <div className="contenedorPagina" id="contenedorDetalleEquipo">
                    <div id="encabezadoDetalleEquipo" className="segundoMenu">     
                        <div id="accionAtras">
                            <button onClick={e => this.redireccionar('equipos')}><i className="fas fa-chevron-left"></i></button>
                        </div>
                        <div id="tituloRefrescar">
                            <p><a onClick={e => this.redireccionar('equipos')}>Equipos</a></p>
                        </div>
                    </div>
                    <div id="cuerpoDetalleEquipo">
                        <div id="encabezadoEquipo">
                            <div id="infoPersonalEquipo">
                                <div id="data">
                                    <div id="main">
                                        <p>{this.state.equipo.getNombre()}</p>
                                        <p>Evento {this.state.equipo.getEventoNombre()}</p>
                                        <p>Deporte {this.state.equipo.getDeporte().getNombre()}</p>
                                        {(this.state.equipo.getRetirado() == true) ? <p>Retirado</p> : null}
                                    </div>
                                    <div id="pais">
                                        <img className="bandera" src={this.state.equipo.getBandera()} alt=""/>
                                    </div>
                                </div>
                                <button className="masInfo" onClick={() => this.mostrarAlertaAtletas()}>Ver Atletas</button>
                            </div>
                        </div>
                        <div id="redesEquipo">
                            <GridList padding={0} cellHeight={35} cols={1} id="redesSociales">
                                {
                                <GridTile>
                                {<a onClick={e => this.push.togglePushEquipo(this.state.equipo, this.successPush, this.failurePush)}>{(this.state.equipo.getTieneAlerta()) ? <i className="fas fa-star gold"></i> : <i className="far fa-star blink"></i>}</a>}
                                </GridTile>
                                }
                            </GridList>
                        </div>
                        <div id="contenedorDerEquipo">
                        { this.state.banderaCarga 
                        ?
                            (this.state.eventos.length > 0) ?
                                this.desplegarContenido()
                            : <p className="mensajeSinRegistros">Sin resultados</p>
                        :
                            <table>
                                {this.estructuraSkeleton()}
                            </table>
                        }
                        </div>
                    </div>
                    {this.alertaAtletas()}
                    {this.alertaPop()}
                    {this.redireccion()}
                </div>
            </div>
        )
    }
    
    successPush = (respuesta) => {
        this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);
        this.state.equipo.setTieneAlerta(!this.state.equipo.getTieneAlerta());
        this.datosSesion.guardarEquipoDetalle(this.state.equipo)
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

    cargarEventos = () => {
        this.setState({eventos: [], banderaCarga: false});
        Conexion.instancia().solicitar('get', (this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 'api/listarCompetenciasPorEquipo/' : 'listarCompetenciasPorEquipo/', this.state.equipo.getId(), null, this.datosSesion.obtenerTokenPush())
            .then(x => {
                var respuesta = new RespuestaBase(x);
                var evento = null;
                if(respuesta.exito){
                    respuesta.mensaje.map(e => {
                        evento = new EventosAtleta().setJson(e);
                        this.state.eventos.push(evento);
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

      consultarDetalleAtleta = (id) => {
        this.utilidades.mostrarCargador();
        Conexion.instancia().solicitar('get', (this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 'api/atleta/' : 'atleta/', id, null)
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

    getOpcionesAtletas = () => {
        this.utilidades.mostrarCargador();
        var atleta = null;
        var opciones = [];
        this.setState({atletasOpciones: []});
        Conexion.instancia().solicitar('get', 'atletas/', '', null)
        .then(x => {
            var respuesta = new RespuestaBase(x);
            if(respuesta.exito){
                respuesta.mensaje.map(a => {
                    var existe = false
                    atleta = new Atleta().setJson(a);
                    if(atleta.getActivo() && !atleta.getRetirado() && atleta.getGenero() == this.state.equipo.getGenero() && atleta.getDeporte().getId() == this.state.equipo.getDeporte().getId() && atleta.getCodigoPais() == this.state.equipo.getCodigoPais()){
                        for (var i = 0; i < this.state.equipo.getAtletas().length; i++) {
                            if(this.state.equipo.getAtletas()[i].getId() == atleta.getId()){
                                existe = true;
                                break;
                            }
                        }
                        if(!existe)
                            opciones.push(<option value={atleta.getId()}>{atleta.getNombre()}</option>);   
                    }
                });
                this.utilidades.ocultarCargador();
                this.setState({atletasOpciones: opciones, alertaAtletas: true});
            }
            else{
              this.utilidades.ocultarCargador();
              this.setState({alertaAtletas: true});
            }        
        })
        .catch( data => { 
          this.utilidades.ocultarCargador();
          this.setState({alertaAtletas: true});
        });
    }

    // 1 -> agregar, 0 -> eliminar
    gestionarAtleta = (gestion, atletaId) => {
        this.utilidades.mostrarCargador();
        var atletaGestion = new SolicitudEquipoAtleta(atletaId);
        Conexion.instancia().solicitar('put', 'api/equipo/atletas/', this.state.equipo.getId() + "/" + gestion, JSON.stringify(atletaGestion), this.datosSesion.obtenerTokenPush())
        .then(x => {
            var respuesta = new RespuestaBase(x);
            if(respuesta.exito){
                this.datosSesion.guardarEquipoDetalle(new Equipo().setJson(respuesta.mensaje, this.state.equipo.getEventoNombre()));
                this.setState({equipo: this.cargarEquipo()})
                this.cerrarAlertaAtletas()
                this.utilidades.mostrarAlerta("alertaExito", (gestion == "1") ? "Atleta fue agregado." : "Atleta fue eliminado.");
                this.utilidades.ocultarCargador();
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

export default DetalleEquipo