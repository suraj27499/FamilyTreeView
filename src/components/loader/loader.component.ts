import { Component } from '@angular/core';

@Component({
  selector: 'loader',
  standalone: true,
  imports: [],
  template: `
    <div class="overlay">
      <div class="loader"></div>
    </div>
  `,
  styleUrl: './loader.component.scss',
})
export class LoaderComponent {}
