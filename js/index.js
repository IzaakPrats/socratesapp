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
    a.setAttribute("href", "javascript:setSession(\"" + snapshot.key() + "\", \"" + session.name + "\", \"" + session.creator + "\")");

    li.appendChild(a);
    ul.appendChild(li);

    numOfSessions = numOfSessions + 1;
    document.getElementById("sessionsCount").innerHTML = "There are " + numOfSessions + " Sessions."
  });
}

function openAddSession() {
  document.getElementById("addSessionButton").style.display = 'none';
  document.getElementById("indexContainer").style.display = 'none';
  document.getElementById("addSessionContainer").style.display = 'inline';
}

function addSession(form) {
  // If session is null, the user pressed cancel.
  if (form != null && form.name != null && form.creator != null) {
    var firebaseRef = new Firebase("https://burning-heat-1866.firebaseio.com/sessions/");
    var newSessionRef = firebaseRef.push();

    newSessionRef.set({
      name: form.name.value,
      creator: form.creator.value
    });
  }

  document.getElementById("addSessionButton").style.display = 'inline';
  document.getElementById("indexContainer").style.display = 'inline';
  document.getElementById("addSessionContainer").style.display = 'none';
}

function closeSession() {
  document.getElementById("backButton").style.display = 'none';
  document.getElementById("sessionContainer").style.display = 'none';
  document.getElementById("addSessionButton").style.display = 'inline';
  document.getElementById("indexContainer").style.display = 'inline';
}

function setSession(id, name, creator) {
  var firebaseRef = new Firebase("https://burning-heat-1866.firebaseio.com/sessions/" + id);

  document.getElementById("sessionTitle").innerHTML = name;
  document.getElementById("sessionCreator").innerHTML = creator;

  <!-- Get Questions -->
  firebaseRef.child("questions").on("child_added", function(snapshot) {
    var session = snapshot.val();
    console.log("ID: " + snapshot.key());
    console.log("Name: " + session.name);
    console.log("Creator: " + session.creator);

    var ul = document.getElementById("sessionsList");
    var li = document.createElement("li");

    var a = document.createElement("a");
    a.appendChild(document.createTextNode("Session : " + session.name));
    a.setAttribute("href", "javascript:setSession(\"" + snapshot.key() + "\")");

    li.appendChild(a);
    ul.appendChild(li);

    numOfSessions = numOfSessions + 1;
    document.getElementById("sessionsCount").innerHTML = "There are " + numOfSessions + " Sessions."
  });

  document.getElementById("backButton").style.display = 'inline';
  document.getElementById("sessionContainer").style.display = 'inline';
  document.getElementById("addSessionButton").style.display = 'none';
  document.getElementById("indexContainer").style.display = 'none';
}
