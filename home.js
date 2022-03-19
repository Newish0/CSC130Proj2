$(() => {
    let mal = new Jikan4();
    let loadingMore = true;

    hideLoadMore();
    initSuggestions();


    // load suggestions
    mal.getSeasonNow().then(res => {
        let selection = [];
        let animeSelection = [];
        const numSelection = 5;
        let dataConcat = res.data;

        mal.getTopAnime().then(topRes => {
            dataConcat = dataConcat.concat(topRes.data);


            for (let i = 0; i < numSelection; i++) {
                while (true) {
                    let n = parseInt(getRandomArbitrary(0, dataConcat.length));
                    if (!selection.includes(n)) {
                        selection.push(n);
                        break;
                    }
                }
            }


            for (let i = 0; i < numSelection; i++) {
                animeSelection.push(dataConcat[selection[i]]);
            }


            clearSuggestionsDisplay();
            displaySuggestions(animeSelection);

        });



    }).catch(err => {
        console.error(err);
    });


    // load seasonal
    mal.getSeasonNow().then(res => {
        loadingMore = false;
        clearSeasonDisplay();
        displaySeason(res.data);
        armLoadMoreBtn();

    }).catch(err => {
        console.error(err);
    });


    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    function clearSuggestionsDisplay() {
        $(".suggestion-item").remove();
        $(".indicator-dot").remove();
    }

    function displaySuggestions(data) {
        let suggestionCon = $(".suggestion-container");
        let indicatorDotContainer  = $(".indicator-dot-container ");

        for (let x in data) {
            let title = data[x].title;
            let altTitle = data[x].title_english == null ? "" : data[x].title_english;
            let imgSrc = data[x].images.webp.image_url;
            let id = data[x].mal_id;
            let synopsis = data[x].synopsis;



            let tagsHTML = "";
            for (let i in data[x].genres) {
                let tag = `
                <a class="tag clean-url" 
                href="/search/anime/?genre=${data[x].genres[i].mal_id}~${encodeURIComponent(data[x].genres[i].name)}">
                ${data[x].genres[i].name}
                </a>
            `;
                tagsHTML += tag;
            }

            let themesHTML = "";
            for (let i in data[x].themes) {
                let tag = `
                <a class="tag clean-url" 
                href="/search/anime/?genre=${data[x].themes[i].mal_id}~${encodeURIComponent(data[x].themes[i].name)}">
                ${data[x].themes[i].name}
                </a>
            `;
                themesHTML += tag;
            }


            let html = `
            <div class="suggestion-item center auto-gallery align-items-center justify-evenly w-100">
            <div class="w-50 margin-large">
                <h1>${title}</h1>
                <h3>${altTitle}</h3>
                <div class="margin-v-large">
                    ${tagsHTML}
                    ${themesHTML}
                </div>
                <div>${synopsis}</div>
                <br>
                <br>
                <br>
                <a class="block clean-url text-center w-100 large-btn" href="/anime?id=${id}">View</a>
            </div>

            <img class="w-25 rounded-corner-full" src="${imgSrc}"
                alt="${title} cover image">
            </div>`;

            suggestionCon.append(html);

            indicatorDotContainer.append('<div class="indicator-dot"></div>');
        }

        initSuggestions();
    }



    function initSuggestions() {
        $(".suggestion-container .suggestion-item").hide();
        $(".suggestion-container .suggestion-item").first().show();

        $(".suggestion-container .indicator-dot").removeClass("indicator-dot-active");
        $(".suggestion-container .indicator-dot").first().addClass("indicator-dot-active");


        $(".indicator-dot").each((i, eln) => {
            $(eln).on("click", () => { showSuggestions(i) });
        });

        $(".suggestion-prev").on("click", () => {
            let i = $(".indicator-dot-active").index();
            if (i == 0) {
                i = $(".indicator-dot").last().index();
            } else {
                i--;
            }

            showSuggestions(i, "right");
        });

        $(".suggestion-next").on("click", () => {
            let i = $(".indicator-dot-active").index();
            if (i == $(".indicator-dot").length - 1) {
                i = $(".indicator-dot").first().index();
            } else {
                i++;
            }

            showSuggestions(i, "left");
        });
    }

    function showSuggestions(n, direction) {
        $(".suggestion-container .suggestion-item").each((i, eln) => {
            if (n == i) {
                $(".suggestion-container").height($(".suggestion-container").height());
                setTimeout(() => { $(eln).show("slide", { direction: direction }, 200) }, 200);
                $(".indicator-dot").eq(i).addClass("indicator-dot-active");

            } else {
                if ($(eln).is(":visible")) {
                    $(eln).hide("slide", { direction: (direction == "left" ? "right" : "left") }, 180);
                    $(".indicator-dot").eq(i).removeClass("indicator-dot-active");
                }
            }
        })
    }


    function displaySeason(data) {
        let gallery = $(".seasonal-gallery");

        for (let x in data) {
            let title = data[x].title;
            let imgSrc = data[x].images.webp.image_url;
            let id = data[x].mal_id;

            let html = `<a href="/anime/?id=${id}" class="min-card">
                            <img src="${imgSrc}" alt="">
                            <h4>${title}</h4>
                        </a>`;

            gallery.append(html);

        }

        if (mal.hasNextPage()) {
            showLoadMore();
        } else {
            hideLoadMore()
        }
    }

    function clearSeasonDisplay() {
        let gallery = $(".seasonal-gallery");
        gallery.html("");
    }



    function armLoadMoreBtn() {
        $(".load-more").on("click", (evt) => {
            if (!loadingMore) {
                insertLoader();
                mal.getMore().then((res) => {
                    displaySeason(res.data);
                    removeLoader();
                });
            }
        });
    }

    function showLoadMore() {
        $(".load-more").show();
    }

    function hideLoadMore() {
        $(".load-more").hide();
    }

    function insertLoader() {
        loadingMore = true;
        $(".load-more").parent().prepend('<div class="loader margin-auto"></div>');
    }

    function removeLoader() {
        loadingMore = false;
        $(".load-more").parent() > $(".loader").remove();
    }



})