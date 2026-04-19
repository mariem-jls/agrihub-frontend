import { Component, OnInit } from '@angular/core';
import { ContributionsService, ContributionDTO } from '../../../core/services/contributions.service';

@Component({
  selector: 'app-contributions',
  templateUrl: './contributions.component.html',
  styleUrls: ['./contributions.component.css']
})
export class ContributionsComponent implements OnInit {

  loading = false;
  contributions: ContributionDTO[] = [];
  filteredContributions: ContributionDTO[] = [];

  // 🔹 filtre global
  searchText: string = '';

  constructor(private contributionService: ContributionsService) {}

  ngOnInit(): void {
    this.fetchContributions();
  }

  fetchContributions() {
    this.loading = true;
    this.contributionService.getAllContributions().subscribe({
      next: (data) => {
        this.contributions = data;
        this.filteredContributions = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    const text = this.searchText.toLowerCase();

    this.filteredContributions = this.contributions.filter(c => 
      c.projectName?.toLowerCase().includes(text) ||
      c.typeProjet?.toLowerCase().includes(text) ||
      c.username?.toLowerCase().includes(text)
    );
  }
}