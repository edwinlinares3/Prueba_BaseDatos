var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose
  .connect(
   "mongodb+srv://edwinlinares3:Deltec2021@cluster0.88yzf.mongodb.net/?retryWrites=true&w=majority"

  )
  .then(function (db) {
    console.log("Conectado a la base de datos.");
  })
  .catch(function (err) {
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

var Historico = require("./models/historico");
var Cliente = require("./models/clientes");
var Seguimiento = require("./models/seguimiento");
app.use(express.static(__dirname + "/views/style"));

app.get("/Index", async function (req, res) {
  console.log(
    "----------------- Inicio ----------------------"
  );
  res.render("Index", {});
  console.log(
    "----------------- Fin  ----------------------"
  );
});

app.get("/Inicio/:a", async function (req, res) {
  console.log(
    "----------------- Inicio pagina de inicio ----------------------"
  );
  var documentos = await Cliente.find();
  var algo = req.params.a;
  res.render("Inicio", {
    algo,
    clientes: documentos,
  });
  console.log(
    "----------------- Fin pagina de inicio ----------------------"
  );
});

app.get("/Inicio", async function (req, res) {
  console.log(
    "----------------- Inicio pagina de inicio ----------------------"
  );
  var documentos = await Cliente.find();
  var algo = 0;
  res.render("Inicio", {
    algo,
    clientes: documentos,
  });
  console.log(
    "----------------- Fin pagina de inicio ----------------------"
  );
});

app.get("/Nuevocliente", async function (req, res) {
  console.log(
    "----------------- Inicio Nuevo Cliente ----------------------"
  );
  var cliente = await Cliente.find();
  res.render("Nuevocliente", {
    clientes: cliente,
  });
  console.log(
    "----------------- Fin Nuevo Cliente ----------------------"
  );
});

app.post("/resgistro", async function (req, res) {
  console.log(
    "----------------- Inicio Guardar datos Nuevo Cliente----------------------"
  );
  var t = new Cliente(req.body);
  await t.save(); //inserta en la base de datos
  console.log("Cliente Nuevo: " + t);
  res.redirect("/Inicio/Cliente_Creado_Correctamente"); //redirecciona al /home
  console.log(
    "----------------- Fin Cliente Creado ----------------------"
  );
});

app.get("/modificar/:id/:estado", async function (req, res) {
  console.log("------------ Inicio Modificar Cliente -------------");
  var id_enviado = req.params.id;
  var est_enviado = req.params.estado;
  console.log("Modificando el id: " + id_enviado + " Estado Actual: "+ est_enviado);
  var doc = await Cliente.findById(id_enviado);
  console.log("Modificando el Cliente: " + doc);
  res.render("modificaElimina", {
    clientes: doc,
    est_enviado
  });
  console.log("------------ Fin Modificar Cliente -------------");
});

app.post("/modificado", async function (req, res) {
  console.log("------------ Inicio Guardar Modificacion -------------");
  var datos = req.body;
  var EstadoAc = datos.estadoactual;
  var EstadoNu = datos.estado;
  console.log("Cliente a modificar: " + datos);
  var doc = await Cliente.findById(datos.id);
  (doc.Nombre = datos.Nombre),
  (doc.Apellidos = datos.apellidos),
  (doc.Email = datos.email),
  (doc.Telefono = datos.telefono),
  (doc.Pais = datos.pais),
  (doc.Ciudad = datos.ciudad),
  (doc.Direccion = datos.direccion),
  (doc.Localidad = datos.localidad),
  (doc.Barrio = datos.barrio),
  datos.Fecha_Ultima_Modificacion = new Date(Date.now()).toLocaleString(),
  (doc.Estado = datos.estado),
  (doc.Facebook = datos.facebook),
  (doc.Instagram = datos.instagram),
  (doc.Twitter = datos.twitter),
  (doc.Linkedin = datos.linkedin),

  console.log("Actual: "+ EstadoAc + " Nuevo: " + EstadoNu);
  if(EstadoAc!=EstadoNu){
    var documentos = new Historico({
    Fecha_Actualizacion : datos.Fecha_Ultima_Modificacion,
    id_Cliente : datos.id,
    Nombre_Cliente : datos.Nombre,
    Apellidos_Cliente : datos.apellidos,
    EstadoActual : EstadoAc,
    NuevoEstado : EstadoNu
    });
    console.log("--------------Guardar-----------"+ documentos);
    await documentos.save();
    console.log("Historico guardado");
  }

  await doc.save();
  console.log("Cliente modificado: " + doc);
  res.redirect("/Inicio/Cliente_Modificado_Correctamente");
  console.log("------------ Fin Guardar Modificacion -------------");
});

app.get("/eliminar/:id", async function (req, res) {
  console.log("------------ Inicio Eliminar Cliente -------------");
  var id_a = req.params.id;
  console.log("Deberíamos eliminar " + id_a + ": ");

  var doc = await Cliente.findById(id_a);
  console.log("Deberíamos eliminar " + doc + ": ");
  await doc.remove();
  res.redirect("/Inicio/Cliente_Eliminado_Correctamente");
  console.log("------------ Fin Eliminar Cliente -------------");
});

app.post("/filtro", async function (req, res) {
  console.log("------------ Inicio Filtro Estado -------------");
  var t = req.body;
  var est = t.Estado;
  console.log("Filtrar por: " + est);
  var algo = 0;
  var clic = await Cliente.find({ Estado: t.Estado });
  res.render("Inicio", { clientes: clic, algo });
  console.log("------------ Fin Filtro Estado -------------");
});

app.get("/Vseguimientos/:id/:Nombre/:Apellidos", async function(req,res){
  console.log("------------ Inicio Seguimiento -------------");
  var id_a = req.params.id;
  var nom = req.params.Nombre;
  var ape = req.params.Apellidos;
  var documentos = await Seguimiento.find({ id_Cliente: id_a });
  console.log(documentos);
  res.render('VerSeguimiento', {
    seguimiento: documentos,
    Nombre: nom,
    Apellido: ape,
    id_Cliente: id_a
  });
  console.log("------------ Fin Seguimiento -------------");
});

app.post('/nuevoSeguimiento',async function(req, res){
  console.log(
    "----------------- Inicio Nuevo Seguimiento----------------------"
  );
  console.log(req.body);
  var t = new Seguimiento(req.body);
  await t.save(); //inserta en la base de datos
  console.log("Seguimiento Nuevo: " + t);
  res.redirect("/Vseguimientos/"+req.body.id_Cliente+"/"+req.body.Nombre_Cliente+"/"+req.body.Apellidos_Cliente);
  console.log(
    "----------------- Fin Nuevo Seguimiento ----------------------"
  );
});

app.get("/historico/:id/:Nombre/:Apellidos", async function (req, res) {
  console.log("------------ Inicio Historico -------------");
  var id_a = req.params.id;
  var nom = req.params.Nombre;
  var ape = req.params.Apellidos;
  var documentos = await Historico.find({ id_Cliente: id_a });
  console.log(documentos);
  res.render('Historico', {
    historicos: documentos,
    Nombre: nom,
    Apellido: ape,
    id_Cliente: id_a
  });
  console.log("------------ Fin Historico -------------");
});


  app.listen(3000, function () {
  console.log("El servidor funciona en el puerto 3000");
});
