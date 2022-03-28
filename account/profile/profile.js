



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


            if (displayName != null && displayName.indexOf(" ") != -1) {
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

            displayUserWatchingList(user);
            displayUserReadingList(user);

        } else {
            // User is signed out
            window.location = "../signin";
        }
    });


    async function displayUserWatchingList(user) {
        const dataRef = ref(db, `users/${user.uid}/watchinglist`);

        get(dataRef).then((snapshot) => {
            let watchingListContainer = $("#anime-container");

            if (snapshot.exists()) {
                const data = snapshot.val();

                watchingListContainer.html(""); // clear loader

                // generate sections
                watchingListContainer.append('<h4>Watching</h4><div class="auto-gallery justify-start align-items-start margin-v-small" id="wl-watching"></div><br>');
                watchingListContainer.append('<h4>Completed</h4><div class="auto-gallery justify-start align-items-start margin-v-small" id="wl-completed"></div><br>');
                watchingListContainer.append('<h4>Considering</h4><div class="auto-gallery justify-start align-items-start margin-v-small" id="wl-considering"></div><br>');
                watchingListContainer.append('<h4>On Hold</h4><div class="auto-gallery justify-start align-items-start margin-v-small" id="wl-hold"></div><br>');
                watchingListContainer.append('<h4>Dropped</h4><div class="auto-gallery justify-start align-items-start margin-v-small" id="wl-dropped"></div><br>');

                let watchingContainer = $("#wl-watching");
                let completedContainer = $("#wl-completed");
                let consideringContainer = $("#wl-considering");
                let holdContainer = $("#wl-hold");
                let droppedContainer = $("#wl-dropped");


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
                            statusClass = "hiatus";
                            break;
                        case "dropped":
                            statusClass = "dropped";
                            break;
                        default: // status == "none"
                            continue;
                    }


                    let thisScore = data[id].score;

                    if (data[id].score == -1) {
                        thisScore = "n/a"
                    }

                    let htmlTxt = `
                    <div class="role-card">
                    <div class="min-box size-m">
                        <img src="${data[id].cover}" alt="image of ${data[id].title}" loading="lazy">
                        <a href="../../anime/?id=${id}">${data[id].title} - <i class="fa-solid fa-star margin-h-small"></i>${thisScore} (You)</a> 
                        <div class="status-${statusClass} status"></div>
                    </div>
                    `;

                    switch (data[id].status) {
                        case "watching":
                            watchingContainer.append(htmlTxt);
                            break;
                        case "completed":
                            completedContainer.append(htmlTxt);
                            break;
                        case "considering":
                            consideringContainer.append(htmlTxt);
                            break;
                        case "hold":
                            holdContainer.append(htmlTxt);
                            break;
                        case "dropped":
                            droppedContainer.append(htmlTxt);
                            break;
                    }
                }


                if(watchingContainer.html() == "") {
                    watchingContainer.append("<p>You have none here! Go add some.</p>");
                }

                if(completedContainer.html() == "") {
                    completedContainer.append("<p>You have none here! Go add some.</p>");
                }

                if(consideringContainer.html() == "") {
                    consideringContainer.append("<p>You have none here! Go add some.</p>");
                }

                if(holdContainer.html() == "") {
                    holdContainer.append("<p>You have none here! Go add some.</p>");
                }

                if(droppedContainer.html() == "") {
                    droppedContainer.append("<p>You have none here! Go add some.</p>");
                }


            } else {
                watchingListContainer.html("<p>You have none here! Go add some.</p>");
            }
        }).catch((error) => {
            console.error(error);
        });
    }




    async function displayUserReadingList(user) {
        const dataRef = ref(db, `users/${user.uid}/readinglist`);

        get(dataRef).then((snapshot) => {
            let readingListContainer = $("#manga-container");

            if (snapshot.exists()) {
                const data = snapshot.val();

                readingListContainer.html(""); // clear loader

                // generate sections
                readingListContainer.append('<h4>Reading</h4><div class="auto-gallery justify-start align-items-start margin-v-small" id="rl-watching"></div><br>');
                readingListContainer.append('<h4>Completed</h4><div class="auto-gallery justify-start align-items-start margin-v-small" id="rl-completed"></div><br>');
                readingListContainer.append('<h4>Considering</h4><div class="auto-gallery justify-start align-items-start margin-v-small" id="rl-considering"></div><br>');
                readingListContainer.append('<h4>On Hold</h4><div class="auto-gallery justify-start align-items-start margin-v-small" id="rl-hold"></div><br>');
                readingListContainer.append('<h4>Dropped</h4><div class="auto-gallery justify-start align-items-start margin-v-small" id="rl-dropped"></div><br>');

                let readingContainer = $("#rl-watching");
                let completedContainer = $("#rl-completed");
                let consideringContainer = $("#rl-considering");
                let holdContainer = $("#rl-hold");
                let droppedContainer = $("#rl-dropped");


                for (let id in data) {

                    let statusClass = "considering";

                    switch (data[id].status) {
                        case "reading":
                            statusClass = "ongoing";
                            break;
                        case "completed":
                            statusClass = "completed";
                            break;
                        case "considering":
                            statusClass = "considering";
                            break;
                        case "hold":
                            statusClass = "hiatus";
                            break;
                        case "dropped":
                            statusClass = "dropped";
                            break;
                        default: // status == "none"
                            continue;
                    }


                    let thisScore = data[id].score;

                    if (data[id].score == -1) {
                        thisScore = "n/a"
                    }

                    let htmlTxt = `
                    <div class="role-card">
                    <div class="min-box size-m">
                        <img src="${data[id].cover}" alt="image of ${data[id].title}" loading="lazy">
                        <a href="../../manga/?id=${id}">${data[id].title} - <i class="fa-solid fa-star margin-h-small"></i>${thisScore} (You)</a> 
                        <div class="status-${statusClass} status"></div>
                    </div>
                    `;

                    switch (data[id].status) {
                        case "reading":
                            readingContainer.append(htmlTxt);
                            break;
                        case "completed":
                            completedContainer.append(htmlTxt);
                            break;
                        case "considering":
                            consideringContainer.append(htmlTxt);
                            break;
                        case "hold":
                            holdContainer.append(htmlTxt);
                            break;
                        case "dropped":
                            droppedContainer.append(htmlTxt);
                            break;
                    }
                }


                if(readingContainer.html() == "") {
                    readingContainer.append("<p>You have none here! Go add some.</p>");
                }

                if(completedContainer.html() == "") {
                    completedContainer.append("<p>You have none here! Go add some.</p>");
                }

                if(consideringContainer.html() == "") {
                    consideringContainer.append("<p>You have none here! Go add some.</p>");
                }

                if(holdContainer.html() == "") {
                    holdContainer.append("<p>You have none here! Go add some.</p>");
                }

                if(droppedContainer.html() == "") {
                    droppedContainer.append("<p>You have none here! Go add some.</p>");
                }


            } else {
                readingListContainer.html("<p>You have none here! Go add some.</p>");
            }
        }).catch((error) => {
            console.error(error);
        });
    }





    function logout() {
        signOut(auth).then(() => {
            window.location = "../signin"
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