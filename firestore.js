import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc,collection, query, where } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyADmtFOtMf7eDr8RzZ8ES-9iCMf5ywyjao",
    authDomain: "izcasinoroulette.firebaseapp.com",
    projectId: "izcasinoroulette",
    storageBucket: "izcasinoroulette.appspot.com",
    messagingSenderId: "581691954571",
    appId: "1:581691954571:web:e73df3eb4f89218a098b8e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)


export async function start(user) {
    try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        console.log(userDoc.exists())
        if (!userDoc.exists()) {
            // Si el usuario es nuevo, añadirlo con 100 puntos
            await setDoc(userRef, {
                email: user.email,
                displayName: user.displayName,
                points: 100,
                createdAt: new Date(),
            });
            console.log("Nuevo usuario creado con 100 puntos");
        }
            
        } catch (error) {
            console.log('el firestore')
            throw new Error(error)

        }
    }

export async function getPoints(user){
        const userRef = doc(db ,"users" ,user.uid)
        const userSnap = await getDoc(userRef)
        const datos = userSnap.data();
        
        return datos.points
    }

