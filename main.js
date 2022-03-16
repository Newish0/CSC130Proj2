$(() => {
    let mal = new Jikan4();

    // add collapse and expand functionality to nav (bars icon)
    document
        .querySelector("#nav-collap-icon")
        .addEventListener("click", (evt) => {
            document
                .querySelector("#nav-collap-icon")
                .classList.toggle("nav-collap-icon-open");
            document
                .querySelectorAll(
                    "nav .page-nav a:not(:first-child):not(:last-child)"
                )
                .forEach((n) => {
                    n.classList.toggle("nav-show-element");
                });
        });

    // initalize the minimized search button

    $("#min-nav-search-icon").on("click", () => {
        $("#overtop-search").fadeIn(100);
    });

    $(".overtop-x-btn").each((i, obj) => {
        $(obj).on("click", (evt) => {
            $(obj).parent().parent().fadeOut(100);
        });
    });

    $("#nav-search-box").on("focus", () => {    
        $("#nav-search-result").fadeIn(100);
    });

    $("#nav-search-box").on("focusout", () => {
        $("#nav-search-result").fadeOut(100);
    });

    let searchBoxKeyupWait = null;
    $("#nav-search-box").on("keyup", (evt) => {
        if(searchBoxKeyupWait) {
            clearTimeout(searchBoxKeyupWait);
        }
        searchBoxKeyupWait = setTimeout(() => {displayQuickSearch(evt.target.value)}, 400); // wait 400 ms after typing
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

    function displayQuickSearch(query) {
        let animeOut = $(".search-result-anime");
        let mangaOut = $(".search-result-manga");
        let charOut = $(".search-result-character");
        let pplOut = $(".search-result-people");

        const qsAnime = () => {
            // clear current results/ add loader
            animeOut.html('<div class="loader-small"></div>');
            mal.getAnimeSearch({
                q: query,
                limit: 4,
            })
                .then((res) => {
                    animeOut.html(""); // remove loader
                    let data = res.data;
                    for (let x in data) {
                        let imgSrc = data[x].images.webp.small_image_url;
                        let title = data[x].title;
                        let altTitle = data[x].title_english != null ?  data[x].title_english : "";
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

                    if(data.length == 0) {
                        animeOut.html(`<div class="search-result-item">No anime results found.</div>`);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setTimeout(qsAnime, 1000);
                });
        };

        qsAnime();


        const qsManga = () => {
            // clear current results/ add loader
            mangaOut.html('<div class="loader-small"></div>');
            mal.getMangaSearch({
                q: query,
                limit: 4,
            })
                .then((res) => {
                    mangaOut.html(""); // remove loader
                    let data = res.data;
                    for (let x in data) {
                        let imgSrc = data[x].images.webp.small_image_url;
                        let title = data[x].title;
                        let altTitle = data[x].title_english != null ?  data[x].title_english : "";
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

                    if(data.length == 0) {
                        mangaOut.html(`<div class="search-result-item">No anime results found.</div>`);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setTimeout(qsManga, 1000);
                });
        };

        qsManga();
    }
});
