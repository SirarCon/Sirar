class Almacenamiento {

    static _instancia = null;
    static instancia(){
        (this._instancia == null) ? this._instancia = new Almacenamiento() : null;
        return this._instancia;
    }
}

export default Almacenamiento;