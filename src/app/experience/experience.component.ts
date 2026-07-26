import {
  Component, AfterViewInit, OnDestroy,
  ElementRef, ViewChild, ViewChildren, QueryList
} from '@angular/core';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent implements AfterViewInit, OnDestroy {

  @ViewChild('timelineWrap') timelineWrap!: ElementRef<HTMLElement>;
  @ViewChildren('expCard') expCards!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('expDot') expDots!: QueryList<ElementRef<HTMLElement>>;

  visibleCards: boolean[] = [true, true, true];
  paths: string[] = [];
  pathLengths: number[] = [];

  private observer!: IntersectionObserver;
  private resizeObserver!: ResizeObserver;

  ngAfterViewInit(): void {
    this.visibleCards = new Array(this.expCards.length).fill(false);

    // Calculate paths after rendering cycle
    setTimeout(() => {
      this.computePaths();
    }, 150);

    // Recalculate on wrap resize
    if (this.timelineWrap?.nativeElement) {
      this.resizeObserver = new ResizeObserver(() => this.computePaths());
      this.resizeObserver.observe(this.timelineWrap.nativeElement);
    }

    // Scroll animation observer
    if (typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const index = this.expCards.toArray()
              .findIndex(el => el.nativeElement === entry.target);
            if (entry.isIntersecting && index !== -1) {
              this.visibleCards[index] = true;
            }
          });
        },
        { threshold: 0.15 }
      );

      this.expCards.forEach(card => this.observer.observe(card.nativeElement));
    } else {
      this.visibleCards = [true, true, true];
    }
  }

  /** Calculates bezier curves dynamically between dots */
  private computePaths(): void {
    if (!this.timelineWrap?.nativeElement) return;

    const wrapRect = this.timelineWrap.nativeElement.getBoundingClientRect();
    const dots = this.expDots.toArray().map(d => {
      const r = d.nativeElement.getBoundingClientRect();
      return {
        x: r.left - wrapRect.left + r.width / 2,
        y: r.top - wrapRect.top + r.height / 2,
      };
    });

    if (dots.length < 2) return;

    const newPaths: string[] = [];
    for (let i = 0; i < dots.length - 1; i++) {
      const p1 = dots[i];
      const p2 = dots[i + 1];
      const midY = (p1.y + p2.y) / 2;

      // S-curve formula
      const d = `M ${p1.x} ${p1.y} C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`;
      newPaths.push(d);
    }
    this.paths = newPaths;

    // Calculate path lengths for animation
    setTimeout(() => {
      const svgPaths = document.querySelectorAll<SVGPathElement>('#experience svg path');
      this.pathLengths = Array.from(svgPaths).map(p => p.getTotalLength() || 400);
    }, 50);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.resizeObserver?.disconnect();
  }
}
