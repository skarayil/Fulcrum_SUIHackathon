// src/App.tsx
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { DashboardIcon, PersonIcon, ExclamationTriangleIcon, CheckCircledIcon, StarFilledIcon, EyeOpenIcon, MixerHorizontalIcon, GearIcon, RocketIcon } from "@radix-ui/react-icons";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
const CheckIcon = CheckCircledIcon;
import { useEffect } from "react";
import { PageTransition } from "./components/PageTransition";
import FulcrumLogo from "./components/FulcrumLogo";
import { CreateTeam } from "./pages/CreateTeam";
import { Kick } from "./pages/Kick";
import { ClaimPrize } from "./pages/ClaimPrize";
import { ViewPool } from "./pages/ViewPool";
import LandingPage from "./pages/LandingPage";
import { DeveloperDashboard } from "./pages/DeveloperDashboard";
import { NewSponsorDashboard } from "./pages/NewSponsorDashboard";
import { ContestantDashboard } from "./pages/ContestantDashboard";
import { useUserRole } from "./hooks/useUserRole";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Landing Page Wrapper - redirects to dashboard if user has a role
function LandingPageWrapper({ isLoading }: { role: string | null; isLoading: boolean }) {
  // Show loading while checking role
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // TEMPORARILY DISABLED AUTO-REDIRECT - Always show landing page
  // This allows users to register even if they already have a role
  
  // If user has a role, redirect to their dashboard
  // if (role === "developer") {
  //   return <Navigate to="/developer-dashboard" replace />;
  // } else if (role === "sponsor") {
  //   return <Navigate to="/new-sponsor-dashboard" replace />;
  // } else if (role === "contestant") {
  //   return <Navigate to="/contestant-dashboard" replace />;
  // } else if (role === "jury") {
  //   return <Navigate to="/jury-voting" replace />;
  // }

  // Always show landing page for testing
  return <LandingPage />;
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const account = useCurrentAccount();
  const { role, isLoading: isRoleLoading } = useUserRole();

  // Hide security/insecure warnings from wallet connection
  useEffect(() => {
    const hideSecurityWarnings = () => {
      // Find and hide elements containing security warning text
      const allElements = document.querySelectorAll('*');
      allElements.forEach((el) => {
        const text = el.textContent || '';
        if (
          text.toLowerCase().includes('güvenli') ||
          text.toLowerCase().includes('not secure') ||
          text.toLowerCase().includes('untrusted') ||
          text.toLowerCase().includes('insecure') ||
          text.toLowerCase().includes('unsafe')
        ) {
          const parent = el.parentElement;
          if (parent && (parent.classList.contains('warning') || 
              parent.hasAttribute('data-wallet-warning') ||
              parent.hasAttribute('data-testid'))) {
            (parent as HTMLElement).style.display = 'none';
          }
        }
      });
    };

    // Run immediately
    hideSecurityWarnings();

    // Run after a delay to catch dynamically loaded content
    const timeoutId = setTimeout(hideSecurityWarnings, 500);

    // Observe DOM changes for dynamically added elements
    const observer = new MutationObserver(hideSecurityWarnings);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // Define all navigation items with role requirements
  const allNavItems = [
    { path: "/developer-dashboard", label: "Developer", icon: GearIcon, roles: ["developer"] },
    { path: "/new-sponsor-dashboard", label: "Sponsor", icon: RocketIcon, roles: ["sponsor"] },
    { path: "/contestant-dashboard", label: "Contestant", icon: PersonIcon, roles: ["contestant"] },
    { path: "/view-pool", label: "View Pool", icon: EyeOpenIcon, roles: ["sponsor"] },
    { path: "/claim-prize", label: "Claim Prize", icon: StarFilledIcon, roles: ["contestant"] },
    { path: "/create-team", label: "Create Team", icon: PersonIcon, roles: ["contestant"] },
    { path: "/kick", label: "Kick", icon: ExclamationTriangleIcon, roles: ["contestant"] },
  ];

  // Filter navigation items based on user role
  const navItems = role 
    ? allNavItems.filter(item => item.roles.includes(role))
    : [];


  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-lg border-b border-blue-500/30 shadow-lg shadow-blue-500/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="p-1.5">
                <FulcrumLogo size={32} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                FULCRUM
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-black/50 border border-blue-500/20 p-1 rounded-lg">
              {!account && (
                <div className="px-4 py-2 text-sm text-gray-400">
                  Please connect your wallet
                </div>
              )}
              {account && isRoleLoading && (
                <div className="px-4 py-2 text-sm text-blue-400 animate-pulse">
                  Loading role...
                </div>
              )}
              {account && !isRoleLoading && navItems.length === 0 && (
                <div className="px-4 py-2 text-sm text-yellow-400">
                  No role assigned yet
                </div>
              )}
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                const isExclamationIcon = item.icon === ExclamationTriangleIcon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20 border border-blue-500/30'
                        : 'text-gray-400 hover:text-blue-400'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isExclamationIcon ? 'scale-110' : ''}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Wallet Connection */}
            <div className="flex items-center gap-3">
              <ConnectButton />
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden pb-4 pt-2">
            <div className="flex flex-col gap-1">
              {!account && (
                <div className="px-4 py-2 text-sm text-gray-400 text-center">
                  Please connect your wallet
                </div>
              )}
              {account && isRoleLoading && (
                <div className="px-4 py-2 text-sm text-blue-400 animate-pulse text-center">
                  Loading role...
                </div>
              )}
              {account && !isRoleLoading && navItems.length === 0 && (
                <div className="px-4 py-2 text-sm text-yellow-400 text-center">
                  No role assigned yet
                </div>
              )}
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                const isExclamationIcon = item.icon === ExclamationTriangleIcon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all
                      ${
                        isActive
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'text-gray-400 hover:bg-black/50 hover:text-blue-400'
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 ${isExclamationIcon ? 'scale-110' : ''}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </header>

      {/* Wallet Status */}
      {account && location.pathname !== "/" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex items-center gap-2 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/10">
            <CheckIcon className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-mono text-blue-300">
              {account.address.slice(0, 8)}...{account.address.slice(-6)}
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <Routes>
        <Route 
          path="/" 
          element={
            <PageTransition>
              <LandingPageWrapper role={role} isLoading={isRoleLoading} />
            </PageTransition>
          } 
        />
        <Route 
          path="/developer-dashboard" 
          element={
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <PageTransition>
                <ProtectedRoute requiredRole="developer">
                  <DeveloperDashboard />
                </ProtectedRoute>
              </PageTransition>
            </main>
          } 
        />
        <Route 
          path="/new-sponsor-dashboard" 
          element={
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <PageTransition>
                <ProtectedRoute requiredRole="sponsor">
                  <NewSponsorDashboard />
                </ProtectedRoute>
              </PageTransition>
            </main>
          } 
        />
        <Route 
          path="/contestant-dashboard" 
          element={
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <PageTransition>
                <ProtectedRoute requiredRole="contestant">
                  <ContestantDashboard />
                </ProtectedRoute>
              </PageTransition>
            </main>
          } 
        />
        <Route 
          path="/view-pool" 
          element={
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <PageTransition>
                <ProtectedRoute requiredRole="sponsor">
                  <ViewPool />
                </ProtectedRoute>
              </PageTransition>
            </main>
          } 
        />
        <Route 
          path="/claim-prize" 
          element={
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <PageTransition>
                <ProtectedRoute requiredRole="contestant">
                  <ClaimPrize />
                </ProtectedRoute>
              </PageTransition>
            </main>
          } 
        />
        <Route 
          path="/create-team" 
          element={
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <PageTransition>
                <ProtectedRoute requiredRole="contestant">
                  <CreateTeam />
                </ProtectedRoute>
              </PageTransition>
            </main>
          } 
        />
        <Route 
          path="/kick" 
          element={
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <PageTransition>
                <ProtectedRoute requiredRole="contestant">
                  <Kick />
                </ProtectedRoute>
              </PageTransition>
            </main>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
