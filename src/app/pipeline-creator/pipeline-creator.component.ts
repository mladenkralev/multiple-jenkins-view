import { Component, OnInit, Input, ViewChildren, QueryList, ViewChild, ViewContainerRef, ElementRef } from '@angular/core';
import { JenkinsJob } from '../models/jenkins.job.element.model';
import { JenkninsElement } from '../models/jenkins.element.model'
import { jsPlumbInstance } from 'jsplumb';
import { NodeService } from './nodes-container/node/node.service';
import { ViewableJenkinsNode } from '../models/jenkins.node.model';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pipeline-creator',
  templateUrl: './pipeline-creator.component.html',
  styleUrls: ['./pipeline-creator.component.css']
})
export class PipelineCreatorComponent implements OnInit {
  // these are only the selected jobs from previous view
  @Input() jenkinsToSelectedJenkinsJobs?= new Map<JenkninsElement, Array<JenkinsJob>>();
  @Input() loadedPreconfiguredJson?: any

  @ViewChild('nodeContainerDiv', { read: ViewContainerRef, static: false }) viewContainerRef: ViewContainerRef;

  fileUrl: any;

  viawableContent = new Map<JenkninsElement, string>();

  jsPlumbInstance: jsPlumbInstance;
  souceClicked: boolean = false;
  lastRemembered: string = ''

  nodes = [];
  connections = [];

  constructor(private nodeService: NodeService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    if (this.loadedPreconfiguredJson != null) {
      this.fillFromJson(this.loadedPreconfiguredJson)
    } else {
      // for now position 7 nodes and add new line.
      var nodesOnRow = 0;
      var nodesOnRowMax = 7;

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
        const jsonNodes = JSON.stringify({ nodes: arrayOfNodes });
        this.viawableContent.set(jenkinsDomain, jsonNodes)
        stepLeft += 200;
      });
    }

    this.viawableContent.forEach((json, jenkinsElement) => {
      let tempArray = JSON.parse(json);
      console.log(tempArray)
      this.nodes = this.nodes.concat(tempArray.nodes)
    });
    setTimeout(() => {
      this.connections.forEach(connection => {
        this.nodeService.addConnection(connection);
      });
    })
    console.log(this.nodes)

  }

  getNodesFromJson(input) {
    return JSON.parse(input).nodes
  }

  saveNodeJson() {
    //save element position on Canvas and node conections
    const container = this.viewContainerRef.element.nativeElement.parentNode;

    const nodes = Array.from(container.querySelectorAll('.node')).map((node: HTMLDivElement) => {
      return new ViewableJenkinsNode(node.id, String(node.offsetTop), String(node.offsetLeft))
    });
    const connections = (this.nodeService.jsPlumbInstance.getAllConnections() as any[])
      .map((conn) => ({ uuids: conn.getUuids() }));


    var nodesToJenkinsDomains = nodes.map(node => {
      var jenkinsDomain = null;
      this.viawableContent.forEach((json, jenkinsElement) => {
        const tempNodeJson = JSON.parse(json).nodes
        tempNodeJson.forEach(jsonNode => {
          if (jsonNode["id"] === node.id) {
            jenkinsDomain = jenkinsElement
          }
        })
      });

      let jobName = node.id;
      return ({ jobName, jenkinsDomain });
    });

    const json = JSON.stringify({ nodes, connections, nodesToJenkinsDomains });

    const blob = new Blob([json], { type: 'text/json' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

  fillFromJson(json: string) {
    console.log("Fling")

    this.nodes = json["nodes"];
    this.connections = json["connections"];
    let nodesToJenkinsDomains = json["nodesToJenkinsDomains"];

    // let allKnownedJenkinsDomains= new Array<JenkninsElement>()
    let tempViawableContent = new Map<JenkninsElement, Array<ViewableJenkinsNode>>();
    nodesToJenkinsDomains.forEach(element => {
      if (tempViawableContent.size != 0) {
        let alreadyExists = Array.from(tempViawableContent.keys()).find(key => key['url'] === element['jenkinsDomain']['url']);
        if (alreadyExists == undefined) {
          tempViawableContent.set(new JenkninsElement(element['jenkinsDomain']['url'],
            element['jenkinsDomain']["name"],
            element['jenkinsDomain']["password"]), [])
        }
      } else {
        tempViawableContent.set(new JenkninsElement(element['jenkinsDomain']['url'],
          element['jenkinsDomain']["name"],
          element['jenkinsDomain']["password"]), [])
      }

    });

    nodesToJenkinsDomains.forEach(element => {
      let currentNode = this.nodes.find(node => node["id"] === element["jobName"]);
      if (currentNode != undefined) {
        let jenkinsDomain = Array.from(tempViawableContent.keys()).find(key => key['url'] === element['jenkinsDomain']['url']);
        this.getByValue(tempViawableContent, jenkinsDomain).push(
          new ViewableJenkinsNode(currentNode["id"],currentNode["top"], currentNode["left"]));
      }
    });

    tempViawableContent.forEach((jenkinsNodes,jenkinsDomain) => {
      const jsonNodes = JSON.stringify({ nodes: jenkinsNodes });
      this.viawableContent.set(jenkinsDomain, jsonNodes)
    });

    console.log("End result is " + this.viawableContent)
  }

 getByValue(map, searchKey) {
    for (let [key, value] of map.entries()) {
      if (key === searchKey)
        return value;
    }
  }
}
