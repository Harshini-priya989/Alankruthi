import {BrowserRouter,Routes,Route,} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminDashboardPage from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import MainLayout from "./layouts/MainLayout";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import DesignAssistantPage from "./pages/DesignAssistantPage";
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainLayout><HomePage/></MainLayout>}/>
      <Route path="/login" element={<MainLayout><LoginPage/></MainLayout>}/>
      <Route path="/register" element={<MainLayout><RegisterPage/></MainLayout>}/>
      <Route path="/design-assistant" element={<MainLayout><DesignAssistantPage/></MainLayout>}/>
      <Route path="/product/:id" element={<MainLayout><ProductPage/></MainLayout>}/>
      <Route element={<ProtectedRoute/>}>
        <Route path="/cart" element={<MainLayout><CartPage/></MainLayout>}/>
        <Route path="/orders" element={<MainLayout><OrdersPage/></MainLayout>}/>
        <Route path="/checkout" element={<MainLayout><CheckoutPage/></MainLayout>}/>
      </Route>
      <Route element={<AdminRoute/>}>
        <Route path="/admin" element={<MainLayout><AdminDashboardPage/></MainLayout>}/>
        <Route path="/admin/products" element={<MainLayout><AdminProductsPage/></MainLayout>}/>
        <Route path="/admin/orders" element={<MainLayout><AdminOrdersPage/></MainLayout>}/>
        <Route path="/admin/users" element={<MainLayout><AdminUsersPage/></MainLayout>}/>
      </Route>
      
    </Routes>
    </BrowserRouter>
  )
}

export default App;
