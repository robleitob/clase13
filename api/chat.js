const fs = require('fs')

class Chat{
    constructor(){
        this.messages = [];        
    }

    leerMsje(){
        try {
            //Lectura de archivo
            let contenidoArchivo =  fs.readFileSync('./assets/mensajes.txt', 'utf-8')
            if(contenidoArchivo.length > 0){
                this.messages = JSON.parse(contenidoArchivo);
            }
            return this.messages;            
         } catch (error) {
            //console.log(error);
             console.log('A ocurrido un error con el archivo: '+ error.message);
         }
    }

    guardarMsje(obj){
        try {
            this.messages.push(obj);
            fs.writeFileSync('./assets/mensajes.txt', JSON.stringify(this.messages, null, '\t'));
            return this.messages;    
        } catch (error) {
            return [{
                error: error
            }];
        }
    }

}

module.exports = new Chat();