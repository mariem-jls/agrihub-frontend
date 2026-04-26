import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { UserProfile } from '../../../core/models/user-profile.model';
import { KeycloakService } from '../../../core/services/keycloak.service';
import {
  CreateBusinessUserRequest,
  UpdateBusinessUserRequest,
  BusinessUserType
} from '../../../core/models/admin-user-request.model';
import { DuplicateScanResult, UserAiReview } from '../../../core/models/user-ai.model';

type UserFormField =
  | 'username'
  | 'email'
  | 'temporaryPassword'
  | 'fullName'
  | 'phone'
  | 'address'
  | 'region'
  | 'organizationName'
  | 'activityDescription'
  | 'userType';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  private static readonly EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly PHONE_PATTERN = /^[0-9+()\-\s]{3,30}$/;
  private static readonly STRONG_PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,100}$/;

  isEditMode = false;
  userId: number | null = null;
  loading = false;
  submitted = false;
  message = '';
  messageType = '';
  fieldErrors: Partial<Record<UserFormField, string>> = {};
  aiReview: UserAiReview | null = null;
  duplicateScan: DuplicateScanResult | null = null;
  aiLoading = false;
  duplicatesLoading = false;

  originalUser: UserProfile | null = null;

  createRequest: CreateBusinessUserRequest = {
    username: '',
    email: '',
    temporaryPassword: '',
    fullName: '',
    phone: '',
    address: '',
    region: '',
    organizationName: '',
    activityDescription: '',
    userType: 'AGRICULTOR'
  };

  updateRequest: UpdateBusinessUserRequest = {
    fullName: '',
    phone: '',
    address: '',
    region: '',
    organizationName: '',
    activityDescription: '',
    userType: 'AGRICULTOR'
  };

  readonly userTypes: BusinessUserType[] = [
    'INVESTOR',
    'AGRICULTOR',
    'RECYCLING_POINT'
  ];

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userId = +id;
      this.loadUser(this.userId);
    }
  }

  loadUser(id: number): void {
    this.loading = true;
    this.userService.getById(id).subscribe({
      next: (data) => {
        this.originalUser = data;
        this.updateRequest = {
          fullName: data.fullName || '',
          phone: data.phone || '',
          address: data.address || '',
          region: data.region || '',
          organizationName: data.organizationName || '',
          activityDescription: data.activityDescription || '',
          userType: (data.userType as BusinessUserType) || 'AGRICULTOR'
        };
        this.loading = false;
        this.loadAiInsights(id);
      },
      error: (err) => {
        console.error('Error loading user', err);
        this.loading = false;
        this.showMessage('Error loading user', 'error');
      }
    });
  }

  isCreateMode(): boolean {
    return !this.isEditMode;
  }

  isUsernameInvalid(): boolean {
    return this.hasFieldError('username');
  }

  isEmailInvalid(): boolean {
    return this.hasFieldError('email');
  }

  isTemporaryPasswordInvalid(): boolean {
    return this.hasFieldError('temporaryPassword');
  }

  isFullNameInvalid(): boolean {
    return this.hasFieldError('fullName');
  }

  isPhoneInvalid(): boolean {
    return this.hasFieldError('phone');
  }

  isAddressInvalid(): boolean {
    return this.hasFieldError('address');
  }

  isRegionInvalid(): boolean {
    return this.hasFieldError('region');
  }

  isActivityDescriptionInvalid(): boolean {
    return this.hasFieldError('activityDescription');
  }

  isFormValid(): boolean {
    return Object.keys(this.buildClientValidationErrors()).length === 0;
  }

  save(): void {
    this.submitted = true;
    this.fieldErrors = {};
    this.message = '';
    this.messageType = '';

    const clientErrors = this.buildClientValidationErrors();
    if (Object.keys(clientErrors).length > 0) {
      this.fieldErrors = clientErrors;
      return;
    }

    if (this.isEditMode && this.userId) {
      const payload: UpdateBusinessUserRequest = {
        fullName: this.updateRequest.fullName.trim(),
        phone: this.updateRequest.phone.trim(),
        address: this.updateRequest.address.trim(),
        region: this.updateRequest.region.trim(),
        organizationName: this.updateRequest.organizationName.trim(),
        activityDescription: this.updateRequest.activityDescription.trim(),
        userType: this.updateRequest.userType
      };

      this.userService.update(this.userId, payload).subscribe({
        next: () => {
          this.fieldErrors = {};
          this.showMessage('User updated successfully', 'success');
          this.loadAiInsights(this.userId!);
          setTimeout(() => this.router.navigate(['/seller/users']), 1500);
        },
        error: (err) => {
          console.error('Error updating user', err);
          if (!this.applyServerErrors(err)) {
            this.showMessage(this.extractErrorMessage(err, 'Error updating user'), 'error');
          }
        }
      });
    } else {
      const payload: CreateBusinessUserRequest = {
        username: this.createRequest.username.trim(),
        email: this.createRequest.email.trim(),
        temporaryPassword: this.createRequest.temporaryPassword,
        fullName: this.createRequest.fullName.trim(),
        phone: this.createRequest.phone.trim(),
        address: this.createRequest.address.trim(),
        region: this.createRequest.region.trim(),
        organizationName: this.createRequest.organizationName.trim(),
        activityDescription: this.createRequest.activityDescription.trim(),
        userType: this.createRequest.userType
      };

      this.userService.create(payload).subscribe({
        next: () => {
          this.fieldErrors = {};
          this.showMessage('User created successfully', 'success');
          setTimeout(() => this.router.navigate(['/seller/users']), 1500);
        },
        error: (err) => {
          console.error('Error creating user', err);
          if (!this.applyServerErrors(err)) {
            this.showMessage(this.extractErrorMessage(err, 'Error creating user'), 'error');
          }
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/seller/users']);
  }

  logout(): void {
    this.keycloakService.logout();
  }

  showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 4000);
  }

  hasFieldError(field: UserFormField): boolean {
    return !!this.fieldErrors[field];
  }

  getFieldError(field: UserFormField): string {
    return this.fieldErrors[field] || '';
  }

  clearFieldError(field: UserFormField): void {
    if (!this.fieldErrors[field]) {
      return;
    }

    delete this.fieldErrors[field];
  }

  private getFullNameValue(): string {
    return this.isEditMode ? this.updateRequest.fullName : this.createRequest.fullName;
  }

  private getPhoneValue(): string {
    return this.isEditMode ? this.updateRequest.phone : this.createRequest.phone;
  }

  private getAddressValue(): string {
    return this.isEditMode ? this.updateRequest.address : this.createRequest.address;
  }

  private getRegionValue(): string {
    return this.isEditMode ? this.updateRequest.region : this.createRequest.region;
  }

  private getOrganizationNameValue(): string {
    return this.isEditMode ? this.updateRequest.organizationName : this.createRequest.organizationName;
  }

  private getActivityDescriptionValue(): string {
    return this.isEditMode ? this.updateRequest.activityDescription : this.createRequest.activityDescription;
  }

  private buildClientValidationErrors(): Partial<Record<UserFormField, string>> {
    const errors: Partial<Record<UserFormField, string>> = {};

    if (!this.isEditMode) {
      const username = this.createRequest.username.trim();
      const email = this.createRequest.email.trim();
      const password = this.createRequest.temporaryPassword;

      if (!username) {
        errors.username = 'Username is required';
      } else if (username.length < 3 || username.length > 50) {
        errors.username = 'Username must be between 3 and 50 characters';
      }

      if (!email) {
        errors.email = 'Email is required';
      } else if (email.length > 120) {
        errors.email = 'Email must not exceed 120 characters';
      } else if (!UserFormComponent.EMAIL_PATTERN.test(email)) {
        errors.email = 'Email format is invalid';
      }

      if (!password.trim()) {
        errors.temporaryPassword = 'Temporary password is required';
      } else if (password.length < 8 || password.length > 100) {
        errors.temporaryPassword = 'Temporary password must be between 8 and 100 characters';
      } else if (password !== password.trim()) {
        errors.temporaryPassword = 'Temporary password must not start or end with spaces';
      } else if (!UserFormComponent.STRONG_PASSWORD_PATTERN.test(password)) {
        errors.temporaryPassword = 'Temporary password must include uppercase, lowercase, number, and special character';
      } else if (password.toLowerCase() === username.toLowerCase() || password.toLowerCase() === email.toLowerCase()) {
        errors.temporaryPassword = 'Temporary password must not match the username or email';
      }
    }

    const fullName = this.getFullNameValue().trim();
    const phone = this.getPhoneValue().trim();
    const address = this.getAddressValue().trim();
    const region = this.getRegionValue().trim();
    const organizationName = this.getOrganizationNameValue().trim();
    const activityDescription = this.getActivityDescriptionValue().trim();
    const userType = this.isEditMode ? this.updateRequest.userType : this.createRequest.userType;

    if (!fullName) {
      errors.fullName = 'Full name is required';
    } else if (fullName.length < 3 || fullName.length > 120) {
      errors.fullName = 'Full name must be between 3 and 120 characters';
    }

    if (!phone) {
      errors.phone = 'Phone is required';
    } else if (phone.length < 3 || phone.length > 30) {
      errors.phone = 'Phone must be between 3 and 30 characters';
    } else if (!UserFormComponent.PHONE_PATTERN.test(phone)) {
      errors.phone = 'Phone contains invalid characters';
    }

    if (!address) {
      errors.address = 'Address is required';
    } else if (address.length < 5 || address.length > 200) {
      errors.address = 'Address must be between 5 and 200 characters';
    }

    if (!region) {
      errors.region = 'Region is required';
    } else if (region.length < 2 || region.length > 80) {
      errors.region = 'Region must be between 2 and 80 characters';
    }

    if (organizationName && organizationName.length > 160) {
      errors.organizationName = 'Organization name must not exceed 160 characters';
    }

    if (!activityDescription) {
      errors.activityDescription = 'Activity description is required';
    } else if (activityDescription.length < 150 || activityDescription.length > 500) {
      errors.activityDescription = 'Activity description must be between 150 and 500 characters';
    }

    if (!userType) {
      errors.userType = 'User type is required';
    }

    return errors;
  }

  private applyServerErrors(err: any): boolean {
    const fieldErrors: Partial<Record<UserFormField, string>> = {};
    const backendFields = err?.error?.fields;

    if (backendFields && typeof backendFields === 'object') {
      Object.entries(backendFields).forEach(([field, message]) => {
        if (typeof message === 'string' && message.trim()) {
          fieldErrors[field as UserFormField] = message;
        }
      });
    }

    const topLevelError = typeof err?.error?.error === 'string' ? err.error.error : '';
    const normalizedError = topLevelError.toLowerCase();
    if (normalizedError.includes('username') && normalizedError.includes('exist')) {
      fieldErrors.username ||= topLevelError;
    }
    if (normalizedError.includes('email') && normalizedError.includes('exist')) {
      fieldErrors.email ||= topLevelError;
    }

    if (Object.keys(fieldErrors).length > 0) {
      this.fieldErrors = fieldErrors;
      return true;
    }

    return false;
  }

  private extractErrorMessage(err: any, fallback: string): string {
    if (err?.error?.error) {
      return err.error.error;
    }

    return fallback;
  }

  loadAiInsights(id: number): void {
    this.aiReview = null;
    this.duplicateScan = null;
    this.aiLoading = true;
    this.duplicatesLoading = true;

    this.userService.getAiReview(id).subscribe({
      next: (review) => {
        this.aiReview = review;
        this.aiLoading = false;
      },
      error: () => {
        this.aiReview = null;
        this.aiLoading = false;
      }
    });

    this.userService.getDuplicateCandidates(id).subscribe({
      next: (scan) => {
        this.duplicateScan = scan;
        this.duplicatesLoading = false;
      },
      error: () => {
        this.duplicateScan = null;
        this.duplicatesLoading = false;
      }
    });
  }

  rerunAiReview(): void {
    if (!this.userId) {
      return;
    }

    const clientErrors = this.buildClientValidationErrors();
    if (Object.keys(clientErrors).length > 0) {
      this.fieldErrors = clientErrors;
      this.showMessage('Fix validation errors before reviewing the current form.', 'error');
      return;
    }

    this.aiLoading = true;
    this.duplicatesLoading = true;
    this.message = '';
    this.messageType = '';

    const payload: UpdateBusinessUserRequest = {
      fullName: this.updateRequest.fullName.trim(),
      phone: this.updateRequest.phone.trim(),
      address: this.updateRequest.address.trim(),
      region: this.updateRequest.region.trim(),
      organizationName: this.updateRequest.organizationName.trim(),
      activityDescription: this.updateRequest.activityDescription.trim(),
      userType: this.updateRequest.userType
    };

    this.userService.previewAiReview(this.userId, payload).subscribe({
      next: (preview) => {
        this.aiReview = preview.review;
        this.duplicateScan = preview.duplicateScan;
        this.aiLoading = false;
        this.duplicatesLoading = false;
      },
      error: (err) => {
        this.aiLoading = false;
        this.duplicatesLoading = false;
        this.showMessage(this.extractErrorMessage(err, 'Error reviewing the current form.'), 'error');
      }
    });
  }
}
