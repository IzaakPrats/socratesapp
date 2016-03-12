var firebaseRef = new Firebase("https://burning-heat-1866.firebaseio.com/sessions/");

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
});
