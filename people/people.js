$(() => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    let mal = new Jikan4();
    let personID = params.id;

    // panels are hidden till ready
    // add in loader
    $("main").append('<div class="loader center"></div>');



    mal.getPersonById(personID).then(res => {

        let data = res.data;

        let name = $("#name");
        let picture = $("#picture");
        let givenName = $("#given-name");
        let familyName = $("#family-name");
        let altNames = $("#alternate-names");
        let birthday = $("#birthday");
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
        givenName.html(data.given_name);
        familyName.html(data.family_name);

        if (data.birthday != null || data.birthday != "") {
            birthday.html(new Date(data.birthday).getDate());
        }

        altNames.html("");
        for(let i in data.alternate_names) {
            altNames.append(`<span>${data.alternate_names[i]}</span>`);
        }

        favourite.html(data.favorites);
        about.html(data.about);

    }).catch(err => {
        
        displayErrorPage(err.split(":")[1]);
        console.log(err);
        
    });


    mal.getPersonVoices(personID).then(res => {
        let voices = res.data;

        $("#voices-container").html("");

        for (let x in voices) {
            let role = voices[x].role;
            let animeID = voices[x].anime.mal_id;
            let animeCover = voices[x].anime.images.webp.image_url;
            let animeTitle = voices[x].anime.title;
            let characterName = voices[x].character.name;
            let characterID = voices[x].character.mal_id;
            let characterImage = voices[x].character.images.jpg.image_url;

            let htmlTxt = `
            <div class="role-card">
                <div class="min-box">
                    <img src="${characterImage}" alt="image of ${characterImage}" loading="lazy">
                    <a href="/character/?id=${characterID}">${characterName} (${role})</a> 
                </div>
                <div class="min-box half top-bottom">
                    <img src="${animeCover}" alt="cover for ${animeTitle}" loading="lazy">
                    <a href="/anime/?id=${animeID}">${animeTitle}</a>
                </div>
            </div>
            `;

            // <div class="horizontal-box">
            //         <img src="${animeCover}" alt="cover for ${animeTitle}">
            //         <a href="/anime/?id=${animeID}">${animeTitle}</a>
            //     </div>

            $("#voices-container").append(htmlTxt);
        }

        if ($("#voices-container").html() == "") {
            $("#voices-container").html("n/a");
            $("#voices-container").parent().find($(".click-to-show-more")).trigger("click");
        }


    }).catch(err => console.error(err));

    mal.getPersonAnime(personID).then(res => {
        let data = res.data;

        $("#anime-container").html("");

        for (let x in data) {
            let animeID = data[x].anime.mal_id;
            let animeCover = data[x].anime.images.webp.image_url;
            let animeTitle = data[x].anime.title;

            let position = data[x].position;

            // fix bug in API
            if (position.indexOf("add") < 3) {
                position = position.substring(3, position.length);
            }

            let htmlTxt = `
            <div class="role-card">
            <div class="min-box size-m">
                <img src="${animeCover}" alt="image of ${animeTitle}" loading="lazy">
                <a href="/anime/?id=${animeID}">${animeTitle} - <b>${position}</b></a> 
            </div>
            `;
            $("#anime-container").append(htmlTxt);
        }

        if ($("#anime-container").html() == "") {
            $("#anime-container").html("n/a");
            $("#anime-container").parent().find($(".click-to-show-more")).trigger("click");
        }

    }).catch(err => console.error(err));


    mal.getPersonManga(personID).then(res => {
        let data = res.data;

        $("#manga-container").html("");

        for (let x in data) {
            let mangaID = data[x].manga.mal_id;
            let mangaCover = data[x].manga.images.webp.image_url;
            let mangaTitle = data[x].manga.title;

            let position = data[x].position;

            // fix bug in API
            if (position.indexOf("add") < 3) {
                position = position.substring(3, position.length);
            }

            let htmlTxt = `
            <div class="role-card">
            <div class="min-box size-m">
                <img src="${mangaCover}" alt="image of ${mangaTitle}" loading="lazy">
                <a href="/manga/?id=${mangaID}">${mangaTitle} - <b>${position}</b></a> 
            </div>
            `;
            $("#manga-container").append(htmlTxt);
        }

        if ($("#manga-container").html() == "") {
            $("#manga-container").html("n/a");
            $("#manga-container").parent().find($(".click-to-show-more")).trigger("click");
        }

    }).catch(err => console.error(err));



})