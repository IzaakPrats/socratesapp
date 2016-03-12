window.onload = function() {
  init();
};

function init() {
  var firebaseRef = new Firebase("https://burning-heat-1866.firebaseio.com/sessions/");
  var numOfSessions = 0;

  firebaseRef.on("child_added", function(snapshot) {
    var session = snapshot.val();
    console.log("ID: " + session.id);
    console.log("Name: " + session.name);
    console.log("Creator: " + session.creator);

    var ul = document.getElementById("sessionsList");
    var li = document.createElement("li");

    var a = document.createElement("a");
    a.appendChild(document.createTextNode("Session : " + session.name));
    a.setAttribute("href", "javascript:setSession("+ session.id +")");

    li.appendChild(a);
    ul.appendChild(li);

    numOfSessions = numOfSessions + 1;
    document.getElementById("sessionsCount").innerHTML = "There are " + numOfSessions + " Sessions."
  });
}

function addASession(name, creator) {
  var firebaseRef = new Firebase("https://burning-heat-1866.firebaseio.com/sessions/");
  var newSessionRef = firebaseRef.push();

  newSessionRef.set({
    name: name,
    creator: creator
  });
}
