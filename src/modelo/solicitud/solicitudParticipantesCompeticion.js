class SolicitudParticipantesCompeticion{

    constructor(competencia = "", participantes = [], sonAtletas = true){
        if(sonAtletas){
            this.atletas = []
            participantes.map(p => {
                this.atletas.push({competencia: competencia, atleta: p.value})
            });
        }
        else{
            this.equipos = []
            participantes.map(p => {
                this.equipos.push({competencia: competencia, equipo: p.value})
            });
        }
    }
    
}
export default SolicitudParticipantesCompeticion;