import {Component, OnInit} from '@angular/core';
import {IFormConfig, ISubmitEvent} from "./shared-forms/generic-form/generic-form.component";
import {IWeatherError, IWeatherReport, WeatherApiService, WeatherResponse} from "./services/weather-api.service";
import {catchError, skip} from "rxjs/operators";
import {error} from "selenium-webdriver";
import {of} from "rxjs/internal/observable/of";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  lastWeatherResponse: string;
  formConfig:IFormConfig = {
    formFields:[
      {
        type: "select",
        options: [{
          text:'Tel Aviv',
          value: 'Tel Aviv'
        },{
          text:'Kiev',
          value: 'Kiev'
        },
          {
            text:'Amsterdam',
            value: 'Amsterdam'
          },
          {
            text:'Kabul',
            value: 'Kabul'
          }],
        name:'city',
        validations:['required'],
      },
      {
        type: "text",
        name: "units",
        validations:["required", "min", "max"],
        min:3,
        max:8
      }
    ]
  }
  constructor(private weatherApi: WeatherApiService){}
  ngOnInit(): void {

    this.weatherApi.weatherReport.subscribe((res: IWeatherReport | IWeatherError) => {
      if(!res){return;}
      if(res['error']){
        console.log(res['error'])
      }
      else{
        console.log(res)
        this.lastWeatherResponse = `${res['name']} ${((unit, temp)=>{
          switch(unit){
            case 'metric':
              return `${temp} c`
            case 'imperial':
              return `${temp} f`
          }
        })(res['units'], res['main']['temp'])}`
      }
    });
  }
  getWeatherReport(formValue: any){
    this.weatherApi.getWeatherReport(formValue.city, formValue.units);
  }

}
