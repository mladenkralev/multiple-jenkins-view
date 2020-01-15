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
  selectedJenkinsJobs = new Map<JenkninsElement, Array<JenkinsJob>>();


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
          thisObject.selectedJenkinsJobs.set(element, new Array())

          thisObject.allJobs = thisObject.allJobs.concat(jobs)
          // used for seaching
          thisObject.allJobs.forEach(element => {
            if (!thisObject.searchedJobs.includes(element)) {
              thisObject.searchedJobs.push(element)
            }
          });
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
  }
  getJsonBody(data: any): any {
    const obj = data.json;
    return data;
  }

  addJobForPipeline(job: JenkinsJob) {
    // TODO we can haev duplicate elements!
    // TODO optimize ?
    // 
    for (let [jenkinsUrl, jenkinsJobs] of this.jenkinsToJenkinsJobs) {
      jenkinsJobs.forEach(interatorJob => {
        if (interatorJob['name'] == job.name) {
          console.log("Adding new job for pipeline")
          // get array and push to it array by reference
          let tempArray = this.selectedJenkinsJobs.get(jenkinsUrl);
          if (tempArray == null) {
            console.log("Array from jenkinsToSelectedJobs cannot be null ")
            return;
          }

          if (!tempArray.includes(job)) {
            tempArray.push(job);
          }
          // this is not needed, since it is a tempArray is a reference type, not a copy
          // this.jenkinsToSelectedJobs.set(jenkinsUrl, tempArray)
        }
      });
    }
  }
}
