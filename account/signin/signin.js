



import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";









$(() => {




    const auth = getAuth();
    const db = getDatabase();


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



            window.location = "../profile";

        } else {
            // User is signed out
            // ...
        }
    });


    $(".signin-btn").on("click", signin);



    function signin() {
        let email = $("#user-email").val();
        let password = $("#user-password").val();

        // handle some error to limit error given by Firebase
        if($("#user-email").is(":invalid")) {
            showErrorMsg("Email entered is not valid.")
            return;
        }

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

    function showErrorMsg(msg) {
        $(".auth-error-msg-box").html(msg);
        $(".auth-error-msg-box").show();
    }
})