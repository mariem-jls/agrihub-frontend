import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';

import { UserFormComponent } from './user-form.component';
import { UserService } from '../../../core/services/user.service';
import { KeycloakService } from '../../../core/services/keycloak.service';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let userService: jasmine.SpyObj<UserService>;

  const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
  const keycloakSpy = jasmine.createSpyObj<KeycloakService>('KeycloakService', ['logout']);

  beforeEach(async () => {
    userService = jasmine.createSpyObj<UserService>('UserService', ['getById', 'create', 'update']);
    userService.create.and.returnValue(of({} as any));
    userService.update.and.returnValue(of({} as any));
    userService.getById.and.returnValue(of({} as any));

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [UserFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: Router, useValue: routerSpy },
        { provide: KeycloakService, useValue: keycloakSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({})
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows field-level client validation errors after submit', () => {
    component.save();

    expect(component.fieldErrors['username']).toBe('Username is required');
    expect(component.fieldErrors['email']).toBe('Email is required');
    expect(component.fieldErrors['temporaryPassword']).toBe('Temporary password is required');
    expect(component.fieldErrors['fullName']).toBe('Full name is required');
    expect(component.fieldErrors['phone']).toBe('Phone is required');
    expect(component.fieldErrors['address']).toBe('Address is required');
    expect(userService.create).not.toHaveBeenCalled();
  });

  it('shows password policy validation errors for weak create input', () => {
    component.createRequest = {
      ...validCreateRequest(),
      temporaryPassword: 'weakpass1'
    };

    component.save();

    expect(component.fieldErrors['temporaryPassword'])
      .toBe('Temporary password must include uppercase, lowercase, number, and special character');
    expect(userService.create).not.toHaveBeenCalled();
  });

  it('shows password match validation when password equals username', () => {
    component.createRequest = {
      ...validCreateRequest(),
      temporaryPassword: 'Nourmk'
    };

    component.save();

    expect(component.fieldErrors['temporaryPassword'])
      .toBe('Temporary password must be between 8 and 100 characters');
    expect(userService.create).not.toHaveBeenCalled();
  });

  it('shows password match validation when password equals email', () => {
    component.createRequest = {
      ...validCreateRequest(),
      temporaryPassword: 'nour.mokhtar@esprit.tn'
    };

    component.save();

    expect(component.fieldErrors['temporaryPassword'])
      .toBe('Temporary password must include uppercase, lowercase, number, and special character');
    expect(userService.create).not.toHaveBeenCalled();
  });

  it('blocks passwords that match username or email even if they are strong', () => {
    component.createRequest = {
      ...validCreateRequest(),
      username: 'Ahmedmohsen7@',
      temporaryPassword: 'Ahmedmohsen7@'
    };

    component.save();

    expect(component.fieldErrors['temporaryPassword'])
      .toBe('Temporary password must not match the username or email');
    expect(userService.create).not.toHaveBeenCalled();
  });

  it('maps backend field validation errors under the corresponding inputs', () => {
    component.createRequest = validCreateRequest();
    userService.create.and.returnValue(throwError(() => ({
      error: {
        fields: {
          temporaryPassword: 'Temporary password must not match the username or email',
          phone: 'Phone contains invalid characters'
        }
      }
    })));

    component.save();

    expect(component.fieldErrors['temporaryPassword']).toBe('Temporary password must not match the username or email');
    expect(component.fieldErrors['phone']).toBe('Phone contains invalid characters');
    expect(component.message).toBe('');
  });

  it('maps duplicate username/email business errors to the matching field', () => {
    component.createRequest = validCreateRequest();
    userService.create.and.returnValue(throwError(() => ({
      error: {
        error: 'Username already exists in Keycloak'
      }
    })));

    component.save();

    expect(component.fieldErrors['username']).toBe('Username already exists in Keycloak');
    expect(component.message).toBe('');
  });

  it('keeps the top alert for generic backend failures', () => {
    component.createRequest = validCreateRequest();
    userService.create.and.returnValue(throwError(() => ({
      error: {
        error: 'Failed to create business user. The user was not saved.'
      }
    })));

    component.save();

    expect(component.message).toContain('not saved');
    expect(component.fieldErrors['username']).toBeUndefined();
  });

  function validCreateRequest() {
    return {
      username: 'nourmk',
      email: 'nour.mokhtar@esprit.tn',
      temporaryPassword: 'Ahmedmohsen7@',
      fullName: 'Mohamed An',
      phone: '29023611',
      address: 'Ras Jbal',
      userType: 'AGRICULTOR' as const
    };
  }
});
