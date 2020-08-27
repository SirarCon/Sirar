import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import $ from 'jquery';
import Dialog from 'material-ui/Dialog';
import imagenDefault from '../../../assets/imagenes/defaultImage.png';
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import Utilidades from '../../../proveedores/utilidades';
import DatosSesion from '../../../proveedores/datosSesion';

class FormularioFederacion extends Component{

  utilidades = Utilidades.instancia();
  datosSesion = DatosSesion.instancia();
  getFederacion = "";
  agregarForm = "";
  agregarFederacion = "";
  editarFederacion = "";
  datosFormulario = "";
  formValidacion = "";

  constructor(props){
    super(props);
    this.getFederacion = this.props.getFederacion;
    this.agregarFederacion = this.props.agregarFederacion;
    this.editarFederacion = this.props.editarFederacion;
    this.agregarForm = this.props.agregarForm;
    this.datosFormulario = this.props.datosFormulario;
    this.formValidacion = this.props.formValidacion;
    this.state = {
      estilos: { 
        underlineFocusStyle: { borderBottomColor: "#00478A" },
        floatingLabelShrinkStyle: { color: "#336CA1" }
      },
      opcionesFoto: false,
      modalFoto: false,
      banderaCarga: false,
      indexTab: 0
    };
  }

  mostrarPopOverFoto = (event) => {
    event.preventDefault();
    this.setState({
      opcionesFoto: true,
      anchorEl: event.currentTarget,
    });
  };

  ocultarPopOverFoto = () => {
    this.setState({
      opcionesFoto: false
    });
  };

  verFoto = () => {
    this.setState({modalFoto: true, opcionesFoto: false});
  };

  eliminarFoto = () => {
    this.datosFormulario('escudo', '');
    this.setState({opcionesFoto: false});
  };

  cerrarFoto = () => {
    this.setState({modalFoto: false});
  };

  subirFoto = () => {
    this.utilidades.mostrarAlerta("alertaInfo", "La foto debe de ser menor a 5MB");
    $(document).ready(() => {
      $('#inputFoto').click();
    });
    this.setState({opcionesFoto: false});
  };

  actualizarFoto = (event) => {
    this.utilidades.mostrarCargador();
    if (event.target.files && event.target.files[0]) {
      var tamanno = (event.target.files[0].size / 1024 / 1024);
      if(tamanno < 5){
        let reader = new FileReader();
        reader.onload = (e) => {
          var img = new Image();
          img.src = e.target.result;
            img.onload = () => {
              this.datosFormulario("escudo", this.utilidades.prepararFoto(img, tamanno));
              this.utilidades.ocultarCargador();
            };
        };
        reader.readAsDataURL(event.target.files[0]);
      }
      else
        this.utilidades.mostrarAlerta("alertaError", "La foto supera los 5MB");
    }
  }

  asignarBooleano = (valor, atributo) => {
    (valor) ? this.datosFormulario(atributo, true) : this.datosFormulario(atributo, false);
  }

  render(){
    return(
        <div id="contenedorFormFederacion">
            <div id="formPerfil">
                <form>
                  <div id="inputs">
                      <div id="fotoPerfil">
                        <img alt="Imagen no disponible" src={(this.getFederacion("escudo") !== '') ? this.getFederacion("escudo") : imagenDefault}/>
                        <i className="fas fa-cog" onClick={this.mostrarPopOverFoto}></i>
                        <input id="inputFoto" type="file" accept="image/*" onChange={this.actualizarFoto}/>
                      </div>
                      <Popover
                        open={this.state.opcionesFoto}
                        anchorEl={this.state.anchorEl}
                        onRequestClose={this.ocultarPopOverFoto}
                        anchorOrigin={{horizontal:'middle', vertical:'bottom'}}
                        targetOrigin={{horizontal:'left', vertical:'bottom'}}
                      >
                        <Menu className="opcionesPopover">
                          { (this.getFederacion("escudo") !== '')
                            ? <section>
                                <MenuItem primaryText="Ver" onClick={this.verFoto}/>
                                <MenuItem primaryText="Cambiar" onClick={this.subirFoto}/>
                                <MenuItem primaryText="Eliminar" onClick={this.eliminarFoto}/>
                              </section>
                            : <MenuItem primaryText="Agregar" onClick={this.subirFoto}/>
                          }
                        </Menu>
                      </Popover>
                      <div className="grupoInputs">
                        <TextField
                          id="nombrePerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Nombre"
                          name="nombre"
                          value={this.getFederacion("nombre")}
                          onChange={e => this.datosFormulario('nombre', e.target.value)}
                          maxLength="60"
                        />
                        <TextField
                          id="webPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Página Web"
                          name="web"
                          value={this.getFederacion("paginaWeb")}
                          onChange={e => this.datosFormulario('paginaWeb', e.target.value)}
                          maxLength="60"
                        />
                        <TextField
                          id="ubicacionPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Dirección"
                          name="ubicacion"
                          value={this.getFederacion("ubicacion")}
                          onChange={e => this.datosFormulario('ubicacion', e.target.value)}
                          maxLength="100"
                        />
                        <TextField
                          id="telefono1Perfil" 
                          type="tel"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Teléfono 1"
                          name="telefono1"
                          value={this.getFederacion("telefono1")}
                          onChange={e => this.datosFormulario('telefono1', e.target.value)}
                          maxLength="8"
                        />
                        <TextField
                          id="telefono2Perfil" 
                          type="tel"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Teléfono 2"
                          name="telefono2"
                          value={this.getFederacion("telefono2")}
                          onChange={e => this.datosFormulario('telefono2', e.target.value)}
                          maxLength="8"
                        />
                        <TextField
                          id="emailPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Correo Electrónico"
                          name="email"
                          value={this.getFederacion("correoFederacion")}
                          onChange={e => this.datosFormulario('correoFederacion', e.target.value)}
                          maxLength="40"
                        />
                        <TextField
                          id="nombrePresPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Presidente"
                          name="presidente"
                          value={this.getFederacion("presidente")}
                          onChange={e => this.datosFormulario('presidente', e.target.value)}
                          maxLength="40"
                        />
                        <TextField
                          id="emailPresPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Correo Electrónico Presidente"
                          name="email"
                          value={this.getFederacion("correoPresidente")}
                          onChange={e => this.datosFormulario('correoPresidente', e.target.value)}
                          maxLength="40"
                        />
                        {(this.agregarForm()) 
                          ? null
                          :
                          <div className="switchForm">
                            <label>
                              <p>{ this.getFederacion("activo") ? "Habilitado" : "Deshabilitado" }</p>
                              <Toggle
                                checked={this.getFederacion("activo")}
                                icons={false}
                                onChange={e => this.asignarBooleano(e.target.checked, "activo")} />
                            </label>
                          </div>
                        }
                      </div>
                  </div>
                  <div id="grupoBotones">
                    {(this.agregarForm()) 
                    ?
                      <RaisedButton 
                        label="Agregar" 
                        className={ (this.formValidacion()) ? "botonAgregarU" : "botonAgregarU botonDeshabilitado"}
                        fullWidth={true} 
                        onClick={this.agregarFederacion}
                        labelPosition="before"
                        icon={<i className="fas fa-ban"></i>}/>
                    :   
                      <RaisedButton 
                        label="Guardar" 
                        className={ (this.formValidacion()) ? "botonAgregarU" : "botonAgregarU botonDeshabilitado"}
                        fullWidth={true} 
                        onClick={this.editarFederacion}
                        labelPosition="before"
                        icon={<i className="fas fa-ban"></i>}/>
                    }
                  </div>
                </form>
            </div>
          <Dialog
            overlayClassName="fotoOverlay"
            contentClassName="fotoModal"
            open={this.state.modalFoto}
            onRequestClose={this.cerrarFoto}
            style={(this.utilidades.obtenerEsMovil()) ? {zIndex: 1500} : {zIndex: 2100}}
          >
            <img alt="Imagen no disponible" src={this.getFederacion("escudo")} />
          </Dialog>
        </div>
    )
  }

}
export default FormularioFederacion