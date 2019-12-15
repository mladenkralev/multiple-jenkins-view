import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { JenkinsJob } from '../models/jenkins.job.element.model';
import { JenkninsElement } from '../models/jenkins.element.model'
import { jsPlumb, jsPlumbInstance } from 'jsplumb';

@Component({
  selector: 'app-pipeline-creator',
  templateUrl: './pipeline-creator.component.html',
  styleUrls: ['./pipeline-creator.component.css']
})
export class PipelineCreatorComponent implements OnInit {
  @Input() piplineJobs: Array<JenkinsJob> = []
  @Input() registeredJenkinsUrls: Array<JenkninsElement> = []

  @ViewChildren('viewOnEvent') things: QueryList<any>;

  jsPlumbInstance: jsPlumbInstance;
  souceClicked: boolean = false;
  lastRemembered: string = ''

  constructor() {}

  ngOnInit() { }

  ngAfterViewInit() {
    this.things.changes.subscribe(t => {
      this.ngForRendred();
    })
    this.jsPlumbInstance = jsPlumb.getInstance();
  }

  showConnectOnClick(event: Event) {
    console.log("Clicking on button " + event.target);
    this.jsPlumbInstance.recalculateOffsets(<HTMLInputElement>event.currentTarget);

    let current = (<HTMLInputElement>event.currentTarget).id;
    if (this.souceClicked) {
      this.connectSourceToTargetUsingJSPlumb(this.lastRemembered, current);
    }
    else {
      this.jsPlumbInstance.reset();
    }
    this.lastRemembered = current;
    this.souceClicked = !this.souceClicked;
  }

  connectSourceToTargetUsingJSPlumb(source: string, target: string) {
    let labelName;
    console.log("Connecting source " + source + "target " + target)
    labelName = 'connection';     
    this.jsPlumbInstance.connect({
      connector: ['Flowchart', { stub: [212, 67], cornerRadius: 1, alwaysRespectStubs: true }],
      source: 'jenkins-job-Pipeline',
      target: 'jenkins-job-test',
      anchor: ['Right', 'Left'],
      overlays: [
        ['Label', { label: labelName, location: 0.5, cssClass: 'connectingConnectorLabel' }]
      ],
    }); 
  }

  ngForRendred() {
    console.log("Rendering...")
    let labelName = 'connection';
    this.jsPlumbInstance.connect({
      connector: ['Flowchart', { stub: [212, 67], cornerRadius: 1, alwaysRespectStubs: true }],
      source: 'jenkins-job-Pipeline',
      target: 'jenkins-job-test',
      anchor: ['Right', 'Left'],
      overlays: [
        ['Label', { label: labelName, location: 0.5, cssClass: 'connectingConnectorLabel' }]
      ],
    });
  }
}
