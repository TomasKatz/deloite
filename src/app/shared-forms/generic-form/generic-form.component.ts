import {
  AfterViewChecked,
  Component,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
  EventEmitter,
  SimpleChanges
} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Validators} from "@angular/forms";
import {ChangeDetectorRef} from "@angular/core";
import {ComponentFactoryResolver} from "@angular/core";
import {OnChanges} from "@angular/core";

export interface ISelectOption {
  value: string | number;
  text: string;
}
export interface IFormField {
  type:'text' | 'select';
  defaultValue?: string | number;
  options?:ISelectOption[];
  name: string,
  validations: string[], //'required' | 'max' | 'min'
  max?:number;
  min?:number;
}
export interface IFormConfig {
  formFields:IFormField[],
  initialIsGroup?: boolean,
  initialGroupName?: string;
  formFieldGroups?:[]
}
export interface ISubmitEvent {
  value: {[key: string]: any};
}
export abstract class GenericForm{
  formConfig: IFormConfig;
  constructor(private fb:FormBuilder){}
  initForm(formConfig: IFormConfig){
    const formObject = {}
    // iterate formFields build formGroup dynamically
    for(let field of formConfig.formFields){
      let validators = [];
      // set up the name and default value
      formObject[field.name] = [(field.defaultValue || '')]
      // set up validators by iteration
      this.getInitialValidators(validators, field, formObject);
    }
    return this.getInitialFormGroup(this.formConfig, formObject);
  }
  getInitialFormGroup(formConfig: IFormConfig, formObject: any){
    if(formConfig.initialIsGroup){
      return this.fb.group({
        [formConfig.initialGroupName]:this.fb.group(formObject)
      })
    } else {
      return this.fb.group(formObject);
    }
  }
  getInitialValidators(validators:any[],field:IFormField, formObject:{[key: string]: any}){
    for(let validator of field.validations) {
      switch(validator){
        case 'required':
          validators.push(Validators.required);
          break;
        case 'max':
          validators.push(Validators.maxLength(field.max || 10));
          break;
        case 'min':
          validators.push(Validators.minLength(field.min || 0));
          break;
      }

    }
    //formObject[field.name] = formObject[field.name].concat(validators);
    formObject[field.name].push([...validators]);
    validators = [];
  }

}

@Component({
  selector: 'app-generic-form',
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.scss']
})
export class GenericFormComponent extends GenericForm implements OnInit, AfterViewChecked, OnChanges {
  @Input() formConfig: IFormConfig;
  @Input() footerText: string;
  @ViewChild('componentContainer',{read: ViewContainerRef})vc: ViewContainerRef;
  @Output() onSubmit = new EventEmitter<ISubmitEvent>()
  _footerText: string;
  initalForm;
  componentRef;
  constructor(
    private cdr: ChangeDetectorRef,
    private cfr: ComponentFactoryResolver
  ) {
    super(new FormBuilder);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.footerText){
      this.findLowestComponentRef(changes.footerText.currentValue);
    };
  }
  ngOnInit(): void {
    this.initalForm = this.formConfig ? this.initForm(this.formConfig) : null;
    this.initalForm.valueChanges.subscribe(val => {
      console.log(val);
    });
  }
  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }
  submitForm(initialForm, status){
    if(status === 'VALID'){
      this.onSubmit.emit(initialForm.value);
      this.loadComponent();
    }
  }
  loadComponent(){
    const factory = this.cfr.resolveComponentFactory(GenericFormComponent);
    this.componentRef = this.vc.createComponent(factory);
    this.componentRef.instance.formConfig = {...this.formConfig};
    this.componentRef.instance.onSubmit.subscribe((formValue) => {
      this.onSubmit.emit(formValue);
    })
  }
  findLowestComponentRef(text: string, caller?: any){
    if(!this.componentRef){
      console.log('end');
      caller._footerText = text;
      return null;
    }
    else {
        return this.componentRef.instance.findLowestComponentRef(text, this);
    }
  }
}
