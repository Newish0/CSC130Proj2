$(() => {


    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    let mal = new Jikan4();
    let animeID = params.id;



    displayAnime();



    function displayAnime() {

        // hide panel till ready
        $(".panel-container > *").hide();

        // add in loader
        $("main").append('<div class="loader center"></div>');

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
            $("title").html(`${pageTitle} - UsagiDB`);


            title.html(data.title);
            altTitle.html(data.title_english);
            cover.attr("src", data.images.webp.image_url);
            cover.fadeIn(200);

            let tagsHTMLText = "";
            for (let x in data.genres) {
                let name = data.genres[x].name;
                let id = data.genres[x].mal_id;
                tagsHTMLText += `<a class="tag clean-url" href="/search/anime/?genre=${id}~${encodeURIComponent(name)}">${name}</a>`
            }

            for (let x in data.themes) {
                let name = data.themes[x].name;
                let id = data.themes[x].mal_id;
                tagsHTMLText += `<a class="tag clean-url" href="/search/anime/?genre=${id}~${encodeURIComponent(name)}">${name}</a>`
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
                producersHTMLText += `<a class="tag clean-url" href="/search/anime/?producer=${id}~${encodeURIComponent(name)}">${name}</a>`
            }
            producers.html(producersHTMLText);

            let studiosHTMLText = "";
            for (let x in data.studios) {
                let name = data.studios[x].name;
                let id = data.studios[x].mal_id;
                studiosHTMLText += `<a class="tag clean-url" href="/search/anime/?producer=${id}~${encodeURIComponent(name)}">${name}</a>`
            }
            studios.html(studiosHTMLText);

            source.html(data.source);

            let genresHTMLText = "";
            for (let x in data.genres) {
                let name = data.genres[x].name;
                let id = data.genres[x].mal_id;
                genresHTMLText += `<a class="tag clean-url" href="/search/anime/?genre=${id}~${encodeURIComponent(name)}">${name}</a>`
            }
            genres.html(genresHTMLText);

            let themesHTMLText = "";
            for (let x in data.themes) {
                let name = data.themes[x].name;
                let id = data.themes[x].mal_id;
                themesHTMLText += `<a class="tag clean-url" href="/search/anime/?genre=${id}~${encodeURIComponent(name)}">${name}</a>`
            }

            themesHTMLText = themesHTMLText == "" ? "n/a" : themesHTMLText;

            themes.html(themesHTMLText);


            rating.html(data.rating);

            let demographicsHTMLText = "";
            for (let x in data.demographics) {
                let name = data.demographics[x].name;
                let id = data.demographics[x].mal_id;
                demographicsHTMLText += `<a class="tag clean-url" href="/search/anime/?demographic=${id}~${encodeURIComponent(name)}">${name}</a>`
            }

            demographicsHTMLText = demographicsHTMLText == "" ? "n/a" : demographicsHTMLText;

            demographics.html(demographicsHTMLText);

            synopsis.html(data.synopsis);
            background.html(data.background != null ? data.background : "n/a");


            if(data.score != null) {
                initNumberLoadingAnimation("#score", data.score, 1000, false, 2);
            } else {
                score.html("n/a");
            }

            if(data.scored_by != null) {
                initNumberLoadingAnimation("#score-population", data.scored_by, 2000, true, 0);
            } else {
                scorePopulation.html("n/a");
            }



            // now ready to display the basic data
            $(".panel-container > *").fadeIn(100);

            $("main > .loader").remove();


            const loadScoreDistribution = () => {
                mal.getAnimeStatistics(animeID).then(statRes => {
                    let statData = statRes.data;
                    let scores = statData.scores;
                    for (let x in scores) {
                        $(`#score-figure-c${scores[x].score} .column-bar`).css("height", `max(1px, ${scores[x].percentage}%)`)
                        // $(`#score-figure-c${scores[x].score} .column-bar`).css("height", `calc(100% - 1rem)`)
                        // $(`#score-figure-c${scores[x].score} .column-bar`).css("background", `linear-gradient(to top, var(--paradise-pink), var(--paradise-pink) max(1px, calc(${scores[x].percentage}%)), var(--paradise-pink-a1) max(1px, calc(${scores[x].percentage}%)), var(--paradise-pink-a1) calc(100% - max(1px, calc(${scores[x].percentage}%))))`)

                        $(`#score-figure-c${scores[x].score} .column-bar`).attr("title", `${scores[x].percentage}% (${scores[x].votes.toLocaleString(undefined)} votes)`)
                    }
                }).catch(err => {
                    if (err == "Jikan4 API errored with response: 429") {
                        setTimeout(loadScoreDistribution, 1000);
                    } else {
                        console.error(err);
                    }
                });
            }

            loadScoreDistribution();




            const loadRelated = () => {

                mal.getAnimeRelations(animeID).then(relaRes => {
                    let relationHTMLText = "";
                    let relaData = relaRes.data;

                    for (let x in relaData) {
                        let entries = relaData[x].entry;
                        let relation = relaData[x].relation;

                        let relationBlockHTMLText = "";

                        for (let y in entries) {
                            let entry = entries[y];
                            let entryHTMLText = "";

                            entryHTMLText = `<a href="/${entry.type}/?id=${entry.mal_id}" class="clean-url url-item">${entry.name}</a>`;

                            relationBlockHTMLText += entryHTMLText;
                        }

                        relationBlockHTMLText = `<div>${relation}: ${relationBlockHTMLText}</div>`;

                        relationHTMLText += relationBlockHTMLText;
                    }

                    relationHTMLText = relationHTMLText == "" ? "n/a" : relationHTMLText;

                    $("#related").html(relationHTMLText);

                }).catch(err => {
                    if (err == "Jikan4 API errored with response: 429") {
                        setTimeout(loadRelated, 1000);
                    } else {
                        console.error(err);
                    }
                });
            }

            loadRelated();


            const loadCharacters = () => {
                mal.getAnimeCharacters(animeID).then(charRes => {
                    let charData = charRes.data;
                    let charactersHTMLText = "";
                    for (let x in charData) {
                        let charName = charData[x].character.name;
                        let charImgURL = charData[x].character.images.jpg.image_url;
                        let charID = charData[x].character.mal_id;
                        let charRole = charData[x].role;


                        charRole = charRole == undefined ? "n/a" : charRole;

                        let charHTMLText = `
                        <a href="/character/?id=${charID}" class="clean-url black">
                            <img class="character-img"
                                src="${charImgURL}"
                                alt="character image of ${charName}"
                                loading="lazy">
                            <div>
                                <span class="character-name">${charName}</span> (<span class="character-role">${charRole}</span>)
                            </div>
                        </a>
                        `;

                        let vaWrapperHTMLText = "";

                        let voiceActors = charData[x].voice_actors;


                        // load in JP VA first
                        for (let y in voiceActors) {
                            let vaName = voiceActors[y].person.name;
                            let vaID = voiceActors[y].person.mal_id;
                            let vaImgURL = voiceActors[y].person.images.jpg.image_url;



                            let vaCardsHTMLText = `
                                <a href="/people/?id=${vaID}" class="clean-url black">
                                    <div class="character-va-scard">
                                        <img class="character-va-img" src="${vaImgURL}" 
                                        alt="image of ${vaName}, voice actor for ${charName}" 
                                        loading="lazy">
                                        <div class="character-va-name">${vaName}</div>
                                    </div>
                                </a>
                                `;

                            // load in JP VA first
                            // then load in the rest of the VA (non-native)
                            if (voiceActors[y].language == "Japanese") {
                                vaWrapperHTMLText = vaCardsHTMLText + vaWrapperHTMLText;
                            } else {
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
                    if (err == "Jikan4 API errored with response: 429") {
                        setTimeout(loadCharacters, 1000);
                    } else {
                        console.error(err);
                    }
                });
            }

            loadCharacters();


            const loadStaffs = () => {
                mal.getAnimeStaff(animeID).then(staffsRes => {
                    let staffsData = staffsRes.data;
                    let staffsHTMLText = "";
                    for (let x in staffsData) {
                        let staffName = staffsData[x].person.name;
                        let staffImgURL = staffsData[x].person.images.jpg.image_url;
                        let staffID = staffsData[x].person.mal_id;
                        let staffRoles = staffsData[x].positions;
                        let staffRolesText = "";
                        for (let y in staffRoles) {
                            staffRolesText += staffRoles[y] + ", ";
                        }

                        staffRolesText = staffRolesText.substring(0, staffRolesText.length - 2);


                        let staffHTMLText = `
                        <a href="/people/?id=${staffID}" class="clean-url black">
                            <img class="character-img"
                                src="${staffImgURL}"
                                alt="character image of ${staffName}"
                                loading="lazy">
                            <div>
                                <span class="character-name">${staffName}</span> (<span class="character-role">${staffRolesText}</span>)
                            </div>
                        </a>
                        `;



                        let staffCard = `
                        <div class="character-card">
                        ${staffHTMLText}
                        </div>
                        `;

                        staffsHTMLText += staffCard;
                    }

                    $("#staffs").html(staffsHTMLText);

                }).catch(err => {
                    if (err == "Jikan4 API errored with response: 429") {
                        setTimeout(loadStaffs, 1000);
                    } else {
                        console.error(err);
                    }
                });
            }

            loadStaffs();


            const loadExternalLinks = () => {
                mal.getAnimeExternal(animeID).then(extRes => {
                    let extData = extRes.data;
                    let externalsHTMLText = "";

                    externalsHTMLText += `
                        <a class="tag clean-url" href="${data.url}">
                            <img src="https://www.google.com/s2/favicons?domain=${(new URL(data.url)).hostname}?size=64">
                            MyAnimeList
                        </a>
                        `;

                    for (let x in extData) {
                        let name = extData[x].name;
                        let url = extData[x].url;
                        let hostname = (new URL(url)).hostname;

                        if (name == "" || name == null) {
                            name = hostname.replace("www.", "");
                        }

                        // COMMENT: we could try to use the standard favicon protocol, but some sites doesn't work, so we are using Google
                        // standard favicon protocol:  <img src="http://${hostname}/favicon.ico">
                        externalsHTMLText += `
                        <a class="tag clean-url" href="${url}">
                            <img src="https://www.google.com/s2/favicons?domain=${hostname}?size=64">
                            ${name}
                        </a>
                        `;

                    }

                    $("#externals").html(externalsHTMLText);
                }).catch(err => {
                    if (err == "Jikan4 API errored with response: 429") {
                        setTimeout(loadExternalLinks, 1000);
                    } else {
                        console.error(err);
                    }
                });
            }

            loadExternalLinks();


            const loadSongThemes = () => {
                mal.getAnimeThemes(animeID).then(themeRes => {
                    let themeData = themeRes.data;
                    let themesHTMLText = "";

                    let opHTMLText = "";



                    for (let i in themeData.openings) {
                        opHTMLText += `
                        <a href="//music.youtube.com/search?q=${encodeURI(themeData.openings[i].replace(/\d*(: )/, ""))}" class="clean-url url-item">${themeData.openings[i]}</a>
                        `;
                    }

                    opHTMLText = `<div class="tags-container">Openings: ${opHTMLText == "" ? "No opening found." : opHTMLText}</div>`;

                    let edHTMLText = "";

                    for (let i in themeData.endings) {
                        edHTMLText += `
                        <a href="//music.youtube.com/search?q=${encodeURI(themeData.endings[i].replace(/\d*(: )/, ""))}" class="clean-url url-item">${themeData.endings[i]}</a>
                        `;
                    }

                    edHTMLText = `<div class="tags-container">Endings: ${edHTMLText == "" ? "No ending found." : edHTMLText}</div>`;


                    themesHTMLText += opHTMLText;
                    themesHTMLText += edHTMLText;


                    $("#song-themes").html(themesHTMLText);
                }).catch(err => {
                    if (err == "Jikan4 API errored with response: 429") {
                        setTimeout(loadSongThemes, 1000);
                    } else {
                        console.error(err);
                    }
                });
            }

            loadSongThemes();


            const loadVidoes = () => {
                mal.getAnimeVideos(animeID).then(vidRes => {
                    let vidData = vidRes.data;
                    let promos = vidData.promo;
                    let videosHTMLText = "";


                    for (let i in promos) {
                        videosHTMLText += `
                        <br>
                        <div class="video-preview-container card padding-medium margin-medium">
                        <a class="clean-url" href="${promos[i].trailer.url}">
                        <h6>${promos[i].title}</h6>
                        <img src="${promos[i].trailer.images.image_url}">
                        </a>
                        </div>
                        `;
                    }

                    $("#videos").html(videosHTMLText);
                }).catch(err => {
                    if (err == "Jikan4 API errored with response: 429") {
                        setTimeout(loadVidoes, 1000);
                    } else {
                        console.error(err);
                    }
                });
            }

            loadVidoes();


        }).catch(err => {
            if (err == "Jikan4 API errored with response: 429") {
                setTimeout(displayAnime, 1000)
            } else {
                displayErrorPage(err.split(":")[1]);
                console.error(err);
            }
        });
    }


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