



import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import { getDatabase, ref, set, onValue, child, get, remove } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";









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

            $("#join-date").html(new Date(parseInt(user.metadata.createdAt)).toLocaleDateString())

            displayUserLists(user);

        } else {
            // User is signed out
            window.location = "/account/signin";
        }
    });


    async function displayUserLists(user) {
        const dataRef = ref(db, `users/${user.uid}/watchinglist`);

        get(dataRef).then((snapshot) => {
            console.log(snapshot.val());
            if (snapshot.exists()) {
                const data = snapshot.val();

                let watchingListContainer = $("#anime-container");

                console.log(data)

                watchingListContainer.html("");

                for (let id in data) {

                    let statusClass = "considering";

                    switch (data[id].status) {
                        case "watching":
                            statusClass = "ongoing";
                            break;
                        case "completed":
                            statusClass = "completed";
                            break;
                        case "considering":
                            statusClass = "considering";
                            break;
                        case "hold":
                            statusClass = "haitus";
                            break;
                        case "dropped":
                            statusClass = "dropped";
                            break;
                    }
                    
                    // TODO  tmp solution
                    if(data[id].status == "none") {
                        return;
                    } 

                    let thisScore = data[id].score;

                    if(data[id].score == -1) {
                        thisScore = "n/a"
                    }


                    let htmlTxt = `
                    <div class="role-card">
                    <div class="min-box size-m">
                        <img src="${data[id].cover}" alt="image of ${data[id].title}" loading="lazy">
                        <a href="/anime/?id=${id}">${data[id].title} - <i class="fa-solid fa-star margin-h-small"></i>${thisScore} (You)</a> 
                        <div class="status-${statusClass} status"></div>
                    </div>
                    `;

                    watchingListContainer.append(htmlTxt);
                }


            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }



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