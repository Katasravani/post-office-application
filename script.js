let ip;
let Search;

//Finding the IP address on page load
$.getJSON("https://api.ipify.org?format=json", function (data) {

  // Setting text of element span with id ipContainer

  $("#ipContainer").html(data.ip);
  ip = data.ip;
  console.log(ip);
  
});

//Fetching all data from APIs
async function getData(){
  try {
    response = await fetch(`https://ipapi.co/${ip}/json/`);
    let mainData = await response.json();
    response = await fetch(`https://api.postalpincode.in/pincode/${mainData.postal}`);
    postalData = await response.json();
  
    console.log("Main Data -> ");
    console.log(mainData);
    console.log("Postal data -> ");
    console.log(postalData);
    renderUserInfo(mainData,postalData);
  } catch (error) {
    console.log(error);
  }

}

//User Info Rendering
function renderUserInfo(mainData,postalData) {
  console.log("User info rendering...");
try {
  let Lat = mainData.latitude;
  let Long = mainData.longitude;
  let City = mainData.city;
  let Region = mainData.region;
  let Organisation = mainData.org;
  let Hostname = mainData.network;
  let Time_Zone = mainData.timezone;
  let Date_And_Time = new Date().toLocaleString(`en-${mainData.country_code}`, { timeZone: Time_Zone });;
  let Pincode = mainData.postal;
  let PincodeCount = postalData[0].Message;
  
  
    let main = document.getElementById("indexMain");
    main.id = "";
    main.innerHTML = ``;
    main.className =
    "bg-dark text-white container-fluid d-flex justify-content-center align-items-center flex-column p-4";
    
    let div1 = document.createElement("div");
    div1.className = "container-fluid";
    div1.innerHTML = `
        <h3>IP Address: <span>${ip}</span></h3>
        <div class="container d-flex justify-content-between">
        <div>
        <p class="m-0">Lat: <span>${Lat}</span></p>
        <p>Long: <span>${Long}</span></p>
        </div>
        <div>
        <p class="m-0">City: <span>${City}</span></p>
        <p>Region: <span>${Region}</span></p>
        </div>
        <div>
        <p class="m-0">Organisation: <span>${Organisation}</span></p>
        <p>Hostname: <span>${Hostname}</span></p>
        </div>  
        </div>`;
    main.appendChild(div1);
    
      let div2 = document.createElement("div");
      div2.className = "bg-secondary d-flex justify-content-center align-items-center flex-column";
      div2.id = "detailsMain";
  
        let div2_h3 = document.createElement("h3");
        div2_h3.innerText = "Your Current Location";
  
        let div2_div1 = document.createElement("div");
        div2_div1.className = "container m-2";
        div2_div1.id = "map";
      
      div2.appendChild(div2_h3);
      div2.appendChild(div2_div1);
  
    main.appendChild(div2);
    
      let div3 = document.createElement("div");
      div3.className = "text-center py-5";
      div3.id = "moreInfo";
  
        let div3_h3 = document.createElement("h3");
        div3_h3.innerText = "More Information About You";
  
        let div3_div1 = document.createElement("div");
        div3_div1.className = "text-start";
  
        div3_div1.innerHTML = `
        <p>Time Zone: <span>${Time_Zone}</span></p>
        <p>Date And Time: <span></span>${Date_And_Time}</p>
        <p>Pincode: <span>${Pincode}</span></p>
        <p>Message: ${PincodeCount}</p>
        `;
  
      div3.appendChild(div3_h3);
      div3.appendChild(div3_div1);
  
    main.appendChild(div3);
  
      let div4 = document.createElement("div");
      div4.className = "text-center py-5";
      div4.id = "postOffice";
  
        let div4_h3 = document.createElement("h3");
        div4_h3.innerText = "Post Offices Near You";
        
        let div4_div1 = document.createElement("div");
        div4_div1.innerHTML =`
        <input type="search" placeholder="Search By Name" class="text-white form-control form-control-lg bg-dark border-secondary rounded-3" id="Search">
        `;
  
        let div4_div2 = document.createElement("div");
        div4_div2.className = "text-start d-flex justify-content-center align-items-center flex-wrap py-3 gap-4";
        div4_div2.id = "cardContainer";
  
  
  
        div4.appendChild(div4_h3);
        div4.appendChild(div4_div1);
        div4.appendChild(div4_div2);
  
    main.appendChild(div4);
    console.log("User info rendering successful!");
  
  //Google map rendering
    waitForGoogleMaps(mainData)
  
  //Post office cards Rendering
  let PostOffice = postalData[0].PostOffice;
    renderCards(PostOffice);
    addEventToSearch(PostOffice)
  
} catch (error) {
  console.log(error);
}
}

//Postal card Rendering
function renderCards(PostOffice){
  console.log("Post office cards rendering..."); 
try {
  let cardContainer = document.getElementById("cardContainer");
  cardContainer.innerHTML = ``;

    for (let i = 0; i < PostOffice.length; i++) {
      //post office details
      let Name = PostOffice[i].Name;
      let Branch = PostOffice[i].BranchType;
      let Delivery = PostOffice[i].DeliveryStatus;
      let District = PostOffice[i].District;
      let Division = PostOffice[i].Division;
      let card = document.createElement("div");
      card.className = "card bg-secondary";
      card.style.width = "20rem";
      card.innerHTML =  `
          <div class="card-body fw-bold">
            <p class="m-1 ">Name<span class="ms-4 fw-normal">${Name}</span></p>
            <p class="m-1 ">Branch Type<span class="ms-4 fw-normal">${Branch}</span></p>
            <p class="m-1 ">Delivery Status<span class="ms-4 fw-normal">${Delivery}</span></p>
            <p class="m-1 ">District<span class="ms-4 fw-normal">${District}</span></p>
            <p class="m-1 ">Division<span class="ms-4 fw-normal">${Division}</span></p>
          </div>
      `;
      cardContainer.appendChild(card);     
    }
  console.log("Post office cards rendering successful!");
  
} catch (error) {
  console.log(error);
  
}

}

//Map rendering function
function waitForGoogleMaps(mainData) {
  console.log("Google Map rendering starts...");

  if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
      // Google Maps API is not loaded yet, wait and check again
      setTimeout(waitForGoogleMaps(mainData), 200); // Adjust the interval as needed
  } else {
      // Google Maps API is loaded, call initMap()
      initMap(mainData);
      return 0;
  }
}

//Initializing the  Google Map
function initMap(mainData) {
  try {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: mainData.latitude, lng: mainData.longitude }, // Centered at some default location
        zoom: 10
    });
  
    //Creating Marker on The Google Map
    new google.maps.Marker({
      position: { lat: mainData.latitude, lng: mainData.longitude },
      map
    })
    console.log("Google map rendering successful!");
    
  } catch (error) {
  console.log(error);
    
  }
}

// search function for postal data by 'Name'
function addEventToSearch(PostOffice) {
  try {
    //search container to apply add event handlers
    Search = document.getElementById("Search");
    Search.addEventListener("keyup", function () {
      SearchResult(PostOffice);
    });
    
  } catch (error) {
  console.log(error);
    
  }
}

function SearchResult(PostOffice) {
  try {
    const searchValue = Search.value.trim().toLowerCase(); // Trim and convert to lowercase
    // console.log(searchValue);
    let SortedPostOffice;
  
    if (searchValue === "") {
      SortedPostOffice = PostOffice; // Show all Post Offices when the input is empty
    } else {
      SortedPostOffice = PostOffice.filter((element) => {
        // Convert both the name and the search value to lowercase for case-insensitive matching
        return element.Name.toLowerCase().includes(searchValue);
      });
    }
  
    // Now Show the Sorted Post Offices
    renderCards(SortedPostOffice);
    
  } catch (error) {
  console.log(error);
    
  }
}


//empty function passed to Google map Script on load
function emp(){};