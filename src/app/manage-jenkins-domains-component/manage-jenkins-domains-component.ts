import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { JenkninsElement } from '../models/jenkins.element.model';

@Component({
  selector: 'app-manage-jenkins-element',
  templateUrl: './manage-jenkins-domains.component.html',
  styleUrls: ['./manage-jenkins-domains-component.css']
})
export class ManageJenkinsDomainsComponent implements OnInit {
  inProcessOfAddingJenkinsView: boolean = false;

  @Output() jenkinsAdded: EventEmitter<JenkninsElement> = new EventEmitter<JenkninsElement>();

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  addJenkinsView(form: NgForm) {
    console.log('Your form data : ', form.value);
    let url = form.value.url;
    let username = form.value.username;
    let password = form.value.password;

    this.inProcessOfAddingJenkinsView = false;
    let jenkisElement = new JenkninsElement(url, username, password)
    this.fireJenkins(jenkisElement)
  }

  async fireJenkins(jenkisElement: JenkninsElement) {
    let authorizationHash = btoa(jenkisElement.name + ":" + jenkisElement.password);
    this.http.get(jenkisElement.url + "/api/json?pretty=true",
      {
        headers: new HttpHeaders({
          "Authorization": "Basic " + authorizationHash,
          'Content-Type': 'application/json'
        })
      }
    )
      .subscribe(resp => {
        console.log("Recieved from server:" + resp)
        var jsonBodyResponce = this.getJsonBody(resp)
        console.log("Responce body:" + jsonBodyResponce)

        // this.allJenkinsJobs = JSON.parse(JSON.stringify(jsonBodyResponce['jobs']))
        // console.log("Jenkins jobs are " + this.allJenkinsJobs)
        this.jenkinsAdded.emit(jenkisElement);
      });
  }
  getJsonBody(data: any): any {
    const obj = data.json;
    return data;
  }

}
