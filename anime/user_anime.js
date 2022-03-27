import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import { getDatabase, ref, set, onValue, child, get, remove, update } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";

$(() => {

    // -------------------------------------------------------------------------
    // Firebase related
    // -------------------------------------------------------------------------

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    let mal = new Jikan4();
    let animeID = params.id;


    const auth = getAuth();
    const db = getDatabase();



    // When user logged in or out
    // or when page load
    // check whether the user is logged in or out
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            const uid = user.uid;
            const displayName = user.displayName;
            const email = user.email;
            const photoURL = user.photoURL;
            const emailVerified = user.emailVerified;

            console.log("[Anime onAuthStateChanged] User is logged in:");

            generateUserProgressForm().then(() => {
                // sync input form with user DB 

                const dataRef = ref(db, `users/${user.uid}/watchinglist/${animeID}`);

                get(dataRef).then((snapshot) => {
                    console.log(snapshot.val());
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        $("#user-score").val(data.score);
                        $("#user-set-as").val(data.status);
                        $(`#user-nav-progress-ep-${data.progress}`).prop("checked", true);

                        updateQuickMenuWithData(data);

                    } else {
                        console.log("No data available");
                    }
                }).catch((error) => {
                    console.error(error);
                });
            });

            initQuickAccessMenu(user);
        } else {
            console.log("[Anime onAuthStateChanged] User not logged in:");

            initQuickAccessMenu();
        }
    });


    async function updateUserProgressAndScore(user, list, contentID) {
        let userScore = $("#user-score").val();
        let userStatus = $("#user-set-as").val();
        let userProgress = $("#user-progress-out input[name='user-nav-progress']:checked").val();

        const dataRef = ref(db, `users/${user.uid}/${list}/${contentID}`);

        userScore = userScore == null || userScore == undefined ? -1 : userScore;
        userStatus = userStatus == null || userStatus == undefined ? "none" : userStatus;
        userProgress = userProgress == null || userProgress == undefined ? 0 : userProgress;

        if (userScore != -1 && userStatus == "none") {
            userStatus = "watching";
        }



        get(dataRef).then((snapshot) => {
            let sendObj = {};
            if (snapshot.exists()) {
                const data = snapshot.val();
                sendObj = {
                    progress: parseInt(userProgress),
                    score: parseInt(userScore),
                    status: userStatus
                }
                update(ref(db, `users/${user.uid}/${list}/${contentID}`), sendObj);
                updateQuickMenuWithData(sendObj);
            } else if (userScore != -1 || userStatus != "" || userProgress != 0) {
                let animeTitle = null;
                let animeCover = null;
                let data = mal.getAnimeById(animeID).then(res => {
                    data = res.data;

                    animeCover = data.images.webp.image_url;
                    animeTitle = data.title;

                    sendObj = {
                        progress: parseInt(userProgress),
                        score: parseInt(userScore),
                        status: userStatus,
                        title: animeTitle,
                        cover: animeCover,
                        timeAdded: new Date().getTime()
                    }
                    set(ref(db, `users/${user.uid}/${list}/${contentID}`), sendObj);
                    updateQuickMenuWithData(sendObj);
                });
            }
            
        }).catch((error) => {
            console.error(error);
        });
    }

    function updateQuickMenuWithData(data) {
        if (data.score != -1) {
            $(".user-set-score").html(`<i class="fa-solid fa-star margin-h-small"></i> ${data.score}`);
        }

        if (data.status != "none") {

            let statusBtnInfoHTML = `<i class="fa-solid fa-list-ul margin-h-small"></i> ${data.status[0].toUpperCase()}${data.status.substring(1, data.status.length)}`;

            if (data.progress != 0) {
                statusBtnInfoHTML += ` (${data.progress})`;
            }

            $(".user-add-current").html(statusBtnInfoHTML);


        } else {
            $(".user-add-current").html(`<i class="fa-solid fa-list-ul margin-h-small"></i> Add to List`);
        }
    }

    function removeFromList(user, list, contentID) {
        const dataRef = ref(db, `users/${user.uid}/${list}/${contentID}`);

        remove(dataRef).then(() => window.location = window.location);
    }


    function initQuickAccessMenu(user) {
        if (user != undefined) {
            $(".user-remove-from-list").on("click", (evt) => {
                removeFromList(user, "watchinglist", animeID);
            });

            $(".user-add-current").on("click", (evt) => {
                $("#overtop-add-current").css("display", "flex").hide().fadeIn(100); // fadeIn with Flex attr
                disableScroll();
            });

            $(".user-set-score").on("click", (evt) => {
                $("#overtop-set-score").css("display", "flex").hide().fadeIn(100); // fadeIn with Flex attr
                disableScroll();
            });

            $(".sync-on-click").each((i, obj) => {
                $(obj).on("click", (evt) => {
                    if (evt.target !== obj) {
                        return;
                    }
                    updateUserProgressAndScore(user, "watchinglist", animeID);
                });
            });

        } else {
            $(".user-add-current").on("click", (evt) => {
                window.location = "/account/signin";
            });

            $(".user-set-score").on("click", (evt) => {
                window.location = "/account/signin";
            });
        }
    }

    async function generateUserProgressForm() {
        let data = await mal.getAnimeById(animeID);
        data = data.data;

        // generate user progress form based on episodes count
        let progressOut = $("#user-progress-out");
        let progressHTML = "";

        if (!data.episodes) {
            data = await mal.getAnimeEpisodes(animeID);
            data = data.data;

            progressHTML += generateUserProgressFormFromData(data);

            while (mal.hasNextPage()) {
                data = await mal.getMore();
                data = data.data;
                progressHTML += generateUserProgressFormFromData(data);
            }
        } else {
            for (let i = 1; i <= data.episodes; i++) {
                let htmlTxt = `
                    <span>      
                        <input class="user-progress-radio" type="radio" name="user-nav-progress" value="${i}" id="user-nav-progress-ep-${i}">
                        <label class="unselectable" for="user-nav-progress-ep-${i}">${i}</label>
                    </span>
                `;
                progressHTML += htmlTxt;
            }
        }


        progressOut.html(progressHTML); // clear loader & add content
    }

    function generateUserProgressFormFromData(data) {
        let htmlReturn = "";

        for (let i = 0; i < data.length; i++) {
            let epCount = data[i].mal_id;
            let htmlTxt = `
                <span>      
                    <input class="user-progress-radio" type="radio" name="user-nav-progress" value="${epCount}" id="user-nav-progress-ep-${epCount}">
                    <label class="unselectable" for="user-nav-progress-ep-${epCount}">${epCount}</label>
                </span>
            `;
            htmlReturn += htmlTxt;
        }
        return htmlReturn;
    }


});