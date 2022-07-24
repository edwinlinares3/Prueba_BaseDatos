var mongoose =require('mongoose');
var Schema = mongoose.Schema;

var seguimiento = new Schema({
    Fecha_de_seguimiento:String,
    id_Cliente :String,
    Nombre_Cliente:String,
    Apellidos_Cliente:String,
    Observaciones :String
});

//exportamos el modulo que creamos
module.exports = mongoose.model('seguimiento',seguimiento);