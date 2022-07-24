var mongoose =require('mongoose');
var Schema = mongoose.Schema;

var historico = new Schema({
    Fecha_Actualizacion:String,
    id_Cliente :String,
    Nombre_Cliente:String,
    Apellidos_Cliente:String,
    EstadoActual:String,
    NuevoEstado :String
});

//exportamos el modulo que creamos
module.exports = mongoose.model('historicos',historico);