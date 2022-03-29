



import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";



$(() => {




    const auth = getAuth();
    const db = getDatabase();
    let signingUp = false;


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

            console.log("[onAuthStateChanged] User is logged in:")
            console.log(user)

            if(!signingUp) {
                window.location = "../profile";
            }

        } else {
            // User is signed out
            // ...
        }
    });


    $(".signup-btn").on("click", signup);


    // hwo to add user name: https://stackoverflow.com/questions/43509021/how-to-add-username-with-email-and-password-in-firebase
    function signup() {
        let username = $("#user-username").val();
        let email = $("#user-email").val();
        let password = $("#user-password").val();

        signingUp = true;

        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
            console.log("[signup] User is logged in:")
            console.log(user)

            updateProfile(user, {
                displayName: username
            }).then(() => {
                signingUp = false;
                window.location = "../profile";
            });

        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            signingUp = false;

            showErrorMsg(errorMessage + `(${errorCode})`)
        });
    }

    function showErrorMsg(msg) {
        $(".auth-error-msg-box").html(msg);
        $(".auth-error-msg-box").show();
    }
})