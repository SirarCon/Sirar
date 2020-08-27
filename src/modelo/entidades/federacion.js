class Federacion{

    constructor(id = "", nombre = "", escudoUrl = "", paginaWeb = "", ubicacion = "", telefono1 = "", 
    telefono2 = "", correo = "", presidente = "", correoPresidente = "", activo = true){
        this.setId(id);
        this.setNombre(nombre);
        this.setFoto(escudoUrl);
        this.setWeb(paginaWeb);
        this.setUbicacion(ubicacion);
        this.setTelefono1(telefono1);
        this.setTelefono2(telefono2);
        this.setEmail(correo);
        this.setNombrePresidente(presidente);
        this.setEmailPresidente(correoPresidente);
        this.setActivo(activo);
    }

    setJson(json){
        if(json !== null && json !== undefined && json !== {}){
            this.setId((json._id !== null && json._id !== undefined) ? json._id : json.id);
            this.setNombre(json.nombre);
            this.setFoto(json.escudoUrl);
            this.setWeb((json.paginaWeb != null ? json.paginaWeb : ""));
            this.setUbicacion(json.ubicacion);
            this.setActivo((json.activo !== null && json.activo !== undefined) ? json.activo : true);
            if(json.telefonos !== null && json.telefonos !== undefined && json.telefonos !== [] && json.telefonos !== ""){
                if(json.telefonos[0] != null && json.telefonos[0] != undefined){
                    this.setTelefono1(json.telefonos[0].toString());
                }
                if(json.telefonos.length > 1){
                    if(json.telefonos[1] != null && json.telefonos[1] != undefined){
                        this.setTelefono2(json.telefonos[1].toString());
                    }
                }
            }
            else{
                this.setTelefono1(json.telefono1);
                this.setTelefono2(json.telefono2);
            }
            if(json.correoFederacion !== null && json.correoFederacion !== undefined && json.correoFederacion !== "")
                this.setEmail(json.correoFederacion);
            else
                this.setEmail(json.email);
            if(json.presidente !== null && json.presidente !== undefined && json.presidente !== "")
                this.setNombrePresidente(json.presidente);
            else
                this.setNombrePresidente(json.nombrePresidente);
            if(json.correoPresidente !== null && json.correoPresidente !== undefined && json.correoPresidente !== "")
                this.setEmailPresidente(json.correoPresidente);
            else
                this.setEmailPresidente(json.emailPresidente);
        }
        return this;
    }

    getId(){ return this.id;}
    getNombre(){ return this.nombre;}
    getFoto(){ return this.escudoUrl;}
    getWeb(){ return this.paginaWeb;}
    getUbicacion(){ return this.ubicacion;}
    getTelefono1(){ return this.telefono1;}
    getTelefono2(){ return this.telefono2;}
    getEmail(){ return this.email;}
    getNombrePresidente(){ return this.nombrePresidente;}
    getEmailPresidente(){ return this.emailPresidente;}
    setId(id){ this.id = id;}
    setNombre(nombre){ this.nombre = nombre;}
    setFoto(escudoUrl){ this.escudoUrl = (escudoUrl !== undefined && escudoUrl !== null) ? escudoUrl : "";}
    setWeb(paginaWeb){this.paginaWeb = paginaWeb;}
    setUbicacion(ubicacion){ this.ubicacion = ubicacion;}
    setTelefono1(telefono1){ this.telefono1 = telefono1;}
    setTelefono2(telefono2){ this.telefono2 = telefono2;}
    setEmail(email){ this.email = email;}
    setNombrePresidente(nombrePresidente){ this.nombrePresidente = nombrePresidente;}
    setEmailPresidente(emailPresidente){ this.emailPresidente = emailPresidente;}
    getActivo(){ return this.activo;}
    setActivo(activo){ this.activo = activo}
}

export default Federacion;