import { Component } from '@angular/core';
import { RessourceService } from '../../../core/services/ressource.service';
import { Ressource } from '../../../core/models/ressource';

@Component({
  selector: 'app-ressources',
  templateUrl: './ressources.component.html',
  styleUrl: './ressources.component.css'
})
export class RessourcesComponent {
ressources: Ressource[] = [];
loading = true;
  constructor(private ressourceService: RessourceService) {}

  ngOnInit(): void {
    this.ressourceService.getAll().subscribe(data => {
      this.ressources = data;
        this.loading = false;
    });
  }
  selectedRessource: Ressource | null = null;

voirDetails(r: Ressource) {
  this.selectedRessource = r;
}
}
