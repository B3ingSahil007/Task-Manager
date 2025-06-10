import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import Logout from "../components/pages/Logout";
import TaskList from '../components/pages/TaskList';
import AddTask from 'components/pages/AddTask';
import Client from 'components/pages/Client';
import Category from 'components/pages/Category';
import SubCategory from 'components/pages/SubCategory';
import Calendar from 'components/pages/Calendar';
import ShowReferences from 'components/pages/ShowReferences';
import ShowUsers from 'components/pages/ShowUsers';
import AddReferences from 'components/pages/AddReferences';
import AddUser from 'components/pages/AddUser';
import AddSubCategory from 'components/pages/AddSubCategory';
import AddCategory from 'components/pages/AddCategory';
import AddClient from 'components/pages/AddClient';
import EditForm from 'components/pages/EditForm';
import ShowClientDetails from 'components/pages/ShowClientDetails';
import UpdateTask from 'components/pages/UpdateTask';
import ShowTaskDetails from 'components/pages/TaskDetails';
import BillGenerate from 'components/pages/BillGenerate';
import PaymentPending from 'components/pages/PaymentPending';
import PaymentCollected from 'components/pages/PaymentCollected';
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// render - sample page
// const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: '/TaskList',
      element: <TaskList />
    },
    {
      path: '/AddTask',
      element: <AddTask />
    },
    {
      path: '/EditTask/:id',
      element: <UpdateTask />
    },
    {
      path: '/TaskDetails/:id',
      element: <ShowTaskDetails />
    },
    {
      path: '/BillGenerate',
      element: <BillGenerate />
    },
    {
      path: '/PaymentPending',
      element: <PaymentPending />
    },
    {
      path: '/PaymentCollected',
      element: <PaymentCollected />
    },
    {
      path: '/EditTask/:id',
      element: <UpdateTask />
    },
    {
      path: '/Client',
      element: <Client />
    },
    {
      path: '/editClient/:id',
      element: <AddClient />
    },
    {
      path: '/showClientDetails/:id',
      element: <ShowClientDetails />
    },
    {
      path: '/AddClient',
      element: <AddClient />
    },
    {
      path: '/EditForm/:id',
      element: <EditForm />
    },
    {
      path: '/ShowRef',
      element: <ShowReferences />
    },
    {
      path: '/AddRef',
      element: <AddReferences />
    },
    {
      path: '/AddRef/:id',
      element: <AddReferences />
    },
    {
      path: '/ShowUsers',
      element: <ShowUsers />
    },
    {
      path: '/AddUser',
      element: <AddUser />
    },
    {
      path: '/Client',
      element: <Client />
    },
    {
      path: '/Category',
      element: <Category />
    },
    {
      path: '/AddCategory',
      element: <AddCategory />
    },
    {
      path: '/SubCategory',
      element: <SubCategory />
    },
    {
      path: '/AddSubCategory',
      element: <AddSubCategory />
    },
    {
      path: '/Calendar',
      element: <Calendar />
    },
    {
      path: '/logout',
      element: <Logout />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    }
  ]
};

export default MainRoutes;
