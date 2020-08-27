import React, {Component} from 'react'
import Header from '../../estructura/header/header';
import SearchBar from 'material-ui-search-bar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import RaisedButton from 'material-ui/RaisedButton';
import Utilidades from '../../../proveedores/utilidades';
import Skeleton from 'react-loading-skeleton';
import $ from 'jquery';
import Atleta from '../../../modelo/entidades/atleta';
import DatosSesion from '../../../proveedores/datosSesion';
import { Redirect } from 'react-router-dom';
import userDefault from '../../../assets/imagenes/defaultUser.jpeg';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Conexion from '../../../proveedores/conexion';
import RespuestaBase from '../../../modelo/respuesta/respuestaBase';
import FormularioAtleta from '../../formularios/formularioAtleta/formularioAtleta';
import Button from '@material-ui/core/Button';
import Dialog from 'material-ui/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SolicitudAtleta from '../../../modelo/solicitud/solicitudAtleta';


class Atletas extends Component {

    datosSesion = DatosSesion.instancia();
    utilidades = Utilidades.instancia();

    constructor(){
        super();
        this.state = {
            buscarValor: "",
            mostrarFiltros: false,
            atletasOriginal: [],
            atletasVista: [],
            banderaCarga: false,
            ejecutarRedireccion: false,
            indexAtleta: 0, 
            tipo: "",
            deporte: "",
            prueba: "",
            genero: "",
            pais: "", 
            banderaFormulario: "",
            formAgregarAtleta: true,
            id : "", nombre : "", fotoUrl : "", correo : "", telefono : "", fechaNacimiento : "", pasaporte : "", genero : "", lateralidad : "", 
            beneficiario : "", cedulaBeneficiario : "", visaAmericana : "", venceVisa : "", tallaCamisa : "", pantaloneta : "", tallaJacket : "", 
            tallaBuzo : "", tallaTenis : "", infoPersonal : "", fechaDebut : "", facebookUrl : "", instagramUrl : "", twitterUrl : "", altura : "", 
            codigoPais : "", activo : true, deporteId : "", retirado: false,
            nombreValido: false, telefonoValido: false, correoValido: false, alturaValido: false, fechaNacimientoValido: false, fechaDebutValido: false,
            generoValido: false, codigoPaisValido: false, deporteIdValido: false,
            tituloAlertaPop: "", mensajeAlertaPop: "", 
            aceptarAlertaPop: "", botonesAlertaPop: 2, alertaPop: false, editarAtleta: false
        };
    }

    componentDidMount = () => {
        this.cargarAtletas();
    }

    redireccionar = (componente) => {
        this.setState({ejecutarRedireccion: true, destino: componente});
    }
    
    redireccion = () => {
        return (this.state.ejecutarRedireccion) ? <Redirect to={'/' + this.state.destino} /> : null;
    }

    busqueda = () => {
        return <SearchBar 
          className="barraBusquedaAtletas"
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
            this.state.atletasOriginal.map((a) => {
                if(this.state.buscarValor === "" || a.getNombre().toLowerCase().includes(this.state.buscarValor.toLowerCase())){
                    if(this.state.deporte === "" || a.getDeporte().getId() == this.state.deporte){
                        if(this.state.pais === "" || a.getCodigoPais() == this.state.pais){
                            if(this.state.genero === "" || a.getGenero() == this.state.genero){
                                if(this.state.tipo === "" || a.getRetirado().toString() == this.state.tipo){
                                    resultados.push(a);
                                }
                            }
                        }
                    }
                }
            });
            this.setState({atletasVista: resultados});
        }, 0);
    }

    funcionamientoBotonAgregar = () => {
        ($("body").height() < window.innerHeight) ? $('.botonAgregarAtleta').addClass('subirBoton') : null;
          var alturaContenedor = $("body").height() - $("footer").height();
          $(window).scroll(function() {
            $('.botonAgregarAtleta').toggleClass('subirBoton', ($(document).scrollTop() > alturaContenedor))
          });
      }

    toggleFiltros = () => {
        this.setState({mostrarFiltros: !this.state.mostrarFiltros});
        let height = this.state.mostrarFiltros ? 52 : 150;
        $('document').ready(() => {
            $( "#filters" ).css('transform', 'scale(' + ((this.state.mostrarFiltros) ? 1 : 0) + ')');
            $( "#filters select" ).css("pointer-events", (this.state.mostrarFiltros) ? "auto" : "none");
            $( "#encabezadoAtletas" ).animate({ height: height+'px'}, 200, 
            () => { $( "#filters" ).animate({ opacity: this.state.mostrarFiltros ? 1 : 0 }, 250,
            () => { $( "#cuerpoAtletas" ).animate({ paddingTop: (height + 51)+'px'}, 400) })});
        });
        (this.state.mostrarFiltros) ? this.limpiarBusqueda() : null;
    }

    limpiarBusqueda = () => {
        setTimeout(() => {
            this.setState({prueba: "", genero: "", pais: "", tipo: ""});
            this.buscar("deporte", "") }, 350);
    }

    cambioFiltro = event => { this.buscar(event.target.name, event.target.value); };

    filtroInicial = () => {
        let filtro = this.datosSesion.obtenerFiltroAtletasPorDeporte()
        if (filtro != "" && filtro != undefined) {
            $("#botonBusqAvanzada").click();
            //this.setState({deporte: filtro})
            //this.cambioFiltro()
            this.buscar("deporte", filtro)
        }
        this.datosSesion.limpiarFiltroAtletasPorDeporte()
    }

    estructuraSkeleton = () => {
        var tabla = [];
        var fila = [];
        var filaID = 0;
        var columnaID = 0;
        var cantidadColumnas = (this.utilidades.obtenerEsMovil()) ? 1 : parseInt(window.innerWidth / 350);
        var cantidadFilas = parseInt(window.innerHeight / 250);
        while(filaID < cantidadFilas){
            fila.push(<tr key={filaID}><div className="card"><Skeleton></Skeleton></div></tr>)
            filaID++;
        }
        while(columnaID < cantidadColumnas){
          tabla.push(<td key={columnaID}>{fila}</td>);
          columnaID++;
        }
        return tabla;
    }

    desplegarAtletas = () => {
        var tabla = [];
        var index = 0;
        var cantidadColumnas = (this.utilidades.obtenerEsMovil()) ? 1 : parseInt(window.innerWidth / 350);
        var cantidadFilas = Math.ceil(this.state.atletasVista.length / cantidadColumnas);
        var filaID = 0;
        var columnas = [];
        while(filaID < cantidadFilas){
            columnas = this.crearColumnasAtletas(cantidadColumnas, index)
            index = index + (columnas.length)
            tabla.push(<tr key={filaID}>{columnas}</tr>);
            filaID++;
        }
        return tabla;
    }

    crearColumnasAtletas = (cantidadColumnas, index) => {
        var columna = [];
        var columnaID = 0;
        var atleta = null;
        while(columnaID < cantidadColumnas){
            if (index < this.state.atletasVista.length){
                atleta = this.state.atletasVista[index];
                columna.push(<td key={columnaID}>
                    <div className={"cardInfo" + (!atleta.getActivo() ? " desactivo" : "")} name={index} onClick={this.mostrarDetalle.bind(this, atleta)}>
                        <img className="cover" src={(atleta.getFotoUrl() === "") ? userDefault : atleta.getFotoUrl()} alt=""/>
                        {this.state.editarAleta ? <button name={index}><i className="far fa-edit"></i></button> : null}
                        <div id="info">
                            <p id="nombre">{atleta.getNombre()}</p>
                            <p id="deporte">{atleta.getDeporte().getNombre()}</p>
                        </div>
                        <img className="bandera" src={atleta.getBandera()} alt=""/>
                    </div>
                </td>)
            }
            columnaID++;
            index++;
        }
        return columna;
    }

    mostrarDetalle = (atleta) => {
        if(this.state.editarAleta){
            this.seleccionarAtleta(atleta)
        }
        else{
            if(atleta !== undefined && atleta !== null && atleta !== ""){
                this.datosSesion.guardarAtletaDetalle(atleta);
                this.redireccionar("detalleAtleta");
            }
        }
    }

    opcionesPaises(){
        var opciones = [];
        this.datosSesion.obtenerCatalogoPaises().map(p => {
            opciones.push(<option value={p.getId()} key={p.getId()}>{p.getNombre()}</option>);
        });
        return opciones;
    }

    opcionesDeportes(){
        var opciones = [];
        this.datosSesion.obtenerCatalogoDeportes().map(d => {
            opciones.push(<option value={d.getId()} key={d.getId()}>{d.getNombre()}</option>);
        });
        return opciones;
    }

    seleccionarAtleta = (atleta) => {
        this.setState({editarAleta: false})
        if(atleta !== undefined){
            this.llenarFormAtleta(atleta);
            $(document).ready(() => {
                this.validarFormularioEdicion()
                if(!this.state.formAgregarAtleta){
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
            $('#modalFormAtleta').removeClass("abrirModalForm");
            $('#modalFormAtleta').addClass("cerrarModalForm");
            $('#cuerpoAtletas').show()
        }
        else{
            eventos = "none";
            $('#modalFormAtleta').removeClass("cerrarModalForm");
            $('#modalFormAtleta').addClass("abrirModalForm");
            $('#cuerpoAtletas').hide()
        }
        $('header').css('pointerEvents', eventos);
        this.setState({banderaFormulario: !this.state.banderaFormulario});
    }

    llenarFormAtleta = (a) => {
        (a == null)
        ? this.setState({formAgregarAtleta: true, id : "", nombre : "", fotoUrl : "", correo : "", telefono : "", fechaNacimiento : "", 
        pasaporte : "", genero : "", lateralidad : "", beneficiario : "", cedulaBeneficiario : "", visaAmericana : "", venceVisa : "", 
        tallaCamisa : "", pantaloneta : "", tallaJacket : "", tallaBuzo : "", tallaTenis : "", infoPersonal : "", fechaDebut : "", facebookUrl : "", 
        instagramUrl : "", twitterUrl : "", altura : "", codigoPais : "", activo : true, deporteId : "", retirado: false})
        : this.setState({formAgregarAtleta: false, id : a.getId(), nombre : a.getNombre(), fotoUrl : a.getFotoUrl(), correo : a.getCorreo(), 
        telefono : a.getTelefono(), fechaNacimiento : a.getFechaNacimiento(), pasaporte : a.getPasaporte(), genero : a.getGenero(), 
        lateralidad : a.getLateralidad(), beneficiario : a.getBeneficiario(), cedulaBeneficiario : a.getCedulaBeneficiario(), 
        visaAmericana : a.getVisaAmericana(), venceVisa : a.getVenceVisa(), tallaCamisa : a.getTallaCamisa(), pantaloneta : a.getPantaloneta(), 
        tallaJacket : a.getTallaJacket(), tallaBuzo : a.getTallaBuzo(), tallaTenis : a.getTallaTennis(), infoPersonal : a.getInfoPersonal(), 
        fechaDebut : a.getFechaDebut(), facebookUrl : a.getFacebookUrl(), instagramUrl : a.getInstagramUrl(), twitterUrl : a.getTwitterUrl(), 
        altura : a.getAltura(), codigoPais : a.getCodigoPais(), activo : a.getActivo(), deporteId : a.getDeporte().getId(), retirado: a.getRetirado()});
    }

    verificarAgregar = () => {
        return this.state.formAgregarAtleta;
    } 

    getDatosAtleta = (input) => {
        switch(input){
            case "nombre": return this.state.nombre;
            case "fotoUrl": return this.state.fotoUrl;
            case "correo": return this.state.correo;
            case "telefono": return this.state.telefono;
            case "fechaNacimiento": return this.state.fechaNacimiento;
            case "pasaporte": return this.state.pasaporte;
            case "genero": return this.state.genero;
            case "lateralidad": return this.state.lateralidad;
            case "beneficiario": return this.state.beneficiario;
            case "cedulaBeneficiario": return this.state.cedulaBeneficiario;
            case "visaAmericana": return this.state.visaAmericana;
            case "venceVisa": return this.state.venceVisa;
            case "tallaCamisa": return this.state.tallaCamisa;
            case "pantaloneta": return this.state.pantaloneta;
            case "tallaJacket": return this.state.tallaJacket;
            case "tallaBuzo": return this.state.tallaBuzo;
            case "tallaTenis": return this.state.tallaTenis;
            case "infoPersonal": return this.state.infoPersonal;
            case "fechaDebut": return this.state.fechaDebut;
            case "facebookUrl": return this.state.facebookUrl;
            case "instagramUrl": return this.state.instagramUrl;
            case "twitterUrl": return this.state.twitterUrl;
            case "altura": return this.state.altura;
            case "codigoPais": return this.state.codigoPais;
            case "activo": return this.state.activo;
            case "retirado": return this.state.retirado;
            case "deporteId": return this.state.deporteId;
            default: return "";
        }
    }

    setDatosAtleta = (input, valor) => {
        this.setState({
            [input]: valor
        });
    }

    validarFormularioEdicion = () =>{
        this.datosFormulario("nombre", this.state.nombre)
        this.datosFormulario("correo", this.state.correo)
        this.datosFormulario("telefono", this.state.telefono)
        this.datosFormulario("altura", this.state.altura)
        this.datosFormulario("fechaNacimiento", this.state.fechaNacimiento)
        this.datosFormulario("fechaDebut", this.state.fechaDebut)
        this.datosFormulario("genero", this.state.genero)
        this.datosFormulario("codigoPais", this.state.codigoPais)
        this.datosFormulario("deporteId", this.state.deporteId)
    }

    datosFormulario = (dato, valor) => {
        switch(dato){
            case 'nombre':
                valor = this.utilidades.limitarDato('alfanumericoespacio', valor);
                this.setDatosAtleta(dato, valor);
                this.setState({nombreValido: (valor.length > 4)});
                break;
            case 'correo':
                valor = this.utilidades.limitarDato('correo', valor);
                this.setDatosAtleta(dato, valor);
                this.setState({correoValido: (valor.length === 0 || this.utilidades.validezDato('correo', valor))});
                break;
            case 'telefono':
                valor = this.utilidades.limitarDato('numerico', valor);
                this.setDatosAtleta(dato, valor);
                this.setState({telefonoValido: (valor.length === 0 || valor.length === 8)});
                break;
            case 'altura':
                valor = this.utilidades.limitarDato('numerico', valor.toString());
                this.setDatosAtleta(dato, valor);
                this.setState({alturaValido: (valor.length === 0 || valor.length === 3)});
                break;
            case 'fechaNacimiento':
                //valor = this.utilidades.limitarDato('alfanumerico', valor);
                this.setDatosAtleta(dato, valor);
                this.setState({fechaNacimientoValido: (valor.length === 0 || valor.length > 7)});
                break;
            case 'fechaDebut':
                //valor = this.utilidades.limitarDato('alfanumerico', valor);
                this.setDatosAtleta(dato, valor);
                this.setState({fechaDebutValido: (valor.length === 0 || valor.length > 7)});
                break;
            case 'genero':
                this.setDatosAtleta(dato, valor);
                this.setState({generoValido: (valor.toString().length > 0)});
                break;
            case 'codigoPais':
                this.setDatosAtleta(dato, valor);
                this.setState({codigoPaisValido: (valor.toString().length > 0)});
                break;
            case 'deporteId':
                this.setDatosAtleta(dato, valor);
                this.setState({deporteIdValido: (valor.toString().length > 0)});
                break;
            default:
                this.setDatosAtleta(dato, valor);
                break;
        }
    }

    formValidacion = () => {
        return (this.state.nombreValido && this.state.correoValido && this.state.telefonoValido && this.state.alturaValido && 
            this.state.fechaDebutValido && this.state.fechaNacimientoValido && this.state.generoValido && this.state.codigoPaisValido && 
            this.state.deporteIdValido) ? true : false;
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

    render(){
        return(
            <div className="contenidoBody">
                <Header titulo = "Atletas" />
                <div className="contenedorPagina" id="contenedorAtletas">
                    <div id="encabezadoAtletas" className="segundoMenu">     
                        <div id="tituloRefrescar">
                            <p>Atletas</p>
                        </div>
                        {this.busqueda()}
                        <RaisedButton 
                            label={this.utilidades.obtenerEsMovil() ? this.state.mostrarFiltros ? <i className="fas fa-angle-up"></i> : <i className="fas fa-sliders-h"></i> : this.state.mostrarFiltros ? "Cerrar filtros" : "Búsqueda Avanzada"} 
                            className={"botonBusqAvanzada"}
                            id="botonBusqAvanzada"
                            labelPosition="before"
                            onClick={this.toggleFiltros}
                        />
                        <div id="filters">
                            <form className="form" autoComplete="off">
                                <FormControl className="selectControl">
                                    <InputLabel htmlFor="tipo-simple">Tipo</InputLabel>
                                    <Select
                                        native
                                        value={this.state.tipo}
                                        onChange={this.cambioFiltro}
                                        inputProps={{
                                            name: 'tipo',
                                            id: 'tipo-simple'
                                        }}
                                    >
                                        <option value=""/>
                                        <option value="false">Activo</option>
                                        <option value="true">Retirado</option>
                                    </Select>
                                </FormControl>
                                <FormControl className="selectControl">
                                    <InputLabel htmlFor="deporte-simple">Deporte</InputLabel>
                                    <Select
                                        native
                                        value={this.state.deporte}
                                        onChange={this.cambioFiltro}
                                        inputProps={{
                                            name: 'deporte',
                                            id: 'deporte-simple'
                                        }}
                                    >
                                        <option value=""/>
                                        {this.opcionesDeportes()}
                                    </Select>

                                </FormControl>
                                <FormControl className="selectControl">
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
                                <FormControl className="selectControl">
                                    <InputLabel htmlFor="genero-simple">Género</InputLabel>
                                    <Select
                                        native
                                        value={this.state.genero}
                                        onChange={this.cambioFiltro}
                                        inputProps={{
                                            name: 'genero',
                                            id: 'genero-simple',
                                        }}
                                    >
                                        <option value=""/>
                                        <option value="0">Femenino</option>
                                        <option value="1">Masculino</option>
                                    </Select>
                                </FormControl>
                            </form>
                        </div>
                    </div>
                    <div id="cuerpoAtletas" >
                        { this.state.banderaCarga ?
                            <section key="">
                            { (this.state.atletasVista.length > 0) ?
                                <table>
                                    {this.desplegarAtletas()}
                                </table>
                            : <p className="mensajeSinRegistros">Sin resultados</p>
                            }
                            {this.datosSesion.esAdministrador() ? 
                                <section>
                                    <FloatingActionButton 
                                        className="botonHabilitarEdicionAtleta"
                                        onClick={() => this.setState({editarAleta: !this.state.editarAleta})}
                                    >
                                        { this.state.editarAleta ? <i className="fas fa-times"></i> : <i className="far fa-edit"></i>}
                                    </FloatingActionButton>
                                    <FloatingActionButton 
                                        className="botonAgregarAtleta"
                                        onClick={() => this.seleccionarAtleta(null)}
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
                    <div id="modalFormAtleta">
                        <FloatingActionButton 
                            className="botonCerrarForm"
                            onClick={() => this.seleccionarAtleta(null)}
                        >
                            <svg aria-hidden="true" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-times fa-w-10 fa-3x">
                                <path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z">
                                </path>
                            </svg>
                        </FloatingActionButton>
                        <FormularioAtleta
                            agregarForm = {this.verificarAgregar}
                            getAtleta = {this.getDatosAtleta} 
                            agregarAtleta = {this.agregarAtleta}
                            editarAtleta = {this.editarAleta}
                            datosFormulario = {this.datosFormulario}
                            formValidacion = {this.formValidacion}
                        ></FormularioAtleta>
                    </div>
                    {this.alertaPop()}
                    {this.redireccion()}
                </div>
            </div>
        )
    }
 
    cargarAtletas = () => {
        this.setState({atletasOriginal: [], atletasVista: [], banderaCarga: false, buscarValor: ""});
        var atleta = null;
        Conexion.instancia().solicitar('get', (this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 'api/atletas/' : 'atletas/', '', null, this.datosSesion.obtenerTokenPush())
            .then(x => {
                var respuesta = new RespuestaBase(x);
                if(respuesta.exito){
                    respuesta.mensaje.map(a => {
                        atleta = new Atleta().setJson(a);
                        if(this.datosSesion.esAdministrador())
                            this.state.atletasOriginal.push(atleta);
                        else
                            atleta.getActivo() ? this.state.atletasOriginal.push(atleta) : null;
                    });
                    this.setState({atletasVista: this.state.atletasOriginal});
                    this.filtroInicial()
                }
                else{
                    if(respuesta.codigo === 403)
                        this.mostrarAlertaPop("Atención", respuesta.mensaje, "sesionV", 1);
                    else
                        this.utilidades.mostrarAlerta("alertaError", respuesta.mensaje);
                }
                this.datosSesion.guardarTokenPersonal(respuesta.token);
                this.setState({banderaCarga: true});
                //this.funcionamientoBotonAgregar();
            })
            .catch( data => { 
                this.setState({banderaCarga: true});
                this.utilidades.mostrarAlerta("alertaError", Conexion.instancia().errorGenerico);
            }); 
    }

    agregarAtleta = () => {
        this.utilidades.mostrarCargador();
        var atletaNuevo = new SolicitudAtleta(this.state.nombre,this.state.fotoUrl,this.state.correo,this.state.telefono,this.state.fechaNacimiento,
            this.state.pasaporte,this.state.genero,this.state.lateralidad,this.state.beneficiario,this.state.cedulaBeneficiario,this.state.visaAmericana, this.state.venceVisa, 
            this.state.tallaCamisa,this.state.pantaloneta,this.state.tallaJacket,this.state.tallaBuzo,this.state.tallaTenis,this.state.infoPersonal, 
            this.state.fechaDebut,this.state.facebookUrl,this.state.instagramUrl,this.state.twitterUrl,this.state.altura,this.state.codigoPais,
            this.state.deporteId,this.state.id,this.state.activo,this.state.retirado);
        Conexion.instancia().solicitar('post', 'api/atletas/', '', JSON.stringify(atletaNuevo))
        .then(x => {
            var respuesta = new RespuestaBase(x);
            if(respuesta.exito){
                this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);
                this.utilidades.ocultarCargador();
                this.seleccionarAtleta(null);
                this.cargarAtletas();
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

    editarAleta = () => {
        this.utilidades.mostrarCargador();
        var atletaModificado = new SolicitudAtleta(this.state.nombre,this.state.fotoUrl,this.state.correo,this.state.telefono,this.state.fechaNacimiento,
            this.state.pasaporte,this.state.genero,this.state.lateralidad,this.state.beneficiario,this.state.cedulaBeneficiario,this.state.visaAmericana, this.state.venceVisa, 
            this.state.tallaCamisa,this.state.pantaloneta,this.state.tallaJacket,this.state.tallaBuzo,this.state.tallaTenis,this.state.infoPersonal, 
            this.state.fechaDebut,this.state.facebookUrl,this.state.instagramUrl,this.state.twitterUrl,this.state.altura,this.state.codigoPais,
            this.state.deporteId,this.state.id,this.state.activo,this.state.retirado);        
        Conexion.instancia().solicitar('put', 'api/atleta/', this.state.id, JSON.stringify(atletaModificado))
        .then(x => {
            var respuesta = new RespuestaBase(x);
            if(respuesta.exito){
                this.utilidades.ocultarCargador();
                this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);          
                this.seleccionarAtleta(null);
                this.cargarAtletas();
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

export default Atletas