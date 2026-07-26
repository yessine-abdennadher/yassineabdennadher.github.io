import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { HeroSecionComponent } from './hero-secion/hero-secion.component';
import { ButtonRetourComponent } from './button-retour/button-retour.component';
import { EducationComponent } from './education/education.component';
import { SkillsComponent } from './skills/skills.component';
import { ProjectsComponent } from './projects/projects.component';
import { CertificationsComponent } from './certifications/certifications.component';
import { ExperienceComponent } from './experience/experience.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule } from '@angular/forms';


export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  // Cast to any to bypass constructor signature mismatch in installed @ngx-translate/http-loader types
  return new (TranslateHttpLoader as any)(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    AboutMeComponent,
    HeroSecionComponent,
    ButtonRetourComponent,
    EducationComponent,
    SkillsComponent,
    ProjectsComponent,
    CertificationsComponent,
    ExperienceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    TranslateModule.forRoot({
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient],
  },
}),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
