import Atleta from "./atleta";
import Registro from "./registro";
import Equipo from "./equipo";

class Participante{

    setJson(json, tipoPrueba){
        this.setRegistros([])
        if(json !== null && json !== undefined && json !== {}){
            this.setId((json._id !== null && json._id !== undefined) ? json._id : json.id);
            if(json.atleta !== undefined){
                this.setEsAtleta(true)
                this.setAtleta(new Atleta().setJson(json.atleta))
            }
            else if(json.equipo !== undefined){
                this.setEsAtleta(false)
                this.setEquipo(new Equipo().setJson(json.equipo))
            }
            this.setEsLocal((json.esLocal !== null && json.esLocal !== undefined) ? json.esLocal : false);
            this.setPuntaje((tipoPrueba == "2") ? 999999999 : -999999999)
            if(json.marcadores !== null && json.marcadores !== undefined && json.marcadores.length > 0){
                var registro = null
                var bandera = ""
                var nombre = ""
                if(this.getEsAtleta()){
                    bandera = this.getAtleta().getBandera()
                    nombre = this.getAtleta().getNombre()
                }
                else{
                    bandera = this.getEquipo().getBandera()
                    nombre = this.getEquipo().getNombre()
                }
                json.marcadores.map(m => {
                    registro = new Registro().setJson(m, this.getId(), bandera, nombre)
                    if(registro.getEsUltimo())
                        this.setPuntaje((registro.getPuntaje() !== null && registro.getPuntaje() !== undefined) ? registro.getPuntaje() : (tipoPrueba == "2") ? 999999999 : -999999999)
                    this.registros.push(registro)
                })
            }
        }
        return this;
    }

    getEsAtleta(){ return this.esAtleta;}
    setEsAtleta(esAtleta){ this.esAtleta = esAtleta;}
    getId(){ return this.id;}
    setId(id){ this.id = id;}
    getAtleta(){ return this.atleta;}
    setAtleta(atleta){ this.atleta = atleta}
    getEquipo(){ return this.equipo;}
    setEquipo(equipo){ this.equipo = equipo}
    getEsLocal(){ return this.esLocal;}
    setEsLocal(esLocal){ this.esLocal = esLocal}
    getPuntaje(){ return this.puntaje;}
    setPuntaje(puntaje){ this.puntaje = puntaje}
    getRegistros(){ return this.registros}
    setRegistros(registros){ this.registros = registros}
}

export default Participante;