import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import * as go from 'gojs';
import { GojsAngularModule } from 'gojs-angular';
import { DiagramComponent } from 'gojs-angular';

import { AppService } from './app.service';
import { LoaderComponent } from '../components/loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, GojsAngularModule, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'familyTreeView';
  textInput: string = '';
  treeData: any;
  protected isLoading: boolean = false;

  @ViewChild(DiagramComponent, { static: false })
  diagramComponent!: DiagramComponent;

  public diagramDivClassName = 'myDiagramDiv';
  public diagramModelData = { prop: 'value', color: 'red' };

  public dia: any;

  @ViewChild('myDiag', { static: false }) myDiag!: DiagramComponent;

  constructor(private appService: AppService) {}

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

    dia.model = new go.TreeModel(this.treeData);

    this.dia = dia;

    return dia;
  }

  generateFamilyTree() {
    this.isLoading = true;
    this.appService
      .searchPrompt(this.textInput)
      .then((response: any) => {
        this.isLoading = false;
        this.treeData = JSON.parse(response.answer);
      })
      .catch((err: any) => {
        this.isLoading = false;
        console.error(err);
      });
  }
}
