import { Component, OnInit, Input } from '@angular/core';
import { JenkninsElement } from '../models/jenkins.element.model'
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { JenkinsJob } from '../models/jenkins.job.element.model';

@Component({
  selector: 'app-view-jenkins-elements',
  templateUrl: './view-jenkins-elements.component.html',
  styleUrls: ['./view-jenkins-elements.component.css']
})
export class ViewJenkinsElementsComponent implements OnInit {
  @Input() registeredJenkinsUrls: Array<JenkninsElement> = []
  // jenkins to jenkins jobs
  jenkinsToJenkinsJobs = new Map<JenkninsElement, Array<JenkinsJob>>();
  jenkinsToSelectedJobs = new Map<JenkninsElement, Array<JenkinsJob>>();


  // better to have them saved, not to iterate it on demand
  allJobs: Array<JenkinsJob> = []
  searchedJobs: Array<JenkinsJob> = []


  addingJenkinsJobsView: boolean = true;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.registeredJenkinsUrls.forEach(element => {
      try {
        let promises = this.fireJenkins(element);
        let thisObject = this;
        promises.then(function (result) {
          let jobs: Array<JenkinsJob> = JSON.parse(JSON.stringify(result['jobs']))
          console.log("Jobs found are " + jobs)
          thisObject.jenkinsToJenkinsJobs.set(element, jobs)
          thisObject.allJobs = thisObject.allJobs.concat(jobs)
          // used for seaching
          thisObject.searchedJobs = thisObject.searchedJobs.concat(thisObject.allJobs)
        });
      } catch (err) {
        console.log(err)
      }

    })
  }

  onSearchChange(searchValue: string): void {
    this.searchedJobs = this.allJobs.filter(job => job.name.toLowerCase().includes(searchValue.toLowerCase()))
  }

  async fireJenkins(jenkisElement: JenkninsElement): Promise<Object> {
    var start = new Date().getTime();
    let authorizationHash = btoa(jenkisElement.name + ":" + jenkisElement.password);
    let promise = this.http.get(jenkisElement.url + "/api/json?pretty=true",
      {
        headers: new HttpHeaders({
          "Authorization": "Basic " + authorizationHash,
          'Content-Type': 'application/json'
        })
      }
    ).toPromise();
    let result = await promise;

    var end = new Date().getTime();
    console.log("Get all of the jobs took " + (end - start) + " milisec");
    return result

    // .subscribe(resp => {
    //   console.log("Recieved from server:" + resp)
    //   var jsonBodyResponce = this.getJsonBody(resp)
    //   console.log("Responce body:" + jsonBodyResponce)

    //   let jobs: Array<JenkinsJob> = JSON.parse(JSON.stringify(jsonBodyResponce['jobs']))
    //   return jobs
    // });
  }
  getJsonBody(data: any): any {
    const obj = data.json;
    return data;
  }

  addJobForPipeline(job: JenkinsJob) {

    // TODO we can haev duplicate elements!
    // TODO optimize ?
    for (let [jenkinsUrl, jenkinsJobs] of this.jenkinsToJenkinsJobs) {
      console.log(jenkinsUrl, jenkinsJobs);
      jenkinsJobs.forEach(interatorJob => {
        if (interatorJob['name'] == job.name) {
          // maybe new variable should be introduced
          // this.jenkinsToSelectedJobs.set(jenkinsUrl, job)
        }
      });
    }
  }
}
