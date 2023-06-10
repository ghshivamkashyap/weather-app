console.log("jai mata di");

const usertab = document.querySelector("[data-user-Weather]");

const searchtab = document.querySelector("[data-search-Weather]");

const usercontainer = document.querySelector(".weathercontainer");

const grantacesscontainer = document.querySelector(".grant-location-container");

const searchform = document.querySelector("[data-searchform]");

const loadingscreen = document.querySelector(".loading-container");

const userinfocontainer = document.querySelector(".user-info-container");

let currtab = usertab;

const Apikey = "c1cbdd681f61bf6a01993079572a1c3f";

// initial conditions

currtab.classList.add("currunttab");
getfromsessionstorage();
// tab switching on click

function switchtab(clickedtab) {
  if (clickedtab != currtab) {
    currtab.classList.remove("currunttab");
    currtab = clickedtab;
    currtab.classList.add("currunttab");

    if (!searchform.classList.contains("active")) {
      // kya search vala tab is invisible then make it visibe
      userinfocontainer.classList.remove("active");
      grantacesscontainer.classList.remove("active");
      searchform.classList.add("active");
    } else {
      // phle search val etab par tha ab ur weather vale tab par jana hai
      searchform.classList.remove("active");
      userinfocontainer.classList.remove("active");
      // ab ur weather vale tab par aa gya hu to weather display krne pdega usse phle cordinates chack kar leta hu ki avalable hai ya nahi
      getfromsessionstorage();
    }
  }
}

usertab.addEventListener("click", () => {
  switchtab(usertab);
});

// searchtab.addEventListener("click", () => {
//   switchtab(searchtab);
// });

searchtab.addEventListener("click", () => {
  switchtab(searchtab);
});

// check if cordinates are aleready present in session storage or not ?

function getfromsessionstorage() {
  const localcordinates = sessionStorage.getItem("user-cordinate");
  if (!localcordinates) {
    grantacesscontainer.classList.add("active");
  } else {
    const cordinates = JSON.parse(localcordinates);
    fetchuserqweatherinfo(cordinates);
  }
}

async function fetchuserqweatherinfo(cordinates) {
  const { lat, lon } = cordinates;

  // 1 make grant container invisible
  grantacesscontainer.classList.remove("active");

  // 2 loader ko dkhao
  loadingscreen.classList.add("active");

  // 3 api call mardo bhai ab

  try {
    const responce = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${Apikey}&units=metric`
    );

    const data = await responce.json();
    loadingscreen.classList.remove("active");
    userinfocontainer.classList.add("active");
    renderweatherinfo(data);
  } catch (err) {
    console.log(err);
  }
}

function renderweatherinfo(weatherinfo) {
  // phle elements fetch krke lao jinme valuse add krege

  const cityname = document.querySelector("[data-city-name]");
  const flag = document.querySelector("[data-country-icon]");
  const discrition = document.querySelector("[data-weathet-discription]");
  const weathericon = document.querySelector("[weather-icon]");
  const temprature = document.querySelector("[data-temprature]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const clouds = document.querySelector("[data-clouds]");

  // values dal do sari bhai
  // cityname
  cityname.innerText = weatherinfo?.name;
  // flag image
  flag.src = `https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
  // discrition
  discrition.innerText = weatherinfo?.weather?.[0]?.description;
  // weathericon
  weathericon.src = `http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
  // temprature
  temprature.innerText = `${weatherinfo?.main?.temp} 	℃`;
  // windspeed
  windspeed.innerText = `${weatherinfo?.wind?.speed} m/s`;
  // humidity
  humidity.innerText = `${weatherinfo?.main?.humidity} %`;
  // cloudiness
  clouds.innerText = `${weatherinfo?.clouds?.all} %`;
}

// function showPosition(position) {
//   const usercordiates = {
//     lat: position.coords.latitude,
//     lon: position.coords.longitude,
//   };

//   sessionStorage.setItem("user-cordinate", JSON.stringify(usercordiates));
//   fetchuserqweatherinfo(usercordiates);
// }

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("No location supported..!");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchuserqweatherinfo(userCoordinates);
}

const grantbtn = document.querySelector("[data-grantacess]");
grantbtn.addEventListener("click", getLocation);

let searchinput = document.querySelector("[data-searchinput]");
searchform.addEventListener("submit", (e) => {
  e.preventDefault();

  let cityname = searchinput.value;
  if (cityname === "") {
    return;
  } else {
    fetchSearchWeatherInfo(cityname);
  }
});

async function fetchSearchWeatherInfo(city) {
  loadingscreen.classList.add("active");
  userinfocontainer.classList.remove("active");
  grantacesscontainer.classList.remove("active");
  try {
    const responce = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Apikey}&units=metric`
    );
    const data = await responce.json();
    loadingscreen.classList.remove("active");
    userinfocontainer.classList.add("active");
    renderweatherinfo(data);
  } catch (e) {}
}
