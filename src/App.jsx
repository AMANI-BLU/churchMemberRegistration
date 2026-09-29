import React, { useState, useEffect, useCallback } from 'react';
import { ChurchProvider, useChurch } from './context/ChurchContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { ConfirmDialog } from './components/ConfirmDialog';

import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { IdCards } from './pages/IdCards';
import { Baptism } from './pages/Baptism';
import { Families } from './pages/Families';
import { Ministries } from './pages/Ministries';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';

import { MemberModal } from './components/MemberModal';
import { MemberProfileModal } from './components/MemberProfileModal';
import { BaptismCertificateModal } from './components/BaptismCertificateModal';
import { RecordBaptismModal } from './components/RecordBaptismModal';
import { AssignMinistryModal } from './components/AssignMinistryModal';
import { FamilyModal } from './components/FamilyModal';
import { MinistryModal } from './components/MinistryModal';

import './styles/index.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/print.css';

const VALID_ROUTES = [
  'dashboard',
  'members',
  'idcards',
  'baptism',
  'families',
  'ministries',
  'reports',
  'settings'
];

const getTabFromLocation = () => {
  if (typeof window === 'undefined') return 'dashboard';
  const cleanHash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
  return VALID_ROUTES.includes(cleanHash) ? cleanHash : 'dashboard';
};

const LoadingScreen = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-app, #f8fafc)'
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <img
        src="/church-logo.png"
        alt="Logo"
        style={{ width: '52px', height: '52px', objectFit: 'contain' }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: 'var(--text-secondary, #64748b)',
          fontSize: '0.9rem',
          fontWeight: 500
        }}
      >
        <span
          className="animate-spin"
          style={{
            width: '18px',
            height: '18px',
            border: '2px solid var(--primary, #2563eb)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block'
          }}
        ></span>
        <span>Initializing Congregation Portal...</span>
      </div>
    </div>
  </div>
);

const MainLayout = () => {
  const {
    currentRole,
    deleteMember,
    deleteFamily,
    deleteMinistry,
    resetToDemoData,
    logout
  } = useChurch();

  const [activeTab, setActiveTabState] = useState(getTabFromLocation);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync route handler (updates state & URL hash)
  const handleNavigate = useCallback((tab) => {
    const target = VALID_ROUTES.includes(tab) ? tab : 'dashboard';
    setActiveTabState(target);
    if (window.location.hash !== `#/${target}`) {
      window.location.hash = `#/${target}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen for browser Back / Forward buttons and manual hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const route = getTabFromLocation();
      setActiveTabState(route);
    };

    window.addEventListener('hashchange', handleHashChange);

    if (!window.location.hash || window.location.hash === '#/login') {
      window.location.hash = '#/dashboard';
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Guard: non-admin roles cannot view settings tab
  useEffect(() => {
    if (activeTab === 'settings' && currentRole !== 'admin') {
      handleNavigate('dashboard');
    }
  }, [activeTab, currentRole, handleNavigate]);

  // Modals state (Unconditional hooks)
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState(null);

  const [selectedProfileMemberId, setSelectedProfileMemberId] = useState(null);

  // Baptism Modals
  const [isRecordBaptismOpen, setIsRecordBaptismOpen] = useState(false);
  const [recordBaptismCandidateId, setRecordBaptismCandidateId] = useState(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certMemberId, setCertMemberId] = useState(null);

  // Ministry Assign Modal
  const [isAssignMinistryOpen, setIsAssignMinistryOpen] = useState(false);
  const [ministryToAssign, setMinistryToAssign] = useState(null);

  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [familyToEdit, setFamilyToEdit] = useState(null);

  const [isMinistryModalOpen, setIsMinistryModalOpen] = useState(false);
  const [ministryToEdit, setMinistryToEdit] = useState(null);
  const [idCardsSelectedMemberIds, setIdCardsSelectedMemberIds] = useState(null);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDangerous: false,
    iconType: 'danger',
    onConfirm: () => {}
  });

  const currentTab = activeTab === 'settings' && currentRole !== 'admin' ? 'dashboard' : activeTab;

  // ── Logout Confirmation ───────────────────────────────────────
  const handlePromptLogout = useCallback(() => {
    setConfirmDialog({
      isOpen: true,
      title: 'Sign Out',
      message: 'Are you sure you want to sign out of the EECMY congregation portal?',
      confirmText: 'Sign Out',
      cancelText: 'Stay Logged In',
      isDangerous: true,
      iconType: 'logout',
      onConfirm: () => logout()
    });
  }, [logout]);

  // ── Member Handlers ──────────────────────────────────────────
  const handleOpenRegisterMember = () => {
    setMemberToEdit(null);
    setIsMemberModalOpen(true);
  };
  const handleOpenEditMember = (member) => {
    setMemberToEdit(member);
    setIsMemberModalOpen(true);
  };
  const handlePromptDeleteMember = (member) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Remove Church Member',
      message: `Remove "${member.firstName} ${member.lastName}" from the congregation directory? This action cannot be undone.`,
      confirmText: 'Remove Member',
      cancelText: 'Cancel',
      isDangerous: true,
      iconType: 'danger',
      onConfirm: () => deleteMember(member.id)
    });
  };

  // ── ID Card Navigation ───────────────────────────────────────
  const handleNavigateToIdCards = (memberIds) => {
    if (memberIds) {
      const arr = Array.isArray(memberIds) ? memberIds : [memberIds];
      setIdCardsSelectedMemberIds(arr);
    }
    handleNavigate('idcards');
  };

  // ── Baptism Handlers ─────────────────────────────────────────
  const handleOpenRecordBaptism = (candidateId = null) => {
    setRecordBaptismCandidateId(candidateId);
    setIsRecordBaptismOpen(true);
  };
  const handleOpenBaptismCertificate = (memberId) => {
    setCertMemberId(memberId);
    setIsCertModalOpen(true);
  };

  // ── Ministry Handlers ────────────────────────────────────────
  const handleOpenCreateMinistry = () => { setMinistryToEdit(null); setIsMinistryModalOpen(true); };
  const handleOpenEditMinistry = (ministry) => { setMinistryToEdit(ministry); setIsMinistryModalOpen(true); };
  const handleOpenAssignMinistry = (ministry) => {
    setMinistryToAssign(ministry);
    setIsAssignMinistryOpen(true);
  };
  const handlePromptDeleteMinistry = (ministry) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Ministry Group',
      message: `Remove "${ministry.name}"? Enrolled members will be unassigned.`,
      confirmText: 'Delete Ministry',
      cancelText: 'Cancel',
      isDangerous: true,
      iconType: 'danger',
      onConfirm: () => deleteMinistry(ministry.id)
    });
  };

  // ── Family Handlers ──────────────────────────────────────────
  const handleOpenCreateFamily = () => { setFamilyToEdit(null); setIsFamilyModalOpen(true); };
  const handleOpenEditFamily = (family) => { setFamilyToEdit(family); setIsFamilyModalOpen(true); };
  const handlePromptDeleteFamily = (family) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Family Household',
      message: `Delete household "${family.familyName}"? Members will be unlinked but remain in the directory.`,
      confirmText: 'Delete Family',
      cancelText: 'Cancel',
      isDangerous: true,
      iconType: 'danger',
      onConfirm: () => deleteFamily(family.id)
    });
  };

  // ── Reset ────────────────────────────────────────────────────
  const handlePromptResetDemoData = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset Demo Data',
      message: 'This will reset all data back to initial EECMY YABELLO sample church dataset. All custom changes will be lost.',
      confirmText: 'Reset',
      cancelText: 'Cancel',
      isDangerous: true,
      iconType: 'warning',
      onConfirm: () => resetToDemoData()
    });
  };

  return (
    <div className="app-layout-sidebar animate-fade-in">
      {/* Left Sidebar Navigation */}
      <Sidebar
        activeTab={currentTab}
        onSelectTab={handleNavigate}
        onOpenRegisterMember={handleOpenRegisterMember}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="main-content-area">
        {/* Top Header Bar */}
        <Header
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenRegisterMember={handleOpenRegisterMember}
          onNavigate={handleNavigate}
          onRequestLogout={handlePromptLogout}
        />

        {/* Dynamic Main Page Content with Key Transition */}
        <main key={currentTab} className="page-main-viewport animate-fade-in">
          {currentTab === 'dashboard' && (
            <Dashboard
              onNavigate={handleNavigate}
              onOpenRegisterMember={handleOpenRegisterMember}
              onSelectMemberProfile={setSelectedProfileMemberId}
            />
          )}
          {currentTab === 'members' && (
            <Members
              onOpenRegisterMember={handleOpenRegisterMember}
              onOpenEditMember={handleOpenEditMember}
              onSelectMemberProfile={setSelectedProfileMemberId}
              onPromptDeleteMember={handlePromptDeleteMember}
              onOpenIdCard={handleNavigateToIdCards}
            />
          )}
          {currentTab === 'idcards' && (
            <IdCards initialSelectedIds={idCardsSelectedMemberIds} />
          )}
          {currentTab === 'baptism' && (
            <Baptism
              onOpenRecordBaptism={handleOpenRecordBaptism}
              onOpenCertificate={handleOpenBaptismCertificate}
              onSelectMemberProfile={setSelectedProfileMemberId}
            />
          )}
          {currentTab === 'families' && (
            <Families
              onOpenCreateFamily={handleOpenCreateFamily}
              onOpenEditFamily={handleOpenEditFamily}
              onPromptDeleteFamily={handlePromptDeleteFamily}
              onSelectMemberProfile={setSelectedProfileMemberId}
            />
          )}
          {currentTab === 'ministries' && (
            <Ministries
              onOpenCreateMinistry={handleOpenCreateMinistry}
              onOpenEditMinistry={handleOpenEditMinistry}
              onPromptDeleteMinistry={handlePromptDeleteMinistry}
              onSelectMemberProfile={setSelectedProfileMemberId}
              onOpenAssignMinistry={handleOpenAssignMinistry}
            />
          )}
          {activeTab === 'reports' && <Reports />}
          {activeTab === 'settings' && (
            <Settings onPromptResetDemoData={handlePromptResetDemoData} />
          )}
        </main>
      </div>

      {/* Modals */}
      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        memberToEdit={memberToEdit}
      />
      <MemberProfileModal
        isOpen={!!selectedProfileMemberId}
        onClose={() => setSelectedProfileMemberId(null)}
        memberId={selectedProfileMemberId}
        onEditMember={handleOpenEditMember}
        onOpenIdCard={handleNavigateToIdCards}
      />
      <BaptismCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        memberId={certMemberId}
      />
      <RecordBaptismModal
        isOpen={isRecordBaptismOpen}
        onClose={() => setIsRecordBaptismOpen(false)}
        preselectedMemberId={recordBaptismCandidateId}
      />
      <AssignMinistryModal
        isOpen={isAssignMinistryOpen}
        onClose={() => {
          setIsAssignMinistryOpen(false);
          setMinistryToAssign(null);
        }}
        ministry={ministryToAssign}
      />
      <FamilyModal
        isOpen={isFamilyModalOpen}
        onClose={() => setIsFamilyModalOpen(false)}
        familyToEdit={familyToEdit}
      />
      <MinistryModal
        isOpen={isMinistryModalOpen}
        onClose={() => setIsMinistryModalOpen(false)}
        ministryToEdit={ministryToEdit}
      />
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        isDangerous={confirmDialog.isDangerous}
        iconType={confirmDialog.iconType}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
      <Toast />
    </div>
  );
};

const AppRouter = () => {
  const { isAuthenticated, authLoading } = useChurch();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        if (window.location.hash !== '#/login') {
          window.location.hash = '#/login';
        }
      } else {
        if (!window.location.hash || window.location.hash === '#/login' || window.location.hash === '#') {
          window.location.hash = '#/dashboard';
        }
      }
    }
  }, [isAuthenticated, authLoading]);

  if (authLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <MainLayout />;
};

export default function App() {
  return (
    <ErrorBoundary>
      <ChurchProvider>
        <AppRouter />
      </ChurchProvider>
    </ErrorBoundary>
  );
}
