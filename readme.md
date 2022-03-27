# README


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

