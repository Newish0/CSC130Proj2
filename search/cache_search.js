


$(() => {

    let dataURL = "";


    if(document.URL.includes("/search/companies")) {
        dataURL = "/data/producers.json";
    } else if(document.URL.includes("/search/magazines")) {
        dataURL = "/data/magazines.json";
    } else{
        display404();
    }


    let sections = null;

    fillOutFrameWithData();

    initFilterBarSeachBox();


    function generateNav(sections) {
        for (let key in sections) {
            let html = `
            <span class="primary-color grow"><a href="#section-${key}" class="clean-url">${key}</a></span>
            `;

            $("#output-nav").append(html);
        }
    }

    function initFilterBarSeachBox() {
        let search = $("#filters-bar-search-box");

        // filter bar search box auto search on stop typing
        let searchBoxKeyupWait = null;
        search.on("keyup", (evt) => {
            if (searchBoxKeyupWait) {
                clearTimeout(searchBoxKeyupWait);
            }

            let query = evt.target.value;

            searchBoxKeyupWait = setTimeout(() => {
                resetSearch();
                applySearch(query);
            }, 400); // wait 400 ms after typing
        });
    }

    function setAsLoading(target) {
        target.parent().prepend('<div class="loader center"></div>');
    }

    function setAsReady(target) {
        target.parent().find(".loader").remove();
    }

    function applySearch(query) {
        let outputContainer = $("#output-container");

        query = query.toLowerCase();

        // setAsLoading(outputContainer);



        let tmp = {};
        if (sections != null) {
            for (let key in sections) {
                for (let i in sections[key]) {
                    if (sections[key][i].name.toLowerCase().includes(query)) {
                        addToSection(tmp, key, sections[key][i]);
                    }
                }
            }
        }

        resetSections();
        displaySections(outputContainer, tmp);


        // setAsReady(outputContainer);


    }

    function resetSearch() {
        let outputContainer = $("#output-container");

        displaySections(outputContainer, sections);
    }

    function resetSections() {
        $("#output-container").html("");
    }


    async function fillOutFrameWithData() {
        let res = await fetch(dataURL);
        let data = await res.json();



        if (res.status != 200) {
            throw "Failed to fetch data from " + dataURL;
        }

        // fill output container with 0-A-Z section containers
        let outputContainer = $("#output-container");
        sections = {};

        // seperate data into sections
        for (let i in data) {
            let firstCharCode = data[i].name.toUpperCase().charCodeAt(0);
            if (firstCharCode < 65 || firstCharCode > 90) {
                addToSection(sections, "#", data[i]);
            } else {
                addToSection(sections, data[i].name.toUpperCase()[0], data[i]);
            }
        }

        // sort sections
        let sortable = [];
        for (let key in sections) {
            sortable.push(key);
        }
        sortable.sort((a, b) => (a > b ? 1 : -1));

        let newSections = {};
        for (let i in sortable) {
            newSections[sortable[i]] = sections[sortable[i]];
        }
        sections = newSections;

        // display sections
        displaySections(outputContainer, sections);
        generateNav(sections);
    }

    function displaySections(outputContainer, sections) {
        for (let key in sections) {
            let content = "";

            for (let i in sections[key]) {
                let name = sections[key][i].name;
                let id = sections[key][i].mal_id;
                let count = sections[key][i].count;
                let imgSrc = `https://cdn.myanimelist.net/img/common/companies/${id}.png`;

                let html = `
                    <span class="tag">
                       <a class="clean-url" href="/search/anime/?producer=${id}~${encodeURIComponent(name)}"><h5 class="margin-small">${name} (${count})</h5></a>
                    </span>
                `

                content += html;
            }

            outputContainer.append(generateSection(key, content, false));
        }
    }

    function addToSection(sections, key, data) {
        if (sections[key] == undefined) {
            sections[key] = [];
        }
        sections[key].push(data);
    }

    function generateSection(heading, content, hideRest) {
        let html = `
        <div class="card padding-normal margin-v-large">
            <h3 id="section-${heading.replace(" ", "-")}">${heading}</h3>
            <div class="auto-gallery  align-items-start justify-start">${content}</div>
        </div>
        `

        if (hideRest) {
            html = `
            <div class="hide-rest-container hide-rest">
                ${html}
                <a class="click-to-show-more">Show more</a>
            </div>
            `
        }

        return html;
    }

});