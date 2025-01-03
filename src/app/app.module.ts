import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, CoreModule, AppRoutingModule],
})
export class AppModule {}
