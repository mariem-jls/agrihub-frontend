import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { UserListComponent } from './user-list.component';
import { UserService } from '../../../core/services/user.service';
import { KeycloakService } from '../../../core/services/keycloak.service';
import { UserProfile } from '../../../core/models/user-profile.model';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: jasmine.SpyObj<UserService>;

  const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
  const keycloakSpy = jasmine.createSpyObj<KeycloakService>('KeycloakService', ['logout']);

  beforeEach(async () => {
    userService = jasmine.createSpyObj<UserService>('UserService', ['getAll', 'lock', 'unlock']);
    userService.getAll.and.returnValue(of([]));
    userService.lock.and.returnValue(of(activeUser()));
    userService.unlock.and.returnValue(of(activeUser()));

    await TestBed.configureTestingModule({
      declarations: [UserListComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: Router, useValue: routerSpy },
        { provide: KeycloakService, useValue: keycloakSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows orphaned users with a dedicated account label', () => {
    const orphan = orphanedUser();

    expect(component.isOrphaned(orphan)).toBeTrue();
    expect(component.getAccountStatusLabel(orphan)).toBe('Missing in Keycloak');
    expect(component.getAccountStatusClass(orphan)).toBe('badge-orphan');
  });

  it('does not call unlock for orphaned users and shows a clear message', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    component.unlockUser(orphanedUser());

    expect(userService.unlock).not.toHaveBeenCalled();
    expect(component.message).toContain('missing from Keycloak');
  });

  it('surfaces backend orphan errors instead of a generic unlock message', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.users = [lockedUser()];
    userService.unlock.and.returnValue(throwError(() => ({
      error: {
        error: 'This user exists locally but is missing from Keycloak. Delete and recreate the account.'
      }
    })));

    component.unlockUser(lockedUser());

    expect(component.message).toContain('missing from Keycloak');
  });

  function activeUser(): UserProfile {
    return {
      id: 1,
      username: 'nour',
      email: 'nour@example.com',
      fullName: 'Nour',
      phone: '12345678',
      address: 'Ras Jbal',
      onboardingCompleted: true,
      accountEnabled: true,
      orphanedInKeycloak: false,
      userType: 'AGRICULTOR'
    };
  }

  function lockedUser(): UserProfile {
    return {
      ...activeUser(),
      accountEnabled: false
    };
  }

  function orphanedUser(): UserProfile {
    return {
      ...lockedUser(),
      orphanedInKeycloak: true
    };
  }
});
