import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Modal } from '../../services/modal.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="toolbar">
      <div class="search-wrap">
        <i class="fas fa-search"></i>
        <input
          type="text"
          class="search-input"
          [(ngModel)]="empService.searchText"
          (ngModelChange)="empService.resetPagination()"
          placeholder="Search employees…"
        />
      </div>
      <select
        class="ctrl-select"
        [(ngModel)]="empService.genderFilter"
        (ngModelChange)="empService.resetPagination()"
      >
        <option value="">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <select class="ctrl-select" [(ngModel)]="empService.sortKey">
        <option value="name">Name A–Z</option>
        <option value="-name">Name Z–A</option>
        <option value="salary">Salary Low–High</option>
        <option value="-salary">Salary High–Low</option>
        <option value="dob">DOB Oldest</option>
        <option value="-dob">DOB Youngest</option>
      </select>
      <select
        class="ctrl-select"
        [(ngModel)]="empService.deptFilter"
        (ngModelChange)="empService.resetPagination()"
      >
        <option value="">All Departments</option>
        <option value="IT">IT</option>
        <option value="HR">HR</option>
        <option value="Finance">Finance</option>
        <option value="Marketing">Marketing</option>
        <option value="Operations">Operations</option>
        <option value="Sales">Sales</option>
      </select>
      <div class="view-btns">
        <button
          class="view-btn"
          [class.active]="empService.viewMode() === 'table'"
          (click)="empService.viewMode.set('table')"
        >
          <i class="fas fa-list"></i>
        </button>
        <button
          class="view-btn"
          [class.active]="empService.viewMode() === 'grid'"
          (click)="empService.viewMode.set('grid')"
        >
          <i class="fas fa-th-large"></i>
        </button>
      </div>
      <button class="btn btn-success" (click)="modalService.open('addModal')">
        <i class="fas fa-plus"></i> Add Employee
      </button>
      <button class="btn btn-ghost" (click)="exportAll()">
        <i class="fas fa-file-export"></i> Export
      </button>
    </div>
  `,
})
export class Toolbar {
  empService = inject(EmployeeService);
  modalService = inject(Modal);

  exportAll() {
    const data = JSON.stringify(this.empService['employeesSig'](), null, 2);
    const a = document.createElement('a');
    a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(data);
    a.download = `employees_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  }
}
