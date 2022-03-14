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

        score.html(data.score);
        scorePopulation.html(data.scored_by.toLocaleString(undefined));

        const loadScoreDistribution = () => {
            mal.getAnimeStatistics(animeID).then(statRes => {
                let statData = statRes.data;
                let scores = statData.scores;
                for (let x in scores) {
                    $(`#score-figure-c${scores[x].score} .column-bar`).css("height", `max(1px, calc(${scores[x].percentage}%))`)
                    $(`#score-figure-c${scores[x].score} .column-bar`).attr("title", `${scores[x].percentage}% (${scores[x].votes.toLocaleString(undefined)} votes)`)
                }
            });
        }

        try {
            loadScoreDistribution();
        } catch (error) {
            setTimeout(loadScoreDistribution, 1000);
        }

        console.log(res)
    })


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