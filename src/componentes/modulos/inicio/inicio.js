import React, { Component } from 'react';
import $ from 'jquery';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import Header from '../../estructura/header/header';
import {GridList, GridTile} from 'material-ui/GridList';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import DatosSesion from '../../../proveedores/datosSesion';
import Utilidades from '../../../proveedores/utilidades';
import Conexion from '../../../proveedores/conexion';
import RespuestaBase from '../../../modelo/respuesta/respuestaBase';
import Evento from '../../../modelo/entidades/evento';
import { Redirect } from 'react-router-dom';

class Inicio extends Component {

  datosSesion = DatosSesion.instancia();
  utilidades = Utilidades.instancia();

  constructor(props){
    super(props);
    this.state = {
      eventos: [], bandera: false, mostrarEventos: true, ejecutarRedireccion: false, destino: ""
    };
  }

  componentDidMount = () => {
    var usuarioSesion = this.datosSesion.obtenerUsuario();
    if(this.datosSesion.obtenerParamURL() === "sesion" && usuarioSesion !== null){
      this.datosSesion.guardarParamURL("");
      $('.appBar button').click();
      this.utilidades.mostrarAlerta('alertaInfo', 'Bienvenido(a) ' + usuarioSesion.getNombre());
    }
    this.cargarEventos()
  }

  cantidadEventosMostrar = (eventosTotales) => {
    var cantidad = 0;
    var pantalla = window.innerWidth;

    if(pantalla > 830){
      cantidad = 3; 
      if(eventosTotales <= 3)
        cantidad = eventosTotales;
    }
    else{
      cantidad = 2;
      if(eventosTotales <= 2)
        cantidad = eventosTotales;
    }
    return cantidad;
  }

  cargarEstructuraEventos = () => {
    var eventos = this.state.eventos;
    var eventosTotales = eventos.length;
    var estructuraFinal = [];
    if(eventosTotales > 0){
      var eventosHTML = [];
      var cantidad = this.cantidadEventosMostrar(eventosTotales);
      for(let i = 0; i < cantidad; i++){
        eventosHTML.push(
          <GridTile key={i} onClick={e => this.abrirEvento(eventos[i])}>
            <img alt="" src={eventos[i].getFoto()}/>
            <p className={(eventos[i].getFoto() == "") ? "eventoSinFoto" : ""}>{eventos[i].getNombre()}</p>
          </GridTile>
        );
      }
      estructuraFinal.push(  
        <div id="eventos" key="" hidden={!this.state.mostrarEventos}>
          <GridList padding={0} cellHeight={120} cols={cantidad} id="eventosPortada">
            {eventosHTML}
          </GridList>
        </div>
      );
    }
    return estructuraFinal;
  }

  redireccionar = (componente) => {
    this.setState({ejecutarRedireccion: true, destino: componente});
  }

  redireccion = () => {
      return (this.state.ejecutarRedireccion) ? <Redirect to={'/' + this.state.destino} /> : null;
  }

  abrirEvento = (evento) => {
    this.datosSesion.guardarEventoDetalle(evento);
    this.redireccionar("detalleEvento");
  }

  cargarEstructuraSkeleton = () => {
    var estructuraFinal = [];
    var eventosHTML = [];
    var cantidad = 2;
    if(!this.utilidades.obtenerEsMovil())
      cantidad = 3; 
    for(let i = 0; i < cantidad; i++){
      eventosHTML.push(
        <GridTile key={i}>
          <div id="fotoSkeleton">
            <Skeleton/>
          </div>
          <div id="tituloSkeleton">
            <Skeleton/>
          </div>
        </GridTile>
      );
    }
    estructuraFinal.push(
      <div id="eventos" key="">
        <GridList key="" padding={0} cellHeight={120} cols={cantidad} id="eventosPortada">
          {eventosHTML}
        </GridList>
      </div>
    );
    return estructuraFinal;
  }

  render() {
    const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
    return (
        <div className="contenidoBody">
          <Header/>
          <div className="contenedorPagina" id="fondo"> 
            <div id="carouselInformativo">
              <div id="swipeContenido">
                { this.state.bandera ?
                  <AutoPlaySwipeableViews 
                      interval={10000} 
                      autoplay={true} 
                    >
                    {this.cargarEstructuraEventos()}
                    <div id="mision">
                      <p className="textoRegular">Misión</p>
                      <p className="textoMediano">Somos la entidad que dirige e impulsa el movimiento olímpico en nuestro país encausando al deporte con los principios del olimpismo,  contribuyendo así a la excelencia deportiva de nuestros atletas y consolidando nuestra identidad nacional.</p>
                    </div>
                    <div id="vision">
                      <p className="textoRegular">Visión</p>
                      <p className="textoMediano">Ser una entidad modelo en el ámbito nacional e internacional, por la transparencia y prestigio en el impulso de todas las disciplinas deportivas por medio de la planificación y ejecución de proyectos en beneficio de los atletas, federaciones y asociaciones deportivas nacionales.</p>
                    </div>
                  </AutoPlaySwipeableViews>
                :
                  <SkeletonTheme>
                  {this.cargarEstructuraSkeleton()}
                  </SkeletonTheme>
                }
              </div>
            </div>
            {this.redireccion()}
          </div>
        </div>
    )
  }

  cargarEventos = () => {
    this.setState({eventos: [], banderaCarga: false});
    var evento = null;
    Conexion.instancia().solicitar('get','eventos/', '', null)
        .then(x => {
            var respuesta = new RespuestaBase(x);
            if(respuesta.exito){
                respuesta.mensaje.map(a => {
                    evento = new Evento().setJson(a);
                    if(evento.getActivo() && evento.getEstado() == "1")
                      this.state.eventos.push(evento);
                });
            }
            this.setState({bandera: true, mostrarEventos: (this.state.eventos.length > 0)});
        })
        .catch( data => { 
            this.setState({bandera: true, mostrarEventos: false});
        }); 
  }

}
  
export default Inicio