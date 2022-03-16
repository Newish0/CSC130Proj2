



$(() => {
    let mal = new Jikan4();

    // add collapse and expand functionality to nav (bars icon)
    document.querySelector("#nav-collap-icon").addEventListener("click", (evt) => {
        document.querySelector("#nav-collap-icon").classList.toggle("nav-collap-icon-open")
        document.querySelectorAll("nav .page-nav a:not(:first-child):not(:last-child)").forEach((n) => {
            n.classList.toggle("nav-show-element");
        })
    });

    // initalize the minimized search button
    
    $("#min-nav-search-icon").on("click", () => {
        $("#overtop-search").fadeIn(100);
    });

    $(".overtop-x-btn").each((i, obj) => {

        $(obj).on("click", (evt) => {
            $(obj).parent().parent().fadeOut(100);
        });
    });

    $("#nav-search-box").on("change", (evt) => {
        displayQuickSearch(evt.target.value);
    });


    function displayQuickSearch(query) {
        let animeOut = $(".search-result-anime");
        let mangaOut = $(".search-result-manga");
        let charOut = $(".search-result-character");
        let pplOut = $(".search-result-people");

        // clear current results
        animeOut.html("");

        const qsAnime = () => {
            mal.getAnimeSearch({
                q: query,
                limit: 5
            }).then(res => {
                let data = res.data;
                for(let x in data) {
                    let imgSrc = data[x].images.webp.small_image_url;
                    let title = data[x].title;
                    let id = data[x].mal_id;

                    let htmlText = `
                        <div class="search-result-item">
                        <img src="${imgSrc}">
                        <a href="/anime/?id=${id}">${title}</a>
                        </div>
                    `;
                    animeOut.append(htmlText);
                }
            }).catch(err => {
                console.error(err);
                setTimeout(qsAnime, 1000);
            });
        }

        qsAnime();
    }
})