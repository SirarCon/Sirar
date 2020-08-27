import Competencia from "./competencia";

class EventosAtleta{

    setJson(json){
        if(json !== null && json !== undefined && json !== {}){
            if(json._id !== null && json._id !== undefined && json._id !== {}){
                this.setId((json._id._id !== null && json._id._id !== undefined) ? json._id._id : "");
                this.setNombre((json._id.nombre !== null && json._id.nombre!== undefined) ? json._id.nombre : "");
            }
            if(json.competencia !== null && json.competencia !== undefined && json.competencia.length > 0){
                let comp = null
                var comps = []
                json.competencia.map(c => {
                    comp = new Competencia().setJson(c, this.getNombre());
                    comps.push(comp);
                })
                this.setCompetencias(comps)
            }
        }
        return this;
    }

    getId(){ return this.id;}
    getNombre(){ return this.nombre;}
    getCompetencias(){ return this.competencias;}
    setId(id){ this.id = id;}
    setNombre(nombre){ this.nombre = nombre;}
    setCompetencias(competencias){ this.competencias = competencias;}
}

export default EventosAtleta;