var currentUserRef;
var currentSessionRef;

window.onload = function() {
  init();
};

function init() {
  // Create connection to our FireBase server
  var firebaseRef = new Firebase("https://burning-heat-1866.firebaseio.com/sessions/");
  // Initialize the number of available sessions to 0
  var numOfSessions = 0;

  // Triggers for each child retrieved and will trigger again for every child added
  firebaseRef.on("child_added", function(snapshot) {
    // Stores the value of the snapshot retrieved, named session because what was retrieved
    // is the details about said session (id, name, creator)
    var session = snapshot.val();

    /* Unnecessary logging for testing, I assume.
    console.log("ID: " + snapshot.key());
    console.log("Name: " + session.name);
    console.log("Creator: " + session.creator);
    */

    // Finding the session list and creating the blank session elements
    var ul = document.getElementById("sessionsList");
    var li = document.createElement("li");

    // Create a link
    var a = document.createElement("a");
    // Set the title of the link to the name of the session
    a.appendChild(document.createTextNode(session.name));
    // Set the reference of the link to that of the session
    a.setAttribute("href", "javascript:setSession(\"" + snapshot.key() + "\", \"" + session.name + "\", \"" + session.creator + "\")");

    // Append the link to the list element and then append that list element to the greater list
    li.appendChild(a);
    ul.appendChild(li);

    // Increment the number of sessions
    numOfSessions = numOfSessions + 1;
    // Change the title displaying the number of sessions
    document.getElementById("sessionsCount").innerHTML = "There are " + numOfSessions + " Sessions."
  });
}

// Function to hide elements when creating a new session
function openAddSession() {
  document.getElementById("addSessionButton").style.display = 'none';
  document.getElementById("indexContainer").style.display = 'none';
  document.getElementById("addSessionContainer").style.display = 'inline';
}

// Accepts a form containing fields for the session name and it's creator as it's parameter
function addSession(form) {
  // If session is null, the user pressed cancel.
  if (form != null && form.name != null && form.creator != null) {
    // If form was true and filled, create new connection to FireBase
    var firebaseRef = new Firebase("https://burning-heat-1866.firebaseio.com/sessions/");
    // Create new session
    var newSessionRef = firebaseRef.push();

    // Set children of the new session equal to the form fields
    newSessionRef.set({
      name: form.name.value,
      creator: form.creator.value
    });
  }

  // Display the previously hidden elements when the form was opened.
  document.getElementById("addSessionButton").style.display = 'inline';
  document.getElementById("indexContainer").style.display = 'inline';
  document.getElementById("addSessionContainer").style.display = 'none';
}

// Leaving a session and returning to the 'main menu' so to speak
function closeSession() {
  // Sets session and user references to null since we left.
  currentSessionRef = null;
  currentUserRef = null;
  // Delete all questions off the page.
  document.getElementById("questionsList").innerHTML = "";
  // Return the 'main menu'
  document.getElementById("backButton").style.display = 'none';
  document.getElementById("sessionContainer").style.display = 'none';
  document.getElementById("addQuestionButton").style.display = 'none';
  document.getElementById("addSessionButton").style.display = 'inline';
  document.getElementById("indexContainer").style.display = 'inline';
}

// Function called when clicking on a session to view it.
function setSession(id, name, creator) {

  // Ask person to enter their name
  var person = prompt("Please enter your name", "Harry Potter");

  // As long as the user entered a name
  if (person != null){
    // Create connection to FireBase for the specific session
    currentSessionRef = new Firebase("https://burning-heat-1866.firebaseio.com/sessions/" + id);
    // Set the respective name and creator texts to their elements
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
