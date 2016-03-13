function authorize(form) {
  if(form != null && form.user != null) {
    localStorage.user_id = form.user.value;
    if(localStorage.user_id === "s0CrateZ") {
      localStorage.user_elevation = "admin";
      console.log("ELEVATED!");
    }
    window.location = "session.html";
  }
}
