import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import $ from 'jquery';
import conLogo from '../../../assets/logos/conLogo.png';
import {AppBar, Drawer, MenuItem} from 'material-ui';
import DatosSesion from '../../../proveedores/datosSesion';
import imagenDefault from '../../../assets/imagenes/defaultImage.png';
import { Redirect } from 'react-router-dom'
import Dialog from 'material-ui/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Utilidades from '../../../proveedores/utilidades';

class Header extends Component {

  datosSesion = DatosSesion.instancia();
  utilidades = Utilidades.instancia();
  tituloPantalla = ""

  constructor(props){
    super(props);
    this.tituloPantalla = this.props.titulo;
    this.imgRight = (this.props.img == undefined) ? <img alt="" src={conLogo} /> : this.props.img;
    this.state = {
      u: this.datosSesion.obtenerUsuario(),
      estilos: {
        opcionMenu:{
          color: "#0A304E"
        }
      },
      desplegarMenu: false,
      ejecutarRedireccion: false,
      alertaPop: false
    }
    /*
    $(window).scroll(function() {
      if ($(document).scrollTop() > 50)
        $('.appBar').addClass('shrink');
      else 
        $('.appBar').removeClass('shrink');
    });*/
    $(document).ready(() => {
      $('#opcionesMenu, #perfilContenedor').click(() => {
        this.setState({desplegarMenu: false});
      });
    });
    this.efectoIphoneX();
  }

  efectoIphoneX = () => {
    //if((window.innerHeight === 375 && window.innerWidth === 812) || (window.innerHeight === 768 && window.innerWidth === 375))
    if(window.innerHeight === 812 && window.innerWidth === 375){
      $(document).ready(() => {
        (this.datosSesion.obtenerUsuario() !== null)
        ? $('.drawer #perfilContenedor').css('padding-top', '30px')
        : $('.drawer #opcionesMenu > div:first-child').css('padding-top', '40px');
      });
    }
  }

  cambiarEstadoMenu = () => {
    this.efectoIphoneX();
    this.setState({u: this.datosSesion.obtenerUsuario(), desplegarMenu: !this.state.desplegarMenu});
  }

  redireccionar = (componente) => {
    if(this.datosSesion.obtenerUsuario() === null)
      this.setState({ejecutarRedireccion: true, destino: componente});
  }

  redireccion = () => {
    return (this.state.ejecutarRedireccion) ? <Redirect to={'/' + this.state.destino} /> : null;
  }

  cerrarAlertaPop = () => {
    this.setState({alertaPop: false});
  }

  mostrarAlertaPop = () => {
    this.setState({alertaPop: true});
  }

  alertaPop = () => {
    return <Dialog open={this.state.alertaPop} onClose={this.cerrarAlertaPop} className="alertaPop">
      <DialogTitle className="alertaPopTitulo">Atención</DialogTitle>
      <DialogContent>
        <DialogContentText className="alertaPopMensaje">¿ Desea cerrar sesión ?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={this.cerrarSesion} className="alertaPopAceptar">
          Aceptar
        </Button>
        <Button onClick={this.cerrarAlertaPop} className="alertaPopCancelar">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  }

  cerrarSesion = () => {
    this.cerrarAlertaPop();
    this.utilidades.mostrarCargador();
    this.setState({desplegarMenu: false});
    this.datosSesion.cerrarSesion();
    setTimeout(() => {
      this.utilidades.ocultarCargador();
      this.redireccionar('');
    }, 800);
  }

  render(){
    return(
      <header>
        <AppBar 
          className="appBar"
          iconElementRight={<p>Sistema Integrado de Resultados de Alto Rendimiento</p>}
        title={<section><p id="tituloMovil">{this.tituloPantalla}</p><Link to="/">{this.imgRight}</Link></section>} 
          onLeftIconButtonClick={this.cambiarEstadoMenu}
        />
        <Drawer 
          className="drawer"
          containerStyle={{backgroundColor: "#F3F6F9"}}
          open={this.state.desplegarMenu} 
          docked={false} 
          width={(this.iPhoneX) ? 300 : 256}
          onRequestChange={(desplegarMenu) => this.setState({desplegarMenu})}>
          { (this.state.u !== null)
            ?
              <Link to="/perfil">
                <div id="perfilContenedor">
                  <MenuItem>
                    <div id="perfil">
                      <i className="far fa-edit"></i>
                      <img alt="Imagen no disponible" src={(this.state.u.getFoto() !== '') ? this.state.u.getFoto() : imagenDefault}/>
                      <p>{this.state.u.getNombre()}</p>
                    </div>
                  </MenuItem>
                </div>
              </Link>
            : null
          }
          <div id="opcionesMenu">
            <MenuItem>
              <div id="infoSistemaMenu">
                <p id="comiteLeyenda">Comité Olímpico Nacional</p>
                <div id="sistemaLeyenda">
                  <p>Sistema Integrado de Resultados</p>
                  <p>de Alto Rendimiento</p>
                </div>
              </div>
            </MenuItem>
              <Link to="/"><MenuItem rightIcon={<i className="fas fa-home"></i>}>Inicio</MenuItem></Link>
              {
                <section>
                  <Link to="/atletas"><MenuItem rightIcon={<i className="fas fa-user"></i>}>Atletas</MenuItem></Link>
                  <Link to="/equipos"><MenuItem rightIcon={<i className="fas fa-users"></i>}>Equipos</MenuItem></Link>
                  <Link to="/deportes"><MenuItem rightIcon={<i className="fas fa-volleyball-ball"></i>}>Deportes</MenuItem></Link>
                  <Link to="/federaciones"><MenuItem rightIcon={<i className="fas fa-building"></i>}>Federaciones</MenuItem></Link>
                  <Link to="/eventos"><MenuItem rightIcon={<i className="fas fa-calendar-alt"></i>}>Eventos</MenuItem></Link>
                </section>
              }
              { (this.state.u !== null && this.state.u.getRol() === 1)
                ? <Link to="/usuarios"><MenuItem rightIcon={<i className="fas fa-users"></i>}>Usuarios</MenuItem></Link>
                : null
              }
              { (this.state.u !== null)
                ? <MenuItem rightIcon={<i className="fas fa-sign-out-alt"></i>} onClick={this.mostrarAlertaPop}>Salir</MenuItem>
                : null
              }
            </div>
        </Drawer>
        {this.alertaPop()}
        {this.redireccion()}
      </header>
    )
  }
}

export default Header