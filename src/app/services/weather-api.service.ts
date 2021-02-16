import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, of} from "rxjs";
import {environment} from "../../environments/environment.prod";
import {catchError, skip} from "rxjs/operators";

export interface Coord {
  lon: number;
  lat: number;
}

export interface IWeather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface IMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface IWind {
  speed: number;
  deg: number;
}

export interface IClouds {
  all: number;
}

export interface ISys {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}
export interface IWeatherError {
  error:any
}
export interface IWeatherReport {
  coord: Coord;
  weather: IWeather[];
  base: string;
  main: IMain;
  visibility: number;
  wind: IWind;
  clouds: IClouds;
  dt: number;
  sys: ISys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}
export type WeatherResponse = IWeatherError | IWeatherReport;
@Injectable({
  providedIn: 'root'
})
export class WeatherApiService {
  private weatherReportSrc = new BehaviorSubject<IWeatherReport>(null);
  public weatherReport = this.weatherReportSrc.asObservable();
  constructor(private http: HttpClient) {}
  getWeatherReport(city: string, unit: string){
    this.http.get(environment.getWeatherUrl(city,unit))
      .pipe(
        catchError((error: any) => {
          this.weatherReportSrc.next(error);
          throw error;
        })
      )
  .subscribe((report: IWeatherReport)=>{
      report['units'] = unit;
      this.weatherReportSrc.next(report);
    });
  }
}
