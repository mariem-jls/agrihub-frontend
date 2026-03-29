import { Component, OnInit } from '@angular/core';
import {
  FundingProjectsService,
  FundingProjectDTO,
} from '../../../core/services/funding-projects.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-funding-project',
  templateUrl: './funding-project.component.html',
  styleUrls: ['./funding-project.component.css'],
})
export class FundingProjectComponent implements OnInit {
  loading = false;
  projects: FundingProjectDTO[] = [];
  filteredProjects: FundingProjectDTO[] = [];

  searchText: string = '';

  constructor(private fundingService: FundingProjectsService) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects() {
    this.loading = true;
    this.fundingService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.filteredProjects = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  applyFilters() {
    const search = this.searchText.toLowerCase();

    this.filteredProjects = this.projects.filter((p) => {
      return (
        p.titre.toLowerCase().includes(search) ||
        p.type.toLowerCase().includes(search) ||
        p.userName?.toLowerCase().includes(search)
      );
    });
  }

  // ✅ ACCEPT
  acceptProject(id: number) {
    Swal.fire({
      title: 'Confirmer ?',
      text: 'Accepter ce projet ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.fundingService.acceptProject(id).subscribe({
          next: () => {
            Swal.fire('Succès', 'Projet accepté', 'success');
            this.fetchProjects(); // refresh
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Erreur', 'Impossible d’accepter', 'error');
          },
        });
      }
    });
  }

  // ❌ REJECT
  rejectProject(id: number) {
    Swal.fire({
      title: 'Confirmer ?',
      text: 'Refuser ce projet ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.fundingService.rejectProject(id).subscribe({
          next: () => {
            Swal.fire('Succès', 'Projet refusé', 'success');
            this.fetchProjects(); // refresh
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Erreur', 'Impossible de refuser', 'error');
          },
        });
      }
    });
  }
}
