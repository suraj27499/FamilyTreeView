import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppService } from './app.service';
import { FamilyTreeComponent } from '../components/family-tree/family-tree.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, FamilyTreeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'familyTreeView';
  textInput: string = '';
  treeData: any;

  constructor(private appService: AppService) {}

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
