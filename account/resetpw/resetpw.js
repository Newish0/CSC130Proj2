



import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";










$(() => {




    const auth = getAuth();


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

            window.location = "../profile";

        } else {
            // User is signed out
            // ...
        }
    });


    $(".reset-btn").on("click", resetPassword);


    function resetPassword() {
        let email = $("#user-email").val();

        if($("#user-email").is(":invalid")) {
            showErrorMsg("Email provided is not valid.")
            return;
        }

        sendPasswordResetEmail(auth, email).then(() => {
            let htmlText = `
            <h1>Reset Password</h1>
            <div class="auth-msg-box successe">A recovery link has been sent. Please check your email to reset your password.</div>
            <a class="large-btn inverted text-center w-100 margin-v-large block box" href="../signin/">Return to sign in</a>
            `
            $("#reset-form").html(htmlText);
            $(".auth-msg-box").show();
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log(error)

            showErrorMsg(errorMessage + `(${errorCode})`)
        });
    }

    function showErrorMsg(msg) {
        $(".auth-error-msg-box").html(msg);
        $(".auth-error-msg-box").show();
    }
})