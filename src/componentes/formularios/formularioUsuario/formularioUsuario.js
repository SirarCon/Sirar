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

class FormularioUsuario extends Component{

  utilidades = Utilidades.instancia();
  getUsuario = "";
  agregarForm = "";
  agregarUsuario = "";
  editarUsuario = "";
  eliminarUsuario = "";
  datosFormulario = "";
  eliminarUsuario = "";
  formValidacion = "";

  constructor(props){
    super(props);
    $(document).ready(() => {
      if(!this.utilidades.obtenerEsMovil()){
        var mitadAlturaForm = ($('.formCentradoVertical').height() / 2);
        var mitadPantalla = (window.innerHeight + 40) / 2;
        $('.formCentradoVertical').css('top', mitadPantalla - mitadAlturaForm);
      }
    });
    this.getUsuario = this.props.getUsuario;
    this.agregarUsuario = this.props.agregarUsuario;
    this.editarUsuario = this.props.editarUsuario;
    this.eliminarUsuario = this.props.eliminarUsuario;
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
    this.datosFormulario('foto', '');
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
              this.datosFormulario("foto", this.utilidades.prepararFoto(img, tamanno));
              this.utilidades.ocultarCargador();
            };
        };
        reader.readAsDataURL(event.target.files[0]);
      }
      else
        this.utilidades.mostrarAlerta("alertaError", "La foto supera los 5MB");
    }
  }

  rolBooleano = () => {
    return (this.getUsuario("rol") === 1) ? true : false;
  }

  asignarRolBooleano = (valor) => {
    (valor) ? this.datosFormulario("rol", 1) : this.datosFormulario("rol", 0);
  }

  render(){
    return(
        <div id="contenedorFormUsuario">
            <div id="formPerfil" className="formCentradoVertical">
                <form>
                  <div id="inputs">
                      <div id="fotoPerfil">
                        <img alt="Imagen no disponible" src={(this.getUsuario("foto") !== '') ? this.getUsuario("foto") : imagenDefault}/>
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
                          { (this.getUsuario("foto") !== '')
                            ? <section>
                                <MenuItem primaryText="Ver" onClick={this.verFoto}/>
                                <MenuItem primaryText="Cambiar" onClick={this.subirFoto}/>
                                <MenuItem primaryText="Eliminar" onClick={this.eliminarFoto}/>
                              </section>
                            : <MenuItem primaryText="Agregar" onClick={this.subirFoto}/>
                          }
                        </Menu>
                      </Popover>
                      <div id="idLabel">
                          <p>Identificación <b>{this.getUsuario("id")}</b></p>
                      </div>
                      <div id="grupoInputs">
                        <TextField
                          id="idPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Identificación"
                          name="id"
                          value={this.getUsuario("id")}
                          onChange={e => this.datosFormulario('id', e.target.value)}
                          maxLength="15"
                        />
                        <TextField
                          id="nombrePerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Nombre"
                          name="nombre"
                          value={this.getUsuario("nombre")}
                          onChange={e => this.datosFormulario('nombre', e.target.value)}
                          maxLength="40"
                        />
                        <TextField
                          id="emailPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Correo Electrónico"
                          name="email"
                          value={this.getUsuario("email")}
                          onChange={e => this.datosFormulario('email', e.target.value)}
                          maxLength="40"
                        />
                        <TextField
                          id="telefonoPerfil" 
                          type="tel"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Teléfono"
                          name="telefono"
                          value={this.getUsuario("telefono")}
                          onChange={e => this.datosFormulario('telefono', e.target.value)}
                          maxLength="8"
                        />
                      </div>
                      <div id="contenedorRol">
                        <label>
                          <p>{(this.getUsuario("rol") === 1) ? "Administrador" : "Colaborador"}</p>
                          <Toggle
                            checked={this.rolBooleano()}
                            icons={false}
                            onChange={ e => this.asignarRolBooleano(e.target.checked)} />
                        </label>
                        <div id="leyendaRoles">
                          <p> Administrador puede gestionar toda la información.</p>
                          <p> Colaborador puede gestionar solamente la información de los eventos.</p>
                        </div>
                      </div>
                  </div>
                  <div id="grupoBotones">
                    {(this.agregarForm()) 
                    ?
                      <RaisedButton 
                        label="Agregar" 
                        className={ (this.formValidacion()) ? "botonAgregarU" : "botonAgregarU botonDeshabilitado"}
                        fullWidth={true} 
                        onClick={this.agregarUsuario}
                        labelPosition="before"
                        icon={<i className="fas fa-ban"></i>}/>
                    : <section>
                        <RaisedButton 
                          label="Guardar" 
                          className={ (this.formValidacion()) ? "botonAgregarU" : "botonAgregarU botonDeshabilitado"}
                          fullWidth={true} 
                          onClick={this.editarUsuario}
                          labelPosition="before"
                          icon={<i className="fas fa-ban"></i>}/>
                        <RaisedButton 
                          label="Eliminar" 
                          fullWidth={true} 
                          className="botonEliminarU" 
                          onClick={this.eliminarUsuario}/>
                      </section>}
                  </div>
                </form>
            </div>
          <Dialog
            overlayClassName="fotoOverlay"
            contentClassName="fotoModal"
            open={this.state.modalFoto}
            onRequestClose={this.cerrarFoto}
          >
            <img alt="Imagen no disponible" src={this.getUsuario("foto")} />
          </Dialog>
        </div>
    )
  }

}
export default FormularioUsuario