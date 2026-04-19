export interface Ressource {
  id?: number;
  type: string;
  description: string;
  status: string;
  nameR: string;
  marque?: string;
  etat?: string;
  prixLocation: number;
  superficie?: number;
  images?: string;
  adresse: string;
   badge?: string; 
}