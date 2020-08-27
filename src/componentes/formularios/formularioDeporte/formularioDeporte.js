import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import Utilidades from '../../../proveedores/utilidades';
import DatosSesion from '../../../proveedores/datosSesion';
import { FormControl, InputLabel, Select } from '@material-ui/core';
import Conexion from '../../../proveedores/conexion';
import RespuestaBase from '../../../modelo/respuesta/respuestaBase';
import Federacion from '../../../modelo/entidades/federacion';

class FormularioDeporte extends Component{

  utilidades = Utilidades.instancia();
  datosSesion = DatosSesion.instancia();
  getDeporte = "";
  agregarForm = "";
  agregarDeporte = "";
  editarDeporte = "";
  datosFormulario = "";
  formValidacion = "";

  constructor(props){
    super(props);
    this.getDeporte = this.props.getDeporte;
    this.agregarDeporte = this.props.agregarDeporte;
    this.editarDeporte = this.props.editarDeporte;
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
        <div id="contenedorFormDeporte">
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
                          value={this.getDeporte("nombre")}
                          onChange={e => this.datosFormulario('nombre', e.target.value)}
                          maxLength="40"
                        />
                        <FormControl className="selectControl">
                          <InputLabel htmlFor="federacion-simple">Federación</InputLabel>
                          <Select
                              native
                              value={this.getDeporte("federacion")}
                              onChange={e => this.datosFormulario('federacion', e.target.value)}
                              inputProps={{
                                  name: 'federacion',
                                  id: 'federacion-simple'
                              }}
                          >
                              <option value=""/>
                              {this.opcionesFederaciones()}
                          </Select>
                        </FormControl>
                        {(this.agregarForm()) 
                          ? null
                          :
                          <div className="switchForm">
                            <label>
                              <p>{ this.getDeporte("activo") ? "Habilitado" : "Deshabilitado" }</p>
                              <Toggle
                                checked={this.getDeporte("activo")}
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
                        onClick={this.agregarDeporte}
                        labelPosition="before"
                        icon={<i className="fas fa-ban"></i>}/>
                    :   
                      <RaisedButton 
                        label="Guardar" 
                        className={ (this.formValidacion()) ? "botonAgregarU" : "botonAgregarU botonDeshabilitado"}
                        fullWidth={true} 
                        onClick={this.editarDeporte}
                        labelPosition="before"
                        icon={<i className="fas fa-ban"></i>}/>
                    }
                  </div>
                </form>
            </div>
        </div>
    )
  }

  opcionesFederaciones(){
    var opciones = [];
    this.datosSesion.obtenerCatalogoFederaciones().map(f => {
      opciones.push(<option value={f.getId()} key={f.getId()}>{f.getNombre()}</option>);
    });
    return opciones;
  }

}
export default FormularioDeporte