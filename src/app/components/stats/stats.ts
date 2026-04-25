import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue"><i class="fas fa-users"></i></div>
        <div>
          <div class="stat-value">{{ empService.totalCount() }}</div>
          <div class="stat-label">Total Employees</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple"><i class="fas fa-mars"></i></div>
        <div>
          <div class="stat-value">{{ empService.maleCount() }}</div>
          <div class="stat-label">Male Employees</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon teal"><i class="fas fa-venus"></i></div>
        <div>
          <div class="stat-value">{{ empService.femaleCount() }}</div>
          <div class="stat-label">Female Employees</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon gold"><i class="fas fa-sterling-sign"></i></div>
        <div>
          <div class="stat-value">
            {{ empService.totalSalary() | currency: 'GBP' : 'symbol' : '0.0-0' }}
          </div>
          <div class="stat-label">Total Salary</div>
        </div>
      </div>
    </div>
  `,
})
export class Stats {
  empService = inject(EmployeeService);
}
