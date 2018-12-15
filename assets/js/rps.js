/*************GLOBAL VARIABLES**************/
var p1Choice, p2Choice, p1, p2, iAm, gameOn;
var p1Ref, p2Ref;
var p1W = 0;
var p1L = 0;
var p1T = 0;
var p2W = 0;
var p2L = 0;
var p2T = 0;

$("#startMe").on("click", function() {
  var user;
  event.preventDefault();
  user = $("#userInput")
    .val()
    .trim();
  if (!user) {
    alert("You can't add a blank name.");
    return;
  }
  if (user === "OFFLINE") {
    alert("Don't be stupid.  Don't use that one.");
    return;
  }

  if (p1 === "OFFLINE") {
    iAm = "p1";
    $("#p1Name").text(user);
    database
      .ref("/p1")
      .onDisconnect()
      .set({ name: "OFFLINE", choice: "" });
    database.ref("/p1").update({
      name: user
    });
    name = user;
  } else {
    database
      .ref("/p2")
      .onDisconnect()
      .set({ name: "OFFLINE", choice: "" });

    iAm = "p2";
    $("#p2Name").text(user);
    database.ref("/p2").update({
      name: user
    });
    p2 = user;
  }
  $("#userInput").val("");
  $(this).addClass("hide");
  $("#userInput").addClass("hide");
});

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBkVNxJuR0ll4B9W_FU8QLvHtcyGiZ7OUA",
  authDomain: "hw-rps-84523.firebaseapp.com",
  databaseURL: "https://hw-rps-84523.firebaseio.com",
  projectId: "hw-rps-84523",
  storageBucket: "",
  messagingSenderId: "62553170311"
};
firebase.initializeApp(config);
var database = firebase.database();

database.ref().on("value", function(snapshot) {
  p1 = snapshot.val().p1.name;
  p1Choice = snapshot.val().p1.choice;
  p2 = snapshot.val().p2.name;
  p2Choice = snapshot.val().p2.choice;

  if (iAm === "p1") {
    player1Logic();
  } else if (iAm === "p2") {
    player2Logic();
  } else {
    playerNoneLogic();
  }
  if (p1Choice && p2Choice) {
    processData();
  }
});
database.ref("/chat1").on("value", function(snapshot) {
  var x = snapshot.val().text;
  var msg = $("<h6/>")
    .addClass("blue")
    .html(p1 + " says:  " + x + "<br>");
  if (x !== "") {
    $("#messages").append(msg);
  }
});
database
  .ref("/chat1")
  .onDisconnect()
  .set({ text: "" });

database.ref("/chat2").on("value", function(snapshot) {
  var x = snapshot.val().text;
  if (p2 === "OFFLINE") {
    return;
  }
  var msg = $("<h6/>")
    .addClass("red")
    .text(p2 + " says:  " + x);
  if (x !== "") {
    $("#messages").append(msg);
  }
});

database
  .ref("/chat2")
  .onDisconnect()
  .set({ text: "" });

function player1Logic() {
  if (p2 === "OFFLINE") {
    $("#welcome").text(
      "Welcome, " + p1 + ". Waiting on another player to join."
    );
    gameOn = false;
    $("#p1ButtonDiv").addClass("hide");
    $("#waitingDiv1").addClass("hide");
    $("#p2ButtonDiv").addClass("hide");
    $("#waitingDiv2").addClass("hide");
    //no processing game logic necessary after this.
    return;
  } else {
    $("#p2Name").text(p2);
    gameOn = true;
    $("#welcome").text("Welcome, " + p1 + " and " + p2 + ".  Good luck!");
  }

  if (gameOn) {
    if (p1Choice && p2Choice) {
      //Both Picked
      $("#bd3").removeClass("hide");
      $("#p2ButtonDiv").removeClass("hide");
      $(".p2Pic").addClass("hide");
      if (p2Choice === "Rock") {
        $("#pic4").removeClass("hide");
      }
      if (p2Choice === "Paper") {
        $("#pic5").removeClass("hide");
      }
      if (p2Choice === "Scissors") {
        $("#pic6").removeClass("hide");
      }
    } else if (p1Choice) {
      //p1 Selected
      //no changes needed here
    } else {
      $("#bd1").removeClass("hide");
      $(".p1Pic").removeClass("hide");
      $("#p1ButtonDiv").removeClass("hide");
      $("#p1Pick").addClass("hide");
      $("#waitingDiv1").addClass("hide");
      $("#bd3").addClass("hide");
    }
  }
}

function player2Logic() {
  if (p1 === "OFFLINE") {
    $("#welcome").text(
      "Welcome, " + p2 + ". Waiting on another player to join."
    );
    gameOn = false;
    return;
  } else {
    $("#p1Name").text(p1);
    gameOn = true;
    $("#welcome").text("Welcome, " + p2 + " and " + p1 + ".  Good luck!");
  }

  if (gameOn) {
    if (p1Choice && p2Choice) {
      //Show Picks
      $("#bd1").removeClass("hide");
      $("#p1ButtonDiv").removeClass("hide");
      $(".p1Pic").addClass("hide");
      if (p1Choice === "Rock") {
        $("#pic1").removeClass("hide");
      }
      if (p1Choice === "Paper") {
        $("#pic2").removeClass("hide");
      }
      if (p1Choice === "Scissors") {
        $("#pic3").removeClass("hide");
      }

      $("#bd3").removeClass("hide");
      $("#p1Pick").removeClass("hide");
      $("#p2Pick").removeClass("hide");
    } else if (p2Choice) {
      // p2 Selected
      // no changes needed here.
    } else {
      $("#bd3").removeClass("hide");
      $(".p2Pic").removeClass("hide");
      $("#p2ButtonDiv").removeClass("hide");
      $("#waitingDiv2").addClass("hide");
      $("#p1ButtonDiv").addClass("hide");
    }
  }
}
function playerNoneLogic() {
  if (p1 === "OFFLINE" && p2 === "OFFLINE") {
    //no one has joined.
    $("#welcome").text(
      "Waiting on 2 players to join.  Add your name and click Start to join."
    );
    $("#bd1").addClass("hide");
    $("#waitingDiv1").addClass("hide");
    $("#p1Pick").addClass("hide");
    $("#bd3").addClass("hide");
    $("#waitingDiv2").addClass("hide");
    $("#p2Pick").addClass("hide");
  } else if (p1 === "OFFLINE" || p2 === "OFFLINE") {
    $("#welcome").text(
      //One has joined
      "Waiting on 1 player to join.  Add your name and click Start to join."
    );
  } else {
    //Two players joined.  Hide join button.
    $("#welcome").text("Game is full.  Try again later.");
  }
}
function newGame() {
  setTimeout(function() {
    $("#p1Div").removeClass("tie");
    $("#p2Div").removeClass("tie");
    $("#p1Div").removeClass("winner");
    $("#p2Div").removeClass("winner");
    $("#p1Wins").text("");
    $("#p2Wins").text("");
    $("#battleDiv").empty();
    database.ref("/p1").update({
      choice: ""
    });
    database.ref("/p2").update({
      choice: ""
    });
  }, 3000);
}

$(document).ready(function() {
  if (p1) {
    $("#inputRow").RemoveClass("hide");
    $("#welcome").text("Welcome!  Type your name and click start.");
  } else if (p2) {
    $("#inputRow").RemoveClass("hide");
    $("#welcome").text("Welcome!  Type your name and click start.");
  } else {
    //DO I NEED ANYTHING HERE?
  }

  $("#pic1").attr("data-val", "Rock");
  $("#pic2").attr("data-val", "Paper");
  $("#pic3").attr("data-val", "Scissors");
  $("#pic4").attr("data-val", "Rock");
  $("#pic5").attr("data-val", "Paper");
  $("#pic6").attr("data-val", "Scissors");

  $("#waiting2").text(p1);

  $(".p1Pic").on("click", function() {
    $(".p1Pic").addClass("hide");
    $(this).removeClass("hide");

    p1Choice = $(this).attr("data-val");

    database.ref("/p1").update({
      choice: p1Choice
    });
  });

  $(".p2Pic").on("click", function() {
    $(".p2Pic").addClass("hide");
    $(this).removeClass("hide");
    p2Choice = $(this).attr("data-val");

    database.ref("/p2").update({
      choice: p2Choice
    });
  });

  $("#trashBtn").on("click", function() {
    var smack = $("#trash")
      .val()
      .trim();
    $("#trash").val("");
    switch (iAm) {
      case "p1":
        //post p1 talk
        database.ref("/chat1").update({ text: smack });
        break;
      case "p2":
        //post p2 talk
        database.ref("/chat2").update({ text: smack });
        break;
      default:
      //post nothing
    }
  });
});

function processData() {
  var msg, winner;
  if (p1Choice === "Rock" && p2Choice === "Rock") {
    //TIE
    msg = p1 + " and " + p2 + " tie!";
    p1T++;
    p2T++;
    winner = "tie";
  }
  if (p1Choice === "Rock" && p2Choice === "Paper") {
    //P2 WINS
    msg = p2 + " wins!";
    p1L++;
    p2W++;
    winner = "p2";
  }
  if (p1Choice === "Rock" && p2Choice === "Scissors") {
    //P1 WINS
    msg = p1 + " wins!";
    p1W++;
    p2L++;
    winner = "p1";
  }
  if (p1Choice === "Paper" && p2Choice === "Rock") {
    //P1 WINS
    msg = p1 + " wins!";
    p1W++;
    p2L++;
    winner = "p1";
  }
  if (p1Choice === "Paper" && p2Choice === "Paper") {
    //TIE
    msg = p1 + " and " + p2 + " tie!";
    p1T++;
    p2T++;
    winner = "tie";
  }
  if (p1Choice === "Paper" && p2Choice === "Scissors") {
    //P2 WINS
    msg = p2 + " wins!";
    p1L++;
    p2W++;
    winner = "p2";
  }
  if (p1Choice === "Scissors" && p2Choice === "Rock") {
    //P2 WINS
    msg = p2 + " wins!";
    p1L++;
    p2W++;
    winner = "p2";
  }
  if (p1Choice === "Scissors" && p2Choice === "Paper") {
    //p1
    msg = p1 + " wins!";
    p1W++;
    p2L++;
    winner = "p1";
  }
  if (p1Choice === "Scissors" && p2Choice === "Scissors") {
    //Tie
    msg = p1 + " and " + p2 + " tie!";
    p1T++;
    p2T++;
    winner = "tie";
  }
  switch (winner) {
    case "p1":
      //highlight p1
      $("#p1Div").addClass("winner");
      $("#p1Wins").text(" WINS!!");
      break;
    case "p2":
      //highight p2
      $("#p2Div").addClass("winner");
      $("#p2Wins").text(" WINS!!");
      break;
    case "tie":
      //highlight both
      $("#p1Div").addClass("tie");
      $("#p2Div").addClass("tie");
      $("#p1Wins").text(" Ties");
      $("#p2Wins").text(" Ties");
  }
  var x = $("<h4>").html("<strong>" + msg + "</strong>");
  // $("#battleText").append(x);
  $("#p1Rec").text("W: " + p1W + " | L: " + p1L + " | T: " + p1T);
  $("#p2Rec").text("W: " + p2W + " | L: " + p2L + " | T: " + p2T);
  newGame();
}
