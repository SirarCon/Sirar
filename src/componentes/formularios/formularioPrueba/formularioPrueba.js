import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import Utilidades from '../../../proveedores/utilidades';
import DatosSesion from '../../../proveedores/datosSesion';
import { FormControl, InputLabel, Select } from '@material-ui/core';

class FormularioPrueba extends Component{

  utilidades = Utilidades.instancia();
  datosSesion = DatosSesion.instancia();
  getPrueba = "";
  agregarForm = "";
  agregarPrueba = "";
  editarPrueba = "";
  datosFormulario = "";
  formValidacion = "";

  constructor(props){
    super(props);
    this.getPrueba = this.props.getPrueba;
    this.agregarPrueba = this.props.agregarPrueba;
    this.editarPrueba = this.props.editarPrueba;
    this.agregarForm = this.props.agregarForm;
    this.datosFormulario = this.props.datosFormulario;
    this.formValidacion = this.props.formValidacion;
    this.state = {
      estilos: { 
        underlineFocusStyle: { borderBottomColor: "#00478A" },
        floatingLabelShrinkStyle: { color: "#336CA1" }
      },
      banderaCarga: false,
      indexTab: 0,
      federaciones: []
    };
  }

  asignarBooleano = (valor, atributo) => {
    (valor) ? this.datosFormulario(atributo, true) : this.datosFormulario(atributo, false);
  }

  render(){
    return(
        <div id="contenedorFormPrueba">
            <div id="formPerfil">
                <form>
                  <div id="inputs">
                      <div className="grupoInputs">
                        <TextField
                          id="nombrePerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Nombre"
                          name="nombre"
                          value={this.getPrueba("nombrePrueba")}
                          onChange={e => this.datosFormulario('nombrePrueba', e.target.value)}
                          maxLength="40"
                        />
                        <FormControl className="selectControl">
                          <InputLabel htmlFor="tipo-simple">Tipo Participantes</InputLabel>
                          <Select
                              native
                              value={this.getPrueba("tipoPrueba")}
                              onChange={e => this.datosFormulario('tipoPrueba', e.target.value)}
                              inputProps={{
                                  name: 'tipo',
                                  id: 'tipo-simple'
                              }}
                          >
                              <option value=""/>
                              <option value={"0"}>Individual</option>
                              <option value={"1"}>Equipo</option>
                          </Select>
                        </FormControl>
                        <FormControl className="selectControl">
                          <InputLabel htmlFor="tipoMarcador-simple">Tipo Marcador</InputLabel>
                          <Select
                              native
                              value={this.getPrueba("tipoMarcador")}
                              onChange={e => this.datosFormulario('tipoMarcador', e.target.value)}
                              inputProps={{
                                  name: 'tipoMarcador',
                                  id: 'tipoMarcador-simple'
                              }}
                          >
                              <option value=""/>
                              <option value={"1"}>Puntaje</option>
                              <option value={"2"}>Tiempo</option>
                              <option value={"3"}>Distancia</option>
                          </Select>
                        </FormControl>
                        {(this.agregarForm()) 
                          ? null
                          :
                          <div className="switchForm">
                            <label>
                              <p>{ this.getPrueba("activoPrueba") ? "Habilitado" : "Deshabilitado" }</p>
                              <Toggle
                                checked={this.getPrueba("activoPrueba")}
                                icons={false}
                                onChange={e => this.asignarBooleano(e.target.checked, "activoPrueba")} />
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
                        onClick={this.agregarPrueba}
                        labelPosition="before"
                        icon={<i className="fas fa-ban"></i>}/>
                    :   
                      <RaisedButton 
                        label="Guardar" 
                        className={ (this.formValidacion()) ? "botonAgregarU" : "botonAgregarU botonDeshabilitado"}
                        fullWidth={true} 
                        onClick={this.editarPrueba}
                        labelPosition="before"
                        icon={<i className="fas fa-ban"></i>}/>
                    }
                  </div>
                </form>
            </div>
        </div>
    )
  }

}
export default FormularioPrueba