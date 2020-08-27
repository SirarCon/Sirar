class SolicitudPush{
    // 0-> atleta, 1 -> equipo, 2 -> competencia
    constructor(tipo, id = "", token = ""){
        switch(tipo){
            case 0:
                this.atleta = id;
                break;
            case 1:
                this.equipo = id;
                break;
            case 2:
                this.competencia = id;
                break;
        }
        this.token = token;
    }

}
export default SolicitudPush;