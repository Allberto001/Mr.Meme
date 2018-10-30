var dotenv = require("dotenv").config()
var request = require('request');
var fs = require("fs");
var keys = require("./keys.js");
var spotify = require('node-spotify-api');

// this will pick up the users input example: node Mr.Meme [2 user input]
var command = process.argv[2];
var searchval = "";

// creating a for loop to make the search value a string
// i = 3 is refferring to the unputs such as '<movie name>'
for(var i = 3; i < process.argv.length; i++) {
    searchval += process.argv[i] + " ";
};

// creating switch case to take users command and run the corresponding function
switch (command) {
    case "spotify-this-song":
    searchSong(searchval);
    break;
    case "do-what-it-says":
    randomSearch();
    break;
    default:
    console.log("\nOh Boy, " + command + " Is just not in my protocol. Try to do it like this instead: \n\n  1. For a random search: node mr.meme.js do-what-it-says \n\n  2. To search Spotify for a song: node mr.meme.js spotify-this-song (*optional number for amount of returned results) (specify song title)\n     Example: node mr.meme.js spotify-this-song 15 Candle in the Wind\n\n");
};


//error function if no response
function errorfunction(resperror) {
 if(resperror){
     return console.log("error occured: ", resperror)
 }
};

// functions for the spotify-this-song command --------
function searchSong(searchval) {

    // Default search value if no song is given
    if (searchval == "") {
        searchval = "The Sign Ace of Base";
    }

    // Accesses Spotify keys  
    var spotify = new Spotify(keys.spotify);

    var searchLimit = "";

    // Allows the user to input the number of returned spotify results, defaults 1 return if no input given
    if (isNaN(parseInt(process.argv[3])) == false) {
        searchLimit = process.argv[3];

        console.log("\nYou requested to return: " + searchLimit + " songs");
        
        // Resets the searchValue to account for searchLimit
        searchValue = "";
        for (var i = 4; i < process.argv.length; i++) {        
            searchValue += process.argv[i] + " ";
        };

    } else {
        console.log("\nFor more than 1 result, add the number of results you would like to be returned after spotify-this-song.\n\nExample: if you would like 3 results returned enter:\n     node.js spotify-this-song 3 Kissed by a Rose")
        searchLimit = 1;
    }
   
    // Searches Spotify with given values
    spotify.search({ type: 'track', query: searchValue, limit: searchLimit }, function(resperror, response) {

        fs.appendFile("log.txt", "-----Spotify Log Entry Start-----\nProcessed on:\n" + Date() + "\n\n" + "terminal commands:\n" + process.argv + "\n\n" + "Data Output: \n", errorFunctionStart());

        errorFunction();

        var songResp = response.tracks.items;

        for (var i = 0; i < songResp.length; i++) {
            console.log("\n=============== Spotify Search Result "+ (i+1) +" ===============\n");
            console.log(("Artist: " + songResp[i].artists[0].name));
            console.log(("Song title: " + songResp[i].name));
            console.log(("Album name: " + songResp[i].album.name));
            console.log(("URL Preview: " + songResp[i].preview_url));
            console.log("\n=========================================================\n");

            fs.appendFile("log.txt", "\n========= Result "+ (i+1) +" =========\nArtist: " + songResp[i].artists[0].name + "\nSong title: " + songResp[i].name + "\nAlbum name: " + songResp[i].album.name + "\nURL Preview: " + songResp[i].preview_url + "\n=============================\n", errorFunction());
        }

        fs.appendFile("log.txt","-----Spotify Log Entry End-----\n\n", errorFunctionEnd());
    })
};
