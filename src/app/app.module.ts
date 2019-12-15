import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JenkinsRestComponent } from './jenkins-rest/jenkins-rest.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { AddJenkinsElementComponent } from './add-jenkins-element/add-jenkins-element.component';
import { FormsModule } from '@angular/forms';
import { ViewJenkinsElementsComponent } from './view-jenkins-elements/view-jenkins-elements.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { PipelineCreatorComponent } from './pipeline-creator/pipeline-creator.component';

@NgModule({
  declarations: [
    AppComponent,
    JenkinsRestComponent,
    HeaderComponent,
    AddJenkinsElementComponent,
    ViewJenkinsElementsComponent,
    PipelineCreatorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxGraphModule,
    BrowserAnimationsModule,
    FormsModule,
    MDBBootstrapModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
