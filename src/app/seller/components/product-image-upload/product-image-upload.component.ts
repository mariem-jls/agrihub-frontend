import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../../core/api.config';
import { ProductImageService } from '../../../core/services/product-image.service';
import { ProductImage } from '../../../core/models/product-image.model';

@Component({
  selector: 'app-product-image-upload',
  templateUrl: './product-image-upload.component.html',
  styleUrls: ['./product-image-upload.component.css']
})
export class ProductImageUploadComponent implements OnInit {

  @Input() productId!: number;

  images: ProductImage[] = [];
  uploading = false;
  dragOver = false;
  message = '';
  messageType = '';

  constructor(
    private http: HttpClient,
    private productImageService: ProductImageService
  ) {}

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.productImageService.getByProduct(this.productId).subscribe({
      next: (data) => this.images = data,
      error: (err) => console.error(err)
    });
  }

  // Drag & Drop
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(): void {
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadFile(files[0]);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) this.uploadFile(file);
  }

  uploadFile(file: File): void {
  if (!file.type.startsWith('image/')) {
    this.showMessage('Only image files are allowed ⚠️', 'error');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    this.showMessage('File size must be less than 5MB ⚠️', 'error');
    return;
  }

  this.uploading = true;

  const formData = new FormData();
  formData.append('file', file);

  // CHANGEMENT CRUCIAL : ne pas définir isPrimary automatiquement
  // Laisser false, l'utilisateur choisira ensuite
  this.http.post<any>(
    `${API_BASE_URL}/marketplace/image/upload/${this.productId}?isPrimary=false`,
    formData
  ).subscribe({
    next: (res) => {
      this.uploading = false;
      if (res.status === 'success') {
        this.showMessage('Image uploaded successfully ✅', 'success');
        this.loadImages();
        
        // Si c'est la première image, proposer de la mettre en primary
        if (this.images.length === 0) {
          setTimeout(() => {
            this.showMessage('Tip: Click the star icon to set this image as primary 🌟', 'info');
          }, 500);
        }
      } else {
        this.showMessage('Upload failed ❌', 'error');
      }
    },
    error: (err) => {
      console.error(err);
      this.uploading = false;
      this.showMessage('Upload error ❌', 'error');
    }
  });
}

setPrimary(image: ProductImage): void {
  if (!image.id) {
    this.showMessage('Cannot set primary: image ID missing ❌', 'error');
    return;
  }

  // D'abord, désactiver primary sur toutes les images
  const disablePrimaryRequests = this.images
    .filter(img => img.isPrimary && img.id !== image.id)
    .map(img => {
      const disableImage = { ...img, isPrimary: false };
      return this.productImageService.update(disableImage).toPromise();
    });

  // Attendre que toutes les désactivations soient faites
  Promise.all(disablePrimaryRequests).then(() => {
    // Puis activer primary sur l'image sélectionnée
    const updatedImage = { ...image, isPrimary: true };
    this.productImageService.update(updatedImage).subscribe({
      next: () => {
        this.showMessage('Primary image updated ✅', 'success');
        this.loadImages();
      },
      error: (err) => {
        console.error('Error setting primary image:', err);
        this.showMessage('Failed to set primary image ❌', 'error');
      }
    });
  }).catch(err => {
    console.error('Error disabling other primaries:', err);
    this.showMessage('Failed to update primary image ❌', 'error');
  });
}

  deleteImage(id: number): void {
    if (!confirm('Delete this image?')) return;
    this.productImageService.delete(id).subscribe({
      next: () => {
        this.showMessage('Image deleted ✅', 'success');
        this.loadImages();
      },
      error: (err) => console.error(err)
    });
  }

  getImageUrl(url: string): string {
    return `http://localhost:8080/AgriLink${url}`;
  }

  showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }
}