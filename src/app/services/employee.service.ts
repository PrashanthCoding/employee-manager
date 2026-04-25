import { computed, effect, Injectable, signal } from '@angular/core';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeesSig = signal<Employee[]>([]);
  public searchText = signal('');
  public genderFilter = signal('');
  public deptFilter = signal('');
  public sortKey = signal('name');
  public currentPage = signal(0);
  public pageSize = signal(10);
  public viewMode = signal<'table' | 'grid'>('table');
  public selectedId = signal<string | null>(null);

  public selectedEmployee = computed(() => {
    const id = this.selectedId();
    return this.employeesSig().find((emp) => emp.id === id) || null;
  });

  // Computed: filtered + sorted employees
  public filteredEmployees = computed(() => {
    let list = this.employeesSig();
    const search = this.searchText().toLowerCase();

    if (search) {
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(search) ||
          e.email.toLowerCase().includes(search) ||
          e.position.toLowerCase().includes(search) ||
          e.department.toLowerCase().includes(search),
      );
    }
    if (this.genderFilter()) {
      list = list.filter((e) => e.gender === this.genderFilter());
    }
    if (this.deptFilter()) {
      list = list.filter((e) => e.department === this.deptFilter());
    }

    // Sorting
    const desc = this.sortKey().startsWith('-');
    const key = desc ? this.sortKey().slice(1) : this.sortKey();
    list.sort((a, b) => {
      let va: any = a[key as keyof Employee];
      let vb: any = b[key as keyof Employee];
      if (key === 'salary') {
        va = +va;
        vb = +vb;
      } else if (key === 'dob') {
        va = new Date(va).getTime();
        vb = new Date(vb).getTime();
      } else {
        va = String(va).toLowerCase();
        vb = String(vb).toLowerCase();
      }
      if (va < vb) return desc ? 1 : -1;
      if (va > vb) return desc ? -1 : 1;
      return 0;
    });
    return list;
  });

  // Paginated slice
  public pagedEmployees = computed(() => {
    const start = this.currentPage() * this.pageSize();
    return this.filteredEmployees().slice(start, start + this.pageSize());
  });

  public totalPages = computed(() => Math.ceil(this.filteredEmployees().length / this.pageSize()));

  // Statistics
  public totalCount = computed(() => this.employeesSig().length);
  public maleCount = computed(() => this.employeesSig().filter((e) => e.gender === 'Male').length);
  public femaleCount = computed(
    () => this.employeesSig().filter((e) => e.gender === 'Female').length,
  );
  public totalSalary = computed(() => this.employeesSig().reduce((sum, e) => sum + e.salary, 0));

  constructor() {
    this.loadFromStorage();
    effect(() => this.saveToStorage());
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('emp_v2');
    if (stored) {
      this.employeesSig.set(JSON.parse(stored));
    } else {
      this.seedData();
    }
  }

  private saveToStorage() {
    localStorage.setItem('emp_v2', JSON.stringify(this.employeesSig()));
  }

  private seedData() {
    const employees: Employee[] = [
      // ... same seed data as original (Nunaram, Peter, Nistha, etc.)
      // For brevity, copy the seed array from the original JS.
    ];
    this.employeesSig.set(employees);
  }

  // CRUD methods
  addEmployee(emp: Omit<Employee, 'id'>) {
    const newEmp = { ...emp, id: Math.random().toString(36).slice(2) };
    this.employeesSig.update((list) => [...list, newEmp]);
  }

  updateEmployee(id: string, updated: Partial<Employee>) {
    this.employeesSig.update((list) =>
      list.map((emp) => (emp.id === id ? { ...emp, ...updated } : emp)),
    );
  }

  deleteEmployee(id: string) {
    this.employeesSig.update((list) => list.filter((emp) => emp.id !== id));
  }

  toggleStatus(id: string) {
    this.employeesSig.update((list) =>
      list.map((emp) =>
        emp.id === id ? { ...emp, status: emp.status === 'Active' ? 'Inactive' : 'Active' } : emp,
      ),
    );
  }

  getEmployeeById(id: string) {
    return this.employeesSig().find((emp) => emp.id === id);
  }

  // Navigation helpers
  goToPage(page: number) {
    this.currentPage.set(page);
  }

  resetPagination() {
    this.currentPage.set(0);
  }
}
