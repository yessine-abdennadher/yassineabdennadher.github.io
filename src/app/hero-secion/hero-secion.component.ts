import { Component, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
declare var VANTA: any;

@Component({
  selector: 'app-hero-secion',
  templateUrl: './hero-secion.component.html',
  styleUrls: ['./hero-secion.component.css']
})
export class HeroSecionComponent implements AfterViewInit, OnDestroy {
  private vantaEffect: any;

  constructor(private elRef: ElementRef) {}

  ngAfterViewInit() {

    
    // Écoute les changements de classe dark sur <html> (si tu as un switch)
    const observer = new MutationObserver(() => this.reloadVanta());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  ngOnDestroy() {
    if (this.vantaEffect) this.vantaEffect.destroy();
  }

  private initVanta() {
    const dark = document.documentElement.classList.contains('dark');

    this.vantaEffect = VANTA.TOPOLOGY({
      el: this.elRef.nativeElement.querySelector('#vanta-bg'),
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
  

      color: dark ? 0x1DA7C9 : 0x0891B2,
      backgroundColor: dark ? 0x130F0F : 0xFFFFFF
    });
  }

  private reloadVanta() {
    if (this.vantaEffect) this.vantaEffect.destroy();
    this.initVanta();
  }
}
