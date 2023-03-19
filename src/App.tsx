import React from 'react';
import { createBrowserRouter,  RouterProvider} from 'react-router-dom';
import CoursesList from './components/CoursesList';
import CourseDetails from './components/CourseDetails';

const router = createBrowserRouter([
  {
    path: "/",
    element: (<CoursesList />) ,
  },
  {
    path: "course/:id",
    element: (<CourseDetails/>),
  },
]);

const App: React.FC = () => {
  return (
      <RouterProvider router={router} />
  );
};



export default App;
