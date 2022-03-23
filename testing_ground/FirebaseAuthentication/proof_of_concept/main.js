

import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import { getDatabase, ref, set, onValue} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";



// const db = getDatabase();

const auth = getAuth();


document.querySelector("#save-data").addEventListener("click", writeUserDataFromTextarea);
document.querySelector("#get-data").addEventListener("click", getCurrentUserData);


function writeUserDataFromTextarea() {
    writeUserData(document.querySelector("textarea").value);
}



function writeUserData(data) {
    const userId = auth.currentUser.uid;
    const db = getDatabase();
    // set(ref(db, 'users/'), {
    //     someTextData: data
    // });
    let someID = parseInt(Math.random() * 100000);
    set(ref(db, 'users/' + userId + '/' + someID + '/someTextData'), data);
}

function getCurrentUserData(){
    const userId = auth.currentUser.uid;
    getUserData(userId);
    
}

async function getUserData(userId) {
    const db = getDatabase();
    const dataRef = ref(db, 'users/' + userId);
    return await onValue(dataRef, (snapshot) => {
        console.log(snapshot)
        const data = snapshot.val();
        console.log("User data: ")
        console.log(data)
        document.querySelector("#some-text-data").value = JSON.stringify(data, null, 4);
        return data;
    });
}




// When user logged in or out 
// or when page load
// check whether the use is logged in or out
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        const displayName = user.displayName;
        const email = user.email;
        const photoURL = user.photoURL;
        const emailVerified = user.emailVerified;
        console.log(user)

        document.querySelector("#login-form").style.display = "none";
        document.querySelector("#loggedin-stuff").style.display = "block";
        document.querySelector("#greeting").innerText = `Hello ${displayName}!`;

        document.querySelector("#your-info").innerHTML = `
            
            Name:${displayName}
            <br>
            Email:${email}
            <br>
            ID: ${uid}
        `;

        // ...
    } else {
        // User is signed out
        // ...
    }
});


// addevent listener
document.querySelector("#login-btn").addEventListener("click", login);
document.querySelector("#logout-btn").addEventListener("click", logout);
document.querySelector("#signup-btn").addEventListener("click", signup);

// hwo to add user name: https://stackoverflow.com/questions/43509021/how-to-add-username-with-email-and-password-in-firebase
function signup() {
    let email = document.querySelector("#user-email").value;
    let password = document.querySelector("#user-password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
            console.log(user)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            showErrorMsg(errorMessage + `(${errorCode})`)
        });
}

function showErrorMsg(msg) {
    document.querySelector("#error-msg").innerText = msg;
}

function login() {
    let email = document.querySelector("#user-email").value;
    let password = document.querySelector("#user-password").value;


    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            showErrorMsg(errorMessage + `(${errorCode})`)
        });
}

function logout() {
    signOut(auth).then(() => {
        document.querySelector("#login-form").style.display = "block";
        document.querySelector("#loggedin-stuff").style.display = "none";
    }).catch((error) => {
        // An error happened.
    });
}