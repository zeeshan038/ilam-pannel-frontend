import StaffIcon from '@/components/icons/staff'
import { FeeUnfilled } from '@/components/icons/fees'
import { StudentIcon } from '@/components/icons/student'
import { UserOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { ExpenseManagementIcon, Expenses } from '@/components/icons/expense'

const baseSidebarItems = [
  {
    key: 'dashboard',
    icon: <UserOutlined />,
    label: 'Dashboard',
  },
  {
    key: 'students',
    icon: <StudentIcon width={16} height={16} />,
    label: 'Student Management',
    children: [
      {
        key: 'students/view',
        icon: <StudentIcon width={16} height={16} />,
        label: 'View Students',
      },
      {
        key: 'students/add',
        icon: <StudentIcon width={16} height={16} />,
        label: 'Add Student',
      },
    ],
  },
  {
    key: 'staff',
    icon: <StaffIcon width={16} height={16} />,
    label: 'Staff Management',
    children: [
      {
        key: 'staff/manage-staff',
        icon: <StaffIcon width={16} height={16} />,
        label: 'Manage Staff',
      },
    ],
  },
  {
    key: 'attendance',
    icon: <StaffIcon width={16} height={16} />,
    label: 'Attendance',
    children: [
      {
        key: 'attendance/employee',
        icon: <StaffIcon width={16} height={16} />,
        label: 'Employee Attendance',
      },
      {
        key: 'attendance/employee-report',
        icon: <StaffIcon width={16} height={16} />,
        label: 'Employee Report',
      },
    ],
  },
  {
    key: 'financial',
    icon: <Expenses width={20} height={20} />,
    label: 'Financial Management',
    children: [
      {
        key: 'financial/fee-management',
        icon: <FeeUnfilled width={16} height={16} />,
        label: 'Fee Management',
      },
      {
        key: 'financial/salary-management',
        icon: <StaffIcon width={16} height={16} />,
        label: 'Salary Management',
      },
      {
        key: 'financial/expense-management',
        icon: <ExpenseManagementIcon width={16} height={16} />,
        label: 'Expense Management',
      },
    ],
  },
]

const buildItems = (collapsed?: boolean) =>
  baseSidebarItems.map(item => ({
    ...item,
    // hide text when collapsed
    label: collapsed ? null : <span style={{ marginLeft: 8 }}>{item.label}</span>,
    children: item.children
      ? item.children.map(child => ({
        ...child,
        label: collapsed ? null : (
          <span style={{ marginLeft: 8 }}>{child.label}</span>
        ),
      }))
      : undefined,
  }))

const SidebarMenu = ({ collapsed }: { collapsed?: boolean }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const selectedKey = location.pathname.startsWith('/admin/')
    ? location.pathname.replace('/admin/', '') || 'dashboard'
    : 'dashboard'

  return (
    <Menu
      theme="light"
      mode="inline"
      inlineCollapsed={collapsed}
      selectedKeys={[selectedKey]}
      items={buildItems(collapsed)}
      onClick={({ key }) => {
        navigate(`/admin/${key}`)
      }}
    />
  )
}

export default SidebarMenu
