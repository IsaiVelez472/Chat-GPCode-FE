import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./modules/auth/context/AuthContext";
import Header from "./modules/core/components/Header";
import Footer from "./modules/core/components/Footer";
import VolunteerLandingPage from "./modules/homepage";
import AuthPage from "./modules/auth/pages/AuthPage";
import Dashboard from "./modules/volunteer/pages/Dashboard";
import MyApplications from "./modules/volunteer/pages/MyApplications";
import CompanyVacancies from "./modules/company/pages/CompanyVacancies";
import CompanyProjects from "./modules/company/pages/CompanyProjects";
import CompanyApplications from "./modules/company/pages/CompanyApplications";
import CreateProjectForm from "./modules/company/pages/CreateProjectForm";
import CreateVacancieForm from "./modules/company/pages/CreateVacancieForm";
import AuthRedirect from "./modules/core/components/AuthRedirect";
import VolunteerRoute from "./modules/core/components/VolunteerRoute";
import CompanyRoute from "./modules/core/components/CompanyRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white text-gray-900 flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route
                path="/"
                element={
                  <AuthRedirect>
                    <VolunteerLandingPage />
                  </AuthRedirect>
                }
              />
              <Route path="/auth/*" element={<AuthPage />} />
              {/* Rutas para voluntarios */}
              <Route 
                path="/dashboard" 
                element={
                  <VolunteerRoute>
                    <Dashboard />
                  </VolunteerRoute>
                } 
              />
              <Route 
                path="/my-applications" 
                element={
                  <VolunteerRoute>
                    <MyApplications />
                  </VolunteerRoute>
                } 
              />
              
              {/* Rutas para empresas */}
              <Route 
                path="/company/vacancies" 
                element={
                  <CompanyRoute>
                    <CompanyVacancies />
                  </CompanyRoute>
                } 
              />
              <Route 
                path="/company/projects" 
                element={
                  <CompanyRoute>
                    <CompanyProjects />
                  </CompanyRoute>
                } 
              />
              <Route 
                path="/company/applications" 
                element={
                  <CompanyRoute>
                    <CompanyApplications />
                  </CompanyRoute>
                } 
              />
              <Route
                path="/company/projects/create"
                element={
                  <CompanyRoute>
                    <CreateProjectForm />
                  </CompanyRoute>
                }
              />
              <Route
                path="/company/projects/:id/edit"
                element={
                  <CompanyRoute>
                    <CreateProjectForm />
                  </CompanyRoute>
                }
              />
              <Route
                path="/company/vacancies/create"
                element={
                  <CompanyRoute>
                    <CreateVacancieForm />
                  </CompanyRoute>
                }
              />
              <Route
                path="/company/vacancies/:id/edit"
                element={
                  <CompanyRoute>
                    <CreateVacancieForm />
                  </CompanyRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="top-right" autoClose={5000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
