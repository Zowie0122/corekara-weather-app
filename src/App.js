import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "./config.json";
import MyMapComponent from "./component/Map";
import "./App.css";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [postCode, setPostCode] = useState();
  const [location, setLocation] = useState({ lat: 35.6762, lgn: 139.6503 });
  const [isMarkerShown, SetIsMarkerShown] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [dogURL, setDogURL] = useState(null);

  const getLocation = async (post_code) => {
    const rawData = await axios.get(
      `https://apis.postcode-jp.com/api/v3/postcodes/${post_code}`,
      {
        headers: {
          apiKey: config.POST_CODE_KEY,
        },
      }
    );
    console.log(rawData);

    if (rawData.data === "") {
      setErrorMessage("Please input the correct post codes");
    } else if (
      rawData.data.location.latitude &&
      rawData.data.location.longitude
    ) {
      const locationObj = {
        lat: rawData.data.location.latitude,
        lgn: rawData.data.location.longitude,
        address: rawData.data.allAddress,
        kana: rawData.data.fullWidthKana,
      };

      setLocation(locationObj);
    } else {
      setErrorMessage("Please input the correct post codes");
    }
  };

  const getWeatherData = async (lat, lgn) => {
    const rawData = await axios.get(
      `http://api.worldweatheronline.com/premium/v1/weather.ashx?key=${config.WEATHER_KEY}&q=${lat},${lgn}&num_of_days=3&tp=24&format=json`
    );
    console.log(rawData.data);
    setWeatherData(rawData.data);
  };

  const getWeekday = (date) => {
    const gsDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const d = new Date(date);
    return gsDayNames[d.getDay()];
  };

  const getDogImage = async () => {
    const dogImageData = await axios.get(
      "https://dog.ceo/api/breeds/image/random"
    );
    console.log(dogImageData.data);
    setDogURL(dogImageData.data.message);
  };

  useEffect(() => {
    getLocation("1000000");

    getWeatherData(35.6762, 139.6503);
    getDogImage();
  }, []);

  return (
    <div className="App">
      Post Code{"  "}
      <input
        className="inputBox"
        onChange={(e) => {
          SetIsMarkerShown(false);
          const inputArray = e.target.value.split("");
          const validInputArray = inputArray.filter((ele) => ele !== "-");
          const validInput = validInputArray.join("");
          setPostCode(validInput);
        }}
      ></input>
      <button
        className="btn btn-success"
        onClick={() => {
          getLocation(postCode);

          SetIsMarkerShown(true);

          getWeatherData(location.lat, location.lgn);
        }}
      >
        Submit
      </button>
      {errorMessage !== null ? <p className="error">{errorMessage}</p> : null}
      {location ? <h1>{location.address}</h1> : null}
      {weatherData !== null ? (
        <div className="cardContainer">
          <p className="font-weight-bold">3-days forecast</p>
          {weatherData.data.weather.map((ele) => (
            <div className="card" style={{ width: "20rem" }}>
              <img
                src={ele.hourly[0].weatherIconUrl[0].value}
                className="card-img-top"
                alt="weatherIcon"
              />
              <div className="card-body">
                <p className="card-text">
                  {ele.date} {getWeekday(ele.date)}
                </p>
                <h5 className="card-title">
                  {ele.hourly[0].weatherDesc[0].value}
                </h5>
                <p className="card-text">
                  Max: {ele.maxtempC} Min: {ele.mintempC}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <div className="mapDogContainer d-flex justify-content-center">
        <MyMapComponent
          isMarkerShown={isMarkerShown}
          lat={location.lat}
          lgn={location.lgn}
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={
            <div
              style={{
                height: `600px`,
                width: `500px`,
              }}
            />
          }
          mapElement={<div style={{ height: `100%` }} />}
        />
        {dogURL !== null ? <img src={dogURL} className="dogPhoto" /> : null}
        {console.log(dogURL)}
      </div>
    </div>
  );
}

export default App;
