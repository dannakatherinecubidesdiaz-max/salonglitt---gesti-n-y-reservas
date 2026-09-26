/**
 * SalonGlitt - Sistema de Gestión y Reservas para Salón de Belleza
 * Y2K Aesthetic #11 • EduPulse Beauty
 */

import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { AppointmentsPage } from './features/appointments/pages/AppointmentsPage';
import { AppointmentDetail360Page } from './features/appointments/pages/AppointmentDetail360Page';
import { AppointmentWizard } from './features/appointments/components/AppointmentWizard';
import { SettingsPage } from './features/settings/pages/SettingsPage';
import { CalendarConsolePage } from './features/appointments/pages/CalendarConsolePage';
import { AuthPage } from './features/auth/pages/AuthPage';
import { UserRoleManagementPage } from './features/users/pages/UserRoleManagementPage';
import { ClientMyAppointmentsPage } from './features/client/pages/ClientMyAppointmentsPage';
import { ClientProfilePage } from './features/client/pages/ClientProfilePage';
import { ClientServicesCatalogPage } from './features/client/pages/ClientServicesCatalogPage';

function SalonGlittApp() {
  const { currentRole, currentUser, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<string>(currentRole === 'CLIENT' ? 'services' : 'dashboard');
  const [activeAppointmentId, setActiveAppointmentId] = useState<string | undefined>(undefined);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>(undefined);

  // Sync default view when role switches
  React.useEffect(() => {
    if (currentRole === 'CLIENT') {
      setCurrentView('services');
    } else {
      setCurrentView('dashboard');
    }
  }, [currentRole]);

  const handleNavigate = (viewId: string, extraData?: any) => {
    if (viewId === 'detail360' && extraData?.appointmentId) {
      setActiveAppointmentId(extraData.appointmentId);
    }
    if (viewId === 'wizard') {
      setPreselectedServiceId(extraData?.serviceId);
    }
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveScreen = () => {
    // Privacy and Route Guard for CLIENT role:
    if (currentRole === 'CLIENT') {
      switch (currentView) {
        case 'services':
        case 'catalog':
          return <ClientServicesCatalogPage onNavigate={handleNavigate} />;
        case 'wizard':
          return (
            <AppointmentWizard
              preselectedServiceId={preselectedServiceId}
              onFinish={() => handleNavigate('my-appointments')}
              onCancel={() => handleNavigate('services')}
            />
          );
        case 'my-appointments':
          return <ClientMyAppointmentsPage onNavigate={handleNavigate} />;
        case 'profile':
          return <ClientProfilePage onNavigate={handleNavigate} />;
        case 'detail360':
          return (
            <AppointmentDetail360Page
              appointmentId={activeAppointmentId}
              onBack={() => handleNavigate('my-appointments')}
              onNavigate={handleNavigate}
            />
          );
        case 'auth':
          return <AuthPage onSuccess={() => handleNavigate('services')} />;
        default:
          return <ClientServicesCatalogPage onNavigate={handleNavigate} />;
      }
    }

    // Admin & Stylist Views:
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'appointments':
        return <AppointmentsPage onNavigate={handleNavigate} />;
      case 'calendar':
        return <CalendarConsolePage onNavigate={handleNavigate} />;
      case 'services':
      case 'catalog':
        return <ClientServicesCatalogPage onNavigate={handleNavigate} />;
      case 'detail360':
        return (
          <AppointmentDetail360Page
            appointmentId={activeAppointmentId}
            onBack={() => handleNavigate('appointments')}
            onNavigate={handleNavigate}
          />
        );
      case 'wizard':
        return (
          <AppointmentWizard
            preselectedServiceId={preselectedServiceId}
            onFinish={(newId) => handleNavigate('detail360', { appointmentId: newId })}
            onCancel={() => handleNavigate('dashboard')}
          />
        );
      case 'users':
        return <UserRoleManagementPage onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPage />;
      case 'my-appointments':
        return <ClientMyAppointmentsPage onNavigate={handleNavigate} />;
      case 'profile':
        return <ClientProfilePage onNavigate={handleNavigate} />;
      case 'auth':
        return <AuthPage onSuccess={() => handleNavigate('dashboard')} />;
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#120B1C]" aria-busy="true" />;
  }

  if (!currentUser) {
    return <AuthPage onSuccess={() => setCurrentView('services')} />;
  }

  return (
    <div className="min-h-screen bg-[#120B1C] text-white flex flex-col selection:bg-[#FF70A6] selection:text-white">
      {/* Top Navbar with role-specific views */}
      <Navbar onNavigate={handleNavigate} currentView={currentView} />

      {/* Main Container: Hide Sidebar when user is CLIENT */}
      <div className={`flex-1 flex flex-col ${currentRole !== 'CLIENT' ? 'lg:flex-row' : ''} max-w-7xl w-full mx-auto`}>
        {currentRole !== 'CLIENT' && <Sidebar currentView={currentView} onNavigate={handleNavigate} />}
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-hidden">
          {renderActiveScreen()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <SalonGlittApp />
      </AuthProvider>
    </ToastProvider>
  );
}
