import { Component, OnInit, Input, ViewChildren, QueryList, ViewChild, ViewContainerRef, ElementRef } from '@angular/core';
import { JenkinsJob } from '../models/jenkins.job.element.model';
import { JenkninsElement } from '../models/jenkins.element.model'
import { jsPlumbInstance } from 'jsplumb';
import { NodeService } from './nodes-container/node/node.service';
import { ViewableJenkinsNode } from '../models/jenkins.node.model';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-pipeline-creator',
  templateUrl: './pipeline-creator.component.html',
  styleUrls: ['./pipeline-creator.component.css']
})
export class PipelineCreatorComponent implements OnInit {
  // these are only the selected jobs from previous view
  @Input() jenkinsToSelectedJenkinsJobs = new Map<JenkninsElement, Array<JenkinsJob>>();

  fileUrl;

  @ViewChildren('viewOnEvent') things: QueryList<any>;

  viawableContent = new Map<JenkninsElement, string>();

  jsPlumbInstance: jsPlumbInstance;
  souceClicked: boolean = false;
  lastRemembered: string = ''

  @ViewChild('mladen', { read: ViewContainerRef, static: false }) viewContainerRef: ViewContainerRef;
  nodes = [];
  connections = [];

  constructor(private nodeService: NodeService, private sanitizer: DomSanitizer) { }

  // ngAfterViewInit(): void {
  //   const container = this.viewContainerRef.nativeElement.parentNode;
  //   console.log(container)
  // }

  ngOnInit() {
    // for now position 7 nodes and add new line.
    var nodesOnRow = 0;
    var nodesOnRowMax = 7;
    console.log("changes")

    var stepLeft = 100;
    this.jenkinsToSelectedJenkinsJobs.forEach((jenkinsJobs, jenkinsDomain) => {
      var stepTop = 300;

      let arrayOfNodes: Array<ViewableJenkinsNode> = new Array();

      jenkinsJobs.forEach(jenkinsJob => {
        arrayOfNodes.push(new ViewableJenkinsNode(jenkinsJob.name, String(stepTop), String(stepLeft)));
        if (nodesOnRow >= nodesOnRowMax) {
          stepTop += 100;
        }
      })
      const myObjStr = JSON.stringify({ nodes: arrayOfNodes });
      this.viawableContent.set(jenkinsDomain, myObjStr)
      stepLeft += 200;
    });

    this.viawableContent.forEach((json, jenkinsElement) => {
      let tempArray = JSON.parse(json);
      console.log(tempArray)
      this.nodes = this.nodes.concat(tempArray.nodes)
    });

    console.log(this.nodes)
  }


  getNodesFromJson(input) {
    return JSON.parse(input).nodes
  }

  saveNodeJson() {
    //save element position on Canvas and node conections
    const container = this.viewContainerRef.element.nativeElement.parentNode;

    const nodes = Array.from(container.querySelectorAll('.node')).map((node: HTMLDivElement) => {
      return new ViewableJenkinsNode( node.id, String( node.offsetTop), String( node.offsetLeft))
    });
    const connections = (this.nodeService.jsPlumbInstance.getAllConnections() as any[])
      .map((conn) => ({ uuids: conn.getUuids() }));


    var nodesToJenkinsDomains = nodes.map(node => {
      var jenkinsDomain = null;
      this.viawableContent.forEach((json, jenkinsElement) => {
        const tempNodeJson = JSON.parse(json).nodes
        if (tempNodeJson[0]["id"] === node.id) {
          jenkinsDomain = jenkinsElement
        }
      });
      let jobName = node.id;
      return ({jobName, jenkinsDomain});
    });

    const json = JSON.stringify({ nodes, connections, nodesToJenkinsDomains });

    const blob = new Blob([json], { type: 'text/json' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }


  fillFromJson() {
    
    const data = JSON.parse(' {"nodes":[{"id":"test-jenkins-1","top":"300","left":"100"},{"id":"test-jenkins-2","top":"316","left":"1249"}],"connections":[{"uuids":["test-jenkins-1_bottom","test-jenkins-2_top"]}],"nodesToJenkinsDomains":[{"jobName":"test-jenkins-1","jenkinsDomain":{"url":"http://localhost:8080/","name":"test","password":"test"}},{"jobName":"test-jenkins-2","jenkinsDomain":{"url":"http://localhost:8081/","name":"test","password":"test"}}]}');
   
    this.nodes = data.nodes;
    this.connections = data.connections;


    this.nodes.forEach(node => {
      this.nodeService.addDynamicNode(node);
    })

    setTimeout(() => {
      this.connections.forEach(connection => {
        this.nodeService.addConnection(connection);
      });
    })
    console.log("Filling dude")
  }
}
