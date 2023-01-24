$(() => {
    let mal = new Jikan4();


    initNavSearchBar();
    initClickToShowMore();
    initCustomNumberInput();

    // add collapse and expand functionality to nav (bars icon)
    document.querySelector("#nav-collap-icon").addEventListener("click", (evt) => {
        document.querySelector("#nav-collap-icon").classList.toggle("nav-collap-icon-open");
        document.querySelectorAll(
            "nav .page-nav a:not(:last-child)"
        ).forEach((n) => {
            n.classList.toggle("nav-show-element");
        });
    });

    // initialize the minimized search button
    $("#min-nav-search-icon").on("click", () => {
        $("#overtop-search").css("display", "flex").hide().fadeIn(100); // fadeIn with Flex attr
    });


    // initialize  "X" exit button for overtop boxes
    $(".overtop-x-btn").each((i, obj) => {
        $(obj).on("click", (evt) => {
            $(obj).parent().parent().fadeOut(100);
            enableScroll();
        });
    });

    // initialize exit on clicking outside of overtop boxes
    $(".overtop-x-bg").each((i, obj) => {
        $(obj).on("click", (evt) => {
            if (evt.target !== obj) {
                return;
            }

            $(obj).fadeOut(100);
            enableScroll();
        });
    });

    // initialize navigation search box focus
    $("#nav-search-box").on("focus", () => {
        $("#nav-search-result").fadeIn(100);
    });

    $("#nav-search-box").on("focusout", () => {
        $("#nav-search-result").fadeOut(100);
    });



    function initCustomNumberInput() {
        let wrapper = $(".custom-number-input");
        let plus = wrapper.find($(".plus"));
        let minus = wrapper.find($(".minus"));

        plus.on("click", (evt) => {
            let input = $(evt.target).parent().find($("input[type='number']"));
            let max = parseInt(input.attr("max"));

            if (isNaN(max) || input.val() + 1 <= max) {
                input.val(parseInt(input.val()) + 1);
            }

        });

        minus.on("click", (evt) => {
            let input = $(evt.target).parent().find($("input[type='number']"));
            let min = parseInt(input.attr("min"));


            if (isNaN(min) || input.val() - 1 >= min) {
                input.val(parseInt(input.val()) - 1);
            }
        });

    }


    function initNavSearchBar() {
        // nav search box auto search on stop typing
        let searchBoxKeyupWait = null;
        $("#nav-search-box, #overtop-search-box").on("keyup", (evt) => {
            if (searchBoxKeyupWait) {
                clearTimeout(searchBoxKeyupWait);
            }
            searchBoxKeyupWait = setTimeout(() => { displayQuickSearch(evt.target.value) }, 400); // wait 400 ms after typing
        });
    }

    function initClickToShowMore() {
        $(".hide-rest-container").each(() => {
            $(this) > $(".click-to-show-more").on("click", (evt) => {
                if (evt.target.parentElement != null) {
                    evt.target.parentElement.classList.remove("hide-rest");
                }
                evt.target.remove();
            });
        });
    }


    setSearchBarsToSync();

    function setSearchBarsToSync() {
        let navSearchBar = $("#nav-search-box");
        let overtopSearchBar = $("#overtop-search-box");
        navSearchBar.on("keyup", (evt) => {
            overtopSearchBar.val(navSearchBar.val());
        });

        overtopSearchBar.on("keyup", (evt) => {
            navSearchBar.val(overtopSearchBar.val());
        });
    }

    // stores the latest search id, and ignore older searches
    // for conflicting search results under slow network
    let searchID = "";

    function displayQuickSearch(query) {
        let animeOut = $(".search-result-anime");
        let mangaOut = $(".search-result-manga");
        let charOut = $(".search-result-character");
        let pplOut = $(".search-result-people");

        let currentSearchID = Math.random().toString(16).slice(2);

        searchID = currentSearchID;

        if (query == "") {
            animeOut.html(""); // remove all
            mangaOut.html(""); // remove all
            charOut.html(""); // remove all
            pplOut.html(""); // remove all
            return;
        }


        // ** anime search **

        // clear current result and add heading
        animeOut.html("<h5>Anime</h5>");

        // add loader
        animeOut.append('<div class="loader-small"></div>');

        mal.getAnimeSearch({
            q: query,
            limit: 4
        }).then((res) => {

            // only show results if result matches ID
            // aka only show when results are the latest
            if (searchID == currentSearchID) {
                animeOut.find($(".loader-small")).remove(); // remove loader
                let data = res.data;
                for (let x in data) {
                    let imgSrc = data[x].images.webp.small_image_url;
                    let title = data[x].title;
                    let altTitle = data[x].title_english != null ? data[x].title_english : "";
                    let id = data[x].mal_id;

                    let htmlText = `
                        <div class="search-result-item">
                        <img src="${imgSrc}">
                       
                        <div>
                            <a href="/CSC130Proj2/anime/?id=${id}">${title}</a>
                            <div class="text-alt">${altTitle}</div>
                        </div>         
                        
                        </div>
                    `;
                    animeOut.append(htmlText);
                }

                if (data.length == 0) {
                    animeOut.append(`<div class="margin-small">No anime results found.</div>`);
                }
            }
        }).catch((err) => {
            console.error(err);
        });


        // ** manga search **

        // clear current result and add heading
        mangaOut.html("<h5>Manga</h5>");

        // add loader 
        mangaOut.append('<div class="loader-small"></div>');

        mal.getMangaSearch({
            q: query,
            limit: 4
        }).then((res) => {

            // only show results if result matches ID
            // aka only show when results are the latest
            if (searchID == currentSearchID) {
                mangaOut.find($(".loader-small")).remove(); // remove loader
                let data = res.data;
                for (let x in data) {
                    let imgSrc = data[x].images.webp.small_image_url;
                    let title = data[x].title;
                    let altTitle = data[x].title_english != null ? data[x].title_english : "";
                    let id = data[x].mal_id;

                    let htmlText = `
                            <div class="search-result-item">
                            <img src="${imgSrc}">
                            
                            <div>
                                <a href="/CSC130Proj2/manga/?id=${id}">${title}</a>
                                <div class="text-alt">${altTitle}</div>
                            </div>
                                
                            
                            </div>
                        `;
                    mangaOut.append(htmlText);
                }

                if (data.length == 0) {
                    mangaOut.append(`<div class="margin-small">No manga results found.</div>`);
                }
            }
        }).catch((err) => {
            console.error(err);
        });



        // ** Character search **

        // clear current result and add heading
        charOut.html("<h5>Character</h5>");

        // add loader 
        charOut.append('<div class="loader-small"></div>');

        mal.getCharactersSearch({
            q: query,
            limit: 4
        }).then((res) => {

            // only show results if result matches ID
            // aka only show when results are the latest
            if (searchID == currentSearchID) {
                charOut.find($(".loader-small")).remove(); // remove loader
                let data = res.data;
                for (let x in data) {
                    let imgSrc = data[x].images.webp.small_image_url;
                    let name = data[x].name;
                    let nameKanji = data[x].name_kanji != null ? data[x].name_kanji : "";
                    let id = data[x].mal_id;

                    let htmlText = `
                            <div class="search-result-item">
                            <img src="${imgSrc}">
                            
                            <div>
                                <a href="/CSC130Proj2/character/?id=${id}">${name}</a>
                                <div class="text-alt">${nameKanji}</div>
                            </div>
                                
                            </div>
                        `;
                    charOut.append(htmlText);
                }

                if (data.length == 0) {
                    charOut.append(`<div class="margin-small">No character results found.</div>`);
                }
            }
        }).catch((err) => {
            console.error(err);
        });



        // ** people search **

        // clear current result and add heading
        pplOut.html("<h5>People</h5>");

        // add loader 
        pplOut.append('<div class="loader-small"></div>');

        mal.getPeopleSearch({
            q: query,
            limit: 4
        }).then((res) => {

            // only show results if result matches ID
            // aka only show when results are the latest
            if (searchID == currentSearchID) {
                pplOut.find($(".loader-small")).remove(); // remove loader
                let data = res.data;
                for (let x in data) {
                    let imgSrc = data[x].images.jpg.image_url;
                    let name = data[x].name;
                    let nameKanji = data[x].given_name != null && data[x].family_name != null ? data[x].family_name + data[x].given_name : "";
                    let id = data[x].mal_id;

                    let htmlText = `
                            <div class="search-result-item">
                            <img src="${imgSrc}">
                            
                            <div>
                                <a href="/CSC130Proj2/character/?id=${id}">${name}</a>
                                <div class="text-alt">${nameKanji}</div>
                            </div>
                                
                            </div>
                        `;
                    pplOut.append(htmlText);
                }

                if (data.length == 0) {
                    pplOut.append(`<div class="margin-small">No people results found.</div>`);
                }
            }
        }).catch((err) => {
            console.error(err);
        });

    }
});


function display404() {
    displayErrorPage(404);
}

function displayErrorPage(code) {

    let html = "";

    fetch("/CSC130Proj2/assets/error.svg").then(res => res.text()).then(text => {
        html = `    
        <div class="container margin-v-large">
            ${text}
        </div>`;

        document.querySelector("main").innerHTML = html;
        document.querySelector("#error-msg").innerHTML = code;
    });

}

function disableScroll() {
    $("html, body").css({
        overflow: "hidden",
        height: "100%"
    });
}
function enableScroll() {
    $("html, body").css({
        overflow: "auto",
        height: "auto"
    });
}