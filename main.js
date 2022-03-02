
let tmp;

window.addEventListener("DOMContentLoaded", () => {
    let mal = new Jikan4();
    let galleryPosterCon = document.querySelector("#gallery-posters");

    let cardTemplate = fetch("templates/poster-card.inc")
        .then(res => res.text())
        .then((txt) => {
            cardTemplate = txt;
            display(galleryPosterCon);
        });


    function display(container) {
        let view = "anime_top";

        switch (view) {
            // TODO
            case "anime_seasonal":
                // TODO
                break;
            case "anime_top":
            default:
                displayTopAnime(mal, container);
                setInterval(() => {displayMore(mal, galleryPosterCon)}, 2000)
        }
    }

    function displayMore(api, container) {
        api.getMore().then((res) => {
            let data = res.data;
            console.log(data)
            for (let i in data) {
                let card = createCard(cardTemplate, data[i]);
                container.appendChild(card);
            }
        });
    }

    function displayTopAnime(api, container) {
        api.getTopAnime().then((res) => {
            let data = res.data;
            console.log(data)
            for (let i in data) {
                let card = createCard(cardTemplate, data[i]);
                container.appendChild(card);
            }
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
        let studioEln = tmpCon.querySelector(".poster-studio");
        let sourceEln = tmpCon.querySelector(".poster-source");
        let themeEln = tmpCon.querySelector(".poster-themes");
        let descpEln = tmpCon.querySelector(".poster-description");
        let scoreEln = tmpCon.querySelector(".poster-score");

        titleEln.innerText = oneData.title;

        titleEln.href = "?view=" + oneData.mal_id;

        for (let i in oneData.genres) {
            let tag = document.createElement("div");
            tag.classList.add("tag");
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


        studioEln.innerText = "";
        for (let i = 0; i < oneData.studios.length; i++) {
            studioEln.innerText += oneData.studios[i].name;
            studioEln.innerText += i < oneData.studios.length - 1 ? ", " : "";
        }


        for (let i in oneData.themes) {
            let tag = document.createElement("div");
            tag.classList.add("tag");
            tag.innerText = oneData.themes[i].name;

            themeEln.appendChild(tag);
        }

        sourceEln.innerText = oneData.source;

        descpEln.innerText = oneData.synopsis;

        descpEln.innerHTML += "<br><p>Source: <a class='clean-url' href='" + oneData.url + "' target='_blank'>myanimelist.net</a></p>"

        scoreEln.innerText = " " + oneData.score;

        return tmpCon.querySelector(".poster-card");
    }
});