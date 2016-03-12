window.onload = function() {
  init();
};

function init() {
  var firebaseRef = new Firebase("https://burning-heat-1866.firebaseio.com/sessions/");
  var numOfSessions = 0;

  firebaseRef.on("child_added", function(snapshot) {
    var session = snapshot.val();
    console.log("ID: " + snapshot.key());
    console.log("Name: " + session.name);
    console.log("Creator: " + session.creator);

    var ul = document.getElementById("sessionsList");
    var li = document.createElement("li");

    var a = document.createElement("a");
    a.appendChild(document.createTextNode("Session : " + session.name));
    a.setAttribute("href", "javascript:setSession("+ snapshot.key() + ")");

    li.appendChild(a);
    ul.appendChild(li);

    numOfSessions = numOfSessions + 1;
    document.getElementById("sessionsCount").innerHTML = "There are " + numOfSessions + " Sessions."
  });
}

function openAddSession() {
  document.getElementById("addSessionContainer").style.display = 'inline';
}

function addSession(form) {
  // If session is null, the user pressed cancel.
  var firebaseRef = new Firebase("https://burning-heat-1866.firebaseio.com/sessions/");
  var newSessionRef = firebaseRef.push();

  newSessionRef.set({
    name: form.name.value,
    creator: form.creator.value
  });

  document.getElementById("addSessionContainer").style.display = 'gone';
}

function setSession(id, name, creator) {
  var firebaseRef = new Firebase("https://burning-heat-1866.firebaseio.com/sessions/" + id);

}
