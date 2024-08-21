import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'family-node',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './family-node.component.html',
  styleUrl: './family-node.component.scss'
})
export class FamilyNodeComponent {
  @Input() node: any; 
}
