$(document).ready(function() {
  var lite;
  var dark;
  var thisLetter;
  var simonSays;
  var level = 0;
  var sCount = 0;
  var pCount = 0;

  var strictMode = false;
  var startLocked = false;

  var simonArr = [];
  var playerArr = [];

  function youWin() {
    if (level >= 20) {
      for (i = 0; i <= 2000; i += 1000) {
        setTimeout(screenFlash, i, "!!!");
      }
      setTimeout(reset, 3000);
      startLocked = false;
      $(".start").css("background", "#9CAAF8");
    }
  }

  function beep(letter) {
    var sound = document.getElementById(letter);
    sound.play();
  }

  function colorSelect(classColor) {
    switch (classColor) {
      case "grn":
        simonSays = ".grn";
        lite = "#00ff00";
        dark = "green";
        thisLetter = "g";
        break;
      case "ylw":
        simonSays = ".ylw";
        lite = "yellow";
        dark = "#cccc00";
        thisLetter = "y";
        break;
      case "red":
        simonSays = ".red";
        lite = "#ff0000";
        dark = "#cc0000";
        thisLetter = "r";
        break;
      case "blu":
        simonSays = ".blu";
        lite = "#0055ff";
        dark = "blue";
        thisLetter = "b";
        break;
    }
  }

  $("button")
    .mouseup(function() {
      //condense this into its own function
      if (startLocked === true) {
        var thisClass = $(this).attr("class");
        colorSelect(thisClass);
        $(this).css("background", dark);
      }
    })
    .mousedown(function blink() {
      if (startLocked === true) {
        var thisClass = $(this).attr("class");
        colorSelect(thisClass);
        beep(thisLetter);
        $(this).css("background", lite);
        playerTurn();
      }
    });

  function simonTurn() {
    //uses previous pattern if it exists
    var valueExists = simonArr[sCount] !== undefined;
    if (valueExists) {
      colorSelect(simonArr[sCount]);
      sCount += 1;
      //uses random
    } else {
      var ranColor = Math.floor(Math.random() * 4);
      switch (ranColor) {
        case 0:
          ranColor = "grn";
          break;
        case 1:
          ranColor = "blu";
          break;
        case 2:
          ranColor = "ylw";
          break;
        case 3:
          ranColor = "red";
          break;
      }
      colorSelect(ranColor);
      simonArr.push(ranColor);
      sCount = 0;
    }
  }

  function endTurn() {
    $(simonSays).css("background", dark);
    playerArr = [];
  }

  function tick() {
    simonTurn();
    $(simonSays).css("background", lite);
    beep(thisLetter);
    setTimeout(endTurn, 500);
  }

  function playerTurn() {
    var pushMe = simonSays
      .split("")
      .splice(1, 3)
      .join("");
    playerArr.push(pushMe);
    if (playerArr[pCount] !== simonArr[pCount]) {
      //you got it wrong
      pCount = 0;
      sCount = 0;
      youLose();
    } else if (playerArr.length === simonArr.length) {
      //you got it all of them right
      youWin();
      if(level < 20) {
        sCount = 0;
        pCount = 0;
        levelUp();
        for (i = 1000; i <= level * 1000; i += 1000) {
          setTimeout(tick, i);
        }
      }
    } else {
      //you got one right
      pCount += 1;
    }
  }

  function levelUp() {
    level += 1;
    if (level < 10) {
      $(".score").text("0" + level);
    } else {
      $(".score").text(level);
    }
  }

  $(".start").on("click", function() {
    //so you can only press start once
    if (startLocked === false) {
      startLocked = true;
      levelUp();
      for (i = 1000; i <= level * 1000; i += 1000) {
        setTimeout(tick, i);
      }
      $(this).css({ background: "blue" });
    }
  });

  function reset() {
    thisLetter = "";
    simonSays = "";
    level = 0;
    sCount = 0;
    pCount = 0;
    simonArr = [];
    playerArr = [];
    $(".score").text("0" + level);
  }

  $(".reset").on("click", function() {
    reset();
    startLocked = false;
    $(".start").css("background", "#9CAAF8");
  });

  $(".strict").on("click", function() {
    $(this).toggleClass("strictMode");
    strictMode = !strictMode;
  });

  function screenFlash(text) {
    $(".score").text(text);
    setTimeout(function() {
      $(".score").text("");
    }, 500);
  }

  function youLose() {
    $(".score").text("");
    $(".score").css("color", "red");
    //blinks a few times
    for (i = 0; i <= 2000; i += 1000) {
      setTimeout(screenFlash, i, "X!");
    }
    setTimeout(function() {
      $(".score").css("color", "green");
      if (strictMode) {
        reset();
        levelUp();
        for (i = 1000; i <= level * 1000; i += 1000) {
          setTimeout(tick, i);
        }
      } else {
        //easy mode
        playerArr = [];
        if (level < 10) {
          $(".score").text("0" + level);
        } else {
          $(".score").text(level);
        }
        for (i = 1000; i <= level * 1000; i += 1000) {
          setTimeout(tick, i);
        }
      }
    }, 3000);
  }
});
