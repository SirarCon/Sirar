import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import Utilidades from '../../../proveedores/utilidades';
import DatosSesion from '../../../proveedores/datosSesion';
import { FormControl, InputLabel, Select } from '@material-ui/core';

class FormularioRegistro extends Component{

  utilidades = Utilidades.instancia();
  datosSesion = DatosSesion.instancia();
  getRegistro = "";
  agregarForm = "";
  agregarRegistro = "";
  editarRegistro = "";
  borrarRegistro = "";
  datosFormulario = "";
  formValidacion = "";
  getParticipantes = [];
  getPrueba = "";

  constructor(props){
    super(props);
    this.getRegistro = this.props.getRegistro;
    this.agregarRegistro = this.props.agregarRegistro;
    this.editarRegistro = this.props.editarRegistro;
    this.borrarRegistro = this.props.borrarRegistro;
    this.agregarForm = this.props.agregarForm;
    this.datosFormulario = this.props.datosFormulario;
    this.formValidacion = this.props.formValidacion;
    this.getParticipantes = this.props.getParticipantes;
    this.getPrueba = this.props.getPrueba;
    this.state = {
      estilos: { 
        underlineFocusStyle: { borderBottomColor: "#00478A" },
        floatingLabelShrinkStyle: { color: "#336CA1" }
      }
    };
  }

  asignarBooleano = (valor, atributo) => {
    (valor) ? this.datosFormulario(atributo, true) : this.datosFormulario(atributo, false);
  }

  render(){
    return(
        <div id="contenedorFormRegistro">
            <div id="formPerfil">
                <form>
                  <div id="inputs">
                      <div className="grupoInputs">
                      <FormControl className="selectControl">
                          <InputLabel htmlFor="participante-simple">Participante</InputLabel>
                          <Select
                              native
                              disabled={!this.agregarForm()}
                              value={this.getRegistro("participanteSeleccionado")}
                              onChange={e => this.datosFormulario('participanteSeleccionado', e.target.value)}
                              inputProps={{
                                  name: 'participante',
                                  id: 'participante-simple'
                              }}
                          >
                              <option value=""/>
                              {this.opcionesParticipantes()}
                          </Select>
                        </FormControl>
                        <TextField
                          id="puntajePerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText={this.getNombreTipoMarcador()}
                          name="puntaje"
                          value={this.getRegistro("puntaje")}
                          onChange={e => this.datosFormulario('puntaje', e.target.value)}
                          maxLength="40"
                        />
                        <TextField
                          id="momentoTiempoPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Momento de la competencia"
                          name="momentoTiempo"
                          value={this.getRegistro("momentoTiempo")}
                          onChange={e => this.datosFormulario('momentoTiempo', e.target.value)}
                          maxLength="40"
                        />
                        <TextField
                          id="setPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Set"
                          name="set"
                          value={this.getRegistro("set")}
                          onChange={e => this.datosFormulario('set', e.target.value)}
                          maxLength="3"
                        />
                        <TextField
                          id="oportunidadesPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Máximo de oportunidades"
                          name="oportunidades"
                          value={this.getRegistro("oportunidades")}
                          onChange={e => this.datosFormulario('oportunidades', e.target.value)}
                          maxLength="3"
                        />
                        <TextField
                          id="oportunidadPerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Oportunidad"
                          name="oportunidad"
                          value={this.getRegistro("oportunidad")}
                          onChange={e => this.datosFormulario('oportunidad', e.target.value)}
                          maxLength="3"
                        />
                        <div className="switchForm">
                          <label>
                            <p>¿Puntaje final?</p>
                            <Toggle
                              checked={this.getRegistro("esUltimo")}
                              icons={false}
                              onChange={e => this.asignarBooleano(e.target.checked, "esUltimo")} />
                          </label>
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
                        onClick={this.agregarRegistro}
                        labelPosition="before"
                        icon={<i className="fas fa-ban"></i>}/>
                    :   
                      <section>
                        <RaisedButton 
                          label="Guardar"
                          className={ (this.formValidacion()) ? "botonAgregarU" : "botonAgregarU botonDeshabilitado"}
                          fullWidth={true} 
                          onClick={this.editarRegistro}
                          labelPosition="before"
                          icon={<i className="fas fa-ban"></i>}
                        />
                        <RaisedButton 
                          label="Borrar" 
                          className="botonEliminarU"
                          fullWidth={true} 
                          onClick={this.borrarRegistro}
                          labelPosition="before"
                        />
                      </section>
                    }
                  </div>
                </form>
            </div>
        </div>
    )
  }

  getNombreTipoMarcador(){
    var tipo = this.getPrueba().getTipoMarcador()
    return (tipo == "1") ? "Puntos logrados" : (tipo == "2") ? "Tiempo logrado" : (tipo == "3") ? "Distancia lograda" : ""
  }

  opcionesParticipantes(){
    var opciones = [];
    this.getParticipantes().map(p => {
      if(p.getEsAtleta())
        opciones.push(<option value={p.getId()} key={p.getId()}>{p.getAtleta().getNombre() + ", " + p.getAtleta().getNombrePais()}</option>);
      else
        opciones.push(<option value={p.getId()} key={p.getId()}>{p.getEquipo().getNombre() + ", " + p.getEquipo().getNombrePais()}</option>);
    });
    return opciones
  }

}
export default FormularioRegistro