var currentUserRef;
var currentSessionRef;

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
    a.appendChild(document.createTextNode(session.name));
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
  currentSessionRef = null;
  currentUserRef = null;
  document.getElementById("questionsList").innerHTML = "";

  document.getElementById("backButton").style.display = 'none';
  document.getElementById("sessionContainer").style.display = 'none';
  document.getElementById("addQuestionButton").style.display = 'none';
  document.getElementById("addSessionButton").style.display = 'inline';
  document.getElementById("indexContainer").style.display = 'inline';
}

function setSession(id, name, creator) {

  // GET USERNAME FOR PERSON //
  var person = prompt("Please enter your name", "Harry Potter");

  if (person != null){
    currentSessionRef = new Firebase("https://burning-heat-1866.firebaseio.com/sessions/" + id);

    document.getElementById("sessionTitle").innerHTML = name;
    document.getElementById("sessionCreator").innerHTML = creator;

    // Set new user
    currentUserRef = currentSessionRef.child("users").push();
    currentUserRef.set({
      name: person
    });

    // Get Questions
    currentSessionRef.child("questions").on("child_added", function(snapshot) {
      var session = snapshot.val();

      var ul = document.getElementById("questionsList");
      var li = document.createElement("li");
      li.setAttribute("id", snapshot.key());

      var a = document.createElement("a");
      a.appendChild(document.createTextNode("Upvote this question"));
      a.setAttribute("href", "javascript:upvoteQuestion(\"" + snapshot.key() + "\")");

      var p = document.createElement("p");
      p.appendChild(document.createTextNode(session.upvotes + " Upvotes : " + session.text));

      li.appendChild(a);
      li.appendChild(p);
      ul.appendChild(li);
    });

    currentSessionRef.child("questions").on("child_changed", function(snapshot) {
      var session = snapshot.val();

      var li = document.getElementById(snapshot.key());
      li.innerHTML = "";

      var a = document.createElement("a");
      a.appendChild(document.createTextNode("Upvote this question"));
      a.setAttribute("href", "javascript:upvoteQuestion(\"" + snapshot.key() + "\")");

      var p = document.createElement("p");
      p.appendChild(document.createTextNode(session.upvotes + " Upvotes : " + session.text));

      li.appendChild(a);
      li.appendChild(p);
    });

    document.getElementById("backButton").style.display = 'inline';
    document.getElementById("sessionContainer").style.display = 'inline';
    document.getElementById("addQuestionButton").style.display = 'inline';
    document.getElementById("addSessionButton").style.display = 'none';
    document.getElementById("indexContainer").style.display = 'none';
  } else {
    closeSession();
  }
}

function upvoteQuestion(id) {
  var questionRef = currentSessionRef.child("questions").child(id);
  var qUpvotes;

  questionRef.on("value", function(snapshot) {
    var question = snapshot.val();
    qUpvotes = question.upvotes;
  });

  questionRef.update({upvotes: qUpvotes + 1});
}

function openAddQuestion() {
  document.getElementById("addQuestionButton").style.display = 'none';
  document.getElementById("sessionContainer").style.display = 'none';
  document.getElementById("addQuestionContainer").style.display = 'inline';
}

function addQuestion(form) {
  // If session is null, the user pressed cancel.
  if (form != null && form.text != null) {
    var newQuestion = currentSessionRef.child("questions").push();

    newQuestion.set({
      user_id: currentUserRef.key(),
      text: form.text.value,
      upvotes: 0
    });
  }

  document.getElementById("addQuestionButton").style.display = 'inline';
  document.getElementById("sessionContainer").style.display = 'inline';
  document.getElementById("addQuestionContainer").style.display = 'none';
}
