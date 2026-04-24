import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { UserProfile } from '../../../core/models/user-profile.model';
import { KeycloakService } from '../../../core/services/keycloak.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: UserProfile[] = [];
  loading = false;
  message = '';
  messageType = '';
  aiFilter: 'ALL' | 'NEEDS_REVIEW' | 'HIGH_RISK' | 'POSSIBLE_DUPLICATES' = 'ALL';

  constructor(
    private userService: UserService,
    private router: Router,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.showMessage(this.extractErrorMessage(err, 'Error loading users.'), 'error');
      }
    });
  }

  goToAdd(): void {
    this.router.navigate(['/seller/users/add']);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/seller/users/edit', id]);
  }

  lockUser(user: UserProfile): void {
    if (!user.id) {
      return;
    }

    if (this.isOrphaned(user)) {
      this.showMessage('This user exists locally but is missing from Keycloak. Delete and recreate the account.', 'error');
      return;
    }

    if (!confirm(`Lock account for ${user.username}?`)) {
      return;
    }

    this.userService.lock(user.id).subscribe({
      next: (updated) => {
        this.replaceUser(updated);
        this.showMessage('Account locked successfully.', 'success');
      },
      error: (err) => {
        console.error(err);
        this.showMessage(this.extractErrorMessage(err, 'Error locking account.'), 'error');
      }
    });
  }

  unlockUser(user: UserProfile): void {
    if (!user.id) {
      return;
    }

    if (this.isOrphaned(user)) {
      this.showMessage('This user exists locally but is missing from Keycloak. Delete and recreate the account.', 'error');
      return;
    }

    if (!confirm(`Unlock account for ${user.username}?`)) {
      return;
    }

    this.userService.unlock(user.id).subscribe({
      next: (updated) => {
        this.replaceUser(updated);
        this.showMessage('Account unlocked successfully.', 'success');
      },
      error: (err) => {
        console.error(err);
        this.showMessage(this.extractErrorMessage(err, 'Error unlocking account.'), 'error');
      }
    });
  }

  logout(): void {
    this.keycloakService.logout();
  }

  showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }

  isOrphaned(user: UserProfile): boolean {
    return !!user.orphanedInKeycloak;
  }

  getUserTypeClass(type?: string): string {
    return type ? 'badge-active' : 'badge-inactive';
  }

  getAccountStatusClass(user: UserProfile): string {
    if (this.isOrphaned(user)) {
      return 'badge-orphan';
    }

    return user.accountEnabled ? 'badge-active' : 'badge-inactive';
  }

  getAccountStatusLabel(user: UserProfile): string {
    if (this.isOrphaned(user)) {
      return 'Missing in Keycloak';
    }

    return user.accountEnabled ? 'Active' : 'Locked';
  }

  get filteredUsers(): UserProfile[] {
    return this.users.filter((user) => {
      if (this.aiFilter === 'ALL') {
        return true;
      }
      if (this.aiFilter === 'NEEDS_REVIEW') {
        return user.aiRecommendation === 'NEEDS_REVIEW';
      }
      if (this.aiFilter === 'HIGH_RISK') {
        return user.aiRecommendation === 'HIGH_RISK';
      }
      return (user.duplicateWarningCount ?? 0) > 0;
    });
  }

  getAiBadgeClass(user: UserProfile): string {
    if (user.aiRecommendation === 'HIGH_RISK') {
      return 'badge-orphan';
    }
    if (user.aiRecommendation === 'NEEDS_REVIEW') {
      return 'badge-pending';
    }
    if (user.aiRecommendation === 'HEALTHY') {
      return 'badge-active';
    }
    return 'badge-inactive';
  }

  private replaceUser(updated: UserProfile): void {
    this.users = this.users.map((user) => user.id === updated.id ? updated : user);
  }

  private extractErrorMessage(err: any, fallback: string): string {
    if (typeof err?.error?.error === 'string' && err.error.error.trim()) {
      return err.error.error;
    }

    return fallback;
  }
}
