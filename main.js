



$(() => {
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
})