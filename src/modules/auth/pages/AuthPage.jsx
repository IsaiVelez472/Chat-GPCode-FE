import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthNavigation from "../components/AuthNavigation";
import LoginForm from "../components/LoginForm";
import VolunteerRegistrationForm from "../components/VolunteerRegistrationForm";
import CompanyRegistrationForm from "../components/CompanyRegistrationForm";

const AuthPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 bg-white">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mt-8 w-full max-w-4xl mx-auto">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Routes>
              <Route index element={<AuthNavigation />} />
              <Route path="login" element={<LoginForm />} />
              <Route
                path="volunteer-registration"
                element={<VolunteerRegistrationForm />}
              />
              <Route
                path="company-registration"
                element={<CompanyRegistrationForm />}
              />
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
