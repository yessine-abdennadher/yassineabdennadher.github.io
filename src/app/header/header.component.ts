import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isDarkMode = false;
  showHeader: boolean = true;
  private hideTimeout: any;
  isLogged: boolean = false;
  showMenu = false;
  isInHeroSection: boolean = false;

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.checkAuth();
    this.checkInitialDarkMode();
    
    this.router.events.subscribe(() => {
      if (this.router.url === '/home' || this.router.url === '/') {
        this.startAutoHideHeader();
      } else {
        this.showHeader = true;
        this.clearHideTimeout();
      }
    });

    // Observer pour détecter quand on est dans la section hero
    this.observeHeroSection();
  }

  observeHeroSection() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          this.isInHeroSection = entry.isIntersecting;
          if (this.isInHeroSection) {
            // Cacher le header quand on est dans la section hero
            this.showHeader = false;
            this.clearHideTimeout();
          } else {
            // Montrer le header quand on quitte la section hero
            this.showHeader = true;
            if (this.router.url === '/home' || this.router.url === '/') {
              this.startAutoHideHeader();
            }
          }
        });
      },
      { threshold:0.5  } // 50% de la section visible
    );

    // Démarrer l'observation après un délai pour que le DOM soit chargé
    setTimeout(() => {
      const heroSection = document.querySelector('app-hero-secion');
      if (heroSection) {
        observer.observe(heroSection);
      }
    }, 1000);
  }

  checkInitialDarkMode() {
    this.isDarkMode = document.documentElement.classList.contains('dark');
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if ((this.router.url === '/home' || this.router.url === '/') && !this.isInHeroSection) {
      this.showHeader = true;
      this.clearHideTimeout();
      this.hideTimeout = setTimeout(() => {
        this.showHeader = false;
      }, 3000);
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if ((this.router.url === '/home' || this.router.url === '/') && !this.isInHeroSection) {
      this.showHeader = true;
      this.clearHideTimeout();
      this.hideTimeout = setTimeout(() => {
        this.showHeader = false;
      }, 3000);
    }
  }

  startAutoHideHeader() {
    if (this.isInHeroSection) return;
    
    this.clearHideTimeout();
    this.hideTimeout = setTimeout(() => {
      this.showHeader = false;
    }, 5000);
  }

  private clearHideTimeout() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }

  checkAuth() {
    this.isLogged = !!localStorage.getItem('user_id');
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  @HostListener('document:click')
  closeMenuOutside() {
    this.showMenu = false;
  }

  scrollToSection(sectionId: string) {
    this.showMenu = false;
    
    // S'assurer que le header est visible avant de scroller
    this.showHeader = true;
    this.clearHideTimeout();
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Redémarrer le timer de masquage après le scroll
      if (this.router.url === '/home' || this.router.url === '/') {
        this.startAutoHideHeader();
      }
    }
  }

  ngOnDestroy() {
    this.clearHideTimeout();
  }
}