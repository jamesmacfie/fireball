Scores = new Meteor.Collection('scores');

if (Meteor.isClient) {
  /**
   Sets the counter and start the game timer.
  */
  var start = function () {
    Session.set("counter", 10);
    var startTime = new Date().getTime();
    var timer = setInterval(function () {
      // every 10 seconds (10 * 1000), subtract 1 from the counter
      var currentCounter = Session.get("counter");
      if (currentCounter > 0) {
        Session.set("counter", currentCounter - 1);
      } else {
        clearInterval(timer);
        alert("Game over!");
        var endTime = new Date().getTime();
        Scores.insert({
          score: endTime - startTime
        });
      }
    }, 10 * 1000);
  }
  // execute the start function
  start();

  Template.feed.helpers({
    counter: function () {
      return Session.get("counter");
    },
    mood: function () {
      var food = Session.get("counter");
      if (food === 0) {
        return "Your dragon has run away!";
      }
      var mood = "The dragon is ";
      if (food <= 3) {
        return mood + "angry.";
      } else if (food <= 5) {
        return mood + "hungry.";
      } else if (food === 20) {
        return mood + "full.";
      } else {
        return mood + "content.";
      }
    }
  });

  Template.feed.events({
    'click button': function () {
      // increment the counter when button is clicked
      var currentCounter = Session.get("counter");
      if (currentCounter > 0 && currentCounter < 20) {
        Session.set("counter", currentCounter + 1);
      }
    }
  });

  Template.scores.helpers({
    scores: function () {
      return Scores.find({}, { sort: { score: -1 }});
    }
  });

  Template.reset.events({
    'click button': function () {
      start();
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
