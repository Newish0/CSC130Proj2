

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
        return this.get(`https://api.jikan.moe/v4/anime/${id}`);
    }

    async getAnimeCharacters(id) {
        return this.get(`https://api.jikan.moe/v4/anime/${id}/characters`);
    }

    async getAnimeStaff(id) {
        return this.get(`https://api.jikan.moe/v4/anime/${id}/staff`);
    }

    async getAnimeEpisodes(id) {
        return this.get(`https://api.jikan.moe/v4/anime/${id}/episodes`);
    }

    async getAnimeEpisodeById(id, episode) {
        return this.get(`https://api.jikan.moe/v4/anime/${id}/episodes/${episode}`);
    }

    async getAnimeNews(id) {
        return this.get(`https://api.jikan.moe/v4/anime/${id}/news`);
    }

    async getAnimeForum(id) {
        return this.get(`https://api.jikan.moe/v4/anime/${id}/forum`);
    }

    async getAnimeVideos(id) {
        return this.get(`https://api.jikan.moe/v4/anime/${id}/videos`);
    }

    async getAnimePictures(id) {
        return this.get(`https://api.jikan.moe/v4/anime/${id}/pictures`);
    }

    async getAnimeStatistics(id) {
        return this.get(`https://api.jikan.moe/v4/anime/${id}/statistics`);
    }

    async getAnimeMoreInfo(id) {
        return this.get(`https://api.jikan.moe/v4/anime/${id}/moreinfo`);
    }

    async getAnimeRecommendations(id) {
        return this.get(`https://api.jikan.moe/v4/anime/${id}/recommendations`);
    }

    async getAnimeUserUpdates(id) {
        return this.get(`https://api.jikan.moe/v4/anime/${id}/userupdates`);
    }

    async getAnimeReviews(id) {
        return this.get(`https://api.jikan.moe/v4/anime/${id}/reviews`);
    }

    async getAnimeRelations(id) {
        return this.get(`https://api.jikan.moe/v4/anime/${id}/relations`);
    }

    async getAnimeThemes(id) {
        return this.get(`https://api.jikan.moe/v4/anime/${id}/themes`);
    }

    async getAnimeExternal(id) {
        return this.get(`https://api.jikan.moe/v4/anime/${id}/external`);
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
        return this.get(`https://api.jikan.moe/v4/characters/${id}`);
    }

    async getCharacterAnime(id) {
        return this.get(`https://api.jikan.moe/v4/characters/${id}/anime`);
    }

    async getCharacterManga(id) {
        return this.get(`https://api.jikan.moe/v4/characters/${id}/manga`);
    }

    async getCharacterVoiceActors(id) {
        return this.get(`https://api.jikan.moe/v4/characters/${id}/voices`);
    }

    async getCharacterPictures(id) {
        return this.get(`https://api.jikan.moe/v4/characters/${id}/pictures`);
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
        let url = `https://api.jikan.moe/v4/genres/anime?page=${page}&limit=${limit}&filter=${filter}`;
        return this.get(url);
    }

    async getMangaGenres({
        page = 1, // int
        limit = 1000, // int - 
        filter = "genres" // string - "genres" "explicit_genres" "themes" "demographics"
    } = {}) {
        let url = `https://api.jikan.moe/v4/genres/manga?page=${page}&limit=${limit}&filter=${filter}`;
        return this.get(url);
    }


    // *******************
    // functions for manga
    // *******************

    async getMangaById(id) {
        return this.get(`https://api.jikan.moe/v4/manga/${id}`);
    }

    async getMangaCharacters(id) {
        return this.get(`https://api.jikan.moe/v4/manga/${id}/characters`);
    }

    async getMangaNews(id) {
        return this.get(`https://api.jikan.moe/v4/manga/${id}/news`);
    }

    async getMangaTopics(id) {
        return this.get(`https://api.jikan.moe/v4/manga/${id}/forum`);
    }

    async getMangaPictures(id) {
        return this.get(`https://api.jikan.moe/v4/manga/${id}/pictures`);
    }

    async getMangaStatistics(id) {
        return this.get(`https://api.jikan.moe/v4/manga/${id}/statistics`);
    }

    async getMangaMoreInfo(id) {
        return this.get(`https://api.jikan.moe/v4/manga/${id}/moreinfo`);
    }

    async getMangaRecommendations(id) {
        return this.get(`https://api.jikan.moe/v4/manga/${id}/recommendations`);
    }

    async getMangaUserUpdates(id) {
        return this.get(`https://api.jikan.moe/v4/manga/${id}/userupdates`);
    }

    async getMangaReviews(id) {
        return this.get(`https://api.jikan.moe/v4/manga/${id}/reviews`);
    }

    async getMangaRelations(id) {
        return this.get(`https://api.jikan.moe/v4/manga/${id}/relations`);
    }

    async getMangaExternal(id) {
        return this.get(`https://api.jikan.moe/v4/manga/${id}/external`);
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

        let url = `${this.baseURL}/manga?page=${page}&limit=${limit}&q=${q}&type=${type}&min_score=${minScore}&max_score=${maxScore}&status=${status}&rating=${rating}&sfw=${sfw}&genres=${genres}&genresExclude=${genresExclude}&order_by=${orderBy}&sort=${sort}&letter=${letter}&producer=${magazine}`

        return this.get(url);
    }


    // ***********************
    // functions for producers
    // ***********************

    async getProducers() {
        let url = "https://api.jikan.moe/v4/producers";
        return this.get(url);
    }


    // ********************
    // functions for random
    // ********************

    async getRandomAnime() {
        return this.get("https://api.jikan.moe/v4/random/anime");
    }

    async getRandomManga() {
        return this.get("https://api.jikan.moe/v4/random/manga");
    }

    async getRandomCharacters() {
        return this.get("https://api.jikan.moe/v4/random/characters");
    }

    async getRandomPeople() {
        return this.get("https://api.jikan.moe/v4/random/people");
    }

    // returns a random MAL user
    async getRandomUsers() {
        return this.get("https://api.jikan.moe/v4/random/users");
    }

    // *****************************
    // functions for recommendations
    // *****************************

    async getRecentAnimeRecommendations() {
        return this.get("https://api.jikan.moe/v4/recommendations/anime");
    }
    async getRecentMangaRecommendations() {
        return this.get("https://api.jikan.moe/v4/recommendations/manga");
    }



    async getTopAnime() {
        return this.getTop("anime");
    }

    #reset() {
        this.lastReqURL = "";
        this.lastResData = null;
    }

    async getTop(type) {
        return this.get(`${this.baseURL}/top/${type}`);
    }

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

