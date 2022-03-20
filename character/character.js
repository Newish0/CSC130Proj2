$(() => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    let mal = new Jikan4();
    let characterID = params.id;

    // panels are hidden till ready
    // add in loader
    $("main").append('<div class="loader center"></div>');

    initClickToShowMore();


    mal.getCharacterById(characterID).then(res => {

        let data = res.data;

        let name = $("#name");
        let picture = $("#picture");
        let nameKanji = $("#name-kanji");
        let altNames = $("#alternate-names");
        let favourite = $("#favourite");
        let about = $("#about");

        $("title").html(data.name + " - UsagiDB");


        picture.attr("src", data.images.jpg.image_url);
        $("#picture").on("load", () => {
            // now ready to display the basic data
            $(".simple-split *").fadeIn(100);
            $("main > .loader").remove();
        });

        name.html(data.name);
        nameKanji.html(data.name_kanji);

        altNames.html("");
        for(let i in data.nicknames) {
            altNames.append(`<span>${data.nicknames[i]}</span>`);
        }

        favourite.html(data.favorites);
        about.html(data.about);

    }).catch(err => console.error(err));


    mal.getCharacterVoiceActors(characterID).then(res => {
        let voices = res.data;

        $("#voices-container").html("");

        for (let x in voices) {
            let language = voices[x].language;
            let personName = voices[x].person.name;
            let personID = voices[x].person.mal_id;
            let personImage = voices[x].person.images.jpg.image_url;

            let htmlTxt = `
            <div class="role-card">
                <div class="min-box">
                    <img src="${personImage}" alt="image of ${personImage}" loading="lazy">
                    <a href="/people/?id=${personID}">${personName} (${language})</a> 
                </div>
            </div>
            `;

            $("#voices-container").append(htmlTxt);
        }

        if ($("#voices-container").html() == "") {
            $("#voices-container").html("n/a");
            $("#voices-container").parent().find($(".click-to-show-more")).trigger("click");
        }


    }).catch(err => console.error(err));

    mal.getCharacterAnime(characterID).then(res => {
        let data = res.data;

        $("#anime-container").html("");

        for (let x in data) {
            let animeID = data[x].anime.mal_id;
            let animeCover = data[x].anime.images.webp.image_url;
            let animeTitle = data[x].anime.title;

            let role = data[x].role;

            let htmlTxt = `
            <div class="role-card">
            <div class="min-box size-m">
                <img src="${animeCover}" alt="image of ${animeTitle}" loading="lazy">
                <a href="/anime/?id=${animeID}">${animeTitle} - <b>${role}</b></a> 
            </div>
            `;
            $("#anime-container").append(htmlTxt);
        }

        if ($("#anime-container").html() == "") {
            $("#anime-container").html("n/a");
            $("#anime-container").parent().find($(".click-to-show-more")).trigger("click");
        }

    }).catch(err => console.error(err));


    mal.getCharacterManga(characterID).then(res => {
        let data = res.data;

        $("#manga-container").html("");

        for (let x in data) {
            let mangaID = data[x].manga.mal_id;
            let mangaCover = data[x].manga.images.webp.image_url;
            let mangaTitle = data[x].manga.title;

            let role = data[x].role;

            let htmlTxt = `
            <div class="role-card">
            <div class="min-box size-m">
                <img src="${mangaCover}" alt="image of ${mangaTitle}" loading="lazy">
                <a href="/manga/?id=${mangaID}">${mangaTitle} - <b>${role}</b></a> 
            </div>
            `;
            $("#manga-container").append(htmlTxt);
        }

        if ($("#manga-container").html() == "") {
            $("#manga-container").html("n/a");
            $("#manga-container").parent().find($(".click-to-show-more")).trigger("click");
        }

    }).catch(err => console.error(err));


    function initClickToShowMore() {
        $(".hide-rest-container").each(() => {
            $(this) > $(".click-to-show-more").on("click", (evt) => {
                if (evt.target.parentElement != null) {
                    evt.target.parentElement.classList.remove("hide-rest");
                }
                evt.target.remove();
            });
        });
    }


})