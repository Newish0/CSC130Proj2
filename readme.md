# README

## About this website
This site, UsagiDB, is a site where you can search for all anime, manga, light novel related. In addition to it being CSC 130's Project 2, the motivation behind the project was to create a frontend that any one of the single existing solutions lacks. Essentially, I want to combine all the good features of other sites into one.

## About Jikan (API)
The API this webpage uses is Jikan V4. 

> Jikan (時間) is an open-source PHP & REST API for the “most active online anime + manga community and database” — MyAnimeList.net. It parses the website to satisfy the need for an API. 

See more info at https://jikan.moe/ 


## Special Features
1. [Firebase](https://firebase.google.com/)
    - User authentication via Firebase
        - User can create an account with an email address and password via [sign up page](http://webhome.csc.uvic.ca/~huanyangl/account/signup/)
        - User can set a username
        - User can reset their password via *Forget password* on [sign in page](http://webhome.csc.uvic.ca/~huanyangl/account/signin/)
        - Basic sign in/out form
        - The ability to delete one's account via [profile page](http://webhome.csc.uvic.ca/~huanyangl/account/profile/) (after signing in)
    - Firebase Realtime Database (requires signing into an account)
        - User can add an anime or manga to their reading/watching list 
        - User can add a status to an anime or manga (ie. watching, considering...)
        - User can give an anime or manga a score (not linked to MyAnimeList in any way)
        - User can set their progress on an anime or manga (ie. 5 episodes completed).
2. [Swiper](https://swiperjs.com/)
    - The suggestion section on the [home page](http://webhome.csc.uvic.ca/~huanyangl/index.html) uses Swiper to allow a desktop and mobile friendly swiping experience
    - Used Swiper's *Effect coverflow* to creat an eye catching landing page.
3. Infinite Scrolling with Intersection Observer
    - The [anime](http://webhome.csc.uvic.ca/~huanyangl/search/anime/) and [manga](http://webhome.csc.uvic.ca/~huanyangl/search/manga/) search page (access via navigation at the top) has infinite scrolling.
    - Infinite scrolling was achived using an Intersection Observer on the load more button
    - See the documentation on *getMore()* in the [Jikan4 class](http://webhome.csc.uvic.ca/~huanyangl/lib/jikan4.js) for determining the next page and the API calls.  
4. Score Distribution Graph
    - Feature is on the detail view page of an anime or manga ([see sample](http://webhome.csc.uvic.ca/~huanyangl/anime/?id=37987))
    - Visualize the score distribution given by the API
    - Hover mouse over solid bars to see tooltp for raw numbers.
5. Number loading animation 
    - Feature is on the detail view page of an anime or manga. ([see sample](http://webhome.csc.uvic.ca/~huanyangl/anime/?id=37987))
    - Both the score and data population size loadings in with an incrementing animation
    - See *initNumberLoadingAnimation()* and *easeOutQuart()* in [*anime.js*](http://webhome.csc.uvic.ca/~huanyangl/anime/anime.js) or [*manga.js*](https://webhome.csc.uvic.ca/~huanyangl/manga/manga.js) for the inner workings
    - Note: *easeOutQuart()* was translated from the Typescript implementation given by https://easings.net/.

## Not so special features 
1. **All tags are clickable:** if an item looks like a tag or glow on hover like a link, then it is probably clickable. 
    - Sample links (all can be accessed by clicking corresponding tags)
        - [Fantasy](http://webhome.csc.uvic.ca/~huanyangl/search/anime/?genre=10~Fantasy) genre
        - [Mecha](http://webhome.csc.uvic.ca/~huanyangl/search/anime/?genre=18~Mecha) theme
        - [Kyoto Animation](http://webhome.csc.uvic.ca/~huanyangl/search/anime/?producer=2~Kyoto%20Animation) studio
2. **A good looking filtering input form:** many hours were directed at styling the filter form (on the anime/manga search pages). Please take a look.
3. **Jikan4 Class (API Wrapper):** wrote a wrapper for Jikan API ([Source code](http://webhome.csc.uvic.ca/~huanyangl/lib/jikan4.js))
    - Caches API responses for a short amount of time to greatly improve performance
    - Added expiration to data cached in local or session storage (to ensure cached data is up to date)
    - It has a Token Bucket to attempt to rate limit itself to Jikan API's specification, but without X-Rate-Limit-Limit in API response header, its effect is questionable. 
4. **All pages are responsive:** all pages are responsive, so do be sure to try out the site on mobile too!

## Fetch and $.get
Since a pure JavaScript wrapper was written for Jikan V4 API, all API calls uses *fetch* instead of *\$.get/ajax*. 
However, to demonstrate using *\$.get*, *fillOutFrameWithData()* from *cache\_search.js* used *$.get* to obtain a json file from the host. 
Although it is not an API call, beyond building the URL, it should practically be the same.


## A note on search
Note that all search query will **only** search the main title, which is usually in Japanese. Hence, unfortunately you cannot search the english translation of titles. However, it will work if the main title is in English.

## How filters work (on search pages)

Filter tags are ***or*** operations. For example, if you have the filter "Action" and "Drama" on, it will search for items with the "Action" tag, ***or*** "Drama" tag.

When filtering by studio/company, due to limitation of the API (it may be an API bug), it will only search one studio/company ID. Therefore, the filter input for studio/company uses *radio* intead of *checkbox*.

## API errors 

The API used, Jikan v4, has a strict rate limiting of 3 request per second. In addition, the header Jikan sends does not appear to have X-Rate-Limit-Limit attached. As a result when loading detail information, or when user generates rapid search queries, you may see 429 errors in the console. However, multiple methods were implemented to prevent such error from bricking the site. The Jikan4 class utilizes Token Bucket to also have a client sided rate limit. In case the Token Bucket fails, The Jikan 4 class will retry until the data is obtained. In the very unlikely event that all counter meausre fails, please refresh the page.

Occasionally, Jikan v4 will send a code 500. From experience, it apears that most of the time, retrying after a second solve the issue. Hence, this is believed to be another API bug. Becuase error code 500 can be legitimate, the Jikan 4 class with only retry once when faced with an 500 HTTP response.

If you see an 404 error like "GET https://t2.gstatic.com/faviconV2?...", please ignore it. It is caused by Google not being able to find the favicon of an external site provided by the API.  

## Sub Pages and Sample Search Terms
- [Home](http://webhome.csc.uvic.ca/~huanyangl/index.html) 
    - Can be reached by clicking on the UsagiDB logo in top navigation bar.
- Anime 
    - [Koe no Katachi - A Silent Voice](http://webhome.csc.uvic.ca/~huanyangl/anime/?id=28851)
        - Can be searched via navigation bar search box 
        - Can be searched via [anime search page](http://webhome.csc.uvic.ca/~huanyangl/search/anime/)
    - [Shigatsu wa Kimi no Uso - Your Lie in April](http://webhome.csc.uvic.ca/~huanyangl/anime/?id=23273)
        - Can be searched via navigation bar search box 
        - Can be searched via [anime search page](http://webhome.csc.uvic.ca/~huanyangl/search/anime/)
- Manga 
    - [86 - 86—Eighty-Six](http://webhome.csc.uvic.ca/~huanyangl/manga/?id=104039)
        - Can be searched via navigation bar search box 
        - Can be searched via [manga search page](http://webhome.csc.uvic.ca/~huanyangl/search/manga/)
    - [Horimiya](http://webhome.csc.uvic.ca/~huanyangl/manga/?id=42451)
        - Can be searched via navigation bar search box 
        - Can be searched via [manga search page](http://webhome.csc.uvic.ca/~huanyangl/search/manga/)
- Companies/Studio
    - [A-1 Pictures](http://webhome.csc.uvic.ca/~huanyangl/search/anime/?producer=56~A-1%20Pictures)
        - Can be reached via [companies page](http://webhome.csc.uvic.ca/~huanyangl/search/companies/)
        - Can be reached via [anime search page](http://webhome.csc.uvic.ca/~huanyangl/search/anime/) by using the studio filter (Note: not all studios are available in filter)
        - Can be reached by clicking on the studio tag via an anime by A-1 Pictures such as [Shigatsu wa Kimi no Uso - Your Lie in April](http://webhome.csc.uvic.ca/~huanyangl/anime/?id=23273)
    - [Kyoto Animation](http://webhome.csc.uvic.ca/~huanyangl/search/anime/?producer=2~Kyoto%20Animation)
        - Can be reached via [companies page](http://webhome.csc.uvic.ca/~huanyangl/search/companies/)
        - Can be reached via [anime search page](http://webhome.csc.uvic.ca/~huanyangl/search/anime/) by using the studio filter (Note: not all studios are available in filter)
        - Can be reached by clicking on the studio tag via an anime by Kyoto Animation such as [Koe no Katachi - A Silent Voice](http://webhome.csc.uvic.ca/~huanyangl/anime/?id=28851)
- Magazines/Publisher
    - [GFantasy](http://webhome.csc.uvic.ca/~huanyangl/search/manga/?magazine=35~GFantasy)
        - Can be reached via [magazines page](http://webhome.csc.uvic.ca/~huanyangl/search/magazines/)
        - Can be reached via [manga search page](http://webhome.csc.uvic.ca/~huanyangl/search/manga/) by using the magazine filter (Note: not all magazines are available in filter)
        - Can be reached by clicking on the publisher tag via an anime by A-1 Pictures such as [Horimiya](http://webhome.csc.uvic.ca/~huanyangl/manga/?id=42451)
- People
    - [Yoshiji Kigami](http://webhome.csc.uvic.ca/~huanyangl/people/?id=7025)
         - Can be searched via navigation bar search box 
         - Can be reached by clicking on the staff's name on an anime or manga that this person contributed to. In this case, [Koe no Katachi - A Silent Voice](http://webhome.csc.uvic.ca/~huanyangl/anime/?id=28851).
    - [Toshimasa Ishii](http://webhome.csc.uvic.ca/~huanyangl/people/?id=51059)
         - Can be searched via navigation bar search box 
         - Can be reached by clicking on the staff's name on an anime or manga that this person contributed to. In this case, [Shigatsu wa Kimi no Uso - Your Lie in April](http://webhome.csc.uvic.ca/~huanyangl/anime/?id=23273).
- Character
    - [Shouya Ishida](http://webhome.csc.uvic.ca/~huanyangl/character/?id=80491)
         - Can be searched via navigation bar search box 
         - Can be reached by clicking on the character name on an anime or manga that this character appears in. In this case, [Koe no Katachi - A Silent Voice](http://webhome.csc.uvic.ca/~huanyangl/anime/?id=28851).
    - [Kaori Miyazono](http://webhome.csc.uvic.ca/~huanyangl/character/?id=69411)
         - Can be searched via navigation bar search box 
         - Can be reached by clicking on the character name on an anime or manga that this character appears in. In this case, [Shigatsu wa Kimi no Uso - Your Lie in April](http://webhome.csc.uvic.ca/~huanyangl/anime/?id=23273).
- Account Related
    - [Sign In](http://webhome.csc.uvic.ca/~huanyangl/account/signin/)
        - Accessed via navigation bar
    - [Sign Up](http://webhome.csc.uvic.ca/~huanyangl/account/signup/)
        - Accessed via "Create a new account" on [sign in page](http://webhome.csc.uvic.ca/~huanyangl/account/signin/)
    - [Profile (Sign in required!)](http://webhome.csc.uvic.ca/~huanyangl/account/profile/)
        - Accessed via navigation bar's person icon after signing in 

## Testing Account 
Below is an account created for testing only. Credential is the same for both the email account and UsagiDB account.

Mail service: https://account.protonmail.com/login

Email: usagidb.test1@protonmail.com

Password: usagidbAcc4CSC130

Creating a fresh account is strongly recommended. 


