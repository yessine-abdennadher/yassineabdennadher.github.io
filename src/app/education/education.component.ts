import {
  Component, AfterViewInit, OnDestroy,
  ElementRef, ViewChild, ViewChildren, QueryList
} from '@angular/core';
import lottie from 'lottie-web';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements AfterViewInit, OnDestroy {

  @ViewChild('timelineWrap') timelineWrap!: ElementRef<HTMLElement>;
  @ViewChildren('eduCard') eduCards!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('eduDot') eduDots!: QueryList<ElementRef<HTMLElement>>;

  visibleCards: boolean[] = [true, true, true];
  paths: string[] = [];
  pathLengths: number[] = [];

  private observer!: IntersectionObserver;
  private resizeObserver!: ResizeObserver;
  private anim: any;

  ngAfterViewInit(): void {
    // Initialiser Lottie
    try {
      this.anim = lottie.loadAnimation({
        container: document.getElementById('lottie-container')!,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/animations/student.json',
      });
    } catch (e) {
      console.warn('Lottie animation failed to load', e);
    }

    this.visibleCards = new Array(this.eduCards.length).fill(false);

    // Calculer les chemins au prochain cycle de rendu
    setTimeout(() => {
      this.computePaths();
    }, 100);

    // Recalculer si la fenêtre change de taille
    if (this.timelineWrap?.nativeElement) {
      this.resizeObserver = new ResizeObserver(() => this.computePaths());
      this.resizeObserver.observe(this.timelineWrap.nativeElement);
    }

    // Apparition progressive des cartes et animation de la ligne
    if (typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const index = this.eduCards.toArray()
              .findIndex(el => el.nativeElement === entry.target);
            if (entry.isIntersecting && index !== -1) {
              this.visibleCards[index] = true;
            }
          });
        },
        { threshold: 0.2 }
      );

      this.eduCards.forEach(card => this.observer.observe(card.nativeElement));
    } else {
      this.visibleCards = [true, true, true];
    }
  }

  /** Calcule une courbe de Bézier entre chaque paire de points consécutifs */
  private computePaths(): void {
    if (!this.timelineWrap?.nativeElement) return;

    const wrapRect = this.timelineWrap.nativeElement.getBoundingClientRect();
    const dots = this.eduDots.toArray().map(d => {
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

      const d = `M ${p1.x} ${p1.y} C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`;
      newPaths.push(d);
    }
    this.paths = newPaths;

    setTimeout(() => {
      const svgPaths = document.querySelectorAll<SVGPathElement>('#education svg path');
      this.pathLengths = Array.from(svgPaths).map(p => p.getTotalLength() || 300);
    }, 50);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.resizeObserver?.disconnect();
    if (this.anim) {
      this.anim.destroy();
    }
  }
}