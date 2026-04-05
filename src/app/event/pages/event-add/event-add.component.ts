import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EventService, AgriHubEvent } from '../../services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';

const TUNIS_CENTER: L.LatLngTuple = [36.8065, 10.1815];
const MAP_DEFAULT_ZOOM = 13;
const MAP_MARKER_ZOOM = 15;
const MAP_CONTAINER_ID = 'eventLocationMap';


@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.component.html',
  styleUrls: ['./event-add.component.css'],
})
export class EventAddComponent implements OnInit, AfterViewInit, OnDestroy {
  newEvent: AgriHubEvent = {
    nom: '',
    date: '',
    adresse: '',
    description: '',
    image: '',
    nbrPlaces: 1,
    categorie: '',
  };

  /** Message d’erreur API / validation affiché sous l’en-tête */
  submitError: string | null = null;

  categories = [
    { value: 'FOIRE_AGRICOLE', label: 'Foire Agricole' },
    { value: 'FORMATION', label: 'Formation' },
    { value: 'CONFERENCE', label: 'Conférence' },
    { value: 'INVESTISSEMENT', label: 'Investissement' },
    { value: 'RECYCLAGE', label: 'Recyclage' },
    { value: 'ATELIER_PRATIQUE', label: 'Atelier Pratique' },
    { value: 'MARCHE_LOCAL', label: 'Marché Local' },
    { value: 'INNOVATION_AGRO', label: 'Innovation Agro' },
  ];

  niveaux = ['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE'];

  private map?: L.Map;
  private marker?: L.Marker;
  /** Après whenReady + invalidateSize */
  private mapLayoutReady = false;

  isEditMode = false;
  eventId!: number;
  isSubmitting = false;

  selectedFile?: File;
  selectedFileName = '';
  previewUrl: string | ArrayBuffer | null = null;

  langueDescription = 'fr';
isGenerating = false;
generateError: string | null = null;


  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    public router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const rawId = this.route.snapshot.paramMap.get('id');
    this.eventId = rawId ? Number(rawId) : NaN;
    if (rawId != null && rawId !== '' && !Number.isNaN(this.eventId)) {
      this.isEditMode = true;
      this.eventService.getEventById(this.eventId).subscribe((data) => {
        this.newEvent = data;
        this.newEvent.date = this.toDateTimeLocal(this.newEvent.date);
        this.syncMapFromEvent();
      });
    }
  }

  ngAfterViewInit(): void {
    
    queueMicrotask(() => this.initMap());
  }

  ngOnDestroy(): void {
    this.destroyMap();
  }

  get isFoire() {
    return this.newEvent.categorie === 'FOIRE_AGRICOLE';
  }
  get isFormation() {
    return this.newEvent.categorie === 'FORMATION';
  }
  get isConference() {
    return this.newEvent.categorie === 'CONFERENCE';
  }
  get isInvestissement() {
    return this.newEvent.categorie === 'INVESTISSEMENT';
  }
  get isRecyclage() {
    return this.newEvent.categorie === 'RECYCLAGE';
  }
  get isAtelier() {
    return this.newEvent.categorie === 'ATELIER_PRATIQUE';
  }
  get isMarche() {
    return this.newEvent.categorie === 'MARCHE_LOCAL';
  }
  get isInnovation() {
    return this.newEvent.categorie === 'INNOVATION_AGRO';
  }

  onCategorieChange(): void {
    const cat = this.newEvent.categorie ?? '';
    if (cat !== 'FOIRE_AGRICOLE') {
      this.newEvent.nbExposants = undefined;
      this.newEvent.typeProduits = undefined;
      this.newEvent.prixEntree = undefined;
    }
    if (cat !== 'FORMATION') {
      this.newEvent.formateur = undefined;
      this.newEvent.niveauRequis = undefined;
      this.newEvent.dureeHeures = undefined;
      this.newEvent.certification = false;
    }
    if (cat !== 'CONFERENCE') {
      this.newEvent.intervenant = undefined;
      this.newEvent.themePrincipal = undefined;
    }
    if (cat !== 'INVESTISSEMENT') {
      this.newEvent.montantMin = undefined;
      this.newEvent.secteurCible = undefined;
    }
    if (cat !== 'RECYCLAGE') {
      this.newEvent.typeDechets = undefined;
      this.newEvent.capaciteTraitement = undefined;
      this.newEvent.partenaires = undefined;
    }
    if (cat !== 'ATELIER_PRATIQUE') {
      this.newEvent.materielNecessaire = undefined;
      this.newEvent.prerequis = undefined;
      this.newEvent.niveauAtelier = undefined;
    }
    if (cat !== 'MARCHE_LOCAL') {
      this.newEvent.horairesOuverture = undefined;
      this.newEvent.nbStands = undefined;
    }
    if (cat !== 'INNOVATION_AGRO') {
      this.newEvent.technologie = undefined;
      this.newEvent.entreprise = undefined;
      this.newEvent.demoDisponible = false;
    }
  }

  onFileSelected(evt: globalThis.Event) {
    const input = evt.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    this.selectedFile = file ?? undefined;
    if (this.selectedFile) {
      this.selectedFileName = this.selectedFile.name;
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFileName = '';
      this.previewUrl = null;
    }
  }

  onSubmit() {
    if (this.isSubmitting) return;
    this.submitError = null;

    if (!this.newEvent.categorie) {
      this.submitError = 'Veuillez choisir une catégorie.';
      return;
    }

    const payload = this.buildPayloadForApi();

    this.isSubmitting = true;

    if (this.isEditMode) {
      this.eventService.updateEventWithImage(this.eventId, payload, this.selectedFile).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/event']);
        },
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
          this.submitError = this.httpErrorMessage(err);
        },
      });
    } else {
      this.eventService.addEvent(payload, this.selectedFile).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/event']);
        },
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
          this.submitError = this.httpErrorMessage(err);
        },
      });
    }
  }

  
  private buildPayloadForApi(): AgriHubEvent {
    const e = { ...this.newEvent };
    e.nbrPlaces = Math.max(1, Number(e.nbrPlaces) || 1);
    if (e.prixEntree != null) {
      e.prixEntree = Number(e.prixEntree);
    }
    if (e.montantMin != null) {
      e.montantMin = Number(e.montantMin);
    }
    if (e.nbExposants != null) {
      e.nbExposants = Number(e.nbExposants);
    }
    if (e.dureeHeures != null) {
      e.dureeHeures = Number(e.dureeHeures);
    }
    if (e.nbStands != null) {
      e.nbStands = Number(e.nbStands);
    }
    return e;
  }

  private httpErrorMessage(err: unknown): string {
    if (err instanceof HttpErrorResponse && err.status === 0) {
      return (
        'Connexion au backend impossible (réponse HTTP 0). ' +
        'Démarrez l’API Spring Boot sur http://localhost:8089 avec le contexte /AgriHub, ' +
        'puis vérifiez dans un navigateur : http://localhost:8089/AgriHub/api/events'
      );
    }
    const anyErr = err as { error?: { message?: string }; message?: string; status?: number };
    if (anyErr?.error?.message) {
      return anyErr.error.message;
    }
    if (typeof anyErr?.error === 'string') {
      return anyErr.error;
    }
    if (anyErr?.message) {
      return anyErr.message;
    }
    return "L'enregistrement a échoué. Vérifiez les champs et la console.";
  }

  resetForm() {
    this.submitError = null;
    this.newEvent = {
      nom: '',
      date: '',
      adresse: '',
      description: '',
      image: '',
      nbrPlaces: 1,
      categorie: '',
    };
    this.selectedFile = undefined;
    this.selectedFileName = '';
    this.previewUrl = null;
    this.clearMarker();
    if (this.map) {
      this.map.setView(TUNIS_CENTER, MAP_DEFAULT_ZOOM);
    }
  }

  get existingImageUrl(): string | null {
    if (!this.isEditMode || !this.newEvent?.image) return null;
    return `http://localhost:8089/AgriHub/api/events/image/${this.newEvent.image}?v=${this.eventId}`;
  }

  private toDateTimeLocal(value: string): string {
    if (!value) return value;
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return value;
    try {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d.toISOString().slice(0, 16);
    } catch {
      /* ignore */
    }
    return value.length >= 16 ? value.slice(0, 16) : value;
  }

  private destroyMap(): void {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
    this.marker = undefined;
    this.mapLayoutReady = false;
  }

  private initMap(): void {
    if (this.map) {
      return;
    }
    if (!document.getElementById(MAP_CONTAINER_ID)) {
      return;
    }

    this.map = L.map(MAP_CONTAINER_ID).setView(TUNIS_CENTER, MAP_DEFAULT_ZOOM);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      this.newEvent.latitude = lat;
      this.newEvent.longitude = lng;
      this.setMarkerAt(lat, lng);
      this.reverseGeocode(lat, lng);
    });

    this.map.whenReady(() => {
      setTimeout(() => {
        this.map?.invalidateSize();
        this.mapLayoutReady = true;
        this.syncMapFromEvent();
      }, 100);
    });
  }

  private syncMapFromEvent(): void {
    if (!this.map || !this.mapLayoutReady) {
      return;
    }
    const lat = this.newEvent.latitude;
    const lng = this.newEvent.longitude;
    if (
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      !Number.isNaN(lat) &&
      !Number.isNaN(lng) &&
      (lat !== 0 || lng !== 0)
    ) {
      this.map.setView([lat, lng], MAP_MARKER_ZOOM);
      this.setMarkerAt(lat, lng);
    }
  }

  private setMarkerAt(lat: number, lng: number): void {
    if (!this.map) {
      return;
    }
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker = L.marker([lat, lng], { icon: this.markerIcon() }).addTo(this.map);
  }

  private clearMarker(): void {
    if (this.marker && this.map) {
      this.map.removeLayer(this.marker);
    }
    this.marker = undefined;
    this.newEvent.latitude = undefined;
    this.newEvent.longitude = undefined;
  }

  
  private markerIcon(): L.Icon {
    return L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }

 
  private reverseGeocode(lat: number, lon: number): void {
    const url =
      'https://nominatim.openstreetmap.org/reverse?' +
      `format=json&lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}` +
      '&accept-language=fr';
    const headers = new HttpHeaders({ Accept: 'application/json' });
    this.http.get<{ display_name?: string }>(url, { headers }).subscribe({
      next: (data) => {
        if (data?.display_name) {
          this.newEvent.adresse = data.display_name;
          this.cdr.markForCheck();
        }
      },
      error: (err) => console.error('Nominatim reverse', err),
    });
  }

genererDescription(): void {
  if (!this.newEvent.nom && !this.newEvent.categorie) {
    this.generateError = 'Remplis le nom et la catégorie d\'abord.';
    return;
  }
  this.isGenerating = true;
  this.generateError = null;

  this.http.post<{ description?: string; error?: string }>(
    '/AgriHub/api/events/generate-description',
    {
      nom:       this.newEvent.nom       || '',
      categorie: this.newEvent.categorie || '',
      date:      this.newEvent.date      || '',
      adresse:   this.newEvent.adresse   || '',
      langue:    this.langueDescription
    }
  ).subscribe({
    next: (res) => {
      if (res.description) {
        this.newEvent.description = res.description;
      } else {
        this.generateError = res.error || 'Erreur inconnue';
      }
      this.isGenerating = false;
    },
    error: () => {
      this.generateError = 'Erreur de connexion.';
      this.isGenerating = false;
    }
  });
}



}
