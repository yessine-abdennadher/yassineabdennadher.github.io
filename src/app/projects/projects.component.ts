import { Component, HostListener, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements AfterViewInit, OnDestroy {
  isVisible = false;
  activeIndex = 0;
  totalProjects = 8;
  @ViewChild('projectsContainer') projectsContainer!: ElementRef;
  private wheelListener?: (e: WheelEvent) => void;

  ngAfterViewInit() {
    if (this.projectsContainer?.nativeElement) {
      const container = this.projectsContainer.nativeElement;
      this.wheelListener = (event: WheelEvent) => {
        const canScrollLeft = container.scrollLeft > 0 && event.deltaY < 0;
        const canScrollRight = (container.scrollLeft + container.clientWidth < container.scrollWidth - 10) && event.deltaY > 0;
        
        if (canScrollLeft || canScrollRight) {
          event.preventDefault();
          container.scrollLeft += event.deltaY;
          this.updateActiveIndex();
        }
      };
      container.addEventListener('wheel', this.wheelListener, { passive: false });
    }
  }

  ngOnDestroy() {
    if (this.wheelListener && this.projectsContainer?.nativeElement) {
      this.projectsContainer.nativeElement.removeEventListener('wheel', this.wheelListener);
    }
  }

  onScroll() {
    this.updateActiveIndex();
  }

  updateActiveIndex() {
    if (!this.projectsContainer) return;
    const container = this.projectsContainer.nativeElement;
    const cardStep = 432;
    this.activeIndex = Math.min(this.totalProjects - 1, Math.max(0, Math.round(container.scrollLeft / cardStep)));
  }

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
    const cardStep = 432;
    container.scrollTo({ left: index * cardStep, behavior: 'smooth' });
  }
}