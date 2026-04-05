import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EventRoutingModule } from './event-routing.module';
import { EventComponent } from './event.component';
import { ListEventComponent } from './pages/list-event/list-event.component';
import { EventCardComponent } from './pages/event-card/event-card.component';
import { EventAddComponent } from './pages/event-add/event-add.component';
import { EventDetailComponent } from './pages/event-detail/event-detail.component';
import { ParticipationListComponent } from './pages/participation-list/participation-list.component';
import { EventArchiveComponent } from './pages/event-archive/event-archive.component';
import { SellerModule } from '../seller/seller.module';

@NgModule({
  declarations: [
    EventComponent,
    ListEventComponent,
    EventCardComponent,
    EventAddComponent,
    EventDetailComponent,
    ParticipationListComponent,
    EventArchiveComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    EventRoutingModule,
    SellerModule
  ]
})
export class EventModule { }
