import React, {Component} from 'react'
import Header from '../../estructura/header/header';
import SearchBar from 'material-ui-search-bar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import RaisedButton from 'material-ui/RaisedButton';
import Utilidades from '../../../proveedores/utilidades';
import Skeleton from 'react-loading-skeleton';
import $ from 'jquery';
import DatosSesion from '../../../proveedores/datosSesion';
import { Redirect } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Conexion from '../../../proveedores/conexion';
import RespuestaBase from '../../../modelo/respuesta/respuestaBase';
import Button from '@material-ui/core/Button';
import Dialog from 'material-ui/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Evento from '../../../modelo/entidades/evento';
import Equipo from '../../../modelo/entidades/equipo';
import FormularioEquipo from '../../formularios/formularioEquipo/formularioEquipo';
import SolicitudEquipo from '../../../modelo/solicitud/solicitudEquipo';

class Equipos extends Component {

    datosSesion = DatosSesion.instancia();
    utilidades = Utilidades.instancia();

    constructor(){
        super();
        this.state = {
            buscarValor: "",mostrarFiltros: false,equiposOriginal: [],equiposVista: [],banderaCarga: false,ejecutarRedireccion: false,
            tipo: "",deporte: "",prueba: "",genero: "",pais: "", banderaFormulario: "",formAgregarEquipo: true,
            id : "", nombre : "", genero : "", codigoPais : "", activo : true, deporteId : "", retirado: false, atletas: [],
            generoValido: false, codigoPaisValido: false, deporteIdValido: false, nombreValido: false,
            tituloAlertaPop: "", mensajeAlertaPop: "", aceptarAlertaPop: "", botonesAlertaPop: 2, alertaPop: false, editarEquipo: false, 
            primeraCargaEquipos: true, eventos: [], alertaEventos: false, tituloAlertaEventos: "", evento: new Evento()
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
          className="barraBusquedaEquipos"
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
            this.state.equiposOriginal.map((a) => {
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
            this.setState({equiposVista: resultados});
        }, 0);
    }

    toggleFiltros = () => {
        this.setState({mostrarFiltros: !this.state.mostrarFiltros});
        let height = this.state.mostrarFiltros ? 52 : 150;
        $('document').ready(() => {
            $( "#filters" ).css('transform', 'scale(' + ((this.state.mostrarFiltros) ? 1 : 0) + ')');
            $( "#filters select" ).css("pointer-events", (this.state.mostrarFiltros) ? "auto" : "none");
            $( "#encabezadoEquipos" ).animate({ height: height+'px'}, 200, 
            () => { $( "#filters" ).animate({ opacity: this.state.mostrarFiltros ? 1 : 0 }, 250,
            () => {
                if($( "#cuerpoEquipos" ).css('padding-top') == "102px" || $( "#cuerpoEquipos" ).css('padding-top') == "200px")
                    $( "#cuerpoEquipos" ).animate({ paddingTop: (height + 50) +'px'}, 400);
                else
                    $( "#cuerpoEquipos" ).animate({ paddingTop: height +'px'}, 400);
            })});
        });
        (this.state.mostrarFiltros) ? this.limpiarBusqueda() : null;
    }

    limpiarBusqueda = () => {
        setTimeout(() => {
            this.setState({prueba: "", genero: "", pais: "", tipo: ""});
            this.buscar("deporte", "") }, 350);
    }

    cambioFiltro = event => { this.buscar(event.target.name, event.target.value); };

    /*
    filtroInicial = () => {
        let filtro = this.datosSesion.obtenerFiltroEquiposPorDeporte()
        if (filtro != "" && filtro != undefined) {
            $("#botonBusqAvanzada").click();
            //this.setState({deporte: filtro})
            //this.cambioFiltro()
            this.buscar("deporte", filtro)
        }
        this.datosSesion.limpiarFiltroEquiposPorDeporte()
    }
    */

    estructuraSkeleton = () => {
        var tabla = [];
        var fila = [];
        var filaID = 0;
        var columnaID = 0;
        var cantidadColumnas = (this.utilidades.obtenerEsMovil()) ? 1 : parseInt(window.innerWidth / 350);
        var cantidadFilas = 3
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

    desplegarEquipos = () => {
        var tabla = [];
        var index = 0;
        var cantidadColumnas = (this.utilidades.obtenerEsMovil()) ? 1 : parseInt(window.innerWidth / 350);
        var cantidadFilas = Math.ceil(this.state.equiposVista.length / cantidadColumnas);
        var filaID = 0;
        var columnas = [];
        while(filaID < cantidadFilas){
            columnas = this.crearColumnasEquipos(cantidadColumnas, index)
            index = index + (columnas.length)
            tabla.push(<tr key={filaID}>{columnas}</tr>);
            filaID++;
        }
        return tabla;
    }

    crearColumnasEquipos = (cantidadColumnas, index) => {
        var columna = [];
        var columnaID = 0;
        var equipo = null;
        while(columnaID < cantidadColumnas){
            if (index < this.state.equiposVista.length){
                equipo = this.state.equiposVista[index];
                columna.push(<td key={columnaID}>
                    <div className={"cardInfo" + (!equipo.getActivo() ? " desactivo" : "")} name={index} onClick={this.mostrarDetalle.bind(this, equipo)}>
                        {this.state.editarEquipo ? <button name={index}><i className="far fa-edit"></i></button> : null}
                        <div id="info">
                            <p id="nombre">{equipo.getNombre()}</p>
                            <p id="genero">{equipo.getGeneroNombre()}</p>
                            <p id="deporte">{equipo.getDeporte().getNombre()}</p>
                        </div>
                        <img className="bandera" src={equipo.getBandera()} alt=""/>
                    </div>
                </td>)
            }
            columnaID++;
            index++;
        }
        return columna;
    }

    mostrarDetalle = (equipo) => {
        if(this.state.editarEquipo){
            this.seleccionarEquipo(equipo)
        }
        else{
            if(equipo !== undefined && equipo !== null && equipo !== ""){
                this.datosSesion.guardarEquipoDetalle(equipo);
                this.redireccionar("detalleEquipo");
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

    seleccionarEquipo = (equipo) => {
        this.setState({editarEquipo: false})
        if(equipo !== undefined){
            this.llenarFormEquipo(equipo);
            $(document).ready(() => {
                this.validarFormularioEdicion()
                if(!this.state.formAgregarEquipo){
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
            $('#modalFormEquipo').removeClass("abrirModalForm");
            $('#modalFormEquipo').addClass("cerrarModalForm");
            $('#cuerpoEquipos').show()
        }
        else{
            eventos = "none";
            $('#modalFormEquipo').removeClass("cerrarModalForm");
            $('#modalFormEquipo').addClass("abrirModalForm");
            $('#cuerpoEquipos').hide()
        }
        $('header').css('pointerEvents', eventos);
        this.setState({banderaFormulario: !this.state.banderaFormulario});
    }

    llenarFormEquipo = (e) => {
        (e == null)
        ? this.setState({formAgregarEquipo: true, id : "", nombre : "", genero : "", codigoPais : "", activo : true, deporteId : "", retirado: false, atletas: []})
        : this.setState({formAgregarEquipo: false, id : e.getId(), nombre : e.getNombre(), genero : e.getGenero(), codigoPais : e.getCodigoPais(), activo : e.getActivo(), 
            deporteId : e.getDeporte().getId(), retirado: e.getRetirado(), atletas: []})
    }
/*
    prepararOpcionesAtletas = (e) => {
        var opciones = []
        var atleta = ""
        e.getAtletas().map(a => {
            atleta = new Atleta().setJson(a);
            opciones.push({value: atleta.getId(), label: atleta.getNombre()})
        })
        return opciones
    }
*/
    verificarAgregar = () => {
        return this.state.formAgregarEquipo;
    } 

    getDatosEquipo = (input) => {
        switch(input){
            case "nombre": return this.state.nombre;
            case "genero": return this.state.genero;
            case "atletas": return this.state.atletas;
            case "codigoPais": return this.state.codigoPais;
            case "activo": return this.state.activo;
            case "retirado": return this.state.retirado;
            case "deporteId": return this.state.deporteId;
            default: return "";
        }
    }

    setDatosEquipo = (input, valor) => {
        this.setState({
            [input]: valor
        });
    }

    validarFormularioEdicion = () =>{
        this.datosFormulario("nombre", this.state.nombre)
        this.datosFormulario("genero", this.state.genero)
        this.datosFormulario("codigoPais", this.state.codigoPais)
        this.datosFormulario("deporteId", this.state.deporteId)
    }

    datosFormulario = (dato, valor) => {
        switch(dato){
            case 'nombre':
                this.setDatosEquipo(dato, valor);
                this.setState({nombreValido: (valor.toString().length > 0)});
                break;
            case 'genero':
                this.setDatosEquipo(dato, valor);
                this.setState({generoValido: (valor.toString().length > 0)});
                break;
            case 'codigoPais':
                this.setDatosEquipo(dato, valor);
                this.setState({codigoPaisValido: (valor.toString().length > 0)});
                break;
            case 'deporteId':
                this.setDatosEquipo(dato, valor);
                this.setState({deporteIdValido: (valor.toString().length > 0)});
                break;
            default:
                this.setDatosEquipo(dato, valor);
                break;
        }
    }

    formValidacion = () => {
        return (this.state.generoValido && this.state.codigoPaisValido && this.state.deporteIdValido && this.state.nombreValido) ? true : false;
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

    cerrarAlertaEventos = () => {
        this.setState({alertaEventos: false});
    }

    mostrarAlertaEventos = (titulo = "") => {
        this.setState({alertaEventos: true, tituloAlertaEventos: titulo});
    }

    alertaEventos = () => {
        return <Dialog open={this.state.alertaEventos} onClose={this.cerrarAlertaEventos} className="alertaPop alertaEventos" scroll="body">
            <DialogTitle>{this.state.tituloAlertaEventos}{(!this.state.primeraCargaEquipos) ? <Button onClick={this.cerrarAlertaEventos} className="buttonCerrarFases"><i className="fas fa-times"></i></Button> : null}</DialogTitle>
            <DialogContent scroll='body'>
                {this.getOpcionesEventos()}
            </DialogContent>
        </Dialog>
    }

    getOpcionesEventos(){
        var opciones = [];
        if(this.state.eventos.length > 0){
            this.state.eventos.map(ev => {
                opciones.push(<Button key={ev.getId()} onClick={e => this.seleccionarEvento(ev)} value={ev.getId()} className="buttonFase">{ev.getNombre()}</Button>)
            });
        }
        else{
            opciones.push(<Button key={1} onClick={e => this.recargarEventos()} className="buttonFase">Refrescar</Button>)
        }
        return opciones;
    }

    seleccionarEvento = (evento) => {
        this.setState({evento: evento})
        this.cargarEquipos(evento)
    }

    recargarEventos = () => {
        this.cerrarAlertaEventos()
        this.cargarEventos()
    }

    render(){
        return(
            <div className="contenidoBody">
                <Header titulo = "Equipos" />
                <div className="contenedorPagina" id="contenedorEquipos">
                    <div id="encabezadoEquipos" className="segundoMenu">     
                        <div id="tituloRefrescar">
                            <p>Equipos</p>
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
                    <div id="cuerpoEquipos" >
                        <div id="encabezadoEventoEquipos">
                            <div id="imgBorder">
                                <img className="cover" src={(this.state.evento.getFoto() === "") ? "" : this.state.evento.getFoto()} alt=""/>
                            </div>
                            <p>{this.state.evento.getNombre()}</p>
                        </div>
                        { this.state.banderaCarga ?
                            <section key="">
                            { (this.state.equiposVista.length > 0) ?
                                <table id="tableEquipos">
                                    {this.desplegarEquipos()}
                                </table>
                            : <p className="mensajeSinRegistros">Sin resultados</p>
                            }
                            {this.datosSesion.esAdministrador() ? 
                                <section>
                                    <FloatingActionButton 
                                        className="botonHabilitarEdicionEquipo"
                                        onClick={() => this.setState({editarEquipo: !this.state.editarEquipo})}
                                    >
                                        { this.state.editarEquipo ? <i className="fas fa-times"></i> : <i className="far fa-edit"></i>}
                                    </FloatingActionButton>
                                    <FloatingActionButton 
                                        className="botonAgregarEquipo"
                                        onClick={() => this.seleccionarEquipo(null)}
                                    >
                                        <ContentAdd />
                                    </FloatingActionButton>
                                </section>
                                : null}
                                <FloatingActionButton 
                                    className="botonCambiarEvento"
                                    onClick={() => this.cargarEventos()}
                                >
                                    <i className="fas fa-exchange-alt"></i>
                                </FloatingActionButton>
                            </section>
                        :
                            <table>
                                {this.estructuraSkeleton()}
                            </table>
                        }
                    </div>
                    <div id="modalFormEquipo">
                        <FloatingActionButton 
                            className="botonCerrarForm"
                            onClick={() => this.seleccionarEquipo(null)}
                        >
                            <svg aria-hidden="true" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-times fa-w-10 fa-3x">
                                <path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z">
                                </path>
                            </svg>
                        </FloatingActionButton>
                        {
                        <FormularioEquipo
                            agregarForm = {this.verificarAgregar}
                            getEquipo = {this.getDatosEquipo} 
                            agregarEquipo = {this.agregarEquipo}
                            editarEquipo = {this.editarEquipo}
                            datosFormulario = {this.datosFormulario}
                            formValidacion = {this.formValidacion}
                        ></FormularioEquipo>
                        }
                    </div>
                    {this.alertaPop()}
                    {this.alertaEventos()}
                    {this.redireccion()}
                </div>
            </div>
        )
    }
 
    cargarEventos = () => {
        this.utilidades.mostrarCargador()
        this.setState({eventos: []});
        var evento = null;
        Conexion.instancia().solicitar('get', (this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 'api/eventos/' : 'eventos/', '', null)
            .then(x => {
                var respuesta = new RespuestaBase(x);
                if(respuesta.exito){
                    respuesta.mensaje.map(e => {
                        evento = new Evento().setJson(e);
                        this.state.eventos.push(evento);
                    });
                    setTimeout(() => {
                        this.utilidades.ocultarCargador()
                        this.mostrarAlertaEventos((this.state.eventos.length > 0) ? "Seleccione el evento" : "No hay eventos registrados")
                    }, 1000);
                }
                else{
                    this.utilidades.ocultarCargador()
                    if(respuesta.codigo === 403)
                        this.mostrarAlertaPop("Atención", respuesta.mensaje, "sesionV", 1);
                    else
                        this.mostrarAlertaEventos(respuesta.mensaje)
                }
                this.datosSesion.guardarTokenPersonal(respuesta.token);
            })
            .catch( data => { 
                this.utilidades.ocultarCargador()
                this.mostrarAlertaEventos(Conexion.instancia().errorGenerico)
            }); 
    }

    cargarEquipos = (evento) => {
        this.utilidades.mostrarCargador()
        this.setState({equiposOriginal: [], equiposVista: [], banderaCarga: false, buscarValor: ""});
        var equipo = null;
        Conexion.instancia().solicitar('get', (this.datosSesion.esAdministrador() || this.datosSesion.esColaborador()) ? 'api/equipos/' : 'equipos/', evento.getId(), null, this.datosSesion.obtenerTokenPush())
            .then(x => {
                var respuesta = new RespuestaBase(x);
                this.utilidades.ocultarCargador()
                if(respuesta.exito){
                    respuesta.mensaje.map(e => {
                        equipo = new Equipo().setJson(e, evento.getNombre());
                        if(this.datosSesion.esAdministrador())
                            this.state.equiposOriginal.push(equipo);
                        else
                            equipo.getActivo() ? this.state.equiposOriginal.push(equipo) : null;
                    });
                    this.cerrarAlertaEventos()
                    this.setState({equiposVista: this.state.equiposOriginal, primeraCargaEquipos: false});
                    //this.filtroInicial()
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
                this.utilidades.ocultarCargador()
                this.setState({banderaCarga: true});
                this.utilidades.mostrarAlerta("alertaError", Conexion.instancia().errorGenerico);
            }); 
    }

    agregarEquipo = () => {
        this.utilidades.mostrarCargador();
        var equipoNuevo = new SolicitudEquipo(this.state.nombre,this.state.genero,this.state.codigoPais,this.state.deporteId,this.state.evento.getId(),this.state.atletas,this.state.retirado,this.state.id,this.state.activo);
        Conexion.instancia().solicitar('post', 'api/equipos/', '', JSON.stringify(equipoNuevo), this.datosSesion.obtenerTokenPush())
        .then(x => {
            var respuesta = new RespuestaBase(x);
            if(respuesta.exito){
                this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);
                this.utilidades.ocultarCargador();
                this.seleccionarEquipo(null);
                this.cargarEquipos(this.state.evento);
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

    editarEquipo = () => {
        this.utilidades.mostrarCargador();  
        var equipoModificado = new SolicitudEquipo(this.state.nombre,this.state.genero,this.state.codigoPais,this.state.deporteId,this.state.evento.getId(),[],this.state.retirado,this.state.id,this.state.activo);  
        Conexion.instancia().solicitar('put', 'api/equipo/', this.state.id, JSON.stringify(equipoModificado))
        .then(x => {
            var respuesta = new RespuestaBase(x);
            if(respuesta.exito){
                this.utilidades.ocultarCargador();
                this.utilidades.mostrarAlerta("alertaExito", respuesta.mensaje);          
                this.seleccionarEquipo(null);
                this.cargarEquipos(this.state.evento);
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

export default Equipos