const express = require('express');
const mysql = require('mysql2');
const cors = require('cors')
const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));  




// Configura la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'beaxenh9alvmjjzccly3-mysql.services.clever-cloud.com',
  user: 'uafkphgat4n28dkz',
  password: 'Xw35WsIypkMgyGiycKAn',
  database: 'beaxenh9alvmjjzccly3'
});

// Conecta con la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error de conexión: ' + err.stack);
    return;
  }
  console.log('Conectado con éxito como id ' + connection.threadId);
});

// Define una ruta para obtener los datos de la base de datos
app.get('/ranking', (req, res) => {
    connection.query('SELECT user_id, username, puntos FROM Usuarios ORDER BY puntos DESC', (err, results) => {
      if (err) {
        res.status(500).send('Error en la consulta');
        return;
      }
      res.json(results);
    });
  });

// Servir archivos estáticos (para tu HTML)
app.use(express.static('public'));

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
