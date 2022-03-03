

class Jikan4 {
    constructor() {
        this.baseURL = "https://api.jikan.moe/v4";
        this.lastReqURL = "";
        this.lastResData = null;
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

    async getTopAnime() {
        return this.getTop("anime");
    }

    #reset() {
        this.page = 0;
    }

    async getTop(type) {
        return this.get(this.baseURL + "/top/" + type);
    }

    async getMore() {
        if (this.lastResData.pagination.has_next_page) {
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

