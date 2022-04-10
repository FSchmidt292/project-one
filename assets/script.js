var artistNameEl = document.querySelector("#artist-name");
var artistSearchForm = document.querySelector("#artist-search");
var currSearchEl = document.querySelector("#currSearch");
var previousWavezEl = document.querySelector(".previous-wavez");

var imageUrl = "";

//Initial API call. Will return album ID's of user input artist to be passed
//through the genreCall method
var artistCall = function(artist){
    //Uncomment deezer api call if heroku link does not work, required CORS workaround
    //var apiUrl = `https://api.deezer.com/search?q=${artist}`;
    var apiUrl = `https://cwru-p1-g2.herokuapp.com/search?q=${artist}`;

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                //console.log(data);
                var albumId = data.data[0].album.id;
                console.log(albumId);
                genreCall(albumId);
            })
        }
    })
};

//Secondary API call using the previously gathered artist album ID in order 
//to retreive artists/album genre to pass through the imageSearch method
var genreCall = function(albumId) {
    //Uncomment deezer api call if heroku link does not work, required CORS workaround
    //var apiUrl = `https://api.deezer.com/album/${albumId}`;
    var apiUrl = `https://cwru-p1-g2.herokuapp.com/album/${albumId}`;

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
    var apiUrl = `https://www.flickr.com/services/rest?method=flickr.photos.search&api_key=bdf1b34a751721c09d026be91eb2c0c5&tags=${genre}&safe_search=1&per_page=500&sort=relevance&format=json&nojsoncallback=1`;

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
                var rand = Math.floor(Math.random() * 500);
                var serverId = data.photos.photo[rand].server;
                var photoId = data.photos.photo[rand].id;
                var secret = data.photos.photo[rand].secret;

                imageUrl = "";
                imageUrl = `https://live.staticflickr.com/${serverId}/${photoId}_${secret}.jpg`
                console.log(imageUrl);
                currSearchEl.setAttribute("src", imageUrl);
            })
        }
    })
}


/*when generateImage is run:
the calls to api will happen and we will receive a URL for an image, which will display in the center.
we will also pull the information entered into the text field area and save it in local storage and use it to create a link to the URL that was pulled with that search
by innerHTML-ing it to the the UL for past searches. 
*/
function generateImage(event){
    event.preventDefault();

    var search = artistNameEl.value;

    artistCall(search);
    p = document.getElementById('artist-id');
    $("#artist-id").empty();
    p.innerHTML += search;
  }; 

//Save button logic, dynamically creates an additional button to be put in the previous wavez section
$(".save-btn").on("click", function(){
    var previousWavez = document.createElement("button");

    var artist = ""
    var img = ""

    artist = $("#artist-id").text();
    img = $("#currSearch").attr("src");

    previousWavez.textContent = `${artist}`;
    previousWavez.setAttribute("data-img", `${img}`);
    previousWavez.setAttribute("data-artist", `${artist}`);

    localStorage.setItem("artist", artist);
    localStorage.setItem("img", img);

    console.log(artist);
    console.log(img);

$(".prev-results").append(previousWavez);
});

//Handles the previousWaves button logic
var previousWavezHandler = function(event) {
    if (event.target.getAttribute("data-artist")) {
        var imgRecall = event.target.getAttribute("data-img");
        var artistRecall = event.target.getAttribute("data-artist");

        p.innerHTML = artistRecall;

        currSearchEl.setAttribute("src", "");
        currSearchEl.setAttribute("src", imgRecall);
    };
}
  
artistSearchForm.addEventListener("submit", generateImage);
previousWavezEl.addEventListener("click", previousWavezHandler);