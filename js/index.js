var currentUserRef;
var sessionRef;
var gRealTime = false;

window.onload = function() {
  init();
};

function init() {
  // Create connection to our FireBase server
  sessionRef = new Firebase("https://burning-heat-1866.firebaseio.com/sessions/-KCh2WrprACabdcw6Qwq/");
  // Initialize the number of available sessions to 0
  // Triggers for each child retrieved and will trigger again for every child added
  sessionRef.child("questions").on("child_added", function(snapshot) {
    // Stores the value of the snapshot retrieved, named session because what was retrieved
    // is the details about said session (id, name, creator)
    var question = snapshot.val();

    // Finding the session list and creating the blank session elements
    var ul = document.getElementById("questionsList");
    var li = document.createElement("li");



    // Create a link
    var a = document.createElement("a");
    // Set the title of the link to the name of the session
    a.appendChild(document.createTextNode(question.text));
    // Set the reference of the link to that of the session
    //a.setAttribute("href", "javascript:getSession(\"" + snapshot.key() + "\", \"" + session.name + "\", \"" + session.creator + "\")");
    // Create a link
    var b = document.createElement("a");
    // Add the text and the script to run when the link is pressed.
    b.appendChild(document.createTextNode("Upvote this question"));
    b.setAttribute("href", "javascript:upvoteQuestion(\"" + snapshot.key() + "\")");
    /*var newTH;
    if(localStorage.user_elevation === "admin") {
      newTH = document.createElement('th');
      newTH.innerHTML = 'Hello, World!';
      newTH.onclick = function () {
          this.parentElement.removeChild(this);
      };

      table.appendChild(newTH);
    }*/

    // Create a new paragraph element and populate it with the plain text of the question
    var p = document.createElement("p");
    p.appendChild(document.createTextNode(question.upvotes + " Upvotes : " + question.text));

    // Populate the list item with the link to upvote and the question, then populate the ul with the list item.
    li.appendChild(b);
    li.appendChild(p);
    li.appendChild(btn);

    // Append the link to the list element and then append that list element to the greater list
    //li.appendChild(a);
    ul.appendChild(li);
  });
}

// Leaving a session and returning to the 'main menu' so to speak
/*function closeSession() {
  // Sets session and user references to null since we left.
  sessionRef = null;
  currentUserRef = null;
  // Delete all questions off the page.
  document.getElementById("questionsList").innerHTML = "";
  // Return the 'main menu'
  document.getElementById("sessionContainer").style.display = 'none';
  document.getElementById("addQuestionButton").style.display = 'none';
}*/

// Function called when clicking on a session to view it.
/*function getSession() {
  // Create connection to FireBase for the specific session
  sessionRef = new Firebase("https://burning-heat-1866.firebaseio.com/sessions/");

  if(localStorage.user_id != sessionRef.key()) {
  // Ask person to enter their name
    var person = prompt("Please enter your name", "Harry Potter");
  }

  // As long as the user entered a name
  if (person != null || localStorage.user_id == sessionRef.key()) {

    // Set the respective name and creator texts to their elements
    document.getElementById("sessionTitle").innerHTML = name;

    // Set new user
    if(localStorage.user_id != sessionRef.key()) {
      currentUserRef = sessionRef.child("users").push();
      currentUserRef.set({
        name: person
      });
    }

    // Get Questions
    sessionRef.child("questions").on("child_added", function(snapshot) {
      // Retrieve all the questions and their details
      var session = snapshot.val();
      // Populate the lists with the questions
      var ul = document.getElementById("questionsList");
      var li = document.createElement("li");
      // Set the id of the question list item equal to it's key
      li.setAttribute("id", snapshot.key());

      // Create a link
      var b = document.createElement("a");
      // Add the text and the script to run when the link is pressed.
      b.appendChild(document.createTextNode("Upvote this question"));
      b.setAttribute("href", "javascript:upvoteQuestion(\"" + snapshot.key() + "\")");

      // Create a new paragraph element and populate it with the plain text of the question
      var p = document.createElement("p");
      p.appendChild(document.createTextNode(session.upvotes + " Upvotes : " + session.text));

      // Populate the list item with the link to upvote and the question, then populate the ul with the list item.
      li.appendChild(b);
      li.appendChild(p);
      ul.appendChild(li);
    });

    // THIS SEEMS REPETITIVE ASK IZAAK ABOUT THIS
    // Update the questions list when the child is changed
    sessionRef.child("questions").on("child_changed", function(snapshot) {
      var session = snapshot.val();
      // Find the question element by it's UUID and erase it?
      var li = document.getElementById(snapshot.key());
      li.innerHTML = "";

      // Create link element which runs script to upvote.
      var a = document.createElement("a");
      a.appendChild(document.createTextNode("Upvote this question"));
      a.setAttribute("href", "javascript:upvoteQuestion(\"" + snapshot.key() + "\")");

      var p = document.createElement("p");
      p.appendChild(document.createTextNode(session.upvotes + " Upvotes : " + session.text));

      li.appendChild(a);
      li.appendChild(p);
    });

    // Store last chatroom visited
    localStorage.user_id = sessionRef.key();

    // Set the style to be that of when you're viewing a session.
    document.getElementById("sessionContainer").style.display = 'inline';
    document.getElementById("addQuestionButton").style.display = 'inline';
  } else {
    // If person was null, close the session.
    closeSession();
  }
}*/

// Script to increment upvote count
function upvoteQuestion(id) {
  // Retrieve question in 'questions' by 'id'
  var questionRef = sessionRef.child("questions").child(id);
  var qUpvotes;

  //
  questionRef.on("value", function(snapshot) {
    var question = snapshot.val();
    qUpvotes = question.upvotes;
  });

  questionRef.update({upvotes: qUpvotes + 1});

  location.reload();
}

// Change style
function openAddQuestion() {
  document.getElementById("addQuestionButton").style.display = 'none';
  document.getElementById("sessionContainer").style.display = 'none';
  document.getElementById("addQuestionContainer").style.display = 'inline';
}

// Function adds a question to a session given a form
function addQuestion(form) {
  // If session is null, the user pressed cancel.
  if (form != null && form.text != null) {
    // As long as the question isn't null
    // Push up the new question to the session details on FireBase
    var newQuestion = sessionRef.child("questions").push();

    // set the new questions details
    newQuestion.set({
      text: form.text.value,
      upvotes: 0
    });
  }

  // Change style
  document.getElementById("addQuestionButton").style.display = 'inline';
  document.getElementById("sessionContainer").style.display = 'inline';
  document.getElementById("addQuestionContainer").style.display = 'none';
}
