const express = require('express');
const axios = require('axios');
const readline = require('readline');
const fs = require('fs');
const app = express();

// Lista para almacenar los mensajes ya vistos
let mensajesVistos = new Set();

// Crear una interfaz para leer desde la consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Función para obtener los mensajes del chat de YouTube
const obtenerMensajes = async (url, archivo) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
      },
    });

    const html = response.data;

    // Extraer el script que contiene "ytInitialData"
    const scriptMatch = html.match(/<script[^>]*>.*?window\[\"ytInitialData\"\].*?<\/script>/s);
    if (!scriptMatch) {
      console.log('No se encontró la etiqueta script con ytInitialData');
      return;
    }

    const scriptContent = scriptMatch[0];

    // Expresión regular para mensajes, autores y URLs
    const regex = /"liveChatTextMessageRenderer":\{"message":\{"runs":\[(.*?)\]\},"authorName":\{"simpleText":"(.*?)"\}/g;
    const urlRegex = /"text":"(.*?)"/g;

    let match;
    while ((match = regex.exec(scriptContent)) !== null) {
      const author = match[2]; // Autor del mensaje
      const messageRuns = match[1]; // Bloque de mensaje

      // Extraer partes del mensaje
      let message = '';
      let partMatch;
      while ((partMatch = urlRegex.exec(messageRuns)) !== null) {
        message += partMatch[1]; // Concatenar partes del mensaje
      }

      // Verificar si el mensaje ya fue procesado
      if (!mensajesVistos.has(message)) {
        mensajesVistos.add(message);
        const timestamp = new Date().toLocaleTimeString('es-ES', { hour12: false });
        const logMessage = `[${timestamp}] [${author}]: ${message}`;
        console.log(logMessage);
        fs.appendFileSync(archivo, logMessage + '\n', 'utf8'); // Guardar en el archivo
      }
    }
  } catch (error) {
    console.error('Error al obtener los mensajes:', error);
  }
};

// Pedir la URL de la transmisión al usuario
rl.question('', (url) => {
  rl.question('Ingresa el nombre del archivo donde se guardarán los mensajes: ', (archivo) => {
    setInterval(() => obtenerMensajes(url, archivo), 2000);
    rl.close();
  });
});

// Configurar el servidor para escuchar en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
  console.log('Por favor, ingresa la URL de la transmisión para comenzar.');
});
