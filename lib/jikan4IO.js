class Jikan4IO {
    constructor() {
        this.api = new Jikan4();
    }

    async generateAnimeFilterNav(containerEln) {
        let htmlTxt = `

            <div>
                ${await this.generateAnimeGenresAsHTMLTxt()}
            </div>
        `;

        containerEln.innerHTML = htmlTxt;
    }

    async generateAnimeGenresAsHTMLTxt(){
        let htmlTxt = "";

        let genres = await this.api.getAnimeGenres();

        genres = genres.data;

        console.log(genres)

        for(let x in genres) {
            htmlTxt += this.#createIncExcTagAsHTMLTxt(genres[x].name, genres[x].mal_id);
        }

        return htmlTxt;
    }
    

    #createIncExcTagAsHTMLTxt(name, value) {
        let htmlTxt = `
        <span>
            <input type="checkbox" name="${name}" class="filter-form-inc-exc-tags" id="${name}-${value}" value="${value}">
            <label class="unselectable" for="${name}-${value}">${name}</label>
        </span>
        `;

        return htmlTxt;
    }

    #strToHTML(str) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(str, 'text/html');
        return doc.body.childNodes;
    }

}