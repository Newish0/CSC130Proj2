$(() => {
    const urlParams = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    let mal = new Jikan4();
    let container = $("#posters-container");
    let loadingMore = false;
    let searchParams = {
        q: "",
        minScore: 0,
        maxScore: 10,
        genres: "",
        sort: "desc",
        orderBy: "score",
    };


    armFilterBar();

    if (urlParams.genre) {
        let params = urlParams.genre.split("~");

        if(params[0] == undefined || params[0] == "" || params[1] == undefined || params[1] == "") {
            display404();
        }

        searchParams.genres = params[0];
        disableFiltersAndSearch();
        insertHeadingIntoFilterBar(params[1]);
        insertBackIntoFilterBar();
    } else if (urlParams.magazine) {
        let params = urlParams.magazine.split("~");

        if(params[0] == undefined || params[0] == "" || params[1] == undefined || params[1] == "") {
            display404();
        }

        searchParams.magazines = params[0];
        disableFiltersAndSearch();
        insertHeadingIntoFilterBar(params[1]);
        insertBackIntoFilterBar();
    } else if (urlParams.demographic) {
        let params = urlParams.demographic.split("~");

        if(params[0] == undefined || params[0] == "" || params[1] == undefined || params[1] == "") {
            display404();
        }

        searchParams.genres = params[0];
        disableFiltersAndSearch();
        insertHeadingIntoFilterBar(params[1]);
        insertBackIntoFilterBar();
    }




    try {
        syncUserInputs(); // try to get from browser cache
    } catch (error) {
        // ignore
    }

    displaySearch();

    armLoadMoreBtn();
    armLoadMoreBtnAsAuto();


    function insertBackIntoFilterBar() {
        $(".filters-bar").prepend(`<a href="javascript:history.back()"><h1"><i class="fa-solid fa-angle-left dark-color text-large"></i></h1></a>`);
    }

    function insertHeadingIntoFilterBar(headingText) {
        $(".filters-bar").prepend(`<h1 style="flex-grow:1">${headingText}</h1>`);
    }

    function disableFiltersAndSearch() {
        $("#filters").hide();
        $("#filters-bar-search-box-wrapper").hide();
    }

    function initSorting() {
        $("#sort").on("click", () => {
            $("#overtop-sorts").css("display", "flex").hide().fadeIn(100); // fadeIn with Flex attr
            disableScroll();
        });
    }

    // add in tags for filter
    function initFilters() {
        $("#filters").on("click", () => {
            $("#overtop-filters").css("display", "flex").hide().fadeIn(100); // fadeIn with Flex attr
            disableScroll();
        });

        $(".sync-on-click").each((i, obj) => {
            $(obj).on("click", (evt) => {
                if (evt.target !== obj) {
                    return;
                }
                syncUserInputs();
            });
        });

        $(".filters-reset").each((i, obj) => {
            $(obj).on("click", (evt) => {
                if (evt.target !== obj) {
                    return;
                }
                resetFilters();
            });
        });

        const initGenres = () => {
            let filterGenres = $(".filter-genres");
            mal.getMangaGenres({
                filter: "genres",
            }).then((res) => {
                filterGenres.html("");

                res.data.sort((a, b) => (a.name > b.name ? 1 : -1));

                for (let x in res.data) {
                    let name = res.data[x].name;
                    let value = res.data[x].mal_id;
                    let tag = `
                        <span class="info-item">
                            <input type="checkbox" name="filter-genre-${value}" class="filter-ix-tag" id="filter-genre-${value}" value="${value}">
                            <label class="unselectable" for="filter-genre-${value}">${name}</label>
                        </span>
                        `;

                    filterGenres.append(tag);
                }

                // add in 'any' tag
                let anyTag = `
                    <span class="info-item">
                        <input type="checkbox" name="filter-genre-any" class="filter-ix-tag" id="filter-genre-any" value="" checked>
                        <label class="unselectable" for="filter-genre-any">Any</label>
                    </span>
                    `;
                filterGenres.append(anyTag);

                $(".filter-genres .filter-ix-tag").on("change", (evt) => {
                    if ($(".filter-genres .filter-ix-tag:not(#filter-genre-any):checked").length >= 1) {
                        $("#filter-genre-any").prop("checked", false);
                    } else {
                        $("#filter-genre-any").prop("checked", true);
                    }

                    let label = $("label[for='" + evt.target.id + "']");
                    if (evt.target.checked && evt.target != $("#filter-genre-any").get(0)) {
                        let aTag = `
                            <span class="info-item filter-active-genre-${evt.target.value}">
                                <span class="filter-i-tag unselectable">${label.html()}</span>
                            </span>
                            `;
                        $(".filter-active").append(aTag);
                    } else {
                        $(`.filter-active .filter-active-genre-${evt.target.value}`).remove();
                    }
                });
            }).catch((err) => {
                if (err == "Jikan4 API errored with response: 429") {
                    setTimeout(initGenres, 1000);
                } else {
                    console.error(err);
                }
            });

            // filterGenres.on("change", (evt) => {
            //     syncUserInputs()
            // });
        };

        initGenres();

        const initThemes = () => {
            let filterThemes = $(".filter-themes");
            mal.getMangaGenres({
                filter: "themes",
            }).then((res) => {
                filterThemes.html("");

                res.data.sort((a, b) => (a.name > b.name ? 1 : -1));

                for (let x in res.data) {
                    let name = res.data[x].name;
                    let value = res.data[x].mal_id;
                    let tag = `
                        <span class="info-item">
                            <input type="checkbox" name="filter-theme-${value}" class="filter-ix-tag" id="filter-theme-${value}" value="${value}">
                            <label class="unselectable" for="filter-theme-${value}">${name}</label>
                        </span>
                        `;

                    filterThemes.append(tag);
                }

                // add in 'any' tag
                let anyTag = `
                    <span class="info-item">
                        <input type="checkbox" name="filter-theme-any" class="filter-ix-tag" id="filter-theme-any" value="" checked>
                        <label class="unselectable" for="filter-theme-any">Any</label>
                    </span>
                    `;
                filterThemes.append(anyTag);

                $(".filter-themes .filter-ix-tag").on("change", (evt) => {
                    if ($(".filter-themes .filter-ix-tag:not(#filter-genre-any):checked").length >= 1) {
                        $("#filter-theme-any").prop("checked", false);
                    } else {
                        $("#filter-theme-any").prop("checked", true);
                    }

                    let label = $("label[for='" + evt.target.id + "']");
                    if (evt.target.checked && evt.target != $("#filter-theme-any").get(0)) {
                        let aTag = `
                            <span class="info-item filter-active-theme-${evt.target.value}">
                                <span class="filter-i-tag unselectable">${label.html()}</span>
                            </span>
                            `;
                        $(".filter-active").append(aTag);
                    } else {
                        $(`.filter-active .filter-active-theme-${evt.target.value}`).remove();
                    }
                });
            }).catch((err) => {
                if (err == "Jikan4 API errored with response: 429") {
                    setTimeout(initThemes, 1000);
                } else {
                    console.error(err);
                }
            });

        };

        initThemes();

        const initMagazines = () => {
            let filterMagazines = $(".filter-magazines");
            filterMagazines.html("");
            mal.getMagazines().then(magazines => {
                magazines = magazines.data;

                for (let x in magazines) {
                    let name = magazines[x].name;
                    let value = magazines[x].mal_id;
                    let tag = `
                    <span>
                        <input type="radio" name="filter-magazines" class="filter-ix-tag" id="filter-magazines-${value}" value="${value}">
                        <label class="unselectable" for="filter-magazines-${value}">${name}</label>
                    </span>
                    `;

                    filterMagazines.append(tag);
                }

                // NOTE: add in aplied magazines filter event before anyTag (don't want any tags in there)
                $(".filter-magazines input[type='radio']").on("change", (evt) => {

                    let label = $("label[for='" + evt.target.id + "']");

                    $(".filter-active .filter-active-magazines").remove();
                    let aTag = `
                        <span class="info-item filter-active-magazines">
                            <span class="filter-i-tag unselectable">${label.html()}</span>
                        </span>
                        `;
                    $(".filter-active").append(aTag);

                });



                let anyTag = `
                <span>
                    <input type="radio" name="filter-magazines" class="filter-ix-tag" id="filter-magazines-any" value="" checked>
                    <label class="unselectable" for="filter-magazines-any">Any</label>
                </span>`;

                filterMagazines.append(anyTag);


            }).catch((err) => {
                if (err == "Jikan4 API errored with response: 429") {
                    setTimeout(initMagazines, 1000);
                } else {
                    console.error(err);
                }
            });
        }

        initMagazines();
    }

    initScoreRangeSlider();

    function initScoreRangeSlider() {
        $("#score-range-slider").slider({
            range: true,
            min: 0,
            max: 10,
            values: [0, 10],
            slide: function (event, ui) {
                $("#score-range-out").val(ui.values[0] + " - " + ui.values[1]);
                $("#score-range-slider .ui-slider-handle").each((i, obj) => {
                    let html = `
                    <div class="output">
                    ${ui.values[i]}
                    <i class="fa-solid fa-caret-down"></i>
                    </div>
                    `;
                    $(obj).html(html);
                });
            },
        });

        let values = $('#score-range-slider').slider("option", "values");

        $("#score-range-slider .ui-slider-handle").each((i, obj) => {
            let html = `
            <div class="output">
            ${values[i]}
            <i class="fa-solid fa-caret-down"></i>
            </div>
            `;
            $(obj).html(html);
        });
    }

    function resetFilters() {
        $('#score-range-slider').slider("values", 0, 0);
        $('#score-range-slider').slider("values", 1, 10);
        let values = $('#score-range-slider').slider("option", "values");
        $("#score-range-slider .ui-slider-handle").each((i, obj) => {
            let html = `
            <div class="output">
            ${values[i]}
            <i class="fa-solid fa-caret-down"></i>
            </div>
            `;
            $(obj).html(html);
        });

        $(".filter-active").html("");

        $(".filter-genres .filter-ix-tag:not(#filter-genre-any):checked").prop("checked", false);
        $(".filter-genres #filter-genre-any").prop("checked", true);
        $(".filter-themes .filter-ix-tag:not(#filter-theme-any):checked").prop("checked", false);
        $(".filter-themes #filter-theme-any").prop("checked", true);
        $(".filter-magazines .filter-ix-tag:not(#filter-magazines-any):checked").prop("checked", false);
        $(".filter-magazines #filter-magazines-any").prop("checked", true);
    }

    function resetSorting() {
        $(".order-by input").prop("checked", false);
        $(".sort-by input").prop("checked", false);
        $("#sorting-order-by-score").prop("checked", true);
        $("#sorting-sort-desc").prop("checked", true);
    }

    function displaySearch() {
        clearDisplay();
        insertLoader();
        mal.getMangaSearch(searchParams).then((res) => {
            clearDisplay();
            addDataToDisplay(res.data);
            removeLoader();
        }).catch(err => {
            if (err == "Jikan4 API errored with response: 429") {
                setTimeout(displaySearch, 1000)
            } else {
                console.error(err);
            }
        });
    }

    function clearDisplay() {
        container.html("");
    }

    function addDataToDisplay(data) {
        if (data.length == 0) {
            container.append("<div>No results found.</div>");
        }

        for (let i in data) {
            container.append(createOneCard(data[i]));
        }

        if (mal.hasNextPage()) {
            showLoadMore();
        } else {
            hideLoadMore();
        }
    }

    function createOneCard(oneData) {
        let title = oneData.title;
        let titleHREF = "/CSC130Proj2/manga/?id=" + oneData.mal_id;

        let tagsHTML = "";
        for (let i in oneData.genres) {
            let tag = `
                <a class="tag clean-url" 
                href="/CSC130Proj2/search/manga/?genre=${oneData.genres[i].mal_id}~${encodeURIComponent(oneData.genres[i].name)}">
                ${oneData.genres[i].name}
                </a>
            `;
            tagsHTML += tag;
        }


        let date = "";
        if (oneData.published) {
            date = oneData.published.string;
        }
        date = date === "" ? "Unknown" : date

        let chapters = oneData.chapters == null ? "Unknown" : `${oneData.chapters} Ch`;

        let volumes = oneData.volumes == null ? "Unknown" : `${oneData.volumes} Vol`;

        let imgSrc = "";
        let imgLink = "";
        if (oneData.images.webp != undefined) {
            imgSrc = oneData.images.webp.image_url;
        } else {
            imgSrc = oneData.images.jpg.image_url;
        } // if else

        imgLink = "/CSC130Proj2/manga/?id=" + oneData.mal_id;

        let authors = "";
        for (let i = 0; i < oneData.authors.length; i++) {
            authors += oneData.authors[i].name;
            authors += i < oneData.authors.length - 1 ? ", " : "";
        }

        authors = authors == "" ? "Unknown" : authors;

        let themesHTML = "";
        for (let i in oneData.themes) {
            let tag = `
                <a class="tag clean-url" 
                href="/CSC130Proj2/search/anime/?genre=${oneData.themes[i].mal_id}~${encodeURIComponent(oneData.themes[i].name)}">
                ${oneData.themes[i].name}
                </a>
            `;
            themesHTML += tag;
        }

        let serializations = "";
        for (let i = 0; i < oneData.serializations.length; i++) {
            serializations += oneData.serializations[i].name;
            serializations += i < oneData.serializations.length - 1 ? ", " : "";
        }

        serializations = serializations == "" ? "Unknown" : serializations;


        let description = (oneData.synopsis == null ? "n/a" : oneData.synopsis);

        description +=
            "<br><p>Source: <a class='clean-url' href='" +
            oneData.url +
            "' target='_blank'>myanimelist.net</a></p>";

        let score = " " + (oneData.scored == null ? "n/a" : oneData.scored);

        let template = `
            <!-- START: One Poster Template -->
            <div class="poster-card">
                <div class="poster-info">
                    <div class="poster-title-wrapper">
                        <a class="poster-title clean-url" href="${titleHREF}">${title}</a>
                    </div>
                    
            
                    <div class="poster-tags">
                        ${tagsHTML}
                    </div>
            
                    <div class="poster-details">
                        <div class="poster-date">${date}</div>
                        <!-- ie. air date -->
                        <div class="poster-count">${chapters}</div>
                        <!-- ie. number of episodes -->
                        <div class="poster-length">${volumes}</div>
                        <!-- ie. episode length -->
                    </div>
                </div>
            
                <div class="poster-main">
                    <div class="poster-img">
                        <a href="${imgLink}">
                            <img
                                src="${imgSrc}"
                                alt="Cover image for ${title}"
                            />
                        </a>
                    </div>
            
                    <div class="poster-main-content-wrapper">
                        <div class="poster-additional-info">
                            <div class="poster-studio">${authors}</div>
                            <div class="poster-source">${serializations}</div>
                            <div class="poster-themes">
                                ${themesHTML}
                            </div>
                        </div>
            
                        <div class="poster-description-wrapper">
                            <div class="poster-description">
                                ${description}
                            </div>
                        </div>
                    </div>
                    <div class="poster-score fa-solid fa-star"> ${score}</div>
                </div>
            </div>
            <!-- END: One Poster Template -->
        `;

        return template;
    }

    function armLoadMoreBtn() {
        $("#load-more").on("click", (evt) => {
            if (!loadingMore) {
                insertLoader();
                mal.getMore().then((res) => {
                    addDataToDisplay(res.data);
                    removeLoader();
                });
            }
        });
    }

    function armLoadMoreBtnAsAuto() {
        let loadMoreBtn = document.querySelector("#load-more");

        let loadMoreObserverOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 1.0,
        };

        let callback = (entries, observer) => {
            entries.forEach((entry) => {
                if (container.find(".loader").length == 0 && mal.hasNextPage()) {
                    if (!loadingMore) {
                        insertLoader();
                        const getMore = () => {
                            mal.getMore().then((res) => {
                                addDataToDisplay(res.data);
                                removeLoader();
                            }).catch(err => {
                                if (err == "Jikan4 API errored with response: 429") {
                                    setTimeout(getMore, 1000)
                                } else {
                                    console.error(err);
                                }
                            });
                        }
                        getMore();
                    }
                }
            });
        };

        let loadMoreObserver = new IntersectionObserver(
            callback,
            loadMoreObserverOptions
        );
        loadMoreObserver.observe(loadMoreBtn);
    }

    function showLoadMore() {
        $("#load-more").show();
    }

    function hideLoadMore() {
        $("#load-more").hide();
    }

    function insertLoader() {
        loadingMore = true;
        $("#load-more").parent().prepend('<div class="loader margin-auto"></div>');
    }

    function removeLoader() {
        loadingMore = false;
        $("#load-more").parent() > $(".loader").remove();
    }

    function armFilterBar() {
        let search = $("#filters-bar-search-box");


        initFilters();
        initSorting();

        // filter bar search box auto search on stop typing
        let searchBoxKeyupWait = null;
        search.on("keyup", (evt) => {
            if (searchBoxKeyupWait) {
                clearTimeout(searchBoxKeyupWait);
            }
            searchBoxKeyupWait = setTimeout(() => { syncUserInputs() }, 400); // wait 400 ms after typing
        });
    }

    /**
     * Get the values from the filters, sorts etc...
     * and update the variables
     */
    function syncUserInputs() {
        let search = $("#filters-bar-search-box");
        let scoreRangeValues = $('#score-range-slider').slider("option", "values");

        let filterString = "";


        searchParams.q = search.val();


        // only run filters when they are enabled
        if ($("#filters").is(":visible")) {

            $(".filter-genres input").each((i, obj) => {
                if (obj.checked && !obj.name.includes("any")) {
                    filterString += obj.value + ",";
                }
            });

            $(".filter-themes input").each((i, obj) => {
                if (obj.checked && !obj.name.includes("any")) {
                    filterString += obj.value + ",";
                }
            });

            filterString = filterString.substring(0, filterString.length - 1);

            searchParams.genres = filterString;


            searchParams.magazine = $(".filter-magazines input[name='filter-magazines']:checked").val();
        }

        searchParams.minScore = scoreRangeValues[0];
        searchParams.maxScore = scoreRangeValues[1];


        $(".order-by input").each((i, obj) => {
            if (obj.checked) {
                searchParams.orderBy = obj.value;
                let label = $("label[for='" + obj.id + "']");
                $("#cur-sort-out").html(label.html());
            }
        });

        $(".sort-by input").each((i, obj) => {
            if (obj.checked) {
                searchParams.sort = obj.value;

                if (obj.value == "desc") {
                    $("#sort i").attr("class", "fa-solid fa-arrow-down-short-wide");
                } else {
                    $("#sort i").attr("class", "fa-solid fa-arrow-up-short-wide");
                }
            }
        });

        


        displaySearch(searchParams);
    }
});