/**
 * A wrapper for JikanV4.
 * Jikan is an Unofficial MyAnimeList API.
 * It scrapes the website to satisfy the need for a complete API - which MyAnimeList lacks.
 * See the official doc for API specification at https://docs.api.jikan.moe/
 *
 * Comment: Written specifically for CSC130 Project 2, but encapsulation should be decent.
 * @class Jikan4 a wrapper for the JikanV4 API
 */
class Jikan4 {
    #cacheConfig;

    constructor({
        baseURL = "https://api.jikan.moe/v4",
        cacheConfig = {
            useCache: true,
            life: 1000 * 60 * 10, // 10 minutes
            type: "session", // options: "session" "persistent"
            prefix: "JikanCache-", // prefix in the key name used in storage
            limit: 32, // cache a maximum of n API return data
        },
        autoRateLimit = true
    } = {}) {
        this.baseURL = baseURL;
        this.lastReqURL = "";
        this.lastResData = null;
        this.autoRateLimit = autoRateLimit;

        this.#cacheConfig = cacheConfig;

        this.tokenBucket = new TokenBucketRateLimiter({
            maxRequests: 3,
            timeFrame: 1600 // time in ms (600ms buffer)
        });
    }

    // *******************
    // functions for anime
    // *******************

    async getAnimeById(id) {
        return this.get(`${this.baseURL}/anime/${id}`);
    }

    async getAnimeCharacters(id) {
        return this.get(`${this.baseURL}/anime/${id}/characters`);
    }

    async getAnimeStaff(id) {
        return this.get(`${this.baseURL}/anime/${id}/staff`);
    }

    async getAnimeEpisodes(id) {
        return this.get(`${this.baseURL}/anime/${id}/episodes`);
    }

    async getAnimeEpisodeById(id, episode) {
        return this.get(`${this.baseURL}/anime/${id}/episodes/${episode}`);
    }

    async getAnimeNews(id) {
        return this.get(`${this.baseURL}/anime/${id}/news`);
    }

    async getAnimeForum(id) {
        return this.get(`${this.baseURL}/anime/${id}/forum`);
    }

    async getAnimeVideos(id) {
        return this.get(`${this.baseURL}/anime/${id}/videos`);
    }

    async getAnimePictures(id) {
        return this.get(`${this.baseURL}/anime/${id}/pictures`);
    }

    async getAnimeStatistics(id) {
        return this.get(`${this.baseURL}/anime/${id}/statistics`);
    }

    async getAnimeMoreInfo(id) {
        return this.get(`${this.baseURL}/anime/${id}/moreinfo`);
    }

    async getAnimeRecommendations(id) {
        return this.get(`${this.baseURL}/anime/${id}/recommendations`);
    }

    async getAnimeUserUpdates(id) {
        return this.get(`${this.baseURL}/anime/${id}/userupdates`);
    }

    async getAnimeReviews(id) {
        return this.get(`${this.baseURL}/anime/${id}/reviews`);
    }

    async getAnimeRelations(id) {
        return this.get(`${this.baseURL}/anime/${id}/relations`);
    }

    async getAnimeThemes(id) {
        return this.get(`${this.baseURL}/anime/${id}/themes`);
    }

    async getAnimeExternal(id) {
        return this.get(`${this.baseURL}/anime/${id}/external`);
    }

    async getAnimeSearch({
        page = 1, // int
        limit = 25, // int - max 25
        q = "", // string - query string
        type = "", // string - "tv" "movie" "ova" "special" "ona" "music"
        minScore = 0, // number - int 0
        maxScore = 10, // number - int 10
        status = "", // string - "airing" "complete" "upcoming"
        rating = "", // string - "g" "pg" "pg13" "r17" "r" "rx"
        sfw = true, // boolean - filter out Adult entries
        genres = "", // filter by genre(s) IDs. Can pass multiple with a comma as a delimiter.
        genresExclude = "", // exclude  genre(s) IDs. Can pass multiple with a comma as a delimiter.
        orderBy = "score", // string - "mal_id" "title" "type" "rating" "start_date" "end_date" "episodes" "score" "scored_by" "rank" "popularity" "members" "favorites"
        sort = "desc", // string - "desc" "asc"
        letter = "", // string - return entries starting with the given letter
        producers = "", // string - filter by producer(s) IDs. Can pass multiple with a comma as a delimiter. e.g 1,2,3
    } = {}) {
        q = encodeURIComponent(q);
        type = encodeURIComponent(type);
        status = encodeURIComponent(status);
        rating = encodeURIComponent(rating);
        genres = encodeURIComponent(genres);
        genresExclude = encodeURIComponent(genresExclude);
        orderBy = encodeURIComponent(orderBy);
        sort = encodeURIComponent(sort);
        letter = encodeURIComponent(letter);
        producers = encodeURIComponent(producers);

        let url = `${this.baseURL}/anime?page=${page}&limit=${limit}&order_by=${orderBy}&sort=${sort}&sfw=${sfw}`;

        if (q != "") {
            url += `&q=${q}`;
        }

        if (type != "") {
            url += `&type=${type}`;
        }

        if (minScore != 0) {
            url += `&min_score=${minScore}`;
        }

        if (maxScore != 10) {
            url += `&max_score=${maxScore}`;
        }

        if (status != "") {
            url += `&status=${status}`;
        }

        if (rating != "") {
            url += `&rating=${rating}`;
        }

        if (genres != "") {
            url += `&genres=${genres}`;
        }

        if (genresExclude != "") {
            url += `&genres_exclude=${genresExclude}`;
        }

        if (letter != "") {
            url += `&letter=${letter}`;
        }

        if (producers != "") {
            url += `&producers=${producers}`;
        }

        return this.get(url);
    }

    // ************************
    // functions for characters
    // ************************

    async getCharacterById(id) {
        return this.get(`${this.baseURL}/characters/${id}`);
    }

    async getCharacterAnime(id) {
        return this.get(`${this.baseURL}/characters/${id}/anime`);
    }

    async getCharacterManga(id) {
        return this.get(`${this.baseURL}/characters/${id}/manga`);
    }

    async getCharacterVoiceActors(id) {
        return this.get(`${this.baseURL}/characters/${id}/voices`);
    }

    async getCharacterPictures(id) {
        return this.get(`${this.baseURL}/characters/${id}/pictures`);
    }

    async getCharactersSearch({
        page = 1, // int
        limit = 25, // int - max 25
        q = "", // string - query string
        orderBy = "favorites", // string - "mal_id" "name" "favorites"
        sort = "desc", // string - "desc" "asc"
        letter = "", // string - return entries starting with the given letter
    } = {}) {
        q = encodeURIComponent(q);
        orderBy = encodeURIComponent(orderBy);
        sort = encodeURIComponent(sort);
        letter = encodeURIComponent(letter);

        let url = `${this.baseURL}/characters?page=${page}&limit=${limit}&q=${q}&order_by=${orderBy}&sort=${sort}`;

        // fix invalid search when letter = ""
        if (letter != "") {
            url += `&letter=${letter}`;
        }

        return this.get(url);
    }

    // *******************
    // functions for clubs
    // *******************

    async getClubsById(id) {
        return this.get(`${this.baseURL}/clubs/${id}`);
    }

    async getClubMembers(id) {
        return this.get(`${this.baseURL}/clubs/${id}/members`);
    }

    async getClubRelations(id) {
        return this.get(`${this.baseURL}/clubs/${id}/relations`);
    }

    async getClubsSearch({
        page = 1, // int
        limit = 25, // int - max 25
        q = "", // string - query string
        type = "", // string - "public" "private" "secret"
        category = "", // string - "anime" "manga" "actors_and_artists" "characters" "cities_and_neighborhoods" "companies" "conventions" "games" "japan" "music" "other" "schools"
        orderBy = "members_count", // string - "mal_id" "title" "members_count" "pictures_count" "created"
        sort = "desc", // string - "desc" "asc"
        letter = "", // string - return entries starting with the given letter
    } = {}) {
        q = encodeURIComponent(q);
        type = encodeURIComponent(type);
        category = encodeURIComponent(category);
        orderBy = encodeURIComponent(orderBy);
        sort = encodeURIComponent(sort);
        letter = encodeURIComponent(letter);

        let url = `${this.baseURL}/characters?page=${page}&limit=${limit}&q=${q}&type=${type}&category=${category}&order_by=${orderBy}&sort=${sort}`;

        // fix invalid search when letter = ""
        if (letter != "") {
            url += `&letter=${letter}`;
        }

        return this.get(url);
    }

    // *******************
    // functions for genre
    // *******************

    async getAnimeGenres({
        page = 1, // int
        limit = 1000, // int -
        filter = "genres", // string - "genres" "explicit_genres" "themes" "demographics"
    } = {}) {
        filter = encodeURIComponent(filter);

        let url = `${this.baseURL}/genres/anime?page=${page}&limit=${limit}&filter=${filter}`;

        let result = await this.get(url);
        // addresses duplicate result API glitch
        this.#removeDuplicateInArray(result.data, "mal_id");

        return result;
    }

    async getMangaGenres({
        page = 1, // int
        limit = 1000, // int -
        filter = "genres", // string - "genres" "explicit_genres" "themes" "demographics"
    } = {}) {
        filter = encodeURIComponent(filter);

        let url = `${this.baseURL}/genres/manga?page=${page}&limit=${limit}&filter=${filter}`;

        let result = await this.get(url);
        // addresses duplicate result API glitch
        this.#removeDuplicateInArray(result.data, "mal_id");

        return result;
    }

    // ***********************
    // functions for magazines
    // ***********************

    async getMagazines({
        page = 1, // int
        limit = 100, // int - max 100
        q = "", // string - query string
        orderBy = "mal_id", // string - "mal_id" "name"
        sort = "desc", // string - "desc" "asc"
        letter = "", // string - return entries starting with the given letter
    } = {}) {

        q = encodeURIComponent(q);
        orderBy = encodeURIComponent(orderBy);
        sort = encodeURIComponent(sort);
        letter = encodeURIComponent(letter);

        let url = `${this.baseURL}/magazines?page=${page}&limit=${limit}&q=${q}&order_by=${orderBy}&sort=${sort}`;

        if (letter != "") {
            `&letter=${letter}`;
        }

        return this.get(url);
    }

    // *******************
    // functions for manga
    // *******************

    async getMangaById(id) {
        return this.get(`${this.baseURL}/manga/${id}`);
    }

    async getMangaCharacters(id) {
        return this.get(`${this.baseURL}/manga/${id}/characters`);
    }

    async getMangaNews(id) {
        return this.get(`${this.baseURL}/manga/${id}/news`);
    }

    async getMangaTopics(id) {
        return this.get(`${this.baseURL}/manga/${id}/forum`);
    }

    async getMangaPictures(id) {
        return this.get(`${this.baseURL}/manga/${id}/pictures`);
    }

    async getMangaStatistics(id) {
        return this.get(`${this.baseURL}/manga/${id}/statistics`);
    }

    async getMangaMoreInfo(id) {
        return this.get(`${this.baseURL}/manga/${id}/moreinfo`);
    }

    async getMangaRecommendations(id) {
        return this.get(`${this.baseURL}/manga/${id}/recommendations`);
    }

    async getMangaUserUpdates(id) {
        return this.get(`${this.baseURL}/manga/${id}/userupdates`);
    }

    async getMangaReviews(id) {
        return this.get(`${this.baseURL}/manga/${id}/reviews`);
    }

    async getMangaRelations(id) {
        return this.get(`${this.baseURL}/manga/${id}/relations`);
    }

    async getMangaExternal(id) {
        return this.get(`${this.baseURL}/manga/${id}/external`);
    }

    async getMangaSearch({
        page = 1, // int
        limit = 25, // int - max 25
        q = "", // string - query string
        type = "", // string - "tv" "movie" "ova" "special" "ona" "music"
        minScore = 0, // number - int 0
        maxScore = 10, // number - int 10
        status = "", // string - "airing" "complete" "upcoming"
        rating = "", // string - "g" "pg" "pg13" "r17" "r" "rx"
        sfw = true, // boolean - filter out Adult entries
        genres = 0, // filter by genre(s) IDs. Can pass multiple with a comma as a delimiter.
        genresExclude = 0, // exclude  genre(s) IDs. Can pass multiple with a comma as a delimiter.
        orderBy = "score", // string - "mal_id" "title" "type" "rating" "start_date" "end_date" "episodes" "score" "scored_by" "rank" "popularity" "members" "favorites"
        sort = "desc", // string - "desc" "asc"
        letter = "", // string - return entries starting with the given letter
        magazines = "", // int - filter by producer(s) IDs. Can pass multiple with a comma as a delimiter. e.g 1,2,3
    } = {}) {
        q = encodeURIComponent(q);
        type = encodeURIComponent(type);
        status = encodeURIComponent(status);
        rating = encodeURIComponent(rating);
        genres = encodeURIComponent(genres);
        genresExclude = encodeURIComponent(genresExclude);
        orderBy = encodeURIComponent(orderBy);
        sort = encodeURIComponent(sort);
        letter = encodeURIComponent(letter);
        magazines = encodeURIComponent(magazines);

        let url = `${this.baseURL}/manga?page=${page}&limit=${limit}&q=${q}&min_score=${minScore}&max_score=${maxScore}&sfw=${sfw}&genres=${genres}&genres_exclude=${genresExclude}&order_by=${orderBy}&sort=${sort}`;


        if (type != "") {
            url += `&type=${type}`;
        }

        if (status != "") {
            url += `&status=${status}`;
        }

        if (rating != "") {
            url += `&rating=${rating}`;
        }

        if (magazines != "") {
            url += `&magazines=${magazines}`;
        }



        if (letter != "") {
            url += `&letter=${letter}`;
        }

        return this.get(url);
    }

    // *******************
    // functions for people
    // *******************

    async getPersonById(id) {
        return this.get(`${this.baseURL}/people/${id}`);
    }

    async getPersonAnime(id) {
        return this.get(`${this.baseURL}/people/${id}/anime`);
    }

    async getPersonVoices(id) {
        return this.get(`${this.baseURL}/people/${id}/voices`);
    }

    async getPersonManga(id) {
        return this.get(`${this.baseURL}/people/${id}/manga`);
    }

    async getPersonPictures(id) {
        return this.get(`${this.baseURL}/people/${id}/pictures`);
    }

    async getPeopleSearch({
        page = 1, // int
        limit = 25, // int - max 25
        q = "", // string - query string
        type = "", // string - "tv" "movie" "ova" "special" "ona" "music"
        orderBy = "name", // string - "mal_id" "name" "birthday" "favorites"
        sort = "desc", // string - "desc" "asc"
        letter = "", // string - return entries starting with the given letter
    } = {}) {
        q = encodeURIComponent(q);
        type = encodeURIComponent(type);
        orderBy = encodeURIComponent(orderBy);
        sort = encodeURIComponent(sort);
        letter = encodeURIComponent(letter);

        let url = `${this.baseURL}/people?page=${page}&limit=${limit}&q=${q}&type=${type}&order_by=${orderBy}&sort=${sort}`;

        if (letter != "") {
            `&letter=${letter}`;
        }

        return this.get(url);
    }

    // ***********************
    // functions for producers
    // ***********************

    async getProducers({
        page = 1, // int
        limit = 100, // int - max 100
        q = "", // string - query string
        orderBy = "mal_id", // string - "mal_id" "name"
        sort = "desc", // string - "desc" "asc"
        letter = "", // string - return entries starting with the given letter
    } = {}) {

        q = encodeURIComponent(q);
        orderBy = encodeURIComponent(orderBy);
        sort = encodeURIComponent(sort);
        letter = encodeURIComponent(letter);

        let url = `${this.baseURL}/producers?page=${page}&limit=${limit}&q=${q}&order_by=${orderBy}&sort=${sort}`;

        if (letter != "") {
            `&letter=${letter}`;
        }

        return this.get(url);
    }

    // ********************
    // functions for random
    // ********************

    async getRandomAnime() {
        return this.get(`${this.baseURL}/random/anime`);
    }

    async getRandomManga() {
        return this.get(`${this.baseURL}/random/manga`);
    }

    async getRandomCharacters() {
        return this.get(`${this.baseURL}/random/characters`);
    }

    async getRandomPeople() {
        return this.get(`${this.baseURL}/random/people`);
    }

    // returns a random MAL user
    async getRandomUsers() {
        return this.get(`${this.baseURL}/random/users`);
    }

    // *****************************
    // functions for recommendations
    // *****************************

    async getRecentAnimeRecommendations() {
        return this.get(`${this.baseURL}/recommendations/anime`);
    }

    async getRecentMangaRecommendations() {
        return this.get(`${this.baseURL}/recommendations/manga`);
    }

    // *********************
    // functions for reviews
    // *********************

    async getRecentAnimeReviews() {
        return this.get(`${this.baseURL}/reviews/anime`);
    }

    async getRecentMangaReviews() {
        return this.get(`${this.baseURL}/reviews/manga`);
    }

    // ***********************
    // functions for schedules
    // ***********************

    async getAnimeSchedules({
        filter = "unknown", // string - "monday" "tuesday" "wednesday" "thursday" "friday" "unknown" "other"
    } = {}) {
        filter = encodeURIComponent(filter);

        let url = `${this.baseURL}/schedules?filter=${filter}`;
        return this.get(url);
    }

    // ***********************
    // functions for MAL users
    // ***********************

    // Currently API is broken
    // async getUserById(id) {
    //     return this.get(`${this.baseURL}/user/${id}`);
    // }

    async getUserProfile(username) {
        return this.get(`${this.baseURL}/user/${username}`);
    }

    async getUserStatistics(username) {
        return this.get(`${this.baseURL}/user/${username}/statistics`);
    }

    async getUserFavorites(username) {
        return this.get(`${this.baseURL}/user/${username}favorites`);
    }

    async getUserUpdates(username) {
        return this.get(`${this.baseURL}/user/${username}/userupdates`);
    }

    async getUserAbout(username) {
        return this.get(`${this.baseURL}/user/${username}/about`);
    }

    async getUserHistory(username) {
        return this.get(`${this.baseURL}/user/${username}/history`);
    }

    async getUserFriends(username) {
        return this.get(`${this.baseURL}/user/${username}/friends`);
    }

    /**
     * Gets the anime list of the given user
     *
     * @deprecated Anime lists will be discontinued from May 1st, 2022; use official MAL API instead. See more: https://docs.google.com/document/d/1-6H-agSnqa8Mfmw802UYfGQrceIEnAaEh4uCXAPiX5A
     * @returns {Object} API json response parsed as object if successful
     */
    async getUserAnimelist(username) {
        return this.get(`${this.baseURL}/user/${username}/animelist`);
    }

    /**
     * Gets the anime list of the given user
     *
     * @deprecated Manga lists will be discontinued from May 1st, 2022; use official MAL API instead. See more: https://docs.google.com/document/d/1-6H-agSnqa8Mfmw802UYfGQrceIEnAaEh4uCXAPiX5A
     * @returns {Object} API json response parsed as object if successful
     */
    async getUserMangaList(username) {
        return this.get(`${this.baseURL}/user/${username}/mangalist`);
    }

    async getUserReviews(username) {
        return this.get(`${this.baseURL}/user/${username}/reviews`);
    }

    async getUserRecommendations(username) {
        return this.get(`${this.baseURL}/user/${username}/recommendations`);
    }

    async getUserClubs(username) {
        return this.get(`${this.baseURL}/user/${username}/clubs`);
    }

    async getUsersSearch({
        page = 1, // int
        limit = 25, // int - max 25
        q = "", // string - query string
        gender = "any", // string - "any" "male" "female" "nonbinary"
        location = "", // string -
        minAge = 0, // int - min age
        maxAge = 1000, // int - max age
    } = {}) {
        q = encodeURIComponent(q);
        gender = encodeURIComponent(gender);
        location = encodeURIComponent(location);

        let url = `${this.baseURL}/users?page=${page}&limit=${limit}&q=${q}&gender=${gender}&location=${location}&minAge=${minAge}&maxAge=${maxAge}`;

        return this.get(url);
    }

    // *********************
    // functions for seasons
    // *********************

    async getSeason({
        page = 1, // int
        limit = 25, // int - max = 25
        year = -1, // int
        season = "auto", // string - "winter" "spring" "summer" "fall" "auto"
    } = {}) {
        let date = new Date();
        let month = date.getMonth();

        year = year === -1 ? date.getFullYear() : year;

        if (season === "auto") {
            if (4 <= month <= 6) {
                season = "spring";
            } else if (7 <= month <= 9) {
                season = "summer";
            } else if (10 <= month <= 12) {
                season = "fall";
            } else {
                // Months 01, 02, 03
                season = "winter";
            }
        }

        season = encodeURIComponent(season);

        let url = `${this.baseURL}/seasons/${year}/${season}?page=${page}&limit=${limit}`;
        return this.get(url);
    }

    async getSeasonNow({
        page = 1, // int
        limit = 25, // int - max = 25
    } = {}) {
        let url = `${this.baseURL}/seasons/now?page=${page}&limit=${limit}`;
        return this.get(url);
    }

    async getSeasonsList() {
        return this.get(`${this.baseURL}/seasons`);
    }

    async getSeasonUpcoming({
        page = 1, // int
        limit = 25, // int - max = 25
    } = {}) {
        let url = `${this.baseURL}/seasons/upcoming?page=${page}&limit=${limit}`;
        return this.get(url);
    }

    // *****************
    // functions for top
    // *****************

    async getTopAnime({
        page = 1, // int
        limit = 25, // int - max = 25
    } = {}) {
        let url = `anime?page=${page}&limit=${limit}`;
        return this.getTop(url);
    }

    async getTopManga({
        page = 1, // int
        limit = 25, // int - max = 25
    } = {}) {
        let url = `manga?page=${page}&limit=${limit}`;
        return this.getTop(url);
    }

    async getTopPeople({
        page = 1, // int
        limit = 25, // int - max = 25
    } = {}) {
        let url = `people?page=${page}&limit=${limit}`;
        return this.getTop(url);
    }

    async getTopCharacters({
        page = 1, // int
        limit = 25, // int - max = 25
    } = {}) {
        let url = `characters?page=${page}&limit=${limit}`;
        return this.getTop(url);
    }

    async getTopReviews({
        page = 1, // int
        limit = 25, // int - max = 25
    } = {}) {
        let url = `reviews?page=${page}&limit=${limit}`;
        return this.getTop(url);
    }

    async getTop(type) {
        return this.get(`${this.baseURL}/top/${type}`);
    }

    // *******************
    // functions for watch
    // *******************

    async getWatchRecentEpisodes({
        page = 1, // int
        limit = 25, // int - max = 25
    } = {}) {
        let url = `${this.baseURL}/watch/episodes?page=${page}&limit=${limit}`;
        return this.get(url);
    }

    async getWatchPopularEpisodes({
        page = 1, // int
        limit = 25, // int - max = 25
    } = {}) {
        let url = `${this.baseURL}/watch/episodes/popular?page=${page}&limit=${limit}`;
        return this.get(url);
    }

    async getWatchRecentPromos({
        page = 1, // int
        limit = 25, // int - max = 25
    } = {}) {
        let url = `${this.baseURL}/watch/promos?page=${page}&limit=${limit}`;
        return this.get(url);
    }

    async getWatchPopularPromos({
        page = 1, // int
        limit = 25, // int - max = 25
    } = {}) {
        let url = `${this.baseURL}/watch/promos/popular?page=${page}&limit=${limit}`;
        return this.get(url);
    }

    // ***************************
    // Additional useful functions
    // ***************************

    /**
     * Get the next page given by the previous API call
     *
     * @returns {Object} API json response parsed as object if successful
     * @returns {null} if there is no next page to be loaded
     */
    async getMore() {
        if (
            this.lastResData != null &&
            this.lastResData.pagination &&
            this.lastResData.pagination.has_next_page
        ) {
            let pageNum = this.#getParameterByKey("page", this.lastReqURL);
            let url = null;

            if (pageNum === null) {
                if (this.lastReqURL.match(/\/(?!.*\/)(\w*)\?/g)) {
                    url = this.lastReqURL + "&page=2";
                } else {
                    url = this.lastReqURL + "?page=2";
                }
            } else {
                url = this.lastReqURL.replace(`page=${pageNum}`, `page=${parseInt(pageNum) + 1}`
                );
            }

            return this.get(url);
        } else {
            return null;
        }
    }

    /**
     * - API fetching for all API calls made within the class
     * - Stores additonal info to class for additional functionality
     *
     * @param {string} url - url of the fetch
     * @returns {Object} API json response parsed as object
     */
    async get(url) {
        let res = null;
        let data = null;

        // try to load from cache if config allows
        if(this.#cacheConfig.useCache) {
            data = this.#getAPIDataFromCache(url);

            if (data != null) {
                this.lastReqURL = url;
                this.lastResData = data;

                return data;
            }
        }

        // wait until rate limit is expired 
        if (this.autoRateLimit) {
            // status check / backup 
            while (res == null || res.status == 429) {
                res = await this.tokenBucket.acquireToken(() => fetch(url));
            }

        } else {
            res = await fetch(url);
        }


        // retry once if got code 500
        // sometime API errors out and retrying will work
        if (res.status === 500) {
            await this.#sleep(1200);
            res = await await this.tokenBucket.acquireToken(() => fetch(url));
        }

        // parse response to json
        data = await res.json();

        // check status code of response
        if (res.status !== 200) {
            throw `Jikan4 API errored with response: ${res.status}`;
        } else {

            // check for status error in API data (sometime API does not include proper status code in header)
            if (data.status == undefined || data.status == 200) {
                this.lastReqURL = url;
                this.lastResData = data;

                // cache data if config allows
                if (this.#cacheConfig.useCache) {
                    this.#addAPIDataToCache(url, data);
                }

                return data;
            } else {
                throw `Jikan4 API errored with response: ${data.status}`;
            }
        }
    }


    // fail safe in case token bucket fails (which it will without "X-RateLimit-Reset")
    async fetchAndRetryIfNecessary(url) {
        const response = await fetch(url);
        if (response.status === 429) {
            return this.fetchAndRetryIfNecessary(url);
        }
        return response;
    }


    /**
     * Delete the item that is the oldest
     * from the cache
     * Source: https://codereview.stackexchange.com/questions/38441/function-to-delete-oldest-items-out-of-html5-localstorage-can-i-make-it-more-ef
     */
    #removeOldestFromCache() {
        let storage = null;

        if (this.#cacheConfig.type === "persistent") {
            storage = localStorage;
        } else if (this.#cacheConfig.type === "session") {
            storage = sessionStorage;
        } else {
            throw 'Invalid "type" in Jikan4 cache config';
        }

        let oldestExpiration = -1;
        let oldestKey = -1;

        let prefix = this.#cacheConfig.prefix;
        let allKeys = Object.keys(storage);

        for (let i in allKeys) {
            if (allKeys[i].substring(0, prefix.length) === prefix) {
                let cacheKey = allKeys[i];

                let item = storage.getItem(cacheKey);

                if (item != null) {
                    item = JSON.parse(item);

                    if (oldestExpiration == -1 || oldestExpiration > item.expiration) {
                        oldestExpiration = item.expiration;
                        oldestKey = cacheKey;
                    }
                }
            }
        }

        if (oldestExpiration != -1) {
            storage.removeItem(oldestKey);
        }
    }

    /**
     * Get the list of keys in use by the cache system
     *
     * @return {Array} list of keys in use by the cache system
     */
    #getCacheKeysFromStorage() {
        let storage = null;

        if (this.#cacheConfig.type === "persistent") {
            storage = localStorage;
        } else if (this.#cacheConfig.type === "session") {
            storage = sessionStorage;
        } else {
            throw 'Invalid "type" in Jikan4 cache config';
        }

        let prefix = this.#cacheConfig.prefix;
        let allKeys = Object.keys(storage);
        let cacheKeys = [];

        for (let i in allKeys) {
            if (allKeys[i].substring(0, prefix.length) === prefix) {
                cacheKeys.push(allKeys[i]);
            }
        }

        return cacheKeys;
    }

    /**
     * Add an item that contains the given data and keyed to url
     * into the cache
     *
     * @param {string} url - url of the api call
     * @param {Object} data - API json response parsed as object
     */
    #addAPIDataToCache(url, data) {
        let date = new Date();
        let key = this.#cacheConfig.prefix + btoa(url);
        let cacheObj = {
            data: data,
            expiration: date.getTime() + this.#cacheConfig.life,
        };

        let cacheString = JSON.stringify(cacheObj);


        while (true) {
            try {
                if (this.#getCacheKeysFromStorage().length > this.#cacheConfig.limit) {
                    this.#removeOldestFromCache();
                }

                if (this.#cacheConfig.type === "persistent") {
                    localStorage.setItem(key, cacheString);
                } else if (this.#cacheConfig.type === "session") {
                    sessionStorage.setItem(key, cacheString);
                } else {
                    throw 'Invalid "type" in Jikan4 cache config';
                }

                break;
            } catch (error) {
                // remove 3 items when storage is full
                for (let i = 0; i < 3; i++) {
                    this.#removeOldestFromCache();
                }
            }
        }

    }

    /**
     * Delete the item that matches the given url key
     * from the cache
     *
     * @param {string} url - url of the api call
     */
    #removeAPIDataToCache(url) {
        let key = this.#cacheConfig.prefix + btoa(url);

        if (this.#cacheConfig.type === "persistent") {
            localStorage.removeItem(key);
        } else if (this.#cacheConfig.type === "session") {
            sessionStorage.removeItem(key);
        } else {
            throw 'Invalid "type" in Jikan4 cache config';
        }
    }

    /**
     * Returns the cached result from the previous API call
     * or null if cache does not exist
     *
     * @param {string} url - url of the api call
     * @returns {Object} cached API json response parsed as object
     */
    #getAPIDataFromCache(url) {
        let date = new Date();
        let key = this.#cacheConfig.prefix + btoa(url);

        if (this.#cacheConfig.type === "persistent") {
            let item = localStorage.getItem(key);

            if (item == null) {
                return null;
            }

            item = JSON.parse(item);

            if (date.getTime() > item.expiration) {
                return null;
            } else {
                return item.data;
            }
        } else if (this.#cacheConfig.type === "session") {
            let item = sessionStorage.getItem(key);

            if (item == null) {
                return null;
            }

            item = JSON.parse(item);

            if (date.getTime() > item.expiration) {
                return null;
            } else {
                return item.data;
            }
        } else {
            throw 'Invalid "type" in Jikan4 cache config';
        }
    }

    /**
     * Check whether there is more pages from the last API call
     * @returns {boolean} whether there is a next page
     */
    hasNextPage() {
        return (
            this.lastResData != null &&
            this.lastResData.pagination != undefined &&
            this.lastResData.pagination.has_next_page
        );
    }

    /**
     * Get the last page number given by the last API call
     * @returns {number} the page number of the last page - -1 if DNE
     */
    lastPageNumber() {
        if (
            this.lastResData == null ||
            this.lastResData.pagination.last_visible_page == undefined
        ) {
            return -1;
        } else {
            return this.lastResData.pagination.last_visible_page;
        }
    }

    /**
     * Resets variables that keeps track of API calls
     */
    reset() {
        this.lastReqURL = "";
        this.lastResData = null;
    }

    // ****************
    // Helper functions
    // ****************

    #removeDuplicateInArray(arr, objKey) {
        for (let i = arr.length - 1; i >= 0; i--) {
            for (let j = arr.length - 1; j >= 0; j--) {
                if (arr[j] != undefined && arr[i] != undefined) {
                    if (i != j && arr[j][objKey] == arr[i][objKey]) {
                        arr.splice(j, 1);
                    }
                }
            }
        }
    }

    /**
     * Inmitate thread.sleep using a promise
     * Used for throttling request to avoid rate limit 
     * @param {Number} ms length of sleep in millisecond
     * @returns {Promise} returns promise when finish sleeping
     */
    #sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get query string values in given string representation of a URL
     * Source: https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript?page=1
     * @param {string} key the name of the key to query
     * @param {string} url the url that contains the queries
     */
    #getParameterByKey(key, url) {
        key = key.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + key + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
}




/**
   * A token bucket for 429 retries and throttling for API rate-limits.
   * 
   * It was made following Ben Ogle's guide, with some modifications.
   * Source: https://www.useanvil.com/blog/engineering/throttling-and-consuming-apis-with-429-rate-limits/
   */

class TokenBucketRateLimiter {
    static waitTimeout = null;
    static count = 0;

    constructor({
        maxRequests,
        timeFrame
    }) {

        this.maxRequests = maxRequests;
        this.timeFrame = timeFrame;
        this.reset();

    }

    reset() {
        TokenBucketRateLimiter.waitTimeout = null;
        TokenBucketRateLimiter.count = 0;
        this.waitStartTime = performance.now();
    }

    scheduleReset() {
        if (!TokenBucketRateLimiter.waitTimeout) {
            this.waitStartTime = performance.now();
            TokenBucketRateLimiter.waitTimeout = setTimeout(() => {
                this.reset();
            }, this.timeFrame);
        }
    }

    async nextTick() {
        let waitTime = performance.now() - this.waitStartTime;
        await this.#sleep(waitTime);
    }


    async acquireToken(fn) {
        this.scheduleReset();

        if (TokenBucketRateLimiter.count >= this.maxRequests) {
            await this.#sleep(this.timeFrame);
            return this.acquireToken(fn);
        }

        TokenBucketRateLimiter.count += 1;
        await this.nextTick();

        return fn();
    }

    /**
     * Inmitate thread.sleep using a promise
     * Used for throttling request to avoid rate limit 
     * @param {Number} ms length of sleep in millisecond
     * @returns {Promise} returns promise when finish sleeping
     */
    async #sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}

