// db.js
const mysql = require('mysql');

// Configuración de la conexión
const pool = mysql.createPool({
    host: 'beaxenh9alvmjjzccly3-mysql.services.clever-cloud.com',
    user: 'uafkphgat4n28dkz',
    password: 'Xw35WsIypkMgyGiycKAn',
    database: 'beaxenh9alvmjjzccly3'
});

/*
pool.getConnection((err) => {
    if (err) throw err
    else {
        console.log("conexion exitosa")
    }
})
*/

const query = `
            SELECT user_id, username, puntos
            FROM Usuarios
            ORDER BY puntos
            LIMIT 5;
        `;

pool.query(query, (err, rows) => {
    if (err) throw err
    console.log("el top5")
    for (let i = 0; i < rows.length; i++) {
        user=rows[i]
        console.log(`Nombre: ${user.user_id} | Puntos: ${user.puntos}`)
    }
})

setTimeout(function(){
    pool.end()
},3000)




