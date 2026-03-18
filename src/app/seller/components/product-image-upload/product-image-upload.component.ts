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

    // Validation type
    if (!file.type.startsWith('image/')) {
      this.showMessage('Only image files are allowed ⚠️', 'error');
      return;
    }

    // Validation taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.showMessage('File size must be less than 5MB ⚠️', 'error');
      return;
    }

    this.uploading = true;
    const isPrimary = this.images.length === 0;

    const formData = new FormData();
    formData.append('file', file);

    this.http.post<any>(
      `${API_BASE_URL}/marketplace/image/upload/${this.productId}?isPrimary=${isPrimary}`,
      formData
    ).subscribe({
      next: (res) => {
        this.uploading = false;
        if (res.status === 'success') {
          this.showMessage('Image uploaded successfully ✅', 'success');
          this.loadImages();
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
    const updated = { ...image, isPrimary: true };
    this.productImageService.update(updated).subscribe({
      next: () => {
        this.showMessage('Primary image updated ✅', 'success');
        this.loadImages();
      },
      error: (err) => console.error(err)
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