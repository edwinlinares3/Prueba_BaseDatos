var mongoose =require('mongoose');
var Schema = mongoose.Schema;

var Cliente = new Schema({
    Nombre: String,
    Apellidos: String,
    Email: String,
    Telefono: Number,
    Pais: String,
    Ciudad: String,
    Direccion: String,
    Localidad: String,
    Barrio: String,
    Facebook:String,
    Instagram: String,
    Twitter:String,
    Linkedin:String,
    Fecha_de_registro: String,
    Fecha_Ultima_Modificacion: String,
    Estado: String
});

//exportamos el modelo que creamos aqui
module.exports = mongoose.model('Clientes', Cliente);