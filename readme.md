# README


Note that all search will query both English and Japanese result. Hence, if search result may return what looks to be incorrect, it is likely that the query string matches some Japanese terms. 

Since a pure JavaScript wrapper was written for Jikan V4 API, all API calls uses *fetch* instead of *\$.get/ajax*. 
However, to demonstrate using *\$.get*, *fillOutFrameWithData()* from *cache\_search.js* used *$.get* to obtain a json file from the host. 
Although it is not an API call, beyond building the URL, it should practically be the same.
