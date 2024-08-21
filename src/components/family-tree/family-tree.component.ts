import { Component, Input } from '@angular/core';
import { FamilyNodeComponent } from '../family-node/family-node.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'family-tree',
  standalone: true,
  imports: [FamilyNodeComponent, CommonModule],
  templateUrl: './family-tree.component.html',
  styleUrl: './family-tree.component.scss',
})
export class FamilyTreeComponent {
  @Input() data: any;
}
