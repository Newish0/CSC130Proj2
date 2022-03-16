



$(() => {
    let mal = new Jikan4();
    let container = $("#posters-container");
    let loadingMore = false;
    let params = {
        q: "",
        minScore : 0,
        maxScore: 10,
        genres: "",
        sort: "desc",
        orderBy: "score"
    }

    armFilterBar();

    displaySearch();
    
    armLoadMoreBtn();
    armLoadMoreBtnAsAuto();
    
    function displaySearch() {
        insertLoader();
        mal.getAnimeSearch(params).then(res => {
            clearDisplay();
            addDataToDisplay(res.data);
            removeLoader();
        })
    }

    function clearDisplay () {
        container.html("");
    }

    function addDataToDisplay(data) {
        for (let i in data) {
            container.append(addOneToDisplay(data[i]))
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
        let filters = $("#filters");
        let search = $("#filters-bar-search-box");
        let sort = $("#sort");

        console.log("SYNC")

        params.q = search.val();

        displaySearch(params);
    }

})