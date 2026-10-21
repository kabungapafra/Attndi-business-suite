/**
 * EmployeeProfilePage.jsx
 * Single employee profile view, resolved dynamically from the :employeeId route parameter.
 */
import { useNavigate, useParams } from 'react-router-dom'
import EmployeeProfile from '@components/EmployeeProfile'
import { employeeService } from '@services/employeeService'

export default function EmployeeProfilePage() {
  const { employeeId } = useParams()
  const navigate = useNavigate()
  const employee = employeeService.getById(employeeId)

  return (
    <EmployeeProfile
      employee={employee}
      employeeId={employeeId}
      onBack={() => navigate('/employees')}
    />
  )
}
