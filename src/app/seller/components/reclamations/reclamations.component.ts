import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ReponsesService,
  ReponseDTO,
} from '../../../core/services/reponses.service';

interface ReclamationDTO {
  id: number;
  titre: string;
  description: string;
  type: string;
  status: string;
  priorite: string;
  dateCreation: Date;
  userName: string;
  visible: boolean; // pour contrôler l'affichage du formulaire de réponse
}

@Component({
  selector: 'app-reclamations',
  templateUrl: './reclamations.component.html',
  styleUrls: ['./reclamations.component.css'],
})
export class ReclamationsComponent implements OnInit {
  reclamations: ReclamationDTO[] = [];
  filteredReclamations: ReclamationDTO[] = [];
  loading = true;
  searchText = '';

  // Popup
  showPopup = false;
  selectedReclamation: ReclamationDTO | null = null;
  newResponse = '';
  responses: ReponseDTO[] = [];

  constructor(
    private http: HttpClient,
    private reponseService: ReponsesService,
  ) {}

  ngOnInit() {
    this.loadReclamations();
  }

  loadReclamations() {
    this.http
      .get<
        ReclamationDTO[]
      >('http://localhost:8080/AgriLink/reclamations/getAll')
      .subscribe((data) => {
        this.reclamations = data.map((r) => {
          console.log(
            'Reclamation:',
            r.id,
            'status:',
            r.status,
            'visible:',
            r.visible,
            'type:',
            typeof r.visible,
          );
          return {
            ...r,
            visible: !!r.visible, // convertit 0/1 en boolean directement
          };
        });
        this.filteredReclamations = [...this.reclamations];
        this.loading = false;
      });
  }

  applyFilters() {
    const text = this.searchText.toLowerCase();
    this.filteredReclamations = this.reclamations.filter(
      (r) =>
        r.titre.toLowerCase().includes(text) ||
        r.type.toLowerCase().includes(text) ||
        r.userName.toLowerCase().includes(text),
    );
  }

  accepterReclamation(id: number) {
    this.http
      .put(
        `http://localhost:8080/AgriLink/reclamations/acceptReclamation/${id}`,
        {},
      )
      .subscribe(() => {
        this.loadReclamations();
      });
  }

  refuserReclamation(id: number) {
    this.http
      .put(
        `http://localhost:8080/AgriLink/reclamations/refuseReclamation/${id}`,
        {},
      )
      .subscribe(() => {
        this.loadReclamations();
      });
  }

  openResponsePopup(reclamation: ReclamationDTO) {
    this.selectedReclamation = reclamation;
    this.showPopup = true;
    this.newResponse = '';
    this.loadResponses(reclamation.id);
  }

  loadResponses(reclamationId: number) {
    this.reponseService
      .getReponsesByReclamation(reclamationId)
      .subscribe((data) => (this.responses = data));
  }

  submitResponse() {
    if (!this.selectedReclamation || !this.newResponse.trim()) return;

    this.reponseService
      .addReponse(this.selectedReclamation.id, this.newResponse)
      .subscribe((res) => {
        this.responses.push(res);
        this.newResponse = '';
      });
  }

  closePopup() {
    this.showPopup = false;
    this.selectedReclamation = null;
    this.responses = [];
  }

  finirReclamation(id: number) {
    this.http
      .put(
        `http://localhost:8080/AgriLink/reclamations/finirReclamation/${id}`,
        {},
      )
      .subscribe(() => {
        this.loadReclamations();
      });
  }
}
