

class Jikan4 {
    constructor() {
        this.baseURL = "https://api.jikan.moe/v4";
        this.lastReqURL = "";
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
    }

    async get(url) {
        var res = await fetch(url);
        var data = await res.json();

        if (res.status !== 200) {
            throw "Response: ${res.status}";
        } else {
            this.lastReqURL = url;
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

