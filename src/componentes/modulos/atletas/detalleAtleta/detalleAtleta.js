import React, {Component} from 'react'
import Header from '../../../estructura/header/header';
import Utilidades from '../../../../proveedores/utilidades';
import PushNotifications from '../../../../proveedores/pushNotifications/pushNotifications';
import Skeleton from 'react-loading-skeleton';
import $ from 'jquery';
import Atleta from '../../../../modelo/entidades/atleta';
import DatosSesion from '../../../../proveedores/datosSesion';
import { Redirect } from 'react-router-dom';
import userDefault from '../../../../assets/imagenes/defaultUser.jpeg';
import Conexion from '../../../../proveedores/conexion';
import RespuestaBase from '../../../../modelo/respuesta/respuestaBase';
import Button from '@material-ui/core/Button';
import Dialog from 'material-ui/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {GridList, GridTile} from 'material-ui/GridList';
import EventosAtleta from '../../../../modelo/entidades/eventosAtleta';
import live from '../../../../assets/live.gif';


class DetalleAtleta extends Component {

    datosSesion = DatosSesion.instancia();
    utilidades = Utilidades.instancia();
    push = PushNotifications.instancia();

    constructor(){
        super();
        this.state = {
            banderaCarga: false,
            ejecutarRedireccion: false,
            eventos: [],
            atleta: this.cargarAtleta(),
            alertaInfo: false,
            modalFoto: false,
            eventos: []
        };
    }

    componentDidMount = () => {
        this.validarAcceso()
        this.cargarEventos();
    }

    validarAcceso = () => {
        var a = this.datosSesion.obtenerAtletaDetalle();
        if(a === null || a === undefined)
            this.redireccionar("");
    }

    cargarAtleta = () => {
        var a = this.datosSesion.obtenerAtletaDetalle();
        if(a === null || a === undefined){
            this.redireccionar("atletas");
            return new Atleta();
        }
        return new Atleta().setJson(JSON.parse(a));
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
        this.datosSesion.guardarUltimaPantalla("detalleAtleta");
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

    cerrarAlertaInfo = () => {
        this.setState({alertaInfo: false});
    }

    mostrarAlertaInfo = () => {
        this.setState({alertaInfo: true});
    }

    verFoto = () => {
        this.setState({modalFoto: true, opcionesFoto: false});
    };

    cerrarFoto = () => {
        this.setState({modalFoto: false});
    };

    alertaInfo = () => {
        var alt = this.state.atleta;
        return <Dialog open={this.state.alertaInfo} onClose={this.cerrarAlertaInfo} className="alertaPop atletaMasDetalle" scroll="body">
          <DialogTitle>{this.state.atleta.getNombre()}<Button onClick={this.cerrarAlertaInfo} className="alertaPopCancelar"><i className="fas fa-times"></i></Button></DialogTitle>
          <DialogContent scroll='body'>
            {(alt.getDeporte().getNombre() != "") ? <DialogContentText>Deporte: {alt.getDeporte().getNombre()}</DialogContentText> : null}
            {(alt.getNombrePais() != "") ? <DialogContentText>País: {alt.getNombrePais()}</DialogContentText> : null}
            {(alt.getFechaNacimiento() != "") ? <DialogContentText>Fecha de nacimiento: {alt.getFechaNacimiento()}</DialogContentText> : null}
            {(alt.getGenero() != "") ? <DialogContentText>Género: {alt.getGenero()}</DialogContentText> : null}
            {(alt.getLateralidad() != "") ? <DialogContentText>Lateralidad: {alt.getLateralidad()}</DialogContentText> : null}
            {(alt.getAltura() != "") ? <DialogContentText>Altura: {alt.getAltura()} metros</DialogContentText> : null}
            {(alt.getFechaDebut() != "") ? <DialogContentText>Debut: {alt.getFechaDebut()}</DialogContentText> : null}
            <br></br>
            <DialogContentText><strong>Información Administrativa</strong></DialogContentText>
            {(alt.getCorreo() != "") ? <DialogContentText>Correo Electrónico: {alt.getCorreo()}</DialogContentText> : null}
            {(alt.getTelefono() != "") ? <DialogContentText>Teléfono: {alt.getTelefono()}</DialogContentText> : null}
            {(alt.getPasaporte() != "") ? <DialogContentText>Pasaporte: {alt.getPasaporte()}</DialogContentText> : null}
            {(alt.getBeneficiario() != "") ? <DialogContentText>Beneficiario: {alt.getBeneficiario()}</DialogContentText> : null}
            {(alt.getCedulaBeneficiario() != "") ? <DialogContentText>Cédula Beneficiario: {alt.getCedulaBeneficiario()}</DialogContentText> : null}
            {(alt.getVisaAmericana() != "") ? <DialogContentText>Visa Americana: {alt.getVisaAmericana()}</DialogContentText> : null}
            {(alt.getVenceVisa() != "") ? <DialogContentText>Vencimiento Visa: {alt.getVenceVisa()}</DialogContentText> : null}
            {(alt.getTallaCamisa() != "") ? <DialogContentText>Talla Camisa: {alt.getTallaCamisa()}</DialogContentText> : null}
            {(alt.getPantaloneta() != "") ? <DialogContentText>Talla Pantaloneta: {alt.getPantaloneta()}</DialogContentText> : null}
            {(alt.getTallaJacket() != "") ? <DialogContentText>Talla Jacket: {alt.getTallaJacket()}</DialogContentText> : null}
            {(alt.getTallaBuzo() != "") ? <DialogContentText>Talla Buzo: {alt.getTallaBuzo()}</DialogContentText> : null}
            {(alt.getTallaTennis() != "") ? <DialogContentText>Talla Tennis: {alt.getTallaTennis()}</DialogContentText> : null}
            {(alt.getInfoPersonal() != "") ? <DialogContentText>Información Personal: {alt.getInfoPersonal()}</DialogContentText> : null}
          </DialogContent>
        </Dialog>
    }

    sesionVencida = () => {
        this.datosSesion.cerrarSesion();
        this.redireccionar('autenticacion');
    }

    render(){
        return(
            <div className="contenidoBody">
                <Header titulo = "Atleta" />
                <div className="contenedorPagina" id="contenedorDetalleAtleta">
                    <div id="encabezadoDetalleAtleta" className="segundoMenu">     
                        <div id="accionAtras">
                            <button onClick={e => this.redireccionar('atletas')}><i className="fas fa-chevron-left"></i></button>
                        </div>
                        <div id="tituloRefrescar">
                            <p><a onClick={e => this.redireccionar('atletas')}>Atletas</a></p>
                        </div>
                    </div>
                    <div id="cuerpoDetalleAtleta">
                        <div id="encabezadoAtleta">
                            <div id="imgBorder">
                                <img className="cover" src={(this.state.atleta.getFotoUrl() === "") ? userDefault : this.state.atleta.getFotoUrl()} alt="" onClick={this.verFoto}/>
                            </div>
                            <div id="infoPersonalAtleta">
                                <div id="data">
                                    <div id="main">
                                        <p>{this.state.atleta.getNombre()}</p>
                                        <p><strong></strong>{this.state.atleta.getEdad()} años</p>
                                        <p>Deporte {this.state.atleta.getDeporte().getNombre()}</p>
                                        {(this.state.atleta.getRetirado() == true) ? this.state.atleta.getGenero() == 0 ? <p>Retirada</p> : <p>Retirado</p> : null}
                                    </div>
                                    <div id="pais">
                                        <img className="bandera" src={this.state.atleta.getBandera()} alt=""/>
                                    </div>
                                </div>
                                <button className="masInfo" onClick={() => this.mostrarAlertaInfo()}>Más ...</button>
                            </div>
                        </div>
                        <div id="redesAtleta">
                            <GridList padding={0} cellHeight={35} cols={4} id="redesSociales">
                                <GridTile>
                                    {<a onClick={e => this.push.togglePushAtleta(this.state.atleta, this.successPush, this.failurePush)}>{(this.state.atleta.getTieneAlerta()) ? <i className="fas fa-star gold"></i> : <i className="far fa-star blink"></i>}</a>}
                                </GridTile>
                                <GridTile>
                                <a className={(this.state.atleta.getFacebookUrl() != "") ? "" : "redDesactiva"} href={this.state.atleta.getFacebookUrl()} target="blank"><i className="fab fa-facebook-f"></i></a>
                                </GridTile>
                                <GridTile>
                                <a className={(this.state.atleta.getTwitterUrl() != "") ? "" : "redDesactiva"} href={this.state.atleta.getTwitterUrl()} target="blank"><i className="fab fa-twitter"></i></a>
                                </GridTile>
                                <GridTile>
                                <a className={(this.state.atleta.getInstagramUrl() != "") ? "" : "redDesactiva"} href={this.state.atleta.getInstagramUrl()} target="blank"><i className="fab fa-instagram"></i></a>
                                </GridTile>
                            </GridList>
                        </div>
                        <div id="contenedorDerAtleta">
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
                    {this.alertaInfo()}
                    {this.redireccion()}
                </div>
                <Dialog
                    overlayClassName="fotoOverlay"
                    contentClassName="fotoModal"
                    open={this.state.modalFoto}
                    onRequestClose={this.cerrarFoto}
                    style={(this.utilidades.obtenerEsMovil()) ? {zIndex: 1500} : {zIndex: 2100}}
                >
                    <img alt="Imagen no disponible" src={this.state.atleta.getFotoUrl()} />
                </Dialog>
            </div>
        )
    }
    
    successPush = (respuesta) => {
        this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);
        this.state.atleta.setTieneAlerta(!this.state.atleta.getTieneAlerta());
        this.datosSesion.guardarAtletaDetalle(this.state.atleta)
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
        Conexion.instancia().solicitar('get', (this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 'api/listarCompetenciasPorAtleta/' : 'listarCompetenciasPorAtleta/', this.state.atleta.getId(), null, this.datosSesion.obtenerTokenPush())
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
}

export default DetalleAtleta