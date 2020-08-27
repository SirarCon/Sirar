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
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import DatosSesion from '../../../proveedores/datosSesion';

class FormularioEvento extends Component{

  utilidades = Utilidades.instancia();
  datosSesion = DatosSesion.instancia();
  getEvento = "";
  agregarForm = "";
  agregarEvento = "";
  editarEvento = "";
  datosFormulario = "";
  formValidacion = "";

  constructor(props){
    super(props);
    this.getEvento = this.props.getEvento;
    this.agregarEvento = this.props.agregarEvento;
    this.editarEvento = this.props.editarEvento;
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

  opcionesPaises(){
    var opciones = [];
    this.datosSesion.obtenerCatalogoPaises().map(p => {
        opciones.push(<option value={p.getId()} key={p.getId()}>{p.getNombre()}</option>);
    });
    return opciones;
  }

  asignarBooleano = (valor, atributo) => {
    (valor) ? this.datosFormulario(atributo, true) : this.datosFormulario(atributo, false);
  }

  render(){
    return(
        <div id="contenedorFormEvento">
            <div id="formPerfil">
                <form>
                  <div id="inputs">
                      <div id="fotoPerfil">
                        <img alt="Imagen no disponible" src={(this.getEvento("foto") !== '') ? this.getEvento("foto") : imagenDefault}/>
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
                          { (this.getEvento("foto") !== '')
                            ? <section>
                                <MenuItem primaryText="Ver" onClick={this.verFoto}/>
                                <MenuItem primaryText="Cambiar" onClick={this.subirFoto}/>
                                <MenuItem primaryText="Eliminar" onClick={this.eliminarFoto}/>
                              </section>
                            : <MenuItem primaryText="Agregar" onClick={this.subirFoto}/>
                          }
                        </Menu>
                      </Popover>
                      <div className="grupoInputs grupoIzquierda">
                        <TextField
                          id="nombrePerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Nombre"
                          name="nombre"
                          value={this.getEvento("nombre")}
                          onChange={e => this.datosFormulario('nombre', e.target.value)}
                          maxLength="40"
                        />
                        <FormControl className="selectControl">
                          <InputLabel htmlFor="pais-simple-form">País</InputLabel>
                          <Select
                              native
                              value={this.getEvento("codigoPais")}
                              onChange={e => this.datosFormulario('codigoPais', e.target.value)}
                              inputProps={{
                                  name: 'pais',
                                  id: 'pais-simple-form'
                              }}
                          >
                              <option value=""/>
                              {this.opcionesPaises()}
                          </Select>
                        </FormControl>
                        <TextField
                          id="ciudad" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Ciudad"
                          name="ciudad"
                          value={this.getEvento("ciudad")}
                          onChange={e => this.datosFormulario('ciudad', e.target.value)}
                          maxLength="40"
                        />
                        <TextField
                          id="inicio"
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Fecha de inicio (12/31/1900)"
                          name="inicio"
                          value={this.getEvento("inicio")}
                          onChange={e => this.datosFormulario('inicio', e.target.value)}
                          maxLength="10"
                        />
                        <TextField
                          id="final"
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Fecha de fin (12/31/1900)"
                          name="final"
                          value={this.getEvento("final")}
                          onChange={e => this.datosFormulario('final', e.target.value)}
                          maxLength="10"
                        />
                        {(this.agregarForm()) 
                          ? null
                          :
                          <div className="switchForm">
                            <label>
                              <p>{ this.getEvento("activo") ? "Habilitado" : "Deshabilitado" }</p>
                              <Toggle
                                checked={this.getEvento("activo")}
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
                        onClick={this.agregarEvento}
                        labelPosition="before"
                        icon={<i className="fas fa-ban"></i>}/>
                    :   
                      <RaisedButton 
                        label="Guardar" 
                        className={ (this.formValidacion()) ? "botonAgregarU" : "botonAgregarU botonDeshabilitado"}
                        fullWidth={true} 
                        onClick={this.editarEvento}
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
            <img alt="Imagen no disponible" src={this.getEvento("foto")} />
          </Dialog>
        </div>
    )
  }

}
export default FormularioEvento