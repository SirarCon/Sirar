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

class FormularioAtleta extends Component{

  utilidades = Utilidades.instancia();
  datosSesion = DatosSesion.instancia();
  getAtleta = "";
  agregarForm = "";
  agregarAtleta = "";
  editarAtleta = "";
  datosFormulario = "";
  formValidacion = "";

  constructor(props){
    super(props);
    this.getAtleta = this.props.getAtleta;
    this.agregarAtleta = this.props.agregarAtleta;
    this.editarAtleta = this.props.editarAtleta;
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
    this.datosFormulario('fotoUrl', '');
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
              this.datosFormulario("fotoUrl", this.utilidades.prepararFoto(img, tamanno));
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

  opcionesDeportes(){
    var opciones = [];
    this.datosSesion.obtenerCatalogoDeportes().map(d => {
        opciones.push(<option value={d.getId()} key={d.getId()}>{d.getNombre()}</option>);
    });
    return opciones;
  }

  asignarBooleano = (valor, atributo) => {
    (valor) ? this.datosFormulario(atributo, true) : this.datosFormulario(atributo, false);
  }

  render(){
    return(
        <div id="contenedorFormAtleta">
            <div id="formPerfil">
                <form>
                  <div id="inputs">
                      <div id="fotoPerfil">
                        <img alt="Imagen no disponible" src={(this.getAtleta("fotoUrl") !== '') ? this.getAtleta("fotoUrl") : imagenDefault}/>
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
                          { (this.getAtleta("fotoUrl") !== '')
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
                          value={this.getAtleta("nombre")}
                          onChange={e => this.datosFormulario('nombre', e.target.value)}
                          maxLength="40"
                        />
                        <FormControl className="selectControl">
                          <InputLabel htmlFor="genero-simple-form">Género</InputLabel>
                          <Select
                              native
                              value={this.getAtleta("genero")}
                              onChange={e => this.datosFormulario('genero', e.target.value)}
                              inputProps={{
                                  name: 'genero',
                                  id: 'genero-simple-form'
                              }}
                          >
                              <option value=""/>
                              <option value={"0"}>Femenino</option>
                              <option value={"1"}>Masculino</option>
                          </Select>
                        </FormControl>
                        <FormControl className="selectControl">
                          <InputLabel htmlFor="pais-simple-form">País</InputLabel>
                          <Select
                              native
                              value={this.getAtleta("codigoPais")}
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
                        <FormControl className="selectControl">
                          <InputLabel htmlFor="deporte-simple-form">Deporte</InputLabel>
                          <Select
                              native
                              value={this.getAtleta("deporteId")}
                              onChange={e => this.datosFormulario('deporteId', e.target.value)}
                              inputProps={{
                                  name: 'deporte',
                                  id: 'deporte-simple-form'
                              }}
                          >
                              <option value=""/>
                              {this.opcionesDeportes()}
                          </Select>
                        </FormControl>
                        <FormControl className="selectControl">
                          <InputLabel htmlFor="lateralidad-simple">Lateralidad</InputLabel>
                          <Select
                              native
                              value={this.getAtleta("lateralidad")}
                              onChange={e => this.datosFormulario('lateralidad', e.target.value)}
                              inputProps={{
                                  name: 'lateralidad',
                                  id: 'lateralidad-simple'
                              }}
                          >
                              <option value=""/>
                              <option value={0}>Derecha</option>
                              <option value={1}>Izquierda</option>
                          </Select>
                        </FormControl>
                        <TextField
                          id="nacimientoPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Fecha de nacimiento (12/31/1900)"
                          name="nacimiento"
                          value={this.getAtleta("fechaNacimiento")}
                          onChange={e => this.datosFormulario('fechaNacimiento', e.target.value)}
                          maxLength="10"
                        />
                        <TextField
                          id="emailPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Correo Electrónico"
                          name="email"
                          value={this.getAtleta("correo")}
                          onChange={e => this.datosFormulario('correo', e.target.value)}
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
                          value={this.getAtleta("telefono")}
                          onChange={e => this.datosFormulario('telefono', e.target.value)}
                          maxLength="8"
                        />
                        <TextField
                          id="alturaPerfil" 
                          type="tel"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Altura (centímetros)"
                          name="altura"
                          value={this.getAtleta("altura")}
                          onChange={e => this.datosFormulario('altura', e.target.value)}
                          maxLength="3"
                        />
                        <TextField
                          id="debutPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Fecha debut (12/31/1900)"
                          name="debut"
                          value={this.getAtleta("fechaDebut")}
                          onChange={e => this.datosFormulario('fechaDebut', e.target.value)}
                          maxLength="10"
                        />
                        <TextField
                          id="pasaportePerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Pasaporte"
                          name="pasaporte"
                          value={this.getAtleta("pasaporte")}
                          onChange={e => this.datosFormulario('pasaporte', e.target.value)}
                          maxLength="15"
                        />
                        <TextField
                          id="beneficiarioPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Beneficiario"
                          name="beneficiario"
                          value={this.getAtleta("beneficiario")}
                          onChange={e => this.datosFormulario('beneficiario', e.target.value)}
                          maxLength="40"
                        />
                        <div className="switchForm">
                          <label>
                            <p>Retirado</p>
                            <Toggle
                              checked={this.getAtleta("retirado")}
                              icons={false}
                              onChange={e => this.asignarBooleano(e.target.checked, "retirado")} />
                          </label>
                        </div>
                      </div>
                      <div className="grupoInputs grupoDerecha">
                      <TextField
                          id="cedulaBeneficiarioPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Identificación Beneficiario"
                          name="cedulaBeneficiario"
                          value={this.getAtleta("cedulaBeneficiario")}
                          onChange={e => this.datosFormulario('cedulaBeneficiario', e.target.value)}
                          maxLength="12"
                        />
                        <TextField
                          id="visaPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Visa Americana"
                          name="visaAmericana"
                          value={this.getAtleta("visaAmericana")}
                          onChange={e => this.datosFormulario('visaAmericana', e.target.value)}
                          maxLength="20"
                        />
                        <TextField
                          id="venceVisaPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Vencimiento Visa (12/31/1900)"
                          name="venceVisa"
                          value={this.getAtleta("venceVisa")}
                          onChange={e => this.datosFormulario('venceVisa', e.target.value)}
                          maxLength="10"
                        />
                        <TextField
                          id="camisaPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Talla de Camisa"
                          name="camisa"
                          value={this.getAtleta("tallaCamisa")}
                          onChange={e => this.datosFormulario('tallaCamisa', e.target.value)}
                          maxLength="2"
                        />
                        <TextField
                          id="pantalonetaPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Talla de Pantaloneta"
                          name="pantaloneta"
                          value={this.getAtleta("pantaloneta")}
                          onChange={e => this.datosFormulario('pantaloneta', e.target.value)}
                          maxLength="2"
                        />
                        <TextField
                          id="jacketPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Talla de Jacket"
                          name="jacket"
                          value={this.getAtleta("tallaJacket")}
                          onChange={e => this.datosFormulario('tallaJacket', e.target.value)}
                          maxLength="2"
                        />
                        <TextField
                          id="buzoPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Talla de Buzo"
                          name="buzo"
                          value={this.getAtleta("tallaBuzo")}
                          onChange={e => this.datosFormulario('tallaBuzo', e.target.value)}
                          maxLength="2"
                        />
                        <TextField
                          id="tennisPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Talla de Tennis"
                          name="tennis"
                          value={this.getAtleta("tallaTenis")}
                          onChange={e => this.datosFormulario('tallaTenis', e.target.value)}
                          maxLength="2"
                        />
                        <TextField
                          id="facebookPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Facebook URL"
                          name="facebook"
                          value={this.getAtleta("facebookUrl")}
                          onChange={e => this.datosFormulario('facebookUrl', e.target.value)}
                          maxLength="100"
                        />
                        <TextField
                          id="instagramPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Instagram URL"
                          name="instagram"
                          value={this.getAtleta("instagramUrl")}
                          onChange={e => this.datosFormulario('instagramUrl', e.target.value)}
                          maxLength="100"
                        />
                        <TextField
                          id="twitterPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Twitter URL"
                          name="twitter"
                          value={this.getAtleta("twitterUrl")}
                          onChange={e => this.datosFormulario('twitterUrl', e.target.value)}
                          maxLength="100"
                        />
                        <TextField
                          id="infoPersonalPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Información Personal"
                          name="infoPersonal"
                          value={this.getAtleta("infoPersonal")}
                          onChange={e => this.datosFormulario('infoPersonal', e.target.value)}
                          maxLength="100"
                        />
                        {(this.agregarForm()) 
                          ? null
                          :
                          <div className="switchForm">
                            <label>
                              <p>{ this.getAtleta("activo") ? "Habilitado" : "Deshabilitado" }</p>
                              <Toggle
                                checked={this.getAtleta("activo")}
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
                        onClick={this.agregarAtleta}
                        labelPosition="before"
                        icon={<i className="fas fa-ban"></i>}/>
                    :   
                      <RaisedButton 
                        label="Guardar" 
                        className={ (this.formValidacion()) ? "botonAgregarU" : "botonAgregarU botonDeshabilitado"}
                        fullWidth={true} 
                        onClick={this.editarAtleta}
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
            <img alt="Imagen no disponible" src={this.getAtleta("fotoUrl")} />
          </Dialog>
        </div>
    )
  }

}
export default FormularioAtleta