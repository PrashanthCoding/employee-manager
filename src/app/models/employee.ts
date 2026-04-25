export interface Employee {
  id: string;
  name: string;
  email: string;
  dob: string;
  gender: 'Male' | 'Female';
  phone: string;
  position: string;
  department: string;
  salary: number;
  joinDate: string;
  photo: string;
  quote: string;
  status: 'Active' | 'Inactive' | 'Pending'; // ✅ FIXED
}
