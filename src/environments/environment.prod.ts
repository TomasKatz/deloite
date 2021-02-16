export const environment = {
  production: true,
  weatherApi:'http://api.openweathermap.org/data/2.5/weather?',
  apiKey:'0d7303c17ee3d3482cd82a2ad273a90d',
  getWeatherUrl(city: string, units: string){
    return `${this.weatherApi}q=${city}&appid=${this.apiKey}&units=${units}`
  }
};
