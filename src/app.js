// REACT
import React, {Component} from 'react';
import { Switch, Route } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// COMPONENTES
import Login from './componentes/modulos/login/login';
import ReestablecerContrasena from './componentes/modulos/reestablecerContrasena/reestablecerContrasena';
import Inicio from './componentes/modulos/inicio/inicio';
import Perfil from './componentes/modulos/perfil/perfil';
import Footer from './componentes/estructura/footer/footer';
import Usuarios from './componentes/modulos/usuarios/usuarios';
import $ from 'jquery';
import Dialog from 'material-ui/Dialog';
import loader from './assets/loader.gif';
import Utilidades from './proveedores/utilidades';
import DatosSesion from './proveedores/datosSesion';
import Atletas from './componentes/modulos/atletas/atletas';
import Deportes from './componentes/modulos/deportes/deportes';
import DetalleAtleta from './componentes/modulos/atletas/detalleAtleta/detalleAtleta';
import Federaciones from './componentes/modulos/federaciones/federaciones';
import DetalleFederacion from './componentes/modulos/federaciones/detalleFederacion/detalleFederacion';
import DetalleDeporte from './componentes/modulos/deportes/detalleDeporte/detalleDeporte';
import Eventos from './componentes/modulos/eventos/eventos';
import DetalleEvento from './componentes/modulos/eventos/detalleEvento/detalleEvento';
import Competencias from './componentes/modulos/competencias/competencias';
import DetalleCompetencia from './componentes/modulos/competencias/detalleCompetencia/detalleCompetencia';
import Equipos from './componentes/modulos/equipos/equipos';
import DetalleEquipo from './componentes/modulos/equipos/detalleEquipo/detalleEquipo';
import { messaging } from "./proveedores/pushNotifications/init-fcm";

class App extends Component {

  utilidades = Utilidades.instancia();
  datosSesion = DatosSesion.instancia();

  constructor(){
    super();
    this.iniciarApp();
    if(!this.utilidades.obtenerEsMovil()){
      $(window).scroll(function() {
        if ($(document).scrollTop() > 50)
          $('.segundoMenu').addClass('scrollSegundoMenu');
        else 
          $('.segundoMenu').removeClass('scrollSegundoMenu');
      });
    }

    $.fn.rotate = function(degrees) {
      $(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                   '-moz-transform' : 'rotate('+ degrees +'deg)',
                   '-ms-transform' : 'rotate('+ degrees +'deg)',
                   'transform' : 'rotate('+ degrees +'deg)'});
      return $(this);
    };
  }

	componentWillUnmount() {
		window.removeEventListener('online', this.handleOnline);
		window.removeEventListener('offline', this.handleOffline);
  }
  
	handleOnline = e => {
    e.preventDefault();
    this.utilidades.ocultarAlerta()
  };
  
  handleOffline = e => {
    e.preventDefault();
    this.utilidades.mostrarAlerta("alertaInfo", "Navegando en modo offline")
	};

  iniciarApp = () => {
    this.datosSesion.obtenerCatalogoPaises();
  }

  cargador = () => {
    return <Dialog
      className="cargador"
      overlayClassName="cargadorOverlay"
      contentClassName="cargadorModal"
      open={true}
    >
      <img alt="" src={loader} />              
    </Dialog>
  }

  alertas = () => {
    return <div id="alerta">
        <div>
          <i id="iconoTipoAlerta"></i>
          <span></span>
        </div>
      </div>
  }

  alertaPush = () => {
    return <div id="alertaPush">
        <div>
          <i id="iconoTipoAlerta"></i>
          <span></span>
        </div>
        <a className="cerrar" onClick={e => this.utilidades.ocultarPush()}><i className="fas fa-times"></i></a>
        <a className="ir" onClick={e => this.utilidades.accionPush(e.target.name)}><i className="fas fa-arrow-right"></i></a>
      </div>
  }

  render(){
    return(
      <div>
        <main>
          <MuiThemeProvider>
            <div>
              <Switch>
                <Route exact path='/' component={Inicio}/>
                <Route path='/autenticacion' component={Login}/>
                <Route path='/restablecer' component={ReestablecerContrasena}/>
                <Route path='/perfil' component={Perfil}/>
                <Route path='/usuarios' component={Usuarios}/>
                <Route path='/atletas' component={Atletas}/>
                <Route path='/equipos' component={Equipos}/>
                <Route path='/deportes' component={Deportes}/>
                <Route path='/detalleAtleta' component={DetalleAtleta}/>
                <Route path='/federaciones' component={Federaciones}/>
                <Route path='/detalleFederacion' component={DetalleFederacion}/>
                <Route path='/detalleDeporte' component={DetalleDeporte}/>
                <Route path='/eventos' component={Eventos}/>
                <Route path='/detalleEvento' component={DetalleEvento}/>
                <Route path='/competencias' component={Competencias}/>
                <Route path='/detalleCompetencia' component={DetalleCompetencia}/>
                <Route path='/detalleEquipo' component={DetalleEquipo}/>
                <Route component={Login} />
              </Switch>
              {this.cargador()}
              {this.alertas()}
              {this.alertaPush()}
              <Footer/>
            </div>
          </MuiThemeProvider>
        </main>
      </div>
    )
  }

  async componentDidMount() {
    window.addEventListener('online', this.handleOnline);
		window.addEventListener('offline', this.handleOffline);
    var self = this;
    if(messaging != null){
      this.datosSesion.guardarMsjPushError("Debe de aceptar los permisos")
      messaging.requestPermission()
        .then(async function() {
          const token = await messaging.getToken();
          self.datosSesion.guardarTokenPush(token);
        })
        .catch(function(err) {
          //console.log("Unable to get permission to notify.", err);
        });
      navigator.serviceWorker.addEventListener("message", (message) => {
        var notification = message.data["firebase-messaging-msg-data"]
        //console.log("NOTIFICATION: ", notification)
        var msj = (notification.notification.body != undefined && notification.notification.body != null) ? notification.notification.body : ""
        if(msj != ""){
          if(notification.data != undefined && notification.data != null){
            if(notification.data.competencia != undefined && notification.data.competencia != null)
              this.utilidades.mostrarPush(msj, notification.data.competencia);
            else
              this.utilidades.mostrarPush(msj, "");
          }
          else
            this.utilidades.mostrarPush(msj, "");
        }
      });
    }
    else{
      this.datosSesion.guardarMsjPushError("Explorador no compatible con notificaciones push")
    }
  }
}

export default App