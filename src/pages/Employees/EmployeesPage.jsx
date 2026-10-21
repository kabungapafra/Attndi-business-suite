/**
 * EmployeesPage.jsx
 * Employee directory – lists everyone in the company with search, filtering,
 * status management, pagination, import/export, and edit capabilities.
 */
import { useNavigate } from 'react-router-dom'
import EmployeesList from '@components/EmployeesList'

export default function EmployeesPage() {
  const navigate = useNavigate()

  return (
    <EmployeesList
      onAddEmployee={() => navigate('/employees/new')}
      onSelectEmployee={(emp) => navigate(`/employees/${emp.id}`)}
    />
  )
}
