console.log("hello world test");
$(document).ready(function(){

 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyA8jbcupFby4FkFTZHBAth1xNE-Zi0Ju3E",
    authDomain: "train-schedule-7fb47.firebaseapp.com",
    databaseURL: "https://train-schedule-7fb47.firebaseio.com",
    projectId: "train-schedule-7fb47",
    storageBucket: "train-schedule-7fb47.appspot.com",
    messagingSenderId: "475892815820"
  };
  firebase.initializeApp(config);

  

  // Create a variable to reference the database
  var database = firebase.database();

  

    //database.ref().push({
      //name: "Bill",
      //email: "b@bb.com",
      //age: "21",
      //comment: "first comment"
   

 


  $("#add-train").on("click", function(event) {
    event.preventDefault();

    
    name = $("#name-input").val().trim();
    destination = $("#destination-input").val().trim();
    frequency = $("#frequency-input").val().trim();
    first = $("#first-input").val().trim();
    //minutes = $("#arrival-input").val().trim();
    

    // Code for the push
    database.ref().push({

      name: name,
      destination: destination,
      frequency: frequency,
      first: first,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  });




  // watcher updates table with new data
  database.ref().on("child_added", function(snapshot) {

    
    console.log(snapshot.val());
    console.log(snapshot.val().name);
    console.log(snapshot.val().destination);
    console.log(snapshot.val().first);
    console.log(snapshot.val().frequency);
    
    var first = (snapshot.val().first);
    var frequency = (snapshot.val().frequency);


    var row = $("<tr></tr>");
    var col1 = $("<td></td>").text(snapshot.val().name);
    row.append(col1);

    var col2 = $("<td></td>").text(snapshot.val().destination);
    row.append(col2);

    var col3 = $("<td></td>").text(snapshot.val().frequency);
    row.append(col3);


    
    
   //following code caculates how long till next train and when it arrives

    // push time back one year so we don't end up with a negative number for the difference
    var oneYearAgo = moment(first, "HH:mm").subtract(1, "years");
    
    

    // calculates number of minutes from first time to current time
    var timeDifference = moment().diff(moment(oneYearAgo), "minutes");
    

    // calculates the remainder of the difference divided by frequency
    var remainder = timeDifference % frequency;
    

    // subtracts remainder form frequency to calculate when next train arrives
    var minutesToArrive = frequency - remainder;
    

    // adds minutes until next to current time to find next arrival
    var next = moment().add(minutesToArrive, "minutes");
    
    //adds to next arrival to table
    var col4 = $("<td></td>").text(next);
    row.append(col4);

    //adds minutes until next to table
    var col5 = $("<td></td>").text(minutesToArrive);
    row.append(col5);

    //appends row to table
    $("#trainSched").append(row);

    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });



//end doc ready
})