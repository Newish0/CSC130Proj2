$(() => {
    let mal = new Jikan4();

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
        });
    });

    // initialize exit on clicking outside of overtop boxes
    $(".overtop-x-bg").each((i, obj) => {
        $(obj).on("click", (evt) => {
            if (evt.target !== obj) {
                return;
            }

            $(obj).fadeOut(100);
        });
    });

    // initialize navigation search box focus
    $("#nav-search-box").on("focus", () => {
        $("#nav-search-result").fadeIn(100);
    });

    $("#nav-search-box").on("focusout", () => {
        $("#nav-search-result").fadeOut(100);
    });
  

    // nav search box auto search on stop typing
    let searchBoxKeyupWait = null;
    $("#nav-search-box, #overtop-search-box").on("keyup", (evt) => {
        if (searchBoxKeyupWait) {
            clearTimeout(searchBoxKeyupWait);
        }
        searchBoxKeyupWait = setTimeout(() => { displayQuickSearch(evt.target.value) }, 400); // wait 400 ms after typing
    });
    

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

        // TMP TODO
        charOut.html("<h5>Character</h5>");
        pplOut.html("<h5>People</h5>");

        const qsAnime = () => {
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
                    animeOut > $(".loader-small").remove(); // remove loader
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
                            <a href="/anime/?id=${id}">${title}</a>
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
                if (err == "Jikan4 API errored with response: 429") {
                    setTimeout(qsAnime, 1000);
                } else {
                    console.error(err);
                }
            });
        }

        qsAnime();


        const qsManga = () => {
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
                    mangaOut > $(".loader-small").remove(); // remove loader
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
                                <a href="/manga/?id=${id}">${title}</a>
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
                if (err == "Jikan4 API errored with response: 429") {
                    setTimeout(qsManga, 1000);
                } else {
                    console.error(err);
                }
            });
        }

        qsManga();
    }
});
