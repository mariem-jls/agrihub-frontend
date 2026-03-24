import { Component, OnInit } from '@angular/core';
import {
  FundingProjectsService,
  FundingProjectDTO,
} from '../../../core/services/funding-projects.service';

import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-funding-project',
  templateUrl: './funding-project.component.html',
  styleUrls: ['./funding-project.component.css'],
})
export class FundingProjectComponent implements OnInit {
  loading = false;
  projects: FundingProjectDTO[] = [];
  filteredProjects: FundingProjectDTO[] = [];

  // 🔹 filtres
  searchText: string = '';
  filterUser: string = '';
  filterMinContrib: number | null = null;

  constructor(private fundingService: FundingProjectsService) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects() {
    this.loading = true;
    this.fundingService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.filteredProjects = data; // initialisation
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
}
