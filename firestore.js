import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, get, set, update, query, orderByChild, limitToFirst } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyADmtFOtMf7eDr8RzZ8ES-9iCMf5ywyjao",
    authDomain: "izcasinoroulette.firebaseapp.com",
    projectId: "izcasinoroulette",
    storageBucket: "izcasinoroulette.appspot.com",
    messagingSenderId: "581691954571",
    appId: "1:581691954571:web:e73df3eb4f89218a098b8e",
    databaseURL: "https://izcasinoroulette-default-rtdb.firebaseio.com/"
    };

let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}
const db = getDatabase(app);

export async function start(user) {
    try {
        const userRef = ref(db, `users/${user.uid}`);
        const userSnapshot = await get(userRef);
        if (!userSnapshot.exists()) {
            // Si el usuario es nuevo, añadirlo con 100 puntos
            await set(userRef, {
                email: user.email,
                displayName: user.displayName,
                points: 100,
                createdAt: new Date().toISOString(),
            });
            console.log("Nuevo usuario creado con 100 puntos");
        console.log(await getPoints(user))

        }
    } catch (error) {
        console.log('Error con la Realtime Database');
        throw new Error(error);
    }
}

export async function getPoints(user) {
    //console.log('iddeluser.>'+user.uid)
    const userRef = ref(db, `users/${user.uid}`);
    const userSnapshot = await get(userRef);
    console.log(userRef)
    const datos = userSnapshot.val();


    if (datos) {
        return datos.points;
    } else {
        console.log("No se encontraron datos para el usuario especificado.");
        //console.log('datos .> '+ datos) // O cualquier valor por defecto que prefieras
    }
}

export async function updatePoints(user, newpoints) {
    const userRef = ref(db, `users/${user.uid}`);
    await update(userRef, {
        points: newpoints
    });
}

export async function getRankingRT() {
    const usuarios = [];
    const q = query(ref(db, "users"), orderByChild("points","desc"), limitToFirst(10));
    const querySnapshot = await get(q);
    querySnapshot.forEach((snapshot) => {
        usuarios.push(snapshot.val());
    });
    usuarios.sort((a, b) => b.points - a.points);
    console.log(usuarios);
    return usuarios;
}

