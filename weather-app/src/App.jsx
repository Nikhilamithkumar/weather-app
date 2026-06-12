
import './App.css'
import { useEffect, useState } from 'react'

function App() {


  const API_KEY = import.meta.env.VITE_API_KEY;
  const [weatherData,setWeatherData] = useState(null);
  const[city,setCity] = useState("Chennai");
  const [forecast,setForecast] = useState([])
  const [searchInput, setSearchInput] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true)


  const fetchWeatherData  = async (cityName) =>{
    try{
      setLoading(true)
      setError(null)
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;   
      const response = await fetch(url);
      const data = await response.json();
      setWeatherData(data);  
      const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`);
      const forecastData = await forecastResponse.json();
      const dailyForecast = forecastData.list.filter(
        (item, index) => index % 8 === 0
      );
      setForecast(dailyForecast);
    }catch(error) {
      setError("Couldnt fetch data,please try again")
      setWeatherData(null);
      setForecast([]);
    }finally{
      setLoading(false)
    }
  };
  function handleSearch(e) {
    e.preventDefault();
    fetchWeatherData(searchInput);
    setSearchInput("")
  }

  useEffect(()=>{
    fetchWeatherData(city)
  },[city]);



  if(loading){
    return(
      <>
      <div className="wrapper">Loading...</div>
        </>
    )
  }

  return (
   <>
   <div className ='header'>
    <div className='title-container'>
    </div>
    <form onSubmit={handleSearch} className = 'search-form'>
        <input type='text'
         value ={searchInput}
          onChange={(e)=>setSearchInput(e.target.value)}
          placeholder='Enter city name'
          className = 'search-input'/>
        <button type="submit" className="search-btn">
          <img src="/src/assets/search.webp" alt="Search"/>
        </button>
      </form>
   </div>
   <div className = "wrapper">
      
      {error && (<p className="error">{error}</p>)}

      {weatherData && weatherData.main && weatherData.weather && (
        <>
          <div className="header">
            <h1 className="city">{weatherData.name}</h1>
            <p className="temperature">{Math.round(weatherData.main.temp)}°C</p>
            <p className="condition">{weatherData.weather[0].main}</p>
          </div>
          <div className="weather-details">
            <div className='weather-detail-container'>
              <p >Humidity</p>
              <p>{Math.round(weatherData.main.humidity)}%</p>
            </div>
            <div className='weather-detail-container'>
              <p>Feels Like</p>
              <p>{Math.round(weatherData.main.feels_like)}°C</p>
            </div>
            <div className='weather-detail-container'>
              <p>Wind Speed</p>
              <p>{Math.round(weatherData.wind.speed)} Kmph</p>
            </div>
          </div>
        </>
      )}

      {forecast.length > 0 &&(
        <>
          <div className="forecast">
            <h2 className="forecast-header">5-Day Forecast</h2>
            <div className="forecast-days">
              {forecast.map((day, index) => (
                <div key={index} className="forecast-day">
                  <p>
                    {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </p>
                  <img
                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                    alt={day.weather[0].description}
                  />
                  <p>{Math.round(day.main.temp)}°C</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>

   </>
  )
}

export default App
