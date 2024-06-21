import {Component} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {List} from "immutable";
import {CommonModule} from "@angular/common";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {RoadmapFeatureCardComponent} from "../../components/roadmap-feature-card/roadmap-feature-card.component";
import {RoadmapFeature} from "../../models/roadmap-feature.model";
import {RoadmapFeatureComponent} from "../../components/roadmap-feature/roadmap-feature.component";

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RoadmapFeatureCardComponent,
    MatDivider,
    MatIcon,
    RoadmapFeatureComponent
  ],
  templateUrl: './roadmap.component.html',
  styleUrl: './roadmap.component.scss'
})
export class RoadmapComponent {

  protected readonly features: List<RoadmapFeature> = List.of(

    RoadmapFeature.builder()
      .withTitle('Game 4: ???')
      .withDescription(`Implemented the famous Hanabi game with additional decision-making features.`)
      .withFeatures([
        'Basic game',
        'History',
        'Vision',
        'Critical cards',
        'Markers'
      ])
      .withType(RoadmapFeature.Type.SOON)
      .withReleaseDate(new Date(2025, 3, 30))
      .build(),

    RoadmapFeature.builder()
      .withTitle('Game 3: ???')
      .withDescription(`Implemented the famous Hanabi game with additional decision-making features.`)
      .withFeatures([
        'Basic game',
        'History',
        'Vision',
        'Critical cards',
        'Markers'
      ])
      .withType(RoadmapFeature.Type.SOON)
      .withReleaseDate(new Date(2025, 2, 31))
      .build(),

    RoadmapFeature.builder()
      .withTitle('Game 2: ???')
      .withDescription(`Implemented the famous Hanabi game with additional decision-making features.`)
      .withFeatures([
        'Basic game',
        'History',
        'Vision',
        'Critical cards',
        'Markers'
      ])
      .withType(RoadmapFeature.Type.SOON)
      .withReleaseDate(new Date(2025, 1, 28))
      .build(),

    RoadmapFeature.builder()
      .withTitle('Creating the 1st game !')
      .withDescription(`Implemented the famous Hanabi game with additional decision-making features.`)
      .withFeatures([
        'Basic game',
        'History',
        'Vision',
        'Critical cards',
        'Markers'
      ])
      .withType(RoadmapFeature.Type.WIP)
      .withReleaseDate(new Date(2025, 0, 31))
      .build(),

    RoadmapFeature.builder()
      .withTitle('Created the Hanabi !')
      .withDescription(`Implemented the famous Hanabi game with additional decision-making features.`)
      .withFeatures([
        'Basic game',
        'History',
        'Vision',
        'Critical cards',
        'Markers'
      ])
      .withType(RoadmapFeature.Type.DONE)
      .build(),

    RoadmapFeature.builder()
      .withTitle('1 Year: 1 game per Month !')
      .withDescription(`Here is a challenge that I set for myself for 1 year: release a game every month.
      After 1 year, the site will have 14 games.
      Unlike hanabi, the games created will be new (coming from my own brain!).
      Being a fan of trick games but also of big board games, I will release games at the crossroads of these genres.`)
      .withFeatures([
        '1 Year, 1 game per Month',
        '12 unpublished games !'
      ])
      .withType(RoadmapFeature.Type.CHALLENGE)
      .build(),

    RoadmapFeature.builder()
      .withTitle('Released the website !')
      .withDescription(`I am really happy to announce the release of my game website!<br>Here is some guidelines :`)
      .withFeatures([
        'Fell free to leave feedback',
        'Do not hesitate to support my work ;)',
        'Have a lot of fun !!!'
      ])
      .withType(RoadmapFeature.Type.EVENT)
      .build(),

    RoadmapFeature.builder()
      .withTitle('Created the Hanabi !')
      .withDescription(`Implemented the famous Hanabi game with additional decision-making features.`)
      .withFeatures([
        'Basic game',
        'History',
        'Vision',
        'Critical cards',
        'Markers'
      ])
      .withType(RoadmapFeature.Type.DONE)
      .build(),

    RoadmapFeature.builder()
      .withTitle('Created the Hanabi !')
      .withDescription(`Implemented the famous Hanabi game with additional decision-making features.`)
      .withFeatures([
        'Basic game',
        'History',
        'Vision',
        'Critical cards',
        'Markers'
      ])
      .withType(RoadmapFeature.Type.DONE)
      .build(),
  );
}
