
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
//import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyADmtFOtMf7eDr8RzZ8ES-9iCMf5ywyjao",
    authDomain: "izcasinoroulette.firebaseapp.com",
    projectId: "izcasinoroulette",
    storageBucket: "izcasinoroulette.appspot.com",
    messagingSenderId: "581691954571",
    appId: "1:581691954571:web:e73df3eb4f89218a098b8e"
    };

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


auth.languageCode="es"

export async function login(){
    try {
        const response = await signInWithPopup(auth, provider)
        console.log(response)
        return response.user
    } catch (error) {
        console.log(error)
        throw new Error(error);       
    }
}

export function logout() {
    signOut(auth) // <-- Corrección: Usar signOut correctamente
        .then(() => {
            //console.log("Usuario desconectado");
        })
        .catch((error) => {
            console.error(error);
        });
}

