import React, {Component} from 'react'
import Header from '../../../estructura/header/header';
import Utilidades from '../../../../proveedores/utilidades';
import DatosSesion from '../../../../proveedores/datosSesion';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from 'material-ui/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Federacion from '../../../../modelo/entidades/federacion';
import Skeleton  from 'react-loading-skeleton';
import RespuestaBase from '../../../../modelo/respuesta/respuestaBase';
import Deporte from '../../../../modelo/entidades/deporte';
import Conexion from '../../../../proveedores/conexion';


class DetalleFederacion extends Component {

    datosSesion = DatosSesion.instancia();
    utilidades = Utilidades.instancia();

    constructor(){
        super();
        this.state = {
            banderaCarga: false,
            ejecutarRedireccion: false,
            deportes: [],
            federacion: this.cargarFederacion(),
            federacionInfo: false,
            modalFoto: false,
            alertaInfo: false
        };
    }

    componentDidMount = () => {
        this.validarAcceso()
        this.cargarDeportes();
    }

    validarAcceso = () => {
        var a = this.datosSesion.obtenerFederacionDetalle();
        if(a === null || a === undefined)
            this.redireccionar("");
    }

    cargarFederacion = () => {
        var f = this.datosSesion.obtenerFederacionDetalle();
        if(f === null || f === undefined){
            this.redireccionar("federaciones");
            return new Federacion();
        }
        return new Federacion().setJson(JSON.parse(f));
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
        var cantidadColumnas = (this.utilidades.obtenerEsMovil()) ? 1 : parseInt(window.innerWidth / 200) - 3;
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
        var cantidadColumnas = (this.utilidades.obtenerEsMovil()) ? 1 : parseInt(window.innerWidth / 200) - 3;
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
        this.datosSesion.guardarDeporteDetalle(deporte);
        this.redireccionar("detalleDeporte");
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
        var fed = this.state.federacion;
        return <Dialog open={this.state.alertaInfo} onClose={this.cerrarAlertaInfo} className="alertaPop federacionMasDetalle" scroll="body">
          <DialogTitle>{this.state.federacion.getNombre()}<Button onClick={this.cerrarAlertaInfo} className="alertaPopCancelar"><i className="fas fa-times"></i></Button></DialogTitle>
          <DialogContent scroll='body'>
            {(fed.getUbicacion() != "") ? <DialogContentText>Ubicación: {fed.getUbicacion()}</DialogContentText> : null}
            {(fed.getWeb() != "") ? <DialogContentText>Página Web: {(fed.getWeb().includes("http")) ? <a target="_blank" href={fed.getWeb()}>{fed.getWeb()}</a> : fed.getWeb()}</DialogContentText> : null}
            {(fed.getEmail() != "") ? <DialogContentText>Correo Electrónico: <a href={"mailto:" + fed.getEmail()}>{fed.getEmail()}</a></DialogContentText> : null}
            {(fed.getTelefono1() != "") ? <DialogContentText>Teléfono 1: <a href={"tel:" + fed.getTelefono1()}>{fed.getTelefono1()}</a></DialogContentText> : null}
            {(fed.getTelefono2() != "") ? <DialogContentText>Teléfono 2: <a href={"tel:" + fed.getTelefono2()}>{fed.getTelefono2()}</a></DialogContentText> : null}
            <br></br>
            { ((fed.getNombrePresidente() != "") || (fed.getEmailPresidente() != ""))
                ?
                    <section>
                        <DialogContentText><strong>Presidente</strong></DialogContentText>
                        {(fed.getNombrePresidente() != "") ? <DialogContentText>Nombre: {fed.getNombrePresidente()}</DialogContentText> : null}
                        {(fed.getEmailPresidente() != "") ? <DialogContentText>Correo Electrónico: <a href={"mailto:" + fed.getEmailPresidente()}>{fed.getEmailPresidente()}</a></DialogContentText> : null}
                    </section>
                :
                null
            }
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
                <Header titulo = "Federacion" />
                <div className="contenedorPagina" id="contenedorDetalleFederacion">
                    <div id="encabezadoDetalleFederacion" className="segundoMenu">
                        <div id="accionAtras">
                            <button onClick={e => this.redireccionar('federaciones')}><i className="fas fa-chevron-left"></i></button>
                        </div>
                        <div id="tituloRefrescar">
                            <p><a onClick={e => this.redireccionar('federaciones')}>Federaciones</a></p>
                        </div>
                    </div>
                    <div id="cuerpoDetalleFederacion">
                        <div id="encabezadoFederacion">
                            {(this.state.federacion.getFoto() !== "") 
                                ? 
                                <div id="imgBorder">
                                    <img className="cover" src={this.state.federacion.getFoto()} alt="" onClick={this.verFoto}/>
                                </div>
                                : 
                                null
                            }
                            <div id="infoPersonalFederacion">
                                <div id="data" className={(this.state.federacion.getFoto() !== "") ? "" : "fedSinFoto"}>
                                    <div id="main">
                                        <p>{this.state.federacion.getNombre()}</p>
                                    </div>
                                </div>
                                <button className="masInfo" onClick={() => this.mostrarAlertaInfo()}>Contacto</button>
                            </div>
                        </div>
                        <div id="contenedorDerFederacion">
                            <div id="infoDeportesFederacion">
                                { this.state.banderaCarga ?
                                    <section key="">
                                        { (this.state.deportes.length > 0) ?
                                            <table>
                                                {this.desplegarDeportes()}
                                            </table>
                                            : <p className="mensajeSinRegistros">Sin deportes asociados</p>
                                        }
                                    </section>
                                    :
                                    <table>
                                        {this.estructuraSkeleton()}
                                    </table>
                                }
                            </div>
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
                    <img alt="Imagen no disponible" src={this.state.federacion.getFoto()} />
                </Dialog>
            </div>
        )
    }
    
    cargarDeportes = () => {
        this.setState({deportes: [], banderaCarga: false});
        var deporte = null;
        Conexion.instancia().solicitar('get', (this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 'api/deportes/' : 'deportes/', this.state.federacion.getId(), null)
            .then(x => {
                var respuesta = new RespuestaBase(x);
                if(respuesta.exito){
                    respuesta.mensaje.map(d => {
                        deporte = new Deporte().setJson(d);
                        if(this.datosSesion.esAdministrador())
                            this.state.deportes.push(deporte);
                        else
                            deporte.getActivo() ? this.state.deportes.push(deporte) : null;
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

export default DetalleFederacion