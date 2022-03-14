$(() => {


    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    let mal = new Jikan4();
    let animeID = params.id;

    mal.getAnimeById(animeID).then(res => {
        let data = res.data;

        let title = $("#title");
        let altTitle = $("#alt-title");
        let tags = $("#tags");
        let cover = $("#cover");
        let status = $("#status");
        let statusIcon = $("#status-icon");
        let type = $("#type");
        let episodes = $("#episodes");
        let duration = $("#duration");
        let date = $("#date");
        let season = $("#season");
        let schedule = $("#schedule");
        let producers = $("#producers");
        let studios = $("#studios");
        let source = $("#source");
        let genres = $("#genres");
        let themes = $("#themes");
        let rating = $("#rating");
        let demographics = $("#demographics");
        let synopsis = $("#synopsis");
        let background = $("#background");
        let score = $("#score");
        let scorePopulation = $("#score-population");
        let scoreFigure = $("#score-figure");


        // set page/tab title
        let pageTitle = "";

        pageTitle += data.title;
        if (data.title_english != null) { pageTitle += data.title_english };
        $("title").html(pageTitle);


        title.html(data.title);
        altTitle.html(data.title_english);
        cover.attr("src", data.images.webp.image_url);

        let tagsHTMLText = "";
        for (let x in data.genres) {
            let name = data.genres[x].name;
            let id = data.genres[x].mal_id;
            tagsHTMLText += `<a class="tag clean-url" href="../?genre=${id}">${name}</a>`
        }

        for (let x in data.themes) {
            let name = data.themes[x].name;
            let id = data.themes[x].mal_id;
            tagsHTMLText += `<a class="tag clean-url" href="../?genre=${id}">${name}</a>`
        }

        tags.html(tagsHTMLText);

        status.html(data.status);
        statusIcon.removeClass("status-completed");
        statusIcon.removeClass("status-ongoing");
        statusIcon.addClass(data.airing ? "status-ongoing" : "status-completed");

        type.html(data.type);
        episodes.html(data.episodes);
        duration.html(data.duration);
        date.html(data.aired.string);
        season.html(data.season != null ? toTitleCase(data.season) : "n/a");
        schedule.html(data.broadcast.string == null ? "n/a" : data.broadcast.string);

        let producersHTMLText = "";
        for (let x in data.producers) {
            let name = data.producers[x].name;
            let id = data.producers[x].mal_id;
            producersHTMLText += `<a class="tag clean-url" href="../?genre=${id}">${name}</a>`
        }
        producers.html(producersHTMLText);

        let studiosHTMLText = "";
        for (let x in data.studios) {
            let name = data.studios[x].name;
            let id = data.studios[x].mal_id;
            studiosHTMLText += `<a class="tag clean-url" href="../?genre=${id}">${name}</a>`
        }
        studios.html(studiosHTMLText);

        source.html(data.source);

        let genresHTMLText = "";
        for (let x in data.genres) {
            let name = data.genres[x].name;
            let id = data.genres[x].mal_id;
            genresHTMLText += `<a class="tag clean-url" href="../?genre=${id}">${name}</a>`
        }
        genres.html(genresHTMLText);

        let themesHTMLText = "";
        for (let x in data.themes) {
            let name = data.themes[x].name;
            let id = data.themes[x].mal_id;
            themesHTMLText += `<a class="tag clean-url" href="../?genre=${id}">${name}</a>`
        }
        themes.html(themesHTMLText);


        rating.html(data.rating);

        let demographicsHTMLText = "";
        for (let x in data.demographics) {
            let name = data.demographics[x].name;
            let id = data.demographics[x].mal_id;
            demographicsHTMLText += `<a class="tag clean-url" href="../?genre=${id}">${name}</a>`
        }
        demographics.html(demographicsHTMLText);

        synopsis.html(data.synopsis);
        background.html(data.background != null ? data.background : "n/a");

        //score.html(data.score);
        initNumberLoadingAnimation("#score", data.score, 1000, false, 2);
        //scorePopulation.html(data.scored_by.toLocaleString(undefined));
        initNumberLoadingAnimation("#score-population", data.scored_by, 2000, true, 0);


        const loadScoreDistribution = () => {
            mal.getAnimeStatistics(animeID).then(statRes => {
                let statData = statRes.data;
                let scores = statData.scores;
                for (let x in scores) {
                    $(`#score-figure-c${scores[x].score} .column-bar`).css("height", `max(1px, calc(${scores[x].percentage}%))`)
                    $(`#score-figure-c${scores[x].score} .column-bar`).attr("title", `${scores[x].percentage}% (${scores[x].votes.toLocaleString(undefined)} votes)`)
                }
            }).catch(err => {
                setTimeout(loadScoreDistribution, 1000);
            });
        }

        loadScoreDistribution();
        

        const loadCharacters = () => {
            mal.getAnimeCharacters(animeID).then(statRes => {
                let charData = statRes.data;
                let charactersHTMLText = "";
                for (let x in charData) {
                    let charName = charData[x].character.name;
                    let charImgURL = charData[x].character.images.jpg.image_url;
                    let charID = charData[x].character.mal_id;
                    let charRole = charData[x].role;


                    charRole = charRole == undefined ? "n/a" : charRole;



                    let charHTMLText = `
                    <img class="character-img"
                        src="${charImgURL}"
                        alt="character image of ${charName}"
                        loading="lazy">
                    <div>
                        <span class="character-name">${charName}</span> (<span class="character-role">${charRole}</span>)
                    </div>
                    `;

                    let vaWrapperHTMLText = "";

                    let voiceActors = charData[x].voice_actors;


                    // load in JP VA first
                    for (let y in voiceActors) {
                        if (voiceActors[y].language == "Japanese") {
                            let vaName = voiceActors[y].person.name;
                            let vaImgURL = voiceActors[y].person.images.jpg.image_url;



                            let vaCardsHTMLText = `
                            <div class="character-va-scard">
                                <img class="character-va-img" src="${vaImgURL}" 
                                alt="image of ${vaName}, voice actor for ${charName}" 
                                loading="lazy">
                                <div class="character-va-name">${vaName}</div>
                            </div>
                            `;

                            vaWrapperHTMLText += vaCardsHTMLText;
                        }
                    }


                    // load in the rest of the VA (non-native)
                    for (let y in voiceActors) {
                        if (voiceActors[y].language != "Japanese") {
                            let vaName = voiceActors[y].person.name;
                            let vaImgURL = voiceActors[y].person.images.jpg.image_url;



                            let vaCardsHTMLText = `
                        <div class="character-va-scard">
                            <img class="character-va-img" src="${vaImgURL}" 
                            alt="image of ${vaName}, voice actor for ${charName}" 
                            loading="lazy">
                            <div class="character-va-name">${vaName}</div>
                        </div>
                        `;

                            vaWrapperHTMLText += vaCardsHTMLText;
                        }
                    }

                    vaWrapperHTMLText = `
                    <div class="character-va-wrapper">
                    ${vaWrapperHTMLText}
                    </div>
                    `;

                    let charCard = `
                    <div class="character-card">
                    ${charHTMLText}
                    ${vaWrapperHTMLText}
                    </div>
                    `;


                    charactersHTMLText += charCard;
                }

                $("#characters").html(charactersHTMLText);
            }).catch(err => {
                setTimeout(loadCharacters, 1000);
            });;
        }

        loadCharacters();


        console.log(res)
    })


    function initNumberLoadingAnimation(elnQueryString, number, timeLength, formatOutput, decimalPlaces) {
        const eln = $(elnQueryString);
        const interval = 20; // 20ms
        const numCalls = timeLength / interval;
        const slice = number / numCalls;
        let i = 0;

        if (formatOutput) {
            eln.html("0".toLocaleString(undefined, {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces
            }));
        } else {
            eln.html(0);
        }

        setTimeout(initNumberLoadingAnimationCallback, interval);
        function initNumberLoadingAnimationCallback() {
            let p = i / numCalls;
            let adjustedP = easeOutQuart(p);

            if (i < numCalls) {
                eln.html((number * adjustedP).toLocaleString(undefined, {
                    minimumFractionDigits: decimalPlaces,
                    maximumFractionDigits: decimalPlaces
                }));
                i++;
                setTimeout(initNumberLoadingAnimationCallback, interval);
            } else {
                eln.html(number.toLocaleString(undefined, {
                    minimumFractionDigits: decimalPlaces,
                    maximumFractionDigits: decimalPlaces
                }));
            }
        }
    }

    // Cheat sheet: https://easings.net/
    function easeOutCirc(x) {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
    }

    function easeOutQuart(x) {
        return 1 - Math.pow(1 - x, 4);
    }


    // Source: https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
    function toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }
})