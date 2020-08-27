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
import MultiSelect from '../../estructura/selectCustom';
import Conexion from '../../../proveedores/conexion';
import RespuestaBase from '../../../modelo/respuesta/respuestaBase';
import Prueba from '../../../modelo/entidades/prueba';
import Atleta from '../../../modelo/entidades/atleta';
import Equipo from '../../../modelo/entidades/equipo';
import Evento from '../../../modelo/entidades/evento';

class FormularioCompeticion extends Component{

  utilidades = Utilidades.instancia();
  datosSesion = DatosSesion.instancia();
  getCompeticion = "";
  agregarForm = "";
  agregarCompeticion = "";
  editarCompeticion = "";
  datosFormulario = "";
  formValidacion = "";
  edicion = false;

  constructor(props){
    super(props);
    this.getCompeticion = this.props.getCompeticion;
    this.agregarCompeticion = this.props.agregarCompeticion;
    this.editarCompeticion = this.props.editarCompeticion;
    this.agregarForm = this.props.agregarForm;
    this.datosFormulario = this.props.datosFormulario;
    this.formValidacion = this.props.formValidacion;
    this.edicion = this.props.edicion;
    this.state = {
      estilos: { 
        underlineFocusStyle: { borderBottomColor: "#00478A" },
        floatingLabelShrinkStyle: { color: "#336CA1" }
      },
      banderaCarga: false, indexTab: 0, pruebasOpciones: [], tipoPrueba: 2, // 1 -> equipos, 0 -> atletas, 2 -> ninguno
      atletasOpciones: [], equiposOpciones: [],
    };
  }

  getOpcionesDeportes(){
    var opciones = [];
    this.datosSesion.obtenerCatalogoDeportes().map(d => {
        opciones.push(<option value={d.getId()} key={d.getId()}>{d.getNombre()}</option>);
    });
    return opciones;
  }

  getOpcionesPruebas(deporteId){
    if(deporteId != ""){
      this.utilidades.mostrarCargador();
      var opciones = [];
      Conexion.instancia().solicitar('get', 'deporte/pruebas/', deporteId, null)
      .then(x => {
          var respuesta = new RespuestaBase(x);
          if (respuesta.exito){
            respuesta.mensaje.map(p => {
                let prueba = new Prueba().setJson(p);
                let value = '{"id":"' + (prueba.getId()) + '","tipo":"' + prueba.getTipo() + '"}';
                opciones.push(<option value={value}>{prueba.getNombre()}</option>);
            });
            this.utilidades.ocultarCargador();
            this.setState({pruebasOpciones: opciones});
            if(opciones.length == 0)
              this.utilidades.mostrarAlerta("alertaInfo", "No hay pruebas registradas");
          }
          else{
            this.setState({pruebasOpciones: []});
            this.utilidades.ocultarCargador();
            this.utilidades.mostrarAlerta("alertaError", respuesta.mensaje);
          }
      })
      .catch( data => { 
        this.setState({pruebasOpciones: []});
        this.utilidades.ocultarCargador();
        this.utilidades.mostrarAlerta("alertaError", Conexion.instancia().errorGenerico);
      });
    }
    else{
      this.setState({pruebasOpciones: []});
      this.cambioPrueba("")
    }
  }

  cambioPrueba = (value) =>{
    var tipo = "2"
    if (value != ""){
      let json = JSON.parse(value)
      tipo = json.tipo
    }
    this.setState({tipoPrueba: tipo})
    this.datosFormulario('pruebaId', value)
    this.getOpcionesAtletasEquipos(this.getCompeticion("generoId"), tipo)
  }

  getOpcionesFases(){
    var opciones = [];
    this.datosSesion.obtenerCatalogoFases().map(f => {
        opciones.push(<option value={f.getId()} key={f.getId()}>{f.getDescripcion()}</option>);
    });
    return opciones;
  }

  mostrarSelectAtletas = () => {
    return (this.state.tipoPrueba == "0" && this.state.atletasOpciones.length > 0
    && this.getCompeticion("generoId") != "" && this.getCompeticion("deporteId") != "")
  }

  mostrarSelectEquipos = () => {
    return (this.state.tipoPrueba == "1" && this.state.equiposOpciones.length > 0
    && this.getCompeticion("generoId") != "" && this.getCompeticion("deporteId") != "")
  }

  getOpcionesAtletasEquipos = (generoId, tipoPrueba) => {
    this.setState({atletasOpciones: [], equiposOpciones: []});
    this.datosFormulario('atletas', [])
    this.datosFormulario('equipos', [])
    if(generoId != "" && this.getCompeticion("deporteId") != ""){
      if(tipoPrueba == "0")
        this.getOpcionesAtletas()
      else if(tipoPrueba == "1")
        this.getOpcionesEquipos()
    }
  }

  getOpcionesAtletas = (event) => {
    this.utilidades.mostrarCargador();
    var opciones = [];
    var atleta = null;
    Conexion.instancia().solicitar('get', 'atletas/', '', null)
      .then(x => {
        var respuesta = new RespuestaBase(x);
        if(respuesta.exito){
            respuesta.mensaje.map(a => {
                atleta = new Atleta().setJson(a);
                if(atleta.getActivo() && !atleta.getRetirado() && atleta.getGenero() == this.getCompeticion("generoId") 
                && atleta.getDeporte().getId() == this.getCompeticion("deporteId")){
                  opciones.push({value: atleta.getId(), label: atleta.getNombre() + ", "+ atleta.getNombrePais()})
                }
            });
            this.utilidades.ocultarCargador();
            this.setState({atletasOpciones: opciones});
            if(opciones.length == 0)
              this.utilidades.mostrarAlerta("alertaInfo", "No existen atletas para esta competición");
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

  getOpcionesEquipos = (event) => {
    this.utilidades.mostrarCargador();
    var opciones = [];
    var equipo = null;
    var evento = new Evento().setJson(JSON.parse(this.datosSesion.obtenerEventoDetalle()))
    if(evento  != null){
      Conexion.instancia().solicitar('get', 'equipos/', evento.getId(), null)
          .then(x => {
              var respuesta = new RespuestaBase(x);
              if(respuesta.exito){
                  respuesta.mensaje.map(e => {
                      equipo = new Equipo().setJson(e, evento.getNombre());
                      if(equipo.getActivo() && !equipo.getRetirado() && equipo.getGenero() == this.getCompeticion("generoId") && equipo.getDeporte().getId() == this.getCompeticion("deporteId")){ 
                        opciones.push({value: equipo.getId(), label: equipo.getNombre() + ", "+ equipo.getNombrePais()})
                      }
                  });
                  this.utilidades.ocultarCargador();
                  this.setState({equiposOpciones: opciones});
                  if(opciones.length == 0)
                    this.utilidades.mostrarAlerta("alertaInfo", "No existen equipos para esta competición");
              }
              else{
                this.setState({equiposOpciones: []});
                this.utilidades.ocultarCargador();
                this.utilidades.mostrarAlerta("alertaError", respuesta.mensaje);
              }    
          })
          .catch( data => { 
            this.setState({equiposOpciones: []});
            this.utilidades.ocultarCargador();
            this.utilidades.mostrarAlerta("alertaError", Conexion.instancia().errorGenerico);
          }); 
      }
  }

  asignarBooleano = (valor, atributo) => {
    (valor) ? this.datosFormulario(atributo, true) : this.datosFormulario(atributo, false);
  }

  render(){
    return(
        <div id="contenedorFormCompeticion">
            <div id="formPerfil">
                <form>
                  <div id="inputs">
                    <div className="grupoInputs grupoIzquierda">
                      { (this.edicion)
                      ? null
                      :
                        <section>
                          <FormControl className="selectControl">
                            <InputLabel htmlFor="deporte-simple">Deporte</InputLabel>
                            <Select
                                native
                                value={this.getCompeticion("deporteId")}
                                onChange={e => {
                                  this.datosFormulario('deporteId', e.target.value);
                                  this.getOpcionesPruebas(e.target.value)
                                }}
                                inputProps={{
                                    name: 'deporte',
                                    id: 'deporte-simple'
                                }}
                            >
                                <option value=""/>
                                {this.getOpcionesDeportes()}
                            </Select>
                          </FormControl>
                          <FormControl className="selectControl">
                            <InputLabel htmlFor="prueba-simple">Prueba</InputLabel>
                            <Select
                                native
                                disabled={this.state.pruebasOpciones.length == 0}
                                value={this.getCompeticion("pruebaId")}
                                onChange={e => this.cambioPrueba(e.target.value)}
                                inputProps={{
                                    name: 'prueba',
                                    id: 'prueba-simple'
                                }}
                            >
                                <option value=''/>
                                {this.state.pruebasOpciones}
                            </Select>
                          </FormControl>
                          <FormControl className="selectControl">
                            <InputLabel htmlFor="genero-simple">Género</InputLabel>
                            <Select
                                native
                                value={this.getCompeticion("generoId")}
                                onChange={e => {
                                  this.datosFormulario('generoId', e.target.value)
                                  this.getOpcionesAtletasEquipos(e.target.value, this.state.tipoPrueba)
                                }}
                                inputProps={{
                                    name: 'genero',
                                    id: 'genero-simple'
                                }}
                            >
                                <option value=""/>
                                <option value={"0"}>Femenino</option>
                                <option value={"1"}>Masculino</option>
                            </Select>
                          </FormControl>
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
                                value={this.getCompeticion("atletas")}
                                onChange={e => this.datosFormulario('atletas', e)}
                              />
                            </section>
                            : null}
                            { this.mostrarSelectEquipos() ?
                              <section className="multiSelect">
                                <section className="placeholder" id="equiposSelectPL">
                                  <InputLabel>Equipos</InputLabel>
                                </section>
                                <MultiSelect
                                  id="equiposSelect"
                                  placeholderId="equiposSelectPL"
                                  isMulti
                                  options={this.state.equiposOpciones}
                                  classNamePrefix="select"
                                  placeholder=""
                                  noOptionsMessage={function(){ return "Sin resultados"; }}
                                  value={this.getCompeticion("equipos")}
                                onChange={e => this.datosFormulario('equipos', e)}
                                />
                              </section>
                            : null }
                        </section>
                      } 
                      <FormControl className="selectControl">
                        <InputLabel htmlFor="fase-simple">Fase</InputLabel>
                        <Select
                            native
                            value={this.getCompeticion("faseId")}
                            onChange={e => this.datosFormulario('faseId', e.target.value)}
                            inputProps={{
                                name: 'fase',
                                id: 'fase-simple'
                            }}
                        >
                            <option value=""/>
                            {this.getOpcionesFases()}
                        </Select>
                      </FormControl>
                      <FormControl className="selectControl datePicker">
                        <InputLabel>Fecha {this.utilidades.obtenerSupportDatePicker() ? "" : "(12/31/1900 08:00)"}</InputLabel>
                        <TextField
                          id="fecha"
                          type="datetime-local"
                          label=""
                          min="1990-01-01T00:00"
                          max="2050-01-01T00:00"
                          value={this.getCompeticion("fecha")}
                          onChange={e => this.datosFormulario('fecha', e.target.value)}
                        />
                      </FormControl>
                      <TextField
                        id="ciudad"
                        type="text"
                        fullWidth={true}
                        underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                        floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                        floatingLabelText="Ciudad"
                        name="ciudad"
                        value={this.getCompeticion("ciudad")}
                        onChange={e => this.datosFormulario('ciudad', e.target.value)}
                        maxLength="40"
                      />
                      <TextField
                        id="recinto"
                        type="text"
                        fullWidth={true}
                        underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                        floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                        floatingLabelText="Recinto"
                        name="recinto"
                        value={this.getCompeticion("recinto")}
                        onChange={e => this.datosFormulario('recinto', e.target.value)}
                        maxLength="40"
                      />
                      <TextField
                        id="descripcion"
                        type="text"
                        fullWidth={true}
                        underlineFocusStyle={this.state.estilos.underlineFocusStyle}
                        floatingLabelShrinkStyle={this.state.estilos.floatingLabelShrinkStyle}
                        floatingLabelText="Descripción"
                        name="descripcion"
                        value={this.getCompeticion("descripcion")}
                        onChange={e => this.datosFormulario('descripcion', e.target.value)}
                        maxLength="60"
                      />
                      {(this.agregarForm()) 
                        ? null
                        :
                        <div className="switchForm">
                          <label>
                            <p>{ this.getCompeticion("activoCompetencia") ? "Habilitado" : "Deshabilitado" }</p>
                            <Toggle
                              checked={this.getCompeticion("activoCompetencia")}
                              icons={false}
                              onChange={e => this.asignarBooleano(e.target.checked, "activoCompetencia")} />
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
                        onClick={this.agregarCompeticion}
                        labelPosition="before"
                        icon={<i className="fas fa-ban"></i>}/>
                    :   
                      <RaisedButton 
                        label="Guardar" 
                        className={ (this.formValidacion()) ? "botonAgregarU" : "botonAgregarU botonDeshabilitado"}
                        fullWidth={true} 
                        onClick={this.editarCompeticion}
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
export default FormularioCompeticion