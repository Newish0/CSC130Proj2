import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import { getDatabase, ref, set, onValue, child, get, remove, update } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";

$(() => {

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    let mal = new Jikan4();
    let mangaID = params.id;


    // -------------------------------------------------------------------------
    // Firebase related
    // -------------------------------------------------------------------------
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


            // sync input form with user DB 

            const dataRef = ref(db, `users/${user.uid}/readinglist/${mangaID}`);

            get(dataRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    $("#user-score").val(data.score);
                    $("#user-set-as").val(data.status);

                    $(`#user-nav-progress-chapter`).val(data.progress.chapter);
                    $(`#user-nav-progress-volume`).val(data.progress.volume);

                    updateQuickMenuWithData(data);

                } 
            }).catch((error) => {
                console.error(error);
            });


            initQuickAccessMenu(user);
        } else {

            initQuickAccessMenu();
        }
    });


    async function updateUserProgressAndScore(user, list, contentID) {
        let userScore = $("#user-score").val();
        let userStatus = $("#user-set-as").val();
        let userProgressChapter = $("#user-progress-chapter").val();
        let userProgressVolume = $("#user-progress-volume").val();

        const dataRef = ref(db, `users/${user.uid}/${list}/${contentID}`);

        userScore = userScore == null || userScore == undefined ? -1 : userScore;
        userStatus = userStatus == null || userStatus == undefined ? "none" : userStatus;
        userProgressChapter = userProgressChapter == null || userProgressChapter == undefined ? 0 : userProgressChapter;
        userProgressVolume = userProgressVolume == null || userProgressVolume == undefined ? 0 : userProgressVolume;

        if (userScore != -1 && userStatus == "none") {
            userStatus = "reading";
        }




        get(dataRef).then((snapshot) => {
            let sendObj = {};
            if (snapshot.exists()) {
                const data = snapshot.val();
                sendObj = {
                    progress: {
                        chapter: parseInt(userProgressChapter),
                        volume: parseInt(userProgressVolume)
                    },
                    score: parseInt(userScore),
                    status: userStatus
                }
                update(ref(db, `users/${user.uid}/${list}/${contentID}`), sendObj);
                updateQuickMenuWithData(sendObj);
            } else if (userScore != -1 || userStatus != "" || userProgressChapter != 0 || userProgressVolume != 0) {
                let mangaTitle = null;
                let mangaCover = null;
                
                let data = mal.getMangaById(mangaID).then(res => {
                    data = res.data;

                    mangaCover = data.images.webp.image_url;
                    mangaTitle = data.title;

                    sendObj = {
                        progress: {
                            chapter: parseInt(userProgressChapter),
                            volume: parseInt(userProgressVolume)
                        },
                        score: parseInt(userScore),
                        status: userStatus,
                        title: mangaTitle,
                        cover: mangaCover,
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

    function updateQuickMenuWithData (data) {
        if (data.score != -1) {
            $(".user-set-score").html(`<i class="fa-solid fa-star margin-h-small"></i> ${data.score}`);
        }

        if (data.status != "none") {
            
            let statusBtnInfoHTML = `<i class="fa-solid fa-list-ul margin-h-small"></i> ${data.status[0].toUpperCase()}${data.status.substring(1, data.status.length)}`;

            if (data.progress != 0) {
                statusBtnInfoHTML += ` (${data.progress.chapter}ch, ${data.progress.volume}v)`;
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
                removeFromList(user, "readinglist", mangaID);
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
                    updateUserProgressAndScore(user, "readinglist", mangaID);
                });
            });

        } else {
            $(".user-add-current").on("click", (evt) => {
                window.location = "/CSC130Proj2/account/signin";
            });

            $(".user-set-score").on("click", (evt) => {
                window.location = "/CSC130Proj2/account/signin";
            });
        }
    }

});