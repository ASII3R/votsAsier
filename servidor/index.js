
const { WebSocketServer, WebSocket } = require('ws');
const fs = require('fs');
const path = require('path');

const PUERTO = process.env.PORT || 3000;
const ARCHIVO_VOTOS = path.join(__dirname, 'votos.json');

let votos = [0, 0, 0, 0];

// Cargar los votos guardados
if (fs.existsSync(ARCHIVO_VOTOS)) {
    try {
        votos = JSON.parse(fs.readFileSync(ARCHIVO_VOTOS, 'utf8'));

        if (
            !Array.isArray(votos) ||
            votos.length !== 4 ||
            !votos.every(v => Number.isInteger(v) && v >= 0)
        ) {
            votos = [0, 0, 0, 0];
        }
    } catch (error) {
        votos = [0, 0, 0, 0];
    }
} else {
    fs.writeFileSync(ARCHIVO_VOTOS, JSON.stringify(votos, null, 2));
}

// Crear el servidor WebSocket
const servidor = new WebSocketServer({ port: PUERTO });

console.log(`Servidor WebSocket escuchando en el puerto ${PUERTO}`);

// Enviar los votos a todos los clientes conectados
function enviarVotos() {
    const mensaje = JSON.stringify({
        tipo: 'votos',
        votos: votos
    });

    servidor.clients.forEach(cliente => {
        if (cliente.readyState === WebSocket.OPEN) {
            cliente.send(mensaje);
        }
    });
}

// Gestionar las conexiones
servidor.on('connection', (cliente) => {
    console.log('Cliente conectado');

    // Enviar los votos actuales al nuevo cliente
    cliente.send(JSON.stringify({
        tipo: 'votos',
        votos: votos
    }));

    cliente.on('message', (datos) => {
        try {
            const mensaje = JSON.parse(datos.toString());

            if (
                mensaje.tipo === 'votar' &&
                Number.isInteger(mensaje.opcion) &&
                mensaje.opcion >= 0 &&
                mensaje.opcion < 4
            ) {
                votos[mensaje.opcion]++;

                fs.writeFileSync(
                    ARCHIVO_VOTOS,
                    JSON.stringify(votos, null, 2)
                );

                console.log('Votos actualizados:', votos);

                enviarVotos();
            }
        } catch (error) {
            console.error('Error al procesar el mensaje:', error.message);
        }
    });

    cliente.on('close', () => {
        console.log('Cliente desconectado');
    });
});

servidor.on('error', (error) => {
    console.error('Error en el servidor:', error.message);
});
