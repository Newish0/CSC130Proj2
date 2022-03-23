



import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";









$(() => {




    const auth = getAuth();
    const db = getDatabase();


    $(".signout-btn").on("click", logout)


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

            $(".simple-split *").fadeIn(100);


            // auto generate a user profile img; tmp solution
            let avatarText = "";

            if (displayName.indexOf(" ") != -1) {
                let split = displayName.split(" ");
                avatarText = split[0][0] + split[1][0];
            } else {
                avatarText = displayName[0] + displayName[1];
            }

            $("#picture").attr("src", generateAvatar(avatarText, "#fff", "rgb(238, 66, 102)"));
            $("#name").html(displayName);

            $("#email").html(email);
            $("#uid").html(uid);

            console.log(user.metadata.createdAt)

            $("#join-date").html(new Date(parseInt(user.metadata.createdAt)).toLocaleDateString())



        } else {
            // User is signed out
            window.location = "/account/signin";
        }
    });


    function logout() {
        signOut(auth).then(() => {
            window.location = "/account/signin"
        }).catch((error) => {
            // An error happened.
        });
    }


    function generateAvatar(text, foregroundColor, backgroundColor) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = 256;
        canvas.height = 256;

        // Draw background
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw text
        context.font = "bold 100px 'Lucida Sans'";
        context.fillStyle = foregroundColor;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        return canvas.toDataURL("image/png");
    }



})