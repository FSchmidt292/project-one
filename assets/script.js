var artistNameEl = document.querySelector("#artist-name");
var artistSearchForm = document.querySelector("#artist-search");
var currSearchEl = document.querySelector("#currSearch");
var previousWavezEl = document.querySelector(".previous-wavez");

var artists = []
var waves = []

var imageUrl = "";

//Initial API call. Will return album ID's of user input artist to be passed
//through the genreCall method
var artistCall = function(artist){
    //TODO replace the query with a user input dynamic response
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
    previousWavez.setAttribute("data-artist", `${img}`);
    artists.push(artist)
    waves.push(img)

    localStorage.setItem("artist", JSON.stringify(artists));
    localStorage.setItem("img", JSON.stringify(waves));

    console.log(img.valueOf);

$(".prev-results").append(previousWavez);
});
var pers = function(){
    //get info saved in local storage
    artistSaveData = JSON.parse(localStorage.getItem('artist'));
    imgSaveData = JSON.parse(localStorage.getItem('img'));
    //on multiple saves, the browser will inject a full array into the img and artist variables,
    //recursively looping through that array to print the single items of array.
    var printArtist = function(arr) {
        if ( typeof(arr) == "object") {
            for (var i = 0; i < arr.length; i++) {
                printArtist(arr[i]);
            }
        }
        else artists.push(arr);
    }
    
    printArtist(artistSaveData);
    
    var printImg = function(arra) {
        if ( typeof(arra) == "object") {
            for (var i = 0; i < arra.length; i++) {
                printImg(arra[i]);
            }
        }
        else waves.push(arra);
    }
    
    printImg(imgSaveData);

    artists.push(artistSaveData);
    waves.push(imgSaveData);
for (i = 0; i <= 30; i++) {
    //create the button
    var previousWavez = document.createElement("button");
    //reassign the artist and img variables locally
    var artist = artists[i];
    var img = waves[i];

       //check for null and undefined fields as to not display error
    if (artist === null || artist === undefined){
        console.log("crisis averted")
}else if (typeof(artist) =='object') {
    console.log("crisis averted")

}else{

    previousWavez.textContent = `${artist}`;
    previousWavez.setAttribute("data-artist", `${img}`);
$(".prev-results").append(previousWavez);
}}};

//Handles the previousWaves button logic
var previousWavezHandler = function(event) {
    var searchAgain = event.target.getAttribute("data-artist");

    currSearchEl.setAttribute("src", "");
    currSearchEl.setAttribute("src", searchAgain);
}
  
artistSearchForm.addEventListener("submit", generateImage);
previousWavezEl.addEventListener("click", previousWavezHandler);

pers();