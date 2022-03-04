

class Jikan4 {
    constructor() {
        this.baseURL = "https://api.jikan.moe/v4";
        this.lastReqURL = "";
        this.lastResData = null;
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
        minScore = 0, // float - int 0
        maxScore = 10, // float - int 10
        status = "", // string - "airing" "complete" "upcoming"
        rating = "", // string - "g" "pg" "pg13" "r17" "r" "rx"
        sfw = true, // boolean - filter out Adult entries
        genres = 0, // filter by genre(s) IDs. Can pass multiple with a comma as a delimiter. 
        genresExclude = 0, // exclude  genre(s) IDs. Can pass multiple with a comma as a delimiter. 
        orderBy = "score", // string - "mal_id" "title" "type" "rating" "start_date" "end_date" "episodes" "score" "scored_by" "rank" "popularity" "members" "favorites"
        sort = "desc", // string - "desc" "asc"
        letter = "", // string - return entries starting with the given letter
        producer = 0 // string - filter by producer(s) IDs. Can pass multiple with a comma as a delimiter. e.g 1,2,3
    } = {}) {

        let url = `${this.baseURL}/anime?page=${page}&limit=${limit}&q=${q}&type=${type}&min_score=${minScore}&max_score=${maxScore}&status=${status}&rating=${rating}&sfw=${sfw}&genres=${genres}&genresExclude=${genresExclude}&order_by=${orderBy}&sort=${sort}&letter=${letter}&producer=${producer}`
        console.log(url)
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
        letter = "" // string - return entries starting with the given letter
    } = {}) {

        let url = `${this.baseURL}/characters?page=${page}&limit=${limit}&q=${q}&order_by=${orderBy}&sort=${sort}&letter=${letter}`

        return this.get(url);
    }


    // *******************
    // functions for genre
    // *******************

    async getAnimeGenres({
        page = 1, // int
        limit = 1000, // int - 
        filter = "genres" // string - "genres" "explicit_genres" "themes" "demographics"
    } = {}) {
        let url = `${this.baseURL}/genres/anime?page=${page}&limit=${limit}&filter=${filter}`;
        return this.get(url);
    }

    async getMangaGenres({
        page = 1, // int
        limit = 1000, // int - 
        filter = "genres" // string - "genres" "explicit_genres" "themes" "demographics"
    } = {}) {
        let url = `${this.baseURL}/genres/manga?page=${page}&limit=${limit}&filter=${filter}`;
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
        minScore = 0, // float - int 0
        maxScore = 10, // float - int 10
        status = "", // string - "airing" "complete" "upcoming"
        rating = "", // string - "g" "pg" "pg13" "r17" "r" "rx"
        sfw = true, // boolean - filter out Adult entries
        genres = 0, // filter by genre(s) IDs. Can pass multiple with a comma as a delimiter. 
        genresExclude = 0, // exclude  genre(s) IDs. Can pass multiple with a comma as a delimiter. 
        orderBy = "score", // string - "mal_id" "title" "type" "rating" "start_date" "end_date" "episodes" "score" "scored_by" "rank" "popularity" "members" "favorites"
        sort = "desc", // string - "desc" "asc"
        letter = "", // string - return entries starting with the given letter
        magazine = 0 // string - filter by producer(s) IDs. Can pass multiple with a comma as a delimiter. e.g 1,2,3
    } = {}) {

        let url = `${this.baseURL}/manga?page=${page}&limit=${limit}&q=${q}&type=${type}&min_score=${minScore}&max_score=${maxScore}&status=${status}&rating=${rating}&sfw=${sfw}&genres=${genres}&genresExclude=${genresExclude}&order_by=${orderBy}&sort=${sort}&letter=${letter}&magazine=${magazine}`

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
        orderBy = "score", // string - "mal_id" "name" "birthday" "favorites"
        sort = "desc", // string - "desc" "asc"
        letter = "", // string - return entries starting with the given letter
    } = {}) {

        let url = `${this.baseURL}/people?page=${page}&limit=${limit}&q=${q}&type=${type}&order_by=${orderBy}&sort=${sort}&letter=${letter}`

        return this.get(url);
    }


    // ***********************
    // functions for producers
    // ***********************

    async getProducers() {
        let url = `${this.baseURL}/producers`;
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

    async getAnimeGenres({
        filter = "unknown" // string - "monday" "tuesday" "wednesday" "thursday" "friday" "unknown" "other"
    } = {}) {
        let url = `${this.baseURL}/schedules?filter=${filter}`;
        return this.get(url);
    }


    // *********************
    // functions for seasons
    // *********************

    async getSeason({
        page = 1, // int
        limit = 25, // int - max = 25
        year = -1, // int 
        season = "auto" // string - "winter" "spring" "summer" "fall" "auto"
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

    async getMore() {
        if (this.lastResData != null && this.lastResData.pagination.has_next_page) {
            let pageNum = this.#getParameterByName("page", this.lastReqURL);
            let url = null;

            if (pageNum === null) {
                if (this.lastReqURL.includes("?")) {
                    url = this.lastReqURL + "&page=2";
                } else {
                    url = this.lastReqURL + "?page=2";
                }
            } else {
                url = this.lastReqURL.replace(`page=${pageNum}`, `page=${parseInt(pageNum) + 1}`);
            }

            console.log("DEGUB: Jikan - getMore() URL: " + url)

            return this.get(url);
        } else {
            return null;
        }

    }

    /* 
     * Purpose: - API fetching for all API calls made within the class
     *          - stores additonal info to class for additional functionality
     * Parameter: string - url of the fetch
     * Return: object - API json response parsed as object
     */
    async get(url) {
        var res = await fetch(url);
        var data = await res.json();

        if (res.status !== 200) {
            throw "Response: ${res.status}";
        } else {
            this.lastReqURL = url;
            this.lastResData = data;
            return data;
        }

    }

    reset() {
        this.lastReqURL = "";
        this.lastResData = null;
    }


    // ****************
    // Helper functions
    // ****************

    // Source: https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript?page=1
    #getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

}

