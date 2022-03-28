# README

## About Jikan (API)
The API this webpage uses is Jikan V4. 

> Jikan (時間) is an open-source PHP & REST API for the “most active online anime + manga community and database” — MyAnimeList.net. It parses the website to satisfy the need for an API. 

See more info at https://jikan.moe/ 


## Special Features
1. [Firebase](https://firebase.google.com/)
    - User authentication via Firebase
        - User can create an account with an email address and password
        - User can set a username
        - User can reset their password via *Forget password*.
    - Firebase Realtime Database
        - User can add an anime or manga to their reading/watching list
        - User can add a status to an anime or manga (ie. watching, considering...)
        - User can give an anime or manga a score (not linked to MyAnimeList in any way)
        - User can set their progress on an anime or manga (ie. 5 episodes completed).
2. [Swiper](https://swiperjs.com/)
    - The suggestion section on the home page uses Swiper to allow a desktop and mobile friendly swiping experience
    - Used Swiper's *Effect coverflow* to creat an eye catching landing page.
3. Infinite Scrolling with Intersection Observer
    - The Anime and Manga search page (access via navigation at the top) has infinite scrolling.
    - Infinite scrolling was achived using an Intersection Observer on the load more button
    - See the documentation on *getMore()* in the Jikan4 class for determining the next page and the API calls.  
4. Score Distribution Graph
    - Feature is on the detail view page of an anime or manga
    - Visualize the score distribution given by the API
    - Hover mouse over solid bars to see tooltp for raw numbers.
5. Number loading animation 
    - Feature is on the detail view page of an anime or manga.
    - Both the score and data population size loadings in with an incrementing animation
    - See *initNumberLoadingAnimation()* and *easeOutQuart()* in *anime.js* or *manga.js* for the inner workings
    - Note: *easeOutQuart()* was translated from the Typescript implementation given by https://easings.net/.

## Not so special features 
1. **All tags are clickable:** if an item looks like a tag or glow on hover like a link, then it is probably clickable.
2. **A good looking filtering input form:** many hours were directed at styling the filter form (on the anime/manga search pages). Please take a look.

## Fetch and $.get
Since a pure JavaScript wrapper was written for Jikan V4 API, all API calls uses *fetch* instead of *\$.get/ajax*. 
However, to demonstrate using *\$.get*, *fillOutFrameWithData()* from *cache\_search.js* used *$.get* to obtain a json file from the host. 
Although it is not an API call, beyond building the URL, it should practically be the same.


## A note on search
Note that all search will query both English and Japanese result. Hence, if search result may return what looks to be incorrect, it is likely that the query string matches some Japanese terms. 

## How filters work (on search pages)

Filter tags are ***or*** operations. For example, if you have the filter "Action" and "Drama" on, it will search for items with the "Action" tag, ***or*** "Drama" tag.

When filtering by studio/company, due to limitation of the API (it may be an API bug), it will only search one studio/company ID. Therefore, the filter input for studio/company uses *radio* intead of *checkbox*.

## API errors 

The API used, Jikan v4, has a strict rate limiting of 3 request per second. In addition, the header Jikan sends does not appear to have X-Rate-Limit-Limit attached. As a result when loading detail information, or when user generates rapid search results, you may see 429 errors in the console. However, multiple methods were implemented to prevent such error from bricking the site. The Jikan4 class utilizes a Token Bucket to also have a client sided rate limit. In case the Token Bucket fails, The Jikan 4 class will retry until the data is obtained. 

Occasionally, Jikan v4 will send a code 500 . From experience, it apears that most of the time, retrying after a second solve the issue. Hence, this suggest this to be another API bug. Becuase error code 500 can be legitimate, this the Jikan 4 class with only retry once when faced with an 500 HTTP response.

