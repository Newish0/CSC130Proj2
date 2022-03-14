


$(() => {


    let mal = new Jikan4();

    let galleryPosterCon = document.querySelector("#gallery-posters");

    let cardTemplate = fetch("templates/poster-card.inc")
        .then(res => res.text())
        .then((txt) => {
            cardTemplate = txt;
            display(galleryPosterCon);
            setTimeout(armLoadMoreBtn, 300);
        });



    // init filters
    let filters = document.querySelector("#filters");
    let scoreRange = { min: 0, max: 10 };

    filters.addEventListener("change", () => filterSearch());

    function filterSearch() {
        let params = {};
        let tags = "";
        let producers = "";

        let search = document.querySelector("#filter-search-box").value;

        params.q = search;


        document.querySelectorAll("#filter-tags input").forEach((n) => {
            if (n.checked) {
                tags += n.value + ",";
            }
        });
        tags = tags.substring(0, tags.length - 1);
        params.genres = tags;
        

        params.minScore = scoreRange.min;
        params.maxScore = scoreRange.max;


        document.querySelectorAll("#filter-studios input").forEach((n) => {
            if (n.checked) {
                producers += n.value + ",";
            }
        });
        producers = producers.substring(0, producers.length - 1);
        params.producers = producers;


        display(galleryPosterCon, "anime_search", params);
    }

    $("#score-range-slider").slider({
        range: true,
        min: 0,
        max: 10,
        values: [0, 10],
        slide: function (event, ui) {
            $("#score-range-out").val(ui.values[0] + " - " + ui.values[1]);
            scoreRange.min = ui.values[0];
            scoreRange.max = ui.values[1];
            filterSearch();
        }
    });
    $("#score-range-out").val($("#score-range-slider").slider("values", 0) +
        " - " + $("#score-range-slider").slider("values", 1));

    mal.getAnimeGenres({
        filter: "genres"
    }).then(genres => {
        genres = genres.data;
        let htmlTxt = "";
        for (let x in genres) {

            let name = genres[x].name;
            let value = genres[x].mal_id;
            htmlTxt += htmlTxt = `
            <span>
                <input type="checkbox" name="${name}" class="filter-form-inc-exc-tags" id="${name}-${value}" value="${value}">
                <label class="unselectable" for="${name}-${value}">${name}</label>
            </span>
            `;
        }

        document.querySelector("#filter-tags").innerHTML += htmlTxt;
    });

    mal.getProducers().then(producers => {
        producers = producers.data;
        let htmlTxt = "";
        for (let x in producers) {

            let name = producers[x].name;
            let value = producers[x].mal_id;
            htmlTxt += htmlTxt = `
            <span>
                <input type="checkbox" name="${name}" class="filter-form-inc-exc-tags" id="${name}-${value}" value="${value}">
                <label class="unselectable" for="${name}-${value}">${name}</label>
            </span>
            `;
        }

        document.querySelector("#filter-studios").innerHTML += htmlTxt;
    });



    function armLoadMoreBtn() {
        let loadMoreBtn = document.querySelector("#load-more");

        let loadMoreObserverOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 1.0
        }

        let callback = (entries, observer) => {
            entries.forEach(entry => {
                // Each entry describes an intersection change for one observed
                // target element:
                //   entry.boundingClientRect
                //   entry.intersectionRatio
                //   entry.intersectionRect
                //   entry.isIntersecting
                //   entry.rootBounds
                //   entry.target
                //   entry.time
                if(galleryPosterCon.childNodes.length > 1) {
                    console.log("[DEBUG] Auto load more " + entry.target);
                    displayMore(mal, galleryPosterCon);
                }

                
            });
        };

        let loadMoreObserver = new IntersectionObserver(callback, loadMoreObserverOptions);
        loadMoreObserver.observe(loadMoreBtn);
    }



    function display(container, view, params) {
        view = view == undefined ? "anime_top" : view;

        switch (view) {
            // TODO
            case "anime_seasonal":
                // TODO
                break;

            case "anime_search":
                displaySearchAnime(mal, container, params);
                break;

            case "anime_top":
            default:
                displayTopAnime(mal, container);
            //setInterval(() => {displayMore(mal, galleryPosterCon)}, 2000)
        }
    }

    function displayMore(api, container) {
        api.getMore().then((res) => {

            if (res != null) {
                let data = res.data;
                console.log(data)
                for (let i in data) {
                    let card = createCard(cardTemplate, data[i]);
                    container.appendChild(card);
                }
            }
        }).catch(function () {
            console.log("TOO MANY REQUEST");
        });
    }

    function displaySearchAnime(api, container, params) {
        container.innerHTML = "";

        api.getAnimeSearch(params).then((res) => {
            let data = res.data;
            console.log(data)
            for (let i in data) {
                let card = createCard(cardTemplate, data[i]);
                container.appendChild(card);
            }
        }).catch(function () {
            console.log("TOO MANY REQUEST");
        });
    }

    function displayTopAnime(api, container) {
        api.getAnimeSearch().then((res) => {
            let data = res.data;
            console.log(data)
            for (let i in data) {
                let card = createCard(cardTemplate, data[i]);
                container.appendChild(card);
            }
        }).catch(function () {
            console.log("TOO MANY REQUEST");
        });
    }

    function createCard(template, oneData) {
        let tmpCon = document.createElement("div");
        tmpCon.innerHTML = template;

        let titleEln = tmpCon.querySelector(".poster-title");
        let tagsEln = tmpCon.querySelector(".poster-tags");
        let dateEln = tmpCon.querySelector(".poster-date");
        let countEln = tmpCon.querySelector(".poster-count");
        let lengthEln = tmpCon.querySelector(".poster-length");
        let imgEln = tmpCon.querySelector(".poster-img img");
        let imgLinkEln = tmpCon.querySelector(".poster-img a");
        let studioEln = tmpCon.querySelector(".poster-studio");
        let sourceEln = tmpCon.querySelector(".poster-source");
        let themeEln = tmpCon.querySelector(".poster-themes");
        let descpEln = tmpCon.querySelector(".poster-description");
        let scoreEln = tmpCon.querySelector(".poster-score");

        titleEln.innerText = oneData.title;

        titleEln.href = "/anime/?id=" + oneData.mal_id;

        for (let i in oneData.genres) {
            let tag = document.createElement("a");
            tag.classList.add("tag");
            tag.classList.add("clean-url");
            tag.href = `?genres=${oneData.genres[i].mal_id}`;
            tag.innerText = oneData.genres[i].name;

            tagsEln.appendChild(tag);
        }


        dateEln.innerText = oneData.aired.string;




        if (oneData.type == "TV" || oneData.type == "Movie") {
            countEln.innerText = oneData.episodes + " ep";
        } else if (oneData.type == "Manga") {
            countEln.innerText = oneData.episodes + " ch";
        } else {
            countEln.innerText = oneData.episodes;
        }
        countEln.innerText += " (" + oneData.type + ")";


        lengthEln.innerText = oneData.duration;


        if (oneData.images.webp != undefined) {
            imgEln.src = oneData.images.webp.image_url;
        } else {
            imgEln.src = oneData.images.jpg.image_url;
        } // if else

        imgLinkEln.href = "?view=" + oneData.mal_id;


        studioEln.innerText = "";
        for (let i = 0; i < oneData.studios.length; i++) {
            studioEln.innerText += oneData.studios[i].name;
            studioEln.innerText += i < oneData.studios.length - 1 ? ", " : "";
        }


        for (let i in oneData.themes) {
            let tag = document.createElement("a");
            tag.classList.add("tag");
            tag.classList.add("clean-url");
            tag.href = `?genres=${oneData.themes[i].mal_id}`;
            tag.innerText = oneData.themes[i].name;

            themeEln.appendChild(tag);
        }

        sourceEln.innerText = oneData.source;

        descpEln.innerText = oneData.synopsis;

        descpEln.innerHTML += "<br><p>Source: <a class='clean-url' href='" + oneData.url + "' target='_blank'>myanimelist.net</a></p>"

        scoreEln.innerText = " " + oneData.score;

        return tmpCon.querySelector(".poster-card");
    }

    // https://stackoverflow.com/questions/54246477/how-to-convert-camelcase-to-snake-case-in-javascript
    function camelToSnakeCase(str) { str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`); }
});