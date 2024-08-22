import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import * as go from 'gojs';
import { GojsAngularModule } from 'gojs-angular';
import { DiagramComponent } from 'gojs-angular';

import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, GojsAngularModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'familyTreeView';
  textInput: string = '';
  treeData: any;

  @ViewChild(DiagramComponent, { static: false })
  diagramComponent!: DiagramComponent;

  familyData = [
    {
      key: 0,
      name: 'Ram singh',
      gender: 'M',
      birthYear: '1940',
      relationship: 'grandfather',
    },
    {
      key: 1,
      parent: 0,
      name: 'Roop chand',
      gender: 'M',
      birthYear: '1970',
      relationship: 'father',
    },
    {
      key: 2,
      parent: 0,
      name: 'Samrat Singh',
      gender: 'M',
      birthYear: '1972',
      relationship: 'uncle',
    },
    {
      key: 3,
      parent: 0,
      name: 'Dhyan Chand',
      gender: 'M',
      birthYear: '1975',
      relationship: 'uncle',
    },
    {
      key: 4,
      parent: 0,
      name: 'Sushil Singh',
      gender: 'M',
      birthYear: '1978',
      relationship: 'uncle',
    },
    {
      key: 5,
      parent: 1,
      name: 'Manmeet',
      gender: 'M',
      birthYear: '2000',
      relationship: 'son',
    },
  ];

  public diagramDivClassName = 'myDiagramDiv';
  public diagramModelData = { prop: 'value', color: 'red' };

  public dia: any;

  @ViewChild('myDiag', { static: false }) myDiag!: DiagramComponent;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.treeData = this.familyData;
  }

  initDiagram(): go.Diagram {
    const $ = go.GraphObject.make;
    const dia = $(go.Diagram, {
      'toolManager.hoverDelay': 100, // 100 milliseconds instead of the default 850
      allowCopy: false,
      // create a TreeLayout for the family tree
      layout: $(go.TreeLayout, {
        angle: 90,
        nodeSpacing: 10,
        layerSpacing: 40,
        layerStyle: go.TreeLayout.LayerUniform,
      }),
    });

    const bluegrad = '#90CAF9';
    const pinkgrad = '#F48FB1';

    dia.add(
      $(
        go.Part,
        'Table',
        { position: new go.Point(300, 10), selectable: false },
        $(go.TextBlock, 'Key', {
          row: 0,
          font: '700 14px Droid Serif, sans-serif',
        }),
        $(
          go.Panel,
          'Horizontal',
          { row: 1, alignment: go.Spot.Left },
          $(go.Shape, 'Rectangle', {
            desiredSize: new go.Size(30, 30),
            fill: bluegrad,
            margin: 5,
          }),
          $(go.TextBlock, 'Males', { font: '700 13px Droid Serif, sans-serif' })
        ),
        $(
          go.Panel,
          'Horizontal',
          { row: 2, alignment: go.Spot.Left },
          $(go.Shape, 'Rectangle', {
            desiredSize: new go.Size(30, 30),
            fill: pinkgrad,
            margin: 5,
          }),
          $(go.TextBlock, 'Female', {
            font: '700 13px Droid Serif, sans-serif',
          })
        )
      )
    );

    dia.nodeTemplate = $(
      go.Node,
      'Auto',
      {
        deletable: false,
      },
      new go.Binding('text', 'name'),
      $(
        go.Shape,
        'Rectangle',
        {
          fill: 'lightgray',
          stroke: null,
          strokeWidth: 0,
          stretch: go.GraphObject.Fill,
          alignment: go.Spot.Center,
        },
        new go.Binding('fill', 'gender', (gender) => {
          if (gender === 'M') {
            return bluegrad;
          }
          if (gender === 'F') {
            return pinkgrad;
          }
          return 'orange';
        })
      ),
      $(
        go.TextBlock,
        {
          font: '700 12px Droid Serif, sans-serif',
          textAlign: 'center',
          margin: 10,
          maxSize: new go.Size(80, NaN),
        },
        new go.Binding('text', 'name')
      )
    );

    dia.linkTemplate = $(
      go.Link,
      {
        routing: go.Link.Orthogonal,
        corner: 5,
        selectable: false,
      },
      $(go.Shape, {
        strokeWidth: 3,
        stroke: '#424242',
      })
    );

    dia.model = new go.TreeModel(this.familyData);

    this.dia = dia;

    return dia;
  }

  generateFamilyTree() {
    this.appService
      .searchPrompt(this.textInput)
      .then((response: any) => {
        this.treeData = JSON.parse(response.answer);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }
}
