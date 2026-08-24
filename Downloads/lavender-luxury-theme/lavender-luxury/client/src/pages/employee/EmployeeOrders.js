import AdminOrders from '../admin/AdminOrders';
import EmployeeLayout from './EmployeeLayout';

export default function EmployeeOrders() {
  return <AdminOrders Layout={EmployeeLayout} readOnly canDelete />;
}