import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Modal } from '../../services/modal.service';
import { Toast } from '../../services/toast.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div id="empContainer">
      @if (empService.pagedEmployees().length === 0) {
        <div class="empty-state">
          <i class="fas fa-user-slash"></i>
          <p>No employees found</p>
        </div>
      } @else if (empService.viewMode() === 'table') {
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Gender</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (emp of empService.pagedEmployees(); track emp.id) {
                <tr>
                  <td>
                    <img
                      [src]="emp.photo || fallbackAvatar(emp.name)"
                      class="emp-avatar"
                      (error)="$event.target.src = fallbackAvatar(emp.name)"
                    />
                  </td>
                  <td>
                    <div class="emp-name">{{ emp.name }}</div>
                    <div class="emp-email">{{ emp.email }}</div>
                  </td>
                  <td>{{ emp.position }}</td>
                  <td>{{ emp.department || 'N/A' }}</td>
                  <td>
                    <span
                      class="badge"
                      [class.badge-blue]="emp.gender === 'Male'"
                      [class.badge-rose]="emp.gender === 'Female'"
                      >{{ emp.gender }}</span
                    >
                  </td>
                  <td style="font-weight:600">
                    {{ emp.salary | currency: 'GBP' : 'symbol' : '0.0-0' }}
                  </td>
                  <td>
                    <span class="badge" [ngClass]="statusClass(emp.status)"
                      ><span class="status-dot" [ngClass]="statusDotClass(emp.status)"></span
                      >{{ emp.status }}</span
                    >
                  </td>
                  <td>
                    <div style="display:flex;gap:6px">
                      <button class="btn btn-icon btn-sky btn-sm" (click)="openView(emp.id)">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn btn-icon btn-warning btn-sm" (click)="openEdit(emp.id)">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-icon btn-danger btn-sm" (click)="toggleStatus(emp.id)">
                        <i
                          class="fas"
                          [class.fa-toggle-on]="emp.status === 'Inactive'"
                          [class.fa-toggle-off]="emp.status !== 'Inactive'"
                        ></i>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="grid-view" style="padding:16px">
          @for (emp of empService.pagedEmployees(); track emp.id) {
            <div class="emp-card">
              <div class="emp-card-top"></div>
              <img
                [src]="emp.photo || fallbackAvatar(emp.name)"
                class="emp-card-avatar"
                (error)="$event.target.src = fallbackAvatar(emp.name)"
              />
              <div class="emp-card-body">
                <div class="emp-card-name">{{ emp.name }}</div>
                <div class="emp-card-pos">{{ emp.position }}</div>
                <div class="emp-card-meta">
                  <span
                    class="badge"
                    [class.badge-blue]="emp.gender === 'Male'"
                    [class.badge-rose]="emp.gender === 'Female'"
                    >{{ emp.gender }}</span
                  >
                  <span class="badge" [ngClass]="statusClass(emp.status)"
                    ><span class="status-dot" [ngClass]="statusDotClass(emp.status)"></span
                    >{{ emp.status }}</span
                  >
                </div>
                <div class="emp-card-quote">"{{ emp.quote }}"</div>
              </div>
              <div class="emp-card-footer">
                <div class="emp-card-salary">
                  {{ emp.salary | currency: 'GBP' : 'symbol' : '0.0-0' }}
                </div>
                <div style="display:flex;gap:6px">
                  <button class="btn btn-icon btn-sky btn-sm" (click)="openView(emp.id)">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn btn-icon btn-warning btn-sm" (click)="openEdit(emp.id)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-icon btn-danger btn-sm" (click)="toggleStatus(emp.id)">
                    <i
                      class="fas"
                      [class.fa-toggle-on]="emp.status === 'Inactive'"
                      [class.fa-toggle-off]="emp.status !== 'Inactive'"
                    ></i>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
    <div class="pagination-bar">
      <div class="page-info">
        <select
          class="ctrl-select"
          [(ngModel)]="empService.pageSize"
          (ngModelChange)="empService.resetPagination()"
        >
          <option [value]="5">5</option>
          <option [value]="10" selected>10</option>
          <option [value]="20">20</option>
          <option [value]="50">50</option>
        </select>
        <span style="color:var(--text2);font-size:0.83rem;">per page</span>
      </div>
      <span style="color:var(--text2);font-size:0.83rem;">
        Showing {{ empService.currentPage() * empService.pageSize() + 1 }}–{{
          Math.min(
            (empService.currentPage() + 1) * empService.pageSize(),
            empService.filteredEmployees().length
          )
        }}
        of {{ empService.filteredEmployees().length }}
      </span>
      <div class="pagination">
        <button
          class="page-btn"
          (click)="empService.goToPage(0)"
          [disabled]="empService.currentPage() === 0"
        >
          <i class="fas fa-angle-double-left"></i>
        </button>
        <button
          class="page-btn"
          (click)="empService.goToPage(empService.currentPage() - 1)"
          [disabled]="empService.currentPage() === 0"
        >
          <i class="fas fa-angle-left"></i>
        </button>
        @for (p of pageNumbers(); track p) {
          <button
            class="page-btn"
            [class.active]="p === empService.currentPage()"
            (click)="empService.goToPage(p)"
          >
            {{ p + 1 }}
          </button>
        }
        <button
          class="page-btn"
          (click)="empService.goToPage(empService.currentPage() + 1)"
          [disabled]="empService.currentPage() + 1 >= empService.totalPages()"
        >
          <i class="fas fa-angle-right"></i>
        </button>
        <button
          class="page-btn"
          (click)="empService.goToPage(empService.totalPages() - 1)"
          [disabled]="empService.currentPage() + 1 >= empService.totalPages()"
        >
          <i class="fas fa-angle-double-right"></i>
        </button>
      </div>
    </div>
  `,
})
export class EmployeeListComponent {
  empService = inject(EmployeeService);
  modalService = inject(Modal);
  toast = inject(Toast);
  Math = Math;

  fallbackAvatar(name: string) {
    return `https://ui-avatars.com/api/?background=5b6af0&color=fff&name=${encodeURIComponent(name)}&size=100`;
  }

  statusClass(status: string) {
    return {
      'badge-teal': status === 'Active',
      'badge-rose': status === 'Inactive',
      'badge-gold': status === 'Pending',
    };
  }
  statusDotClass(status: string) {
    return {
      'dot-active': status === 'Active',
      'dot-inactive': status === 'Inactive',
      'dot-pending': status === 'Pending',
    };
  }

  pageNumbers() {
    const total = this.empService.totalPages();
    let start = Math.max(0, this.empService.currentPage() - 2);
    let end = Math.min(total - 1, start + 4);
    if (end - start < 4) start = Math.max(0, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  openView(id: string) {
    // We'll pass data via service; implement view modal later
    this.modalService.open('viewModal');
    // The view component will read the employee id from a service variable
    // For simplicity, store selected employee id in EmployeeService
    this.empService.selectedId.set(id); // ✅ proper way
  }

  openEdit(id: string) {
    this.empService.selectedId.set(id); // ✅ proper way
    this.modalService.open('editModal');
  }

  toggleStatus(id: string) {
    if (confirm('Toggle status?')) {
      this.empService.toggleStatus(id);
      this.toast.show('Status updated', 'info');
    }
  }
}
