console.log("Client-side log HOK");
const btn = document.getElementById("submit-btn");
btn.addEventListener("click", submitDataToServer);

// Submit clicked so post the data to the server
function submitDataToServer(event) { // 1. Added 'event' parameter here so preventDefault() works
  console.log("SUBMIT clicked!!!"); 
  // Create an object to post to the server
  let dataObj = {
    Gname: document.getElementById("Gender").value,
    Wname: document.getElementById("Weight").value,
    Hname: document.getElementById("Height").value,
  };
  event.preventDefault(); // Prevents page reload
  const requestMsg = new XMLHttpRequest();
  requestMsg.open("post", "/putData", true); 
  requestMsg.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  // Optional: Refresh the user list automatically after sending data
  requestMsg.onload = function() {
    getDataFromServer();
  };
  requestMsg.send(JSON.stringify(dataObj));
}
// Make sure to call this function to get latest data
getDataFromServer();
// Send a request to the server to query the db and send the data back
function getDataFromServer() {
  console.log("getData()"); 
  const requestMsg = new XMLHttpRequest();
  requestMsg.addEventListener("load", displayData); 
  requestMsg.open("get", "/getData"); 
  requestMsg.send();
}
function displayData() {
  console.log("displayData()");
  const rowList = document.getElementById("users");
  rowList.innerHTML = ""; // clear all the list items
  let users = JSON.parse(this.responseText);
  // Iterate through every row and match your data keys (Gname, Wname, Hname)
  users.forEach(function (row) {
    const newListItem = document.createElement("li");
    // 2. Updated to match your object keys instead of first_name/surname
    
    // set like python var - set protein var and to 0. 
    let protein = 0;

    if (row["Gender"] == "Male") 
      {
      protein = row["Weight"] * 2;
    } 
    else 
      {
        protein = row["Weight"] * 2 * 0.8;
      }

      //Remobe the decimal 
      protein = Math.round(protein);


    
    // Extracts the information from database to list
    newListItem.innerHTML = `Gender: ${row["Gender"]}, Weight: ${row["Weight"]}, Height: ${row["Height"]} ,  Protein = ${protein}`;
    rowList.appendChild(newListItem);
  });
}
