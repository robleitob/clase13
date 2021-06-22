const fs = require('fs')

class Chat{
    constructor(){
        this.messages = [];        
    }

    leerMsje(){
        try {
            //Lectura de archivo
            
            /* let contenidoArchivo =  fs.readFileSync('../assets/mensajes.txt', 'utf-8')
            this.messages = JSON.parse(contenidoArchivo); */

            /* Este es el error al usar las lineas de arriba : A ocurrido un error con el archivo: ENOENT: no such file or directory, open '../assets/mensajes.txt' */
            
            return this.messages;
         } catch (error) {
            //console.log(error);
            this.messages =[{}];
             console.log('A ocurrido un error con el archivo: '+ error.message);
             //console.log('No hay mensajes que mostrar');
         }
    }

    guardarMsje(obj){
        try {
            this.messages.push(obj);
            return this.messages;    
        } catch (error) {
            return [{
                error: error
            }];
        }
    }

}

module.exports = new Chat();