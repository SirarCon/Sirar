import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import Utilidades from '../../../proveedores/utilidades';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import DatosSesion from '../../../proveedores/datosSesion';
import Conexion from '../../../proveedores/conexion';
import RespuestaBase from '../../../modelo/respuesta/respuestaBase';
import Atleta from '../../../modelo/entidades/atleta';
import MultiSelect from '../../estructura/selectCustom';

class FormularioEquipo extends Component{

  utilidades = Utilidades.instancia();
  datosSesion = DatosSesion.instancia();
  getEquipo = "";
  agregarForm = "";
  agregarEquipo = "";
  editarEquipo = "";
  datosFormulario = "";
  formValidacion = "";

  constructor(props){
    super(props);
    this.getEquipo = this.props.getEquipo;
    this.agregarEquipo = this.props.agregarEquipo;
    this.editarEquipo = this.props.editarEquipo;
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
      atletasOpciones: []
    };
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

  mostrarSelectAtletas = () => {
    return (this.state.atletasOpciones.length > 0 && this.getEquipo("genero") != "" && this.getEquipo("deporteId") != "" && this.agregarForm())
  }

  validarGetOpcionesAtletas= (genero, pais, deporte) => {
    if(this.agregarForm()){
      this.setState({atletasOpciones: []});
      this.datosFormulario('atletas', []);
      if(genero != "" && pais != "" && deporte != "")
          this.getOpcionesAtletas()
    }
  }

  getOpcionesAtletas = () => {
    this.utilidades.mostrarCargador();
    var opciones = [];
    var atleta = null;
    Conexion.instancia().solicitar('get', 'atletas/', '', null)
      .then(x => {
        var respuesta = new RespuestaBase(x);
        if(respuesta.exito){
            respuesta.mensaje.map(a => {
                atleta = new Atleta().setJson(a);
                if(atleta.getActivo() && !atleta.getRetirado() && atleta.getGenero() == this.getEquipo("genero") && atleta.getDeporte().getId() == this.getEquipo("deporteId") && atleta.getCodigoPais() == this.getEquipo("codigoPais")){
                  opciones.push({value: atleta.getId(), label: atleta.getNombre()})
                }
            });
            this.utilidades.ocultarCargador();
            this.setState({atletasOpciones: opciones});
            if(opciones.length == 0)
              this.utilidades.mostrarAlerta("alertaInfo", "No existen atletas para este equipo");
        }
        else{
          this.setState({atletasOpciones: []});
          this.utilidades.ocultarCargador();
          this.utilidades.mostrarAlerta("alertaError", respuesta.mensaje);
        }        
    })
    .catch( data => { 
      this.setState({atletasOpciones: []});
      this.utilidades.ocultarCargador();
      this.utilidades.mostrarAlerta("alertaError", Conexion.instancia().errorGenerico);
    }); 
  }

  render(){
    return(
        <div id="contenedorFormEquipo">
            <div id="formPerfil">
                <form>
                  <div id="inputs">
                      <div className="grupoInputs grupoIzquierda">
                        <TextField
                          id="nombrePerfil" 
                          type="text"
                          fullWidth={true}
                          underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                          floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                          floatingLabelText="Nombre"
                          name="nombre"
                          value={this.getEquipo("nombre")}
                          onChange={e => this.datosFormulario('nombre', e.target.value)}
                          maxLength="40"
                        />
                        {this.agregarForm() ? 
                          <section>
                            <FormControl className="selectControl">
                              <InputLabel htmlFor="genero-simple-form">Género</InputLabel>
                              <Select
                                  native
                                  value={this.getEquipo("genero")}
                                  onChange={e => {
                                    this.datosFormulario('genero', e.target.value)
                                    this.validarGetOpcionesAtletas(e.target.value, this.getEquipo("codigoPais"), this.getEquipo("deporteId"))
                                  }}
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
                                  value={this.getEquipo("codigoPais")}
                                  onChange={e => {
                                    this.datosFormulario('codigoPais', e.target.value)
                                    this.validarGetOpcionesAtletas(this.getEquipo("genero"), e.target.value, this.getEquipo("deporteId"))
                                  }}
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
                                  value={this.getEquipo("deporteId")}
                                  onChange={e => {
                                    this.datosFormulario('deporteId', e.target.value)
                                    this.validarGetOpcionesAtletas(this.getEquipo("genero"), this.getEquipo("codigoPais"), e.target.value)
                                  }}
                                  inputProps={{
                                      name: 'deporte',
                                      id: 'deporte-simple-form'
                                  }}
                              >
                                  <option value=""/>
                                  {this.opcionesDeportes()}
                              </Select>
                            </FormControl>
                          </section>
                        : null }
                        { this.mostrarSelectAtletas() ?
                            <section className="multiSelect">
                              <section className="placeholder" id="atletasSelectPL">
                                <InputLabel>Atletas</InputLabel>
                              </section>
                              <MultiSelect
                                id="atletasSelect"
                                placeholderId="atletasSelectPL"
                                isMulti
                                options={this.state.atletasOpciones}
                                classNamePrefix="select"
                                placeholder=""
                                noOptionsMessage={function(){ return "Sin resultados"; }}
                                value={this.getEquipo("atletas")}
                                onChange={e => this.datosFormulario('atletas', e)}
                              />
                            </section>
                            : null
                        }
                        <div className="switchForm">
                          <label>
                            <p>Retirado</p>
                            <Toggle
                              checked={this.getEquipo("retirado")}
                              icons={false}
                              onChange={e => this.asignarBooleano(e.target.checked, "retirado")} />
                          </label>
                        </div>
                        {(this.agregarForm()) 
                          ? null
                          :
                          <div className="switchForm">
                            <label>
                              <p>{ this.getEquipo("activo") ? "Habilitado" : "Deshabilitado" }</p>
                              <Toggle
                                checked={this.getEquipo("activo")}
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
                        onClick={this.agregarEquipo}
                        labelPosition="before"
                        icon={<i className="fas fa-ban"></i>}/>
                    :   
                      <RaisedButton 
                        label="Guardar" 
                        className={ (this.formValidacion()) ? "botonAgregarU" : "botonAgregarU botonDeshabilitado"}
                        fullWidth={true} 
                        onClick={this.editarEquipo}
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
export default FormularioEquipo