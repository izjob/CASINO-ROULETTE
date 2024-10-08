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


/*
export async function prueba() {
    const usersRef = ref(db, 'users')
    const usersSnapshot = await get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
            const users = snapshot.val()

            Object.keys(users).forEach ((userId)=>{
                const userRef = ref(db, `users/${userId}`);

                const nuevosAtributos ={
                    dateLastDay: new Date(),
                    consecutiveDays: 0
                }

                update(userRef, nuevosAtributos).then(()=> {
                    console.log('ha funcionao')
                }).catch((error)=>{
                    console.log('ha fallao bro: ',error)
                })
            })
        } else{
            console.log('no hay users')
        }
    }).catch((error)=>{
        console.log('no pille los usuarios: ',error)
    })

}
*/

export async function getDateLastDay(user) {
    //console.log('iddeluser.>'+user.uid)
    const userRef = ref(db, `users/${user.uid}`);
    const userSnapshot = await get(userRef);
    //console.log(userRef)
    const datos = userSnapshot.val();
    if (datos) {
        return datos.dateLastDay;
    } else {
        console.log("No se encontraron datos para el usuario especificado.");
        //console.log('datos .> '+ datos) // O cualquier valor por defecto que prefieras
    }
}

export async function getConsecutiveDays(user) {
    //console.log('iddeluser.>'+user.uid)
    const userRef = ref(db, `users/${user.uid}`);
    const userSnapshot = await get(userRef);
    //console.log(userRef)
    const datos = userSnapshot.val();
    if (datos) {
        return datos.consecutiveDays;
    } else {
        console.log("No se encontraron datos para el usuario especificado.");
        //console.log('datos .> '+ datos) // O cualquier valor por defecto que prefieras
    }
}











export async function start(user) {
    try {
        const userRef = ref(db, `users/${user.uid}`);
        const userSnapshot = await get(userRef);
        if (!userSnapshot.exists()) {
            // Si el usuario es nuevo, añadirlo con 100 puntos
            const date = new Date().toISOString();
            const formattedDate = date.split('.')[0].replace('T', ' ');
            const finalDate = `${formattedDate} (UTC-01:00)`;
            await set(userRef, {
                email: user.email,
                displayName: user.displayName,
                points: 100,
                createdAt: new Date().toISOString(),
                maxpoints: 100,
                maxpointsDate: finalDate
            });
            //console.log("Nuevo usuario creado con 100 puntos");
            //console.log(await getPoints(user))

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
    //console.log(userRef)
    const datos = userSnapshot.val();
    if (datos) {
        return datos.points;
    } else {
        console.log("No se encontraron datos para el usuario especificado.");
        //console.log('datos .> '+ datos) // O cualquier valor por defecto que prefieras
    }
}

export async function getMaxpoints(user) {
    //console.log('iddeluser.>'+user.uid)
    const userRef = ref(db, `users/${user.uid}`);
    const userSnapshot = await get(userRef);
    //console.log(userRef)
    const datos = userSnapshot.val();
    if (datos) {
        return datos.maxpoints;
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

export async function getNPlayers() {

    try {
        const usuarios = [];
        const q = query(ref(db, "users"), orderByChild("points"), limitToFirst(100));
        const querySnapshot = await get(q);
        querySnapshot.forEach((snapshot) => {
            usuarios.push(snapshot.val());
        });
        //console.log(usuarios.length)
        return usuarios.length;
    } catch (error) {
        console.log('Error con la Realtime Database');
        throw new Error(error);
    }

}

export async function getRankingRT() {
    const usuarios = [];
    const q = query(ref(db, "users"), orderByChild("points"));
    const querySnapshot = await get(q);
    querySnapshot.forEach((snapshot) => {
        usuarios.push(snapshot.val());
    });
    usuarios.sort((a, b) => b.points - a.points);
    return usuarios.slice(0, 3);
}

export async function getRankingAT() {
    const usuarios = [];
    const q = query(ref(db, "users"), orderByChild("maxpoints"));
    const querySnapshot = await get(q);
    querySnapshot.forEach((snapshot) => {
        usuarios.push(snapshot.val());
    });
    usuarios.sort((a, b) => b.maxpoints - a.maxpoints);
    return usuarios.slice(0, 3);
}



export async function updateMaxpoints(user, newMax) {
    const date = new Date().toISOString();
    const formattedDate = date.split('.')[0].replace('T', ' ');
    const finalDate = `${formattedDate} (UTC-01:00)`;
    const userRef = ref(db, 'users/' + user.uid);
    update(userRef, {
        maxpoints: newMax,
        maxpointsDate: finalDate

    })
}

