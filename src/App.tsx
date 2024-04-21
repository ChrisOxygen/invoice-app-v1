import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import Invoices from "./screens/Invoices";
import SingleInvoice from "./screens/SingleInvoice";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Invoices />,
      },
      {
        path: "/invoice/:id",
        element: <SingleInvoice />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
