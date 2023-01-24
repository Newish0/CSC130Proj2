$(() => {
    let mal = new Jikan4();
    let loadingMore = true;

    hideLoadMore();


    // load suggestions
    // selected from top anime and current season
    mal.getTopAnime().then(res => {
        let selectionIndexes = [];
        let animeSelection = [];
        const numSelection = 8;
        let dataConcat = res.data;

        mal.getSeasonNow().then(res2 => {
            dataConcat = dataConcat.concat(res2.data);

            while (selectionIndexes.length < numSelection) {
                let n = parseInt(getRandomArbitrary(0, dataConcat.length));
                if (!selectionIndexes.includes(n)) {
                    selectionIndexes.push(n);
                }
            }


            for (let i = 0; i < numSelection; i++) {
                animeSelection.push(dataConcat[selectionIndexes[i]]);
            }

            // clearSuggestionsDisplay();
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

    // function clearSuggestionsDisplay() {
    //     $(".suggestion-item").remove();
    //     $(".indicator-dot").remove();
    // }

    function displaySuggestions(data) {
        let suggestionCon = $(".suggestions-out");

        suggestionCon.find($(".loader")).remove();

        for (let x in data) {
            let title = data[x].title;
            let altTitle = data[x].title_english == null ? "" : data[x].title_english;
            let imgSrc = data[x].images.webp.image_url;
            let id = data[x].mal_id;
            let synopsis = data[x].synopsis;

            const maxSynopsisCharLength = 225;

            // if over max length, cut it at the first space after max length
            if (synopsis.length > maxSynopsisCharLength) {
                synopsis = synopsis.substring(0, synopsis.indexOf(" ", maxSynopsisCharLength));

                if (synopsis[synopsis.length - 1].match(/[^A-Za-z0-9]/g)) {
                    synopsis = synopsis.substring(0, synopsis.length - 1);
                }

                synopsis += "...";
            }


            let tagsHTML = "";
            for (let i in data[x].genres) {
                let tag = `
                <a class="tag clean-url" 
                href="/CSC130Proj2/search/anime/?genre=${data[x].genres[i].mal_id}~${encodeURIComponent(data[x].genres[i].name)}">
                ${data[x].genres[i].name}
                </a>
            `;
                tagsHTML += tag;
            }

            let themesHTML = "";
            for (let i in data[x].themes) {
                let tag = `
                <a class="tag clean-url" 
                href="/CSC130Proj2/search/anime/?genre=${data[x].themes[i].mal_id}~${encodeURIComponent(data[x].themes[i].name)}">
                ${data[x].themes[i].name}
                </a>
            `;
                themesHTML += tag;
            }


            let html = `
            <div class="swiper-slide suggestion-item center auto-gallery align-items-center justify-evenly w-100">
            <div class="w-25 margin-large content">
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
                <a class="block text-center w-100 large-btn" href="/CSC130Proj2/anime/?id=${id}">View</a>
            </div>

            <img class="w-25 rounded-corner-full" src="${imgSrc}"
                alt="${title} cover image">
            </div>`;

            suggestionCon.append(html);

        }

        let swiper = new Swiper(".suggestions-box-swiper", {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: true,
            },
            pagination: {
                el: ".swiper-pagination",
            },
            effect: "coverflow",
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: "auto",
            coverflowEffect: {
                rotate: 50,
                stretch: 100,
                depth: 800,
                modifier: 1,
                slideShadows: false,
            },
        });

    }

    function displaySeason(data) {
        let gallery = $(".seasonal-gallery");

        for (let x in data) {
            let title = data[x].title;
            let imgSrc = data[x].images.webp.image_url;
            let id = data[x].mal_id;

            let html = `<a href="/CSC130Proj2/anime/?id=${id}" class="min-card">
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