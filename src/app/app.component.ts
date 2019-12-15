import { Component } from '@angular/core';
import { JenkninsElement } from './models/jenkins.element.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  registeredJenkinsUrls: Array<JenkninsElement> = [new JenkninsElement(
    "http://localhost:8080/",
    "test",
    "test"
  )]

  title = 'jenkins-promotion';

  onJenkinsAdded(event: JenkninsElement) {
    console.log(event)
    this.registeredJenkinsUrls.push(event);
  }
}
