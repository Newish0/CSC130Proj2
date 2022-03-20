$(() => {
    let mal = new Jikan4();
    let loadingMore = true;

    hideLoadMore();
    initSuggestions();


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
        let suggestionCon = $(".suggestion-items");
        let indicatorDotContainer = $(".indicator-dot-container ");

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
                <a class="block text-center w-100 large-btn" href="/anime/?id=${id}">View</a>
            </div>

            <img class="w-25 rounded-corner-full" src="${imgSrc}"
                alt="${title} cover image">
            </div>`;

            suggestionCon.append(html);

            indicatorDotContainer.append('<div class="indicator-dot"></div>');
        }

        initSuggestions();
        autoAdvanceOnSuggestion();
    }

    function autoAdvanceOnSuggestion() {
        let interval = setInterval(() => {
            showNextSuggestion(400);
        }, 10000);

        $(".suggestion-container ").find(".suggestion-prev").on("click", () => { clearInterval(interval) })
        $(".suggestion-container ").find(".suggestion-next").on("click", () => { clearInterval(interval) })
        $(".suggestion-indicators").find(".indicator-dot").on("click", () => { clearInterval(interval) })
    }

    function getActiveSuggestion() {
        let index = 0;
        $(".suggestion-container .suggestion-item").each((i, eln) => {
            if ($(eln).is(":visible")) {
                index = i;
            }
        });

        return index;
    }

    function initSuggestions() {

        // hide all suggestions
        $(".suggestion-item").hide();

        // show only the first suggestion
        $(".suggestion-item").first().show();
        $(".suggestion-indicators").find(".indicator-dot").first().addClass("indicator-dot-active");

        // initialize dots to have on click that takes it to that suggestion
        $(".suggestion-indicators").find(".indicator-dot").each((i, eln) => {
            $(eln).on("click", () => { showSuggestions(i) });
        });

        // init prev button
        $(".suggestion-container").find(".suggestion-prev").on("click", showNextSuggestion);

        // init next button
        $(".suggestion-container ").find(".suggestion-next").on("click", showPrevSuggestion);

        initSuggestionSwipeEvt($(".suggestion-container").get(0));
    }




    // Source: https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
    function initSuggestionSwipeEvt(target) {
        document.addEventListener('touchstart', handleTouchStart, false);
        document.addEventListener('touchmove', handleTouchMove, false);

        // const threshold = Math.sqrt(window.innerHeight * window.innerHeight + window.innerWidth * window.innerWidth) * 0.005;
        const threshold = 5;

        let xDown = null;
        let yDown = null;

        function getTouches(evt) {
            return evt.touches ||             // browser API
                evt.originalEvent.touches; // jQuery
        }

        function handleTouchStart(evt) {

            if (evt.target = target) {
                const firstTouch = getTouches(evt)[0];
                xDown = firstTouch.clientX;
                yDown = firstTouch.clientY;
            }
        };

        function handleTouchMove(evt) {

            if (evt.target != target) {
                return;
            }

            if (!xDown || !yDown) {
                return;
            }

            let xUp = evt.touches[0].clientX;
            let yUp = evt.touches[0].clientY;

            let xDiff = xDown - xUp;
            let yDiff = yDown - yUp;

            if (Math.abs(xDiff) > threshold || Math.abs(yDiff) > threshold) {
                if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
                    if (xDiff > 0) {
                        /* right swipe */
                        showNextSuggestion();
                    } else {
                        /* left swipe */
                        showPrevSuggestion();
                    }
                } else {
                    if (yDiff > 0) {
                        /* down swipe */
                    } else {
                        /* up swipe */
                    }
                }
            }

            /* reset values */
            xDown = null;
            yDown = null;
        };
    }







    function showNextSuggestion(transition = 200) {
        let index = getActiveSuggestion();

        if (index == $(".suggestion-container .suggestion-item").length - 1) {
            index = 0;
        } else {
            index++;
        }

        showSuggestions(index, "left", transition);
    }

    function showPrevSuggestion(transition = 200) {
        let index = getActiveSuggestion();

        if (index == 0) {
            index = $(".suggestion-container .suggestion-item").last().index();
        } else {
            index--;
        }

        showSuggestions(index, "right", transition);
    }

    function showSuggestions(n, direction, animemationLength = 200) {

        $(".suggestion-container .suggestion-item").each((i, eln) => {
            if (n == i) {
                // fixed height for transition
                $(".suggestion-container").height($(".suggestion-container").height());

                setTimeout(() => {
                    // auto height after transition
                    $(".suggestion-container").css("height", "auto");
                    $(eln).show("slide", { direction: direction }, animemationLength);
                }, animemationLength);
                $(".indicator-dot").eq(i).addClass("indicator-dot-active");

            } else {
                if ($(eln).is(":visible")) {
                    $(eln).hide("slide", { direction: (direction == "left" ? "right" : "left") }, animemationLength - 20);
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