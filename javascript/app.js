$(document).ready(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAk-idS8D72r5n86tIotHObh2ts0ldfNMA",
    authDomain: "trainscheduler-d18b4.firebaseapp.com",
    databaseURL: "https://trainscheduler-d18b4.firebaseio.com",
    projectId: "trainscheduler-d18b4",
    storageBucket: "trainscheduler-d18b4.appspot.com",
    messagingSenderId: "659990071707"
  };
  firebase.initializeApp(config);

var database = firebase.database();
//establishes trains on click
$('#add-train-btn').on('click', function(event) {
  event.preventDefault();
  //establishes train variables
  var trainName = $('#train-name-input').val().trim();
  var destination = $('#destination-input').val().trim();
  var firstTrainTime = $('#first-train-input').val().trim();
  var frequency = $('#frequency-input').val().trim();

  //establishes temporary train values
  var newTrain = {
    dBtrainName: trainName,
    dBdestination: destination,
    dBfirstTrainTime: firstTrainTime,
    dBfrequency: frequency,
  };

  //saves train values
  database.ref().push(newTrain);

  //clear values
  $('#train-name-input').val('');
  $('#destination-input').val('');
  $('#first-train-input').val('');
  $('#frequency-input').val('');
});
//creates child in database and creates row with input
database.ref().on('child_added', function(childSnapshot, prevChildKey) {
  //establishes childSnapshot variables
  var cStrainName = childSnapshot.val().dBtrainName;
  var cSdestination = childSnapshot.val().dBdestination;
  var cSfirstTrainTime = childSnapshot.val().dBfirstTrainTime;
  var cSfrequency = childSnapshot.val().dBfrequency;

  //establishes times for trains using moment
  var firstTimeConverted = moment(cSfirstTrainTime, 'hh:mm').subtract(1, 'years');
  var currentTime = moment();
  var diffTime = moment().diff(moment(firstTimeConverted), 'minutes');
  var tRemainder = diffTime % cSfrequency;
  var minutesAway = cSfrequency - tRemainder;
  var calcNextArrival = moment().add(minutesAway, 'minutes');
  var nextArrival = moment(calcNextArrival).format('hh:mm');

  //append train data to the table
  $('table > tbody').append('<tr><td>' + cStrainName + '</td><td>' + cSdestination + '</td><td>Every ' +
  cSfrequency + ' minutes' + '</td><td>' + nextArrival + '</td><td>' + minutesAway +  '</td></tr>');
})

});
