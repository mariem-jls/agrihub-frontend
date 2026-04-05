import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellerLayoutComponent } from '../seller/layout/seller-layout.component';
import { ListEventComponent } from './pages/list-event/list-event.component';
import { EventAddComponent } from './pages/event-add/event-add.component';
import { EventDetailComponent } from './pages/event-detail/event-detail.component';
import { ParticipationListComponent } from './pages/participation-list/participation-list.component';
import { EventArchiveComponent } from './pages/event-archive/event-archive.component';

const routes: Routes = [{
  path: '',
  component: SellerLayoutComponent,  // ← layout de ta collègue
  children: [
    { path: '', component: ListEventComponent },
    { path: 'add', component: EventAddComponent },
    { path: 'edit/:id', component: EventAddComponent },
    { path: 'detail/:id', component: EventDetailComponent },
    { path: 'participations', component: ParticipationListComponent },
    { path: 'archives', component: EventArchiveComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule { }
