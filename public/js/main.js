const socket = io.connect();

/* si recibo productos, los muestro usando handlebars */
socket.on('productos', function (productos) {
    document.getElementById('datos').innerHTML = data2TableHBS(productos)
});

//Muestro todos los mensajes del chat al usuario que se conecta
socket.on('messages', messages => {
    render(messages);
});

function render(messages) {
    let html = messages.map(elem => {
        return (`<strong>${elem.email}</strong><sup>[${elem.fecha}]:</sup>
                <em>${elem.mensaje}</em><br>`)
    }).join(' ');
    document.getElementById('chat').innerHTML = `<div id="msjes"><h3>Centro de Mensajes</h3><hr>${html}</div>`;
}

socket.on('messages', function(messages) {render(messages);});

function addMessage(event){
    
    let message = {
        email: document.getElementById('email').value,
        fecha: new Date().toLocaleString(),
        mensaje: document.getElementById('mensaje').value
    }
    
    socket.emit('nuevo-mensaje', message);
    return false;
}


/* obtengo el formulario */
const form = document.querySelector('form');

form.addEventListener('submit', event => {
    event.preventDefault();
    const data = { 
        title:      form[0].value, 
        price:      form[1].value, 
        thumbnail:  form[2].value 
    };

    fetch('/api/productos/guardar', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(respuesta => respuesta.json())
    .then(productos => {
        form.reset();
        socket.emit('update', 'ok');
    })
    .catch(error => {
        console.log('ERROR', error);
    });
});

function data2TableHBS(productos) {
    const plantilla = `
        <style>
            .table td,
            .table th {
                vertical-align: middle;
            }
        </style>

        {{#if productos.length}}
        <div class="table-responsive">
            <table class="table table-dark">
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Foto</th>
                </tr>
                {{#each productos}}
                <tr>
                    <td>{{this.title}}</td>
                    <td>$ {{ this.price }}</td>
                    <td><img width="50" src={{this.thumbnail}} alt="not found"></td>
                </tr>
                {{/each}}
            </table>
        </div>
        {{/if}}
    `
    //console.log(productos);
    var template = Handlebars.compile(plantilla);
    let html = template({ productos: productos, hayProductos: productos.length });
    return html;
}

function data2ChatHBS(messages){

}