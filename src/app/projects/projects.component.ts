import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  isVisible = false;
  activeIndex = 0;
  totalProjects = 4;
  @ViewChild('projectsContainer') projectsContainer!: ElementRef;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isVisible = window.scrollY > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToBottom() {
    window.scrollTo({ 
      top: document.body.scrollHeight, 
      behavior: 'smooth' 
    });
  }

  scrollProjects(direction: 'left' | 'right') {
    if (direction === 'left') {
      this.activeIndex = Math.max(0, this.activeIndex - 1);
    } else {
      this.activeIndex = Math.min(this.totalProjects - 1, this.activeIndex + 1);
    }
    this.scrollToProject(this.activeIndex);
  }

  scrollToProject(index: number) {
    this.activeIndex = index;
    const container = this.projectsContainer.nativeElement;
    const cardStep = 380; // Largeur moyenne carte + gap
    container.scrollTo({ left: index * cardStep, behavior: 'smooth' });
  }
}