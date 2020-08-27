// REACT
import React, {Component} from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
// COMPONENTES
import unaLogo from '../../../assets/logos/unaLogo.png';
import Utilidades from '../../../proveedores/utilidades';
import DatosSesion from '../../../proveedores/datosSesion';
import { Link } from 'react-router-dom'

class Footer extends Component {

  datosSesion = DatosSesion.instancia();
  utilidades = Utilidades.instancia();
  
  render(){
    return(
      <footer>
        <GridList padding={0} cellHeight={35} cols={5} id="redesSociales">
          <GridTile>
            <a href="https://es-la.facebook.com/con.costarica/" target="blank"><i className="fab fa-facebook-f"></i></a>
          </GridTile>
          <GridTile>
            <a href="https://twitter.com/CRC_Olimpico" target="blank"><i className="fab fa-twitter"></i></a>
          </GridTile>
          <GridTile>
            <a href="https://www.instagram.com/comiteolimpicocr/" target="blank"><i className="fab fa-instagram"></i></a>
          </GridTile>
          <GridTile>
            <a href="https://www.youtube.com/channel/UCRNaKitTHxZ3n_Tag4KPPgQ" target="blank"><i className="fab fa-youtube"></i></a>
          </GridTile>
          {(this.datosSesion.obtenerUsuario() === null) ? 
            <GridTile>
              <Link to="/autenticacion"><i className="fas fa-user"></i></Link>
            </GridTile>
          : <div></div>}
        </GridList>
        <GridList padding={0} cellHeight={35} cols={2} id="unaInfo">
          <GridTile>
            <div id="desarrolloInfo">
              <p>Desarrollado por Universidad Nacional</p>
              <p>Todos los derechos reservados 2020</p>
            </div>
          </GridTile>
          <GridTile>
            <div id="una">
              <a href="http://www.una.ac.cr/" target="blank"><img alt="" src={unaLogo}/></a>
            </div>
          </GridTile>
        </GridList>
      </footer>
    )
  }
}

export default Footer