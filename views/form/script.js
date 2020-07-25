var members = document.querySelector(".members");
var membermails = document.querySelector(".membermails");

members.addEventListener("change", () => {
  var i = 0;
  var num = members.value;
  membermails.innerHTML = "";
  for (i = 0; i < num; i++) {
    membermails.innerHTML += `<input type="text" name="meeting[email][${i}]" placeholder="Enter email id " />`;
  }
});
