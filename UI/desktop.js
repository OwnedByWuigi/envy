var content = document.createElement("div");
content.innerHTML = `
    <div class="taskbar">
        <img src="/Assets/envy.svg" height="26px">
        <div class="date">
            <div id="clock"></div>
            <div id="dateDisplay" style="font-size: 12.5px"></div>
        </div>
    </div>
    <h1>Test Desktop</h1>
    <button onclick="loadScript('/Apps/example.js')">Launch Example App</button>
    <span class="watermark">
        <p>This is an ALPHA rewrite. Expect bugs and instability. Build 1394</p>
    </span>
`;
document.getElementById("desktop").appendChild(content); 


function timeUpdate() {
    // 24-hour time example
    let x = new Date();
    let hours = x.getHours().toString().padStart(2, "0"); // 18
    let minutes = x.getMinutes().toString().padStart(2, "0"); // 37
    let timeString = `${hours}:${minutes}`; // 18:37
    let element = document.getElementById("clock"); // assuming <... id="clock" ...>
    element.innerText = timeString;
  }
  timeUpdate();
  setInterval(timeUpdate, 1000); // 1000ms -> 1 second delay

  function formatDate() {
    const date = new Date(); // Get current date

    // Array of day names
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    // Array of month names
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Get day, month, and date
    const dayName = daysOfWeek[date.getDay()]; // Get day of the week
    const monthName = months[date.getMonth()]; // Get month name
    const dayNumber = date.getDate(); // Get day number

    // Combine the values to get the desired format
    return `${dayName}, ${dayNumber} ${monthName}`;
}

// Function to set the formatted date to the div
function setDate() {
    const dateDisplayDiv = document.getElementById("dateDisplay"); // Get the div element
    dateDisplayDiv.textContent = formatDate(); // Set the formatted date
}

// Call the function to set the date
setDate();

setInterval(setDate, 1000); // 1000ms -> 1 second delay