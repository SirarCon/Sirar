
class SolicitudAtleta{

    constructor(nombre = "", fotoUrl = "", correo = "", telefono = "", fechaNacimiento = "", pasaporte = "", genero = "", lateralidad = "", 
    beneficiario = "", cedulaBeneficiario = "", visaAmericana = "", venceVisa = "", tallaCamisa = "", pantaloneta = "", tallaJacket = "", 
    tallaBuzo = "", tallaTenis = "", infoPersonal = "", fechaDebut = "", facebookUrl = "", instagramUrl = "", twitterUrl = "", altura = "", 
    pais = "", deporte = "", id = "", activo = true, retirado = false){
        this.id = id;
        this.nombre = nombre;
        this.fotoUrl = fotoUrl;
        this.correo = correo;
        this.telefono = telefono;
        this.fechaNacimiento = fechaNacimiento;
        this.pasaporte = pasaporte;
        this.genero = genero;
        this.lateralidad = lateralidad;
        this.beneficiario = beneficiario;
        this.cedulaBeneficiario = cedulaBeneficiario;
        this.visaAmericana = visaAmericana;
        this.venceVisa = venceVisa;
        this.tallaCamisa = tallaCamisa;
        this.pantaloneta = pantaloneta;
        this.tallaJacket = tallaJacket;
        this.tallaBuzo = tallaBuzo;
        this.tallaTenis = tallaTenis;
        this.infoPersonal = infoPersonal;
        this.fechaDebut = fechaDebut;
        this.facebookUrl = facebookUrl;
        this.instagramUrl = instagramUrl;
        this.twitterUrl = twitterUrl;
        this.altura = altura;
        this.pais = pais;
        this.deporte = deporte;
        this.activo = activo;
        this.retirado = retirado;
    }

}
export default SolicitudAtleta;