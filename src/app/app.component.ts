import { Component } from '@angular/core';
import { JenkninsElement } from './models/jenkins.element.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  registeredJenkinsUrls: Array<JenkninsElement> = [
    // new JenkninsElement(
    //   "http://localhost:8080/",
    //   "test",
    //   "test"
    // ),
    // new JenkninsElement(
    //   "http://localhost:8081/",
    //   "test",
    //   "test"
    // )
  ]
  
  loadedPreconfiguredJsonFile: Boolean = false;
  json: string;

  title = 'jenkins-promotion';

  onJenkinsAdded(event: JenkninsElement) {
    this.registeredJenkinsUrls.push(event);
  }

  onLoadedPreconfiguredJson(event: any) {
    this.loadedPreconfiguredJsonFile = !this.loadedPreconfiguredJsonFile
    this.json = event;
    console.log(this.json)
  }
}
