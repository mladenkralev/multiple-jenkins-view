import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { jsPlumb } from 'jsplumb';
import { JenkninsElement } from '../models/jenkins.element.model';

@Component({
  selector: 'app-jenkins-rest',
  templateUrl: './jenkins-rest.component.html',
  styleUrls: ['./jenkins-rest.component.css']
})
export class JenkinsRestComponent implements OnInit {
  // divJenkinsJobPrefix: string = "div-jenkins-job"
  // allJenkinsJobs: Array<JenkninsElement> = []
  // jsPlumbInstance;

  // souceClicked: boolean = false;
  // lastRemembered: string = ''

  // @ViewChildren('viewOnEvent') things: QueryList<any>;

  constructor() { }
  ngOnInit() {
  }

  // ngAfterViewInit() {
  //   this.things.changes.subscribe(t => {
  //     this.ngForRendred();
  //   })
  //   this.jsPlumbInstance = jsPlumb.getInstance();
  // }

  // ngForRendred() {
  //   console.log('NgFor is Rendered' + this.things);

  //   this.allJenkinsJobs.forEach(element => {
  //     var id = this.divJenkinsJobPrefix + "-" + element.name;
  //     console.log("Looking for" + id);

  //     let labelName = 'connection';
  //     this.jsPlumbInstance.connect({
  //       connector: ['Flowchart', { stub: [212, 67], cornerRadius: 1, alwaysRespectStubs: true }],
  //       source: 'jenkins-job-Pipeline',
  //       target: 'jenkins-job-test',
  //       anchor: ['Right', 'Left'],
  //       paintStyle: { stroke: '#456', strokeWidth: 4 },
  //       overlays: [
  //         ['Label', { label: labelName, location: 0.5, cssClass: 'connectingConnectorLabel' }]
  //       ],
  //     });
  //   })
  // }





}
