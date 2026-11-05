console.log("Client-side log HOK");
const btn = document.getElementById("submit-btn");
btn.addEventListener("click", submitDataToServer);

// Submit clicked so post the data to the server
function submitDataToServer(event) { 
    event.preventDefault(); // Prevents page reload
    console.log("SUBMIT clicked!!!");
    
    // Create an object to post to the server matching input IDs
    let dataObj = {
        Gname: document.getElementById("Gender").value,
        Wname: document.getElementById("Weight").value,
        Hname: document.getElementById("Height").value,
    };

    const requestMsg = new XMLHttpRequest();
    requestMsg.open("post", "/putData", true);
    requestMsg.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
    requestMsg.onload = function() {
        getDataFromServer(); // Refresh the list automatically after sending data
    };
    
    requestMsg.send(JSON.stringify(dataObj));
}

// Make sure to call this function to get latest data on load
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
    
    // Iterate through every row and display inputs + calculated protein
    users.forEach(function (row) {
        const newItem = document.createElement("li");
        newItem.innerHTML = `Gender: ${row["Gname"]}, Weight: ${row["Wname"]}kg, Height: ${row["Hname"]}cm — <strong>Protein Needed: ${row["Protein"]}g/day</strong>`;
        rowList.appendChild(newItem);
    });
}
