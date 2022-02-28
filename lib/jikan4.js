

class Jikan4 {
    constructor() {
        this.baseURL = "https://api.jikan.moe/v4";
    }

    async getTopAnime() {
        return this.getTop("anime");
    }

    async getTop(type) {
        var res = await fetch(this.baseURL + "/top/" + type);
        var data = await res.json();
        
        if (res.status !== 200) {
            throw "Response: ${res.status}";
        } else {
            return data;
        }

    }

}

