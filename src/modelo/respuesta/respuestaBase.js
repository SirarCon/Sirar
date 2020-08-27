class RespuestaBase{

    token = "";
    exito = false;
    codigo = 0;
    mensaje = "Ha ocurrido un error, intente nuevamente.";
    
    constructor(json){
        if(json !== undefined && json !== null){
            if(json.token !== undefined && json.token !== null)
                this.token = json.token;
            if(json.mensaje !== undefined && json.mensaje !== null)
                this.mensaje = json.mensaje;
            if(json.datos !== undefined && json.datos !== null)
                this.respuestaDatos(json.datos);
        }
    }

    respuestaDatos = (json) => {
        if(json !== undefined && json !== null){
            if(json.exito !== undefined && json.exito !== null)
                this.exito = json.exito;
            if(json.codigo !== undefined && json.codigo !== null)
                this.codigo = json.codigo;
            if(json.mensaje !== undefined && json.mensaje !== null)
                this.mensaje = json.mensaje;
        }
    }
}

export default RespuestaBase;