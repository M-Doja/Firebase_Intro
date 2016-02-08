//  Creates an empty Array
var shows = [];

// This function calls the server to display the data on the server (In the 'shows' Array)
function getShows(){
  var req = new XMLHttpRequest();
  req.open("GET", "https://movie-rate.firebaseio.com/.json");

  req.onload = function(){
  console.log(req);
  if (200 <= this.status < 400){
    // console.log(this.response);
    var res = JSON.parse(this.response);
    var elemStr = "";
    shows.length = 0; // empties the array
    for (var prop in res){
      res[prop]._id = prop;
      shows.push(res[prop]);
      elemStr += "<li>" + res[prop].title + ": " + res[prop].years + " | " + res[prop].rating + "<button style='margin-left:10px; text-align:center;' class='btn btn-warning btn-sm' onclick='startEdit(" + (shows.length - 1) + ")'>Edit</button></li>"
      console.log(res[prop]);
    }
    document.getElementById('movies').innerHTML = elemStr;
    // console.log(res);
    }else {
      console.log(this.response);
    }
  }
  req.send();
}
getShows();

function startEdit(index){
  $("#editTitle").val(shows[index].title);
  $("#editYears").val(shows[index].years);
  $("#editRating").val(shows[index].rating);
  $("#editSubmitButton").html('<button onclick="saveEdit(' + index +')" class="btn btn-primary">Save Changes</button>');
  $("#myModal").modal('toggle');
}

function saveEdit(index){
  var title = $("#editTitle").val();
  var years = $("#editYears").val();
  var rating = $("#editRating").val();
  var show = new tvShow(title, years, rating);

  $.ajax({
    url: "https://movie-rate.firebaseio.com/" + shows[index]._id + "/.json",
    type: "PUT",
    data: JSON.stringify(show)
  }).success(function(res){
    //  res = this.response
    getShows();
  })
  $("#myModal").modal('toggle');
}


function tvShow(title, years, rating){
  this.title = title;
  this.years = years;
  this.rating = rating;
}
function saveShows(){
  var title = document.getElementById("movieTitle").value;
  var years = document.getElementById("movieYears").value;
  var rating = document.getElementById("movieRating").value;

  var show = new tvShow(title, years, rating);

  var req = new XMLHttpRequest();
  req.open('POST',"https://movie-rate.firebaseio.com/.json");
  req.onload = function(){
      getShows();
  }
  document.getElementById("movieTitle").value = "";
  document.getElementById("movieYears").value = "";
  document.getElementById("movieRating").value = "";
  req.send(JSON.stringify(show));
}
function deleteShows() {
  var elemStr = "";
  for (var i=0; i<shows.length; i+=1){
    elemStr +="<li><input id='"+ shows[i]._id + "'type='checkbox' value='false' class='form-control' style='dislay:inline-block; margin-right:5px; margin-bottom:5px;'/>" + shows[i].title + ": " + shows[i].years + " | " + shows[i].rating + "</li>"
    }
    $("#movies").html(elemStr);
    $("#buttonsGoHere").html('<button class="btn btn-success" onclick="saveDelete()">Delete</button><button class="btn btn-danger" onclick="cancel()">Cancel</button>');
  }
function cancel(){
  $("#buttonsGoHere").html('');
  getShows();
}
var delCount,
    boxes;
function saveDelete(){
  delCount = 0;
  boxes = $(":checkbox:checked");
  if(boxes.length > 0){
    deleteShowsFunc(boxes[0].id);
  }
}
//  recursive function
function deleteShowsFunc(id){
  $.ajax({
    url:'https://movie-rate.firebaseio.com/' + id + '/.json', type: 'DELETE'
  }).success(function(){
    delCount += 1;
    if(delCount < boxes.length){
      deleteShowsFunc(boxes[delCount].id);
    } else {
      getShows();
    }
  })
}

function getWeather() {
$.ajax({
   url: 'https://simple-weather.p.mashape.com/', // The URL to the API. You can get this in the API page of the API you intend to consume
   type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
   data: {
     "location": {
          "city": "",
          "country": "",
          "region": ""
        },
     "units": {
          "distance": "km",
          "pressure": "mb",
          "speed": "km/h",
          "temperature": "F"
        }
   }, // Additional parameters here
   dataType: 'json',
   success: function(data) { console.dir((data.source)); },
   error: function(err) { alert(err); },
   beforeSend: function(xhr) {
   xhr.setRequestHeader("X-Mashape-Authorization", "WeatherMan"); // Enter here your Mashape key
   }
});
}
