// assets
import { DashboardOutlined } from '@ant-design/icons';
import { MdAddTask } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';
import { BiCategory } from 'react-icons/bi';
import { CiCalendarDate, CiLogout } from 'react-icons/ci';

// icons
const icons = {
  DashboardOutlined,
  FaRegUser,
  MdAddTask,
  BiCategory,
  CiCalendarDate,
  CiLogout
};
let role;
// Get role synchronously from localStorage
role = localStorage.getItem('userRole');
console.log(role);
// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'AddTask',
      title: 'Add Task',
      type: 'item',
      url: '/TaskList',
      icon: icons.MdAddTask,
      breadcrumbs: false
    },
    {
      id: 'ShowRef',
      title: 'References',
      type: 'item',
      url: '/ShowRef',
      icon: icons.FaRegUser,
      breadcrumbs: false
    },
    ...(role !== 'ROLE_USER'
      ? [
          {
            id: 'User',
            title: 'Users',
            type: 'item',
            url: '/ShowUsers',
            icon: icons.FaRegUser,
            breadcrumbs: false
          }
        ]
      : []),
    {
      id: 'Client',
      title: 'Client',
      type: 'item',
      url: '/Client',
      icon: icons.FaRegUser,
      breadcrumbs: false
    },
    {
      id: 'Category',
      title: 'Category',
      type: 'item',
      url: '/Category',
      icon: icons.BiCategory,
      breadcrumbs: false
    },
    {
      id: 'SubCategory',
      title: 'Sub Category',
      type: 'item',
      url: '/SubCategory',
      icon: icons.BiCategory,
      breadcrumbs: false
    },
    {
      id: 'BillGenerate',
      title: 'Ready to Bill Generate',
      type: 'item',
      url: '/BillGenerate',
      icon: icons.BiCategory,
      breadcrumbs: false
    },
    {
      id: 'PaymentPending',
      title: 'Payment Pending',
      type: 'item',
      url: '/PaymentPending',
      icon: icons.BiCategory,
      breadcrumbs: false
    },
    {
      id: 'PaymentCollected',
      title: 'Payment Collected',
      type: 'item',
      url: '/PaymentCollected',
      icon: icons.BiCategory,
      breadcrumbs: false
    },
    {
      id: 'Logout',
      title: 'Logout',
      type: 'item',
      url: '/Logout',
      icon: icons.CiLogout,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
