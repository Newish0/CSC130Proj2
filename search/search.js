



$(() => {
    let mal = new Jikan4();
    let container = $("#posters-container");
    let loadingMore = false;
    let params = {
        q: "",
        minScore: 0,
        maxScore: 10,
        genres: "",
        sort: "desc",
        orderBy: "score"
    }

    armFilterBar();
    initFilters();

    displaySearch();

    armLoadMoreBtn();
    armLoadMoreBtnAsAuto();



    // add in tags for filter
    function initFilters() {

        $("#filters").on("click", () => {
            $("#overtop-filters").css("display", "flex").hide().fadeIn(100); // fadeIn with Flex attr
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
            mal.getAnimeGenres({
                filter: "genres"
            }).then(res => {

                filterGenres.html("");

                res.data.sort((a, b) => (a.name > b.name) ? 1 : -1)

                for (let x in res.data) {
                    let name = res.data[x].name;
                    let value = res.data[x].mal_id;
                    let tag = `
                    <span class="info-item">
                        <input type="checkbox" name="filter-genre-${name}-${value}" class="filter-ix-tag" id="filter-genre-${name}-${value}" value="${value}">
                        <label class="unselectable" for="filter-genre-${name}-${value}">${name}</label>
                    </span>
                    `;

                    filterGenres.append(tag);
                }



                // add in 'any' tag
                let anyTag = `
                <span class="info-item">
                    <input type="checkbox" name="filter-genre-any-0" class="filter-ix-tag" id="filter-genre-any-0" value="" checked>
                    <label class="unselectable" for="filter-genre-any-0">Any</label>
                </span>
                `;
                filterGenres.append(anyTag);


                $(".filter-genres .filter-ix-tag").on("change", (evt) => {
                    
                    if ($(".filter-genres .filter-ix-tag:not(#filter-genre-any-0):checked").length >= 1) {
                        $("#filter-genre-any-0").prop("checked", false);
                    } else {
                        $("#filter-genre-any-0").prop("checked", true);
                    }


                    let label = $("label[for='" + evt.target.id + "']");
                    if(evt.target.checked && evt.target != $("#filter-genre-any-0").get(0)) { 
                        let aTag = `
                        <span class="info-item filter-active-${label.html()}">
                            <span class="filter-i-tag unselectable">${label.html()}</span>
                        </span>
                        `;
                        $(".filter-active").append(aTag);
                    } else {
                        $(`.filter-active .filter-active-${label.html()}`).remove();
                    }
                    
                });

            }).catch(err => {
                if (err == "Jikan4 API errored with response: 429") {
                    setTimeout(initGenres, 1000);
                } else {
                    console.error(err);
                }
            });

            // filterGenres.on("change", (evt) => {
            //     syncUserInputs()
            // });
        }

        initGenres();

        const initThemes = () => {
            let filterThemes = $(".filter-themes");
            mal.getAnimeGenres({
                filter: "themes"
            }).then(res => {

                filterThemes.html("");

                res.data.sort((a, b) => (a.name > b.name) ? 1 : -1)

                for (let x in res.data) {
                    let name = res.data[x].name;
                    let value = res.data[x].mal_id;
                    let tag = `
                    <span class="info-item">
                        <input type="checkbox" name="filter-theme-${name}-${value}" class="filter-ix-tag" id="filter-theme-${name}-${value}" value="${value}">
                        <label class="unselectable" for="filter-theme-${name}-${value}">${name}</label>
                    </span>
                    `;

                    filterThemes.append(tag);
                }

                // add in 'any' tag
                let anyTag = `
                <span class="info-item">
                    <input type="checkbox" name="filter-theme-any-0" class="filter-ix-tag" id="filter-theme-any-0" value="" checked>
                    <label class="unselectable" for="filter-theme-any-0">Any</label>
                </span>
                `;
                filterThemes.append(anyTag);


                $(".filter-themes .filter-ix-tag").on("change", (evt) => {
                    if ($(".filter-themes .filter-ix-tag:not(#filter-genre-any-0):checked").length >= 1) {
                        $("#filter-theme-any-0").prop("checked", false);
                    } else {
                        $("#filter-theme-any-0").prop("checked", true);
                    }

                    let label = $("label[for='" + evt.target.id + "']");
                    if(evt.target.checked && evt.target != $("#filter-theme-any-0").get(0)) { 
                        let aTag = `
                        <span class="info-item filter-active-${label.html()}">
                            <span class="filter-i-tag unselectable">${label.html()}</span>
                        </span>
                        `;
                        $(".filter-active").append(aTag);
                    } else {
                        $(`.filter-active .filter-active-${label.html()}`).remove();
                    }
                });

            }).catch(err => {
                if (err == "Jikan4 API errored with response: 429") {
                    setTimeout(initThemes, 1000);
                } else {
                    console.error(err);
                }
            });

            // filterThemes.on("change", (evt) => {
            //     syncUserInputs()
            // });
        }

        initThemes();
    }

    function resetFilters() {
        console.log("lol")
        $(".filter-genres .filter-ix-tag:not(#filter-genre-any-0):checked").prop("checked", false);
        $(".filter-genres #filter-genre-any-0").prop("checked", true);
        $(".filter-themes .filter-ix-tag:not(#filter-theme-any-0):checked").prop("checked", false);
        $(".filter-themes #filter-theme-any-0").prop("checked", true);
    }

    function displaySearch() {
        clearDisplay();
        insertLoader();
        mal.getAnimeSearch(params).then(res => {
            clearDisplay();
            addDataToDisplay(res.data);
            removeLoader();
        })
    }

    function clearDisplay() {
        container.html("");
    }

    function addDataToDisplay(data) {
        
        if(data.length == 0) {
            container.append("<div>No results found.</div>");
        }
        
        for (let i in data) {
            container.append(addOneToDisplay(data[i]))
        }
        
        if(mal.hasNextPage()) {
            showLoadMore();
        } else {
            hideLoadMore();
        }
    }

    function addOneToDisplay(oneData) {
        let title = oneData.title;
        let titleHREF = "/anime/?id=" + oneData.mal_id;

        let tagsHTML = "";
        for (let i in oneData.genres) {
            let tag = `
                <a class="tag clean-url" 
                href="?genres=${oneData.genres[i].mal_id}">
                ${oneData.genres[i].name}
                </a>
            `;
            tagsHTML += tag;
        }

        let date = oneData.aired.string;

        let count = "";
        if (oneData.type == "TV" || oneData.type == "Movie") {
            count = oneData.episodes + " ep";
        } else if (oneData.type == "Manga") {
            count = oneData.episodes + " ch";
        } else {
            count = oneData.episodes;
        }
        count += " (" + oneData.type + ")";

        let length = oneData.duration;

        let imgSrc = "";
        let imgLink = "";
        if (oneData.images.webp != undefined) {
            imgSrc = oneData.images.webp.image_url;
        } else {
            imgSrc = oneData.images.jpg.image_url;
        } // if else

        imgLink = "/anime/?id=" + oneData.mal_id;

        let studios = "";
        for (let i = 0; i < oneData.studios.length; i++) {
            studios += oneData.studios[i].name;
            studios += i < oneData.studios.length - 1 ? ", " : "";
        }


        let themesHTML = "";
        for (let i in oneData.themes) {
            let tag = `
                <a class="tag clean-url" 
                href="?genres=${oneData.themes[i].mal_id}">
                ${oneData.themes[i].name}
                </a>
            `;
            themesHTML += tag;
        }

        let source = oneData.source;

        let description = oneData.synopsis;

        description += "<br><p>Source: <a class='clean-url' href='" + oneData.url + "' target='_blank'>myanimelist.net</a></p>"

        let score = " " + oneData.score;


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
                        <div class="poster-count">${count}</div>
                        <!-- ie. number of episodes -->
                        <div class="poster-length">${length}</div>
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
                            <div class="poster-studio">${studios}</div>
                            <div class="poster-source">${source}</div>
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
                insertLoader()
                mal.getMore().then(res => {
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
            threshold: 1.0
        }

        let callback = (entries, observer) => {
            entries.forEach(entry => {
                if (container.children().length > 1) {
                    if (!loadingMore) {
                        insertLoader();
                        mal.getMore().then(res => {
                            addDataToDisplay(res.data);
                            removeLoader();
                        });
                    }
                }
            });
        };

        let loadMoreObserver = new IntersectionObserver(callback, loadMoreObserverOptions);
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
        let filters = $("#filters");
        let search = $("#filters-bar-search-box");
        let sort = $("#sort");

        filters.on("click", (evt) => {
            console.log("FILTER OVERLAY")
        });

        search.on("change", () => {
            syncUserInputs();
        });

        sort.on("click", () => {
            console.log("SORT OVERLAY")
        });

    }


    /**
     * Get the values from the filters, sorts etc...
     * and update the variables
     */
    function syncUserInputs() {
        let search = $("#filters-bar-search-box");
        let sort = $("#sort");

        let filterString = "";

        console.log("SYNC")

        params.q = search.val();

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

        params.genres = filterString;


        displaySearch(params);
    }

})