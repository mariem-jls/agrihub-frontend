import { Component, OnInit } from '@angular/core';
import { Demande, DemandeService } from '../../../core/services/demande.service';
import { RessourceService } from '../../../core/services/ressource.service';

@Component({
  selector: 'app-demandes',
  templateUrl: './demandes.component.html',
  styleUrl: './demandes.component.css'
})
export class DemandesComponent implements OnInit {
 demandes: Demande[] = [];
  ressources: any[] = [];
  loading = true;
filteredDemandes: Demande[] = [];

selectedStatus: string = '';
selectedPriority: string = '';
  constructor(
    private demandeService: DemandeService,
    private ressourceService: RessourceService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

 loadData() {
  this.ressourceService.getAll().subscribe(res => {
    this.ressources = res;

    this.demandeService.getAll().subscribe(data => {
      this.demandes = data;
      this.applyFilters(); // 🔥 important
      this.loading = false;
    });
  });
}
applyFilters() {
  this.filteredDemandes = this.demandes.filter(d => {

    const matchStatus =
      !this.selectedStatus || d.status === this.selectedStatus;

    const matchPriority =
      !this.selectedPriority || d.priorite === this.selectedPriority;

    return matchStatus && matchPriority;
  });
}
  getRessourceName(id: number): string {
    const r = this.ressources.find(r => r.id === id);
    return r ? r.name : 'Unknown';
  }

  countByStatus(status: string): number {
  return this.demandes.filter(d => d.status === status).length;
}
selectedDemande: any = null;

voirDetails(d: any) {
  this.selectedDemande = d;
}

getRessourceImage(id: number): string {
  const r = this.ressources.find(r => r.id === id);
  return r ? r.images : null;
}

accept(id: number | undefined) {
  if (!id) return; // ✅ garde
  this.demandeService.acceptDemande(id).subscribe({
    next: () => { this.selectedDemande = null; this.loadData(); },
    error: (err) => console.error(err)
  });
}

refuse(id: number | undefined) {
  if (!id) return; // ✅ garde
  this.demandeService.refuseDemande(id).subscribe({
    next: () => { this.selectedDemande = null; this.loadData(); },
    error: (err) => console.error(err)
  });
}
}
