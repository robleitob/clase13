const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const http = require('http').Server(app);
const productos = require('./api/productos');
const chat = require('./api/chat');


// le pasamos la constante http a socket.io
const io = require('socket.io')(http);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
    })
);

app.set("view engine", "hbs");
app.set("views", __dirname + '/views');

/* let messages = [
    {email: "rleivat@gmail.com", mensaje: "Primer mensaje"},
    {email: "robleitob@gmail.com", mensaje: "Segundo mensaje"},
]; //Uso provisorio, debe ir en chat.js
 */

io.on('connection', async socket => {
    console.log('Actualizacion detectada!');
    /* Envio los mensajes al cliente que se conectó; 
    en este caso la lista de los productos */
    socket.emit('productos', productos.listarTodos());

    //TODOS para Chat
    //Envio los mensajes al cliente recien conectado (debo referenciar al arreglo de chat.js (clase))
    socket.emit('messages', chat.leerMsje());

    /*Escuchando al cliente*/
    socket.on('nuevo-mensaje', mensaje => {
        io.sockets.emit('messages', chat.guardarMsje(mensaje));
        //chat.messages.push(mensaje);
        //io.sockets.emit('messages', chat.messages);
    });

    /* Escucho los mensajes enviado por el cliente y se los propago a todos;
    en este caso cuando se agrega un producto */
    socket.on('update', data => {
        io.sockets.emit('productos', productos.listarTodos());
    });
});

// protejo el servidor ante cualquier excepcion no atrapada
app.use((err, req, res, next) => {
    console.error(err.message);
    return res.status(500).send('Algo se rompio!');
});

// importo las rutas y las uso con el prefijo /api
const productosRouter = require('./routes/productos');
app.use('/api', productosRouter);

// obtengo el puerto del enviroment o lo seteo por defecto
const PORT = process.env.PORT || 8080;

// pongo a escuchar el servidor en el puerto indicado
const server = http.listen(PORT, () => {
    console.log(`servidor escuchando en http://localhost:${PORT}`);
});

// en caso de error, avisar
server.on('error', error => {
    console.log('error en el servidor:', error);
});
