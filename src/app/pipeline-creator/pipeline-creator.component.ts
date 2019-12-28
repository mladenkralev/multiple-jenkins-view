import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { JenkinsJob } from '../models/jenkins.job.element.model';
import { JenkninsElement } from '../models/jenkins.element.model'
import { jsPlumb, jsPlumbInstance } from 'jsplumb';
import { NodeService } from './nodes-container/node/node.service';

@Component({
  selector: 'app-pipeline-creator',
  templateUrl: './pipeline-creator.component.html',
  styleUrls: ['./pipeline-creator.component.css']
})
export class PipelineCreatorComponent implements OnInit {
  // these are only the selected jobs from previous view
  @Input() jenkinsToSelectedJenkinsJobs = new Map<JenkninsElement, Array<JenkinsJob>>();
  
  @Input() piplineJobs: Array<JenkinsJob> = []
  @Input() registeredJenkinsUrls: Array<JenkninsElement> = []

  @ViewChildren('viewOnEvent') things: QueryList<any>;

  jsPlumbInstance: jsPlumbInstance;
  souceClicked: boolean = false;
  lastRemembered: string = ''

  nodes = [];
  connections = [];

  constructor(private nodeService: NodeService) { }

  ngOnInit() { }

  ngOnChanges() {
    console.log("changes")
    JSON.stringify
    this.registeredJenkinsUrls.forEach(element => {
      let data: Map<String, Array<JenkninsElement>> = new Map();
      // data.pus
    });
  }

  fillFromJson() {
    const json = `{
      "nodes":[
        {"id":"Step_0 id: b46a17","top":0,"left":0},
        {"id":"Step_1 id: efd2ce","top":200,"left":0}
       
      ],
      "connections":[
        {"uuids":["Step_0 id: b46a17_bottom","Step_1 id: efd2ce_top"]}
      ]}`;
    const data = JSON.parse(json);

    this.nodes = data.nodes;
    this.connections = data.connections;
  }

  yourMethod(item) {
    console.log("Mladen" + item);
  }
}
