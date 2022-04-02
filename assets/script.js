
//Initial API call. Will return album ID's of user input artist to be passed
//through the genreCall method
var artistCall = function(){
    //TODO replace the query with a user input dynamic response
    var apiUrl = `https://api.deezer.com/search?q=metallica`;

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                //console.log(data);
                var albumId = data.data[1].album.id;
                console.log(albumId);
                genreCall(albumId);
            })
        }
    })
};

//Secondary API call using the previously gathered artist album ID in order 
//to retreive artists/album genre to pass through the imageSearch method
var genreCall = function(albumId) {
    var apiUrl = `https://api.deezer.com/album/${albumId}`;

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                var genre = (data.genres.data[0].name);
                console.log(genre);
                imageSearch(genre);
            })
        }
    })
}

//Last API call that generates a random image from the flickr website
var imageSearch = function(genre) {
    var apiUrl = `https://www.flickr.com/services/rest?method=flickr.photos.search&api_key=bdf1b34a751721c09d026be91eb2c0c5&tags=${genre}&safe_search=1&per_page=500&format=json&nojsoncallback=1`;

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                //console.log(data);
                var rand = Math.floor(Math.random() * 500);
                var serverId = data.photos.photo[rand].server;
                var photoId = data.photos.photo[rand].id;
                var secret = data.photos.photo[rand].secret;

                var imageUrl = `https://live.staticflickr.com/${serverId}/${photoId}_${secret}.jpg`
                console.log(imageUrl);
            })
        }
    })
}


/*when generateImage is run:
the calls to api will happen and we will receive a URL for an image, which will display in the center.
we will also pull the information entered into the text field area and save it in local storage and use it to create a link to the URL that was pulled with that search
by innerHTML-ing it to the the UL for past searches. 
*/
function generateImage(){
    getElementById
  }; 
  
  document.getElementById("btn ").addEventListener("click", generateImage)