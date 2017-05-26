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

//limits time input to valid time
$('#first-train-input').on('keyup change', function() {
  console.log('the time has changed');
  var currentVal = $(this).val();
  var cleanVal = currentVal.replace(':', '');
  console.log(currentVal.length)
  if(cleanVal.length === 4) {
   var firstTwo = cleanVal.substring(0, 2);
   var lastTwo = cleanVal.substring(2, 4);
   console.log(firstTwo, lastTwo)
   if (parseInt(firstTwo) < 0 || parseInt(firstTwo) > 24 || parseInt(lastTwo) < 0 || parseInt(lastTwo) > 59) {
      $(this).val('');
   }else {
      $(this).val(firstTwo + ':' + lastTwo)
   }
   if (firstTwo == 24) {
      $(this).val(firstTwo + ':' + '00')
   }
  }
  //if cleanVal longer than 4 it deletes the last value limiting it to 4
  if(cleanVal.length > 4) {
    $(this).val(currentVal.substring(0, currentVal.length - 1));
  }
})

//creates child in database and creates row with input
database.ref().on('child_added', function(childSnapshot, prevChildKey) {
  //establishes childSnapshot variables
  var cStrainName = childSnapshot.val().dBtrainName;
  var cSdestination = childSnapshot.val().dBdestination;
  var cSfirstTrainTime = childSnapshot.val().dBfirstTrainTime;
  var cSfrequency = childSnapshot.val().dBfrequency;

  //establishes times for trains using moment
  var firstTimeConverted = moment(cSfirstTrainTime, 'HH:mm').subtract(1, 'years');
  var currentTime = moment();
  var diffTime = moment().diff(moment(firstTimeConverted), 'minutes');
  var tRemainder = diffTime % cSfrequency;
  var minutesAway = cSfrequency - tRemainder;
  var calcNextArrival = moment().add(minutesAway, 'minutes');
  var nextArrival = moment(calcNextArrival).format('HH:mm');

  //append train data to the table
  $('table > tbody').append('<tr><td>' + cStrainName + '</td><td>' + cSdestination + '</td><td>Every ' +
  cSfrequency + ' minutes' + '</td><td>' + nextArrival + '</td><td>' + minutesAway +  '</td></tr>');
})

});
