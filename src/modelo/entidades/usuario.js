class Usuario{

    constructor(nombre = "", fotoUrl = "", correo = "", identificacion = "", telefono = "", rol = 0, token = ""){
        this.setNombre(nombre);
        this.setToken(token);
        this.setFoto(fotoUrl);
        this.setEmail(correo);
        this.setId(identificacion);
        this.setTelefono(telefono);
        this.setRol(rol);
    }

    setJson(json){
        if(json !== null && json !== {}){
            this.setNombre(json.nombre);
            this.setFoto(json.fotoUrl);
            this.setEmail(json.correo);
            this.setId(json.identificacion);
            this.setTelefono(json.telefono);
            this.setRol(json.rol);
            this.setToken(json.token);
        }
        return this;
    }

    getNombre(){ return this.nombre;}
    getToken(){ return this.token;}
    getFoto(){ return this.fotoUrl;}
    getEmail(){ return this.correo;}
    getId(){ return this.identificacion;}
    getTelefono(){ return this.telefono;}
    getRol(){ return this.rol;}
    getRolNombre(){ return this.rolNombre;}
    setNombre(nombre){ this.nombre = nombre;}
    setToken(token){ this.token = token;}
    setFoto(fotoUrl){ this.fotoUrl = (fotoUrl !== undefined && fotoUrl !== null) ? fotoUrl : "";}
    setEmail(correo){ this.correo = correo;}
    setId(identificacion){ this.identificacion = identificacion;}
    setTelefono(telefono){ this.telefono = telefono;}
    setRol(rol){
        this.rol = rol;
        this.rolNombre = (this.rol === 1) ? "Administrador" : "Colaborador";
    }
}

export default Usuario;