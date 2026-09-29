import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialChurchSettings } from '../data/initialData';
import { supabase } from '../lib/supabase';
import {
  mapMemberToDb,
  mapFamilyToDb,
  mapMinistryToDb,
  mapSettingsToDb,
  fetchAllChurchData,
  fetchUserProfiles,
  updateUserProfileStatus,
  updateUserProfileRole,
  deleteUserProfile
} from '../lib/supabaseService';

const ChurchContext = createContext();

const STORAGE_KEYS = {
  SETTINGS: 'church_mgmt_settings_v3',
  MEMBERS: 'church_mgmt_members_v3',
  FAMILIES: 'church_mgmt_families_v3',
  MINISTRIES: 'church_mgmt_ministries_v3',
  ROLE: 'church_mgmt_current_role_v1',
  THEME: 'church_mgmt_theme_v1'
};

export const ChurchProvider = ({ children }) => {
  // Supabase Auth State
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Current user role: 'admin' or 'staff'
  const [currentRole, setCurrentRoleState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.ROLE) || 'admin';
  });

  // Global Theme: 'light' or 'dark'
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(true);

  // User Accounts Directory (for approval and management)
  const [userProfiles, setUserProfiles] = useState([]);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Theme Management
  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  }, [theme, setTheme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setCurrentRole = useCallback((role) => {
    setCurrentRoleState(role);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, []);

  // Primary Data States
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialChurchSettings;
      }
    }
    return initialChurchSettings;
  });

  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return saved ? JSON.parse(saved) : [];
  });

  const [families, setFamilies] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAMILIES);
    return saved ? JSON.parse(saved) : [];
  });

  const [ministries, setMinistries] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MINISTRIES);
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state to local storage as secondary offline cache
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAMILIES, JSON.stringify(families));
  }, [families]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MINISTRIES, JSON.stringify(ministries));
  }, [ministries]);

  // Data fetching helper
  const refreshData = useCallback(async () => {
    setIsSyncing(true);
    try {
      const {
        members: dbMembers,
        families: dbFamilies,
        ministries: dbMinistries,
        settings: dbSettings,
        userProfiles: dbProfiles,
        error
      } = await fetchAllChurchData();

      if (!error) {
        setIsSupabaseConnected(true);
        if (dbMembers) setMembers(dbMembers);
        if (dbFamilies) setFamilies(dbFamilies);
        if (dbMinistries) setMinistries(dbMinistries);
        if (dbSettings) setSettings(dbSettings);
        if (dbProfiles) setUserProfiles(dbProfiles);
      } else {
        console.warn('Supabase fetch notice:', error.message || error);
      }
    } catch (err) {
      console.error('Failed to sync from Supabase:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Initialize Supabase Auth Session & Listeners
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Supabase getSession warning:', error.message);
        }
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user || null);
          if (initialSession?.user?.user_metadata?.role) {
            setCurrentRole(initialSession.user.user_metadata.role);
          }
          setAuthLoading(false);
        }
      } catch (err) {
        console.error('Supabase auth init error:', err);
        if (mounted) setAuthLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          if (currentSession?.user?.user_metadata?.role) {
            setCurrentRole(currentSession.user.user_metadata.role);
          }
          setAuthLoading(false);
          if (currentSession) {
            refreshData();
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [setCurrentRole, refreshData]);

  // --- Auth Action Functions ---
  const signIn = useCallback(
    async (email, password) => {
      let authResult;
      const cleanEmail = email.trim();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      // Auto-provision default admin if not created yet in Supabase Auth
      if (error && (cleanEmail === 'admin@church.org' || error.message.toLowerCase().includes('invalid login credentials'))) {
        if (cleanEmail === 'admin@church.org' && password === 'Admin@Church2026!') {
          const signUpRes = await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              data: {
                full_name: 'Lead Pastor / Administrator',
                role: 'admin'
              }
            }
          });

          if (!signUpRes.error && signUpRes.data?.user) {
            try {
              await supabase.from('user_profiles').upsert({
                id: signUpRes.data.user.id,
                email: cleanEmail,
                full_name: 'Lead Pastor / Administrator',
                role: 'admin',
                status: 'approved',
                created_at: new Date().toISOString()
              });
            } catch (e) {
              console.warn('Profile seed warning:', e);
            }

            if (signUpRes.data.session) {
              setSession(signUpRes.data.session);
              setUser(signUpRes.data.user);
              setCurrentRole('admin');
              showToast('Admin account initialized & signed in!');
              return signUpRes.data;
            }
          }
        }
        throw error;
      } else if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          throw new Error('Email not confirmed. Please check your email inbox, or in your Supabase Dashboard go to Authentication -> Providers -> Email and uncheck "Confirm email".');
        }
        throw error;
      }

      authResult = data;
      const loggedUser = authResult.user;

      // Check approval status in user_profiles
      try {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', loggedUser.id)
          .maybeSingle();

        const isDefaultAdmin = loggedUser.email === 'admin@church.org' || loggedUser.user_metadata?.role === 'admin';

        if (profile && !isDefaultAdmin) {
          if (profile.status === 'pending') {
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            throw new Error('Your account is pending administrator approval. Please contact the church administrator.');
          } else if (profile.status === 'rejected') {
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            throw new Error('Your account access has been declined by the administrator.');
          }
        }
      } catch (profileErr) {
        if (profileErr.message && (profileErr.message.includes('pending') || profileErr.message.includes('declined'))) {
          throw profileErr;
        }
        console.warn('Profile approval check warning:', profileErr);
      }

      setSession(authResult.session);
      setUser(authResult.user);
      const role = authResult.user?.user_metadata?.role || 'admin';
      setCurrentRole(role);
      showToast(`Welcome back, ${authResult.user?.user_metadata?.full_name || cleanEmail}!`);
      return authResult;
    },
    [setCurrentRole, showToast]
  );

  const signUp = useCallback(
    async (email, password, metadata = {}) => {
      const cleanEmail = email.trim();
      const requestedRole = metadata.role || 'admin';
      const isAdminRole = requestedRole === 'admin' || cleanEmail === 'admin@church.org';

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: metadata.fullName || '',
            role: requestedRole
          }
        }
      });

      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          throw new Error('Email not confirmed. Please check your inbox or disable "Confirm email" in your Supabase Auth dashboard settings.');
        }
        throw error;
      }

      const assignedStatus = isAdminRole ? 'approved' : 'pending';

      if (data.user) {
        try {
          await supabase.from('user_profiles').upsert({
            id: data.user.id,
            email: cleanEmail,
            full_name: metadata.fullName || '',
            role: requestedRole,
            status: assignedStatus,
            created_at: new Date().toISOString()
          });
        } catch (profileErr) {
          console.warn('Error creating user profile record:', profileErr);
        }

        if (isAdminRole) {
          if (data.session) {
            setSession(data.session);
            setUser(data.user);
            setCurrentRole(requestedRole);
            showToast('Admin account created & signed in successfully!');
          } else {
            showToast('Admin account registered! If email confirmation is enabled, please verify in your email.', 'info');
          }
        } else {
          // Non-admin roles require approval before logging in
          if (data.session) {
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
          }
          showToast('Staff registration submitted! An administrator will review and approve your account before you can log in.', 'info');
        }
      }

      return data;
    },
    [setCurrentRole, showToast]
  );

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out error:', e);
    } finally {
      setSession(null);
      setUser(null);
      showToast('Signed out of congregation portal.', 'info');
    }
  }, [showToast]);

  const resetPassword = useCallback(
    async (email) => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin
      });
      if (error) throw error;
      showToast('Password reset email sent. Please check your inbox.');
      return data;
    },
    [showToast]
  );

  // Admin User Account Management Methods
  const approveUser = useCallback(
    async (userId) => {
      try {
        await updateUserProfileStatus(userId, 'approved');
        setUserProfiles((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: 'approved' } : u))
        );
        showToast('User account approved successfully.');
      } catch (err) {
        console.error('Approve user error:', err);
        showToast(err.message || 'Failed to approve user', 'error');
      }
    },
    [showToast]
  );

  const rejectUser = useCallback(
    async (userId) => {
      try {
        await updateUserProfileStatus(userId, 'rejected');
        setUserProfiles((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: 'rejected' } : u))
        );
        showToast('User account rejected.', 'info');
      } catch (err) {
        console.error('Reject user error:', err);
        showToast(err.message || 'Failed to reject user', 'error');
      }
    },
    [showToast]
  );

  const changeUserRole = useCallback(
    async (userId, newRole) => {
      try {
        await updateUserProfileRole(userId, newRole);
        setUserProfiles((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        showToast(`User role updated to ${newRole}.`);
      } catch (err) {
        console.error('Change role error:', err);
        showToast(err.message || 'Failed to update role', 'error');
      }
    },
    [showToast]
  );

  const deleteUserAccount = useCallback(
    async (userId) => {
      try {
        await deleteUserProfile(userId);
        setUserProfiles((prev) => prev.filter((u) => u.id !== userId));
        showToast('User account profile removed.', 'info');
      } catch (err) {
        console.error('Delete user error:', err);
        showToast(err.message || 'Failed to delete user profile', 'error');
      }
    },
    [showToast]
  );

  // Admin Profile & Security (Change Email & Password)
  const updateAdminEmail = useCallback(
    async (newEmail) => {
      const { data, error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      if (user) {
        setUser({ ...user, email: newEmail });
        try {
          await supabase.from('user_profiles').update({ email: newEmail }).eq('id', user.id);
        } catch (e) {
          console.warn('Profile email sync error:', e);
        }
      }
      showToast('Email address updated successfully.');
      return data;
    },
    [user, showToast]
  );

  const updateAdminPassword = useCallback(
    async (newPassword) => {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      showToast('Password updated successfully.');
      return data;
    },
    [showToast]
  );

  const updateAdminName = useCallback(
    async (newName) => {
      const { data, error } = await supabase.auth.updateUser({ data: { full_name: newName } });
      if (error) throw error;
      if (user) {
        const updatedUser = {
          ...user,
          user_metadata: { ...user.user_metadata, full_name: newName }
        };
        setUser(updatedUser);
        try {
          await supabase.from('user_profiles').update({ full_name: newName }).eq('id', user.id);
        } catch (e) {
          console.warn('Profile name sync error:', e);
        }
      }
      showToast('Account name updated successfully.');
      return data;
    },
    [user, showToast]
  );

  const login = useCallback(
    (role = 'admin') => {
      setCurrentRoleState(role);
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
    },
    []
  );

  const logout = useCallback(() => {
    signOut();
  }, [signOut]);

  // Computed isAuthenticated & pending approvals count
  const isAuthenticated = Boolean(session || user);
  const pendingUsersCount = userProfiles.filter((u) => u.status === 'pending').length;

  // Member ID Generator: MEM-YYYY-XXX
  const generateMemberId = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const prefix = `MEM-${currentYear}-`;

    let maxSeq = 0;
    members.forEach((m) => {
      if (m.memberId && m.memberId.startsWith(prefix)) {
        const parts = m.memberId.split('-');
        if (parts.length >= 3) {
          const num = parseInt(parts[2], 10);
          if (!isNaN(num) && num > maxSeq) {
            maxSeq = num;
          }
        }
      }
    });

    const nextNum = String(maxSeq + 1).padStart(3, '0');
    return `${prefix}${nextNum}`;
  }, [members]);

  // --- Member Actions ---
  const addMember = useCallback(
    async (memberData) => {
      const newId = `mem-${Date.now()}`;
      const autoMemberId = memberData.memberId || generateMemberId();
      const today = new Date().toISOString().split('T')[0];

      const newMember = {
        ...memberData,
        id: newId,
        memberId: autoMemberId,
        registeredAt: memberData.registeredAt || today,
        registeredBy: user?.user_metadata?.full_name || (currentRole === 'admin' ? 'Admin' : 'Staff'),
        status: memberData.status || 'Active',
        photo: memberData.photo || '',
        spiritualInfo: {
          baptismStatus: memberData.spiritualInfo?.baptismStatus || 'Unbaptized',
          baptismDate: memberData.spiritualInfo?.baptismDate || '',
          salvationDate: memberData.spiritualInfo?.salvationDate || '',
          certificateNo: memberData.spiritualInfo?.certificateNo || '',
          officiatedBy: memberData.spiritualInfo?.officiatedBy || settings.seniorPastor || 'Reverend (Kes) Desta Guyo',
          location: memberData.spiritualInfo?.location || 'EECMY Sanctuary Baptistery',
          witness: memberData.spiritualInfo?.witness || 'Church Council Elder'
        }
      };

      setMembers((prev) => [newMember, ...prev]);

      if (newMember.familyId) {
        setFamilies((prev) =>
          prev.map((f) => {
            if (f.id === newMember.familyId) {
              const currentMembers = f.memberIds || [];
              if (!currentMembers.includes(newMember.memberId)) {
                return { ...f, memberIds: [...currentMembers, newMember.memberId] };
              }
            }
            return f;
          })
        );
      }

      showToast(`Member "${newMember.firstName} ${newMember.lastName}" registered with ID ${newMember.memberId}.`);

      try {
        const dbRow = mapMemberToDb(newMember);
        const { error } = await supabase.from('members').insert([dbRow]);
        if (error) {
          console.error('Supabase member insert error:', error);
          showToast(`Saved locally (Supabase: ${error.message})`, 'info');
        }
      } catch (err) {
        console.error('Supabase insert exception:', err);
      }

      return newMember;
    },
    [generateMemberId, user, currentRole, settings.seniorPastor, showToast]
  );

  // Register Member with Household
  const registerMemberWithFamily = useCallback(
    async (primaryMemberData, familyModeData, primaryRole = 'Head of Family', inlineMembers = []) => {
      const currentYear = new Date().getFullYear();
      const prefix = `MEM-${currentYear}-`;
      const today = new Date().toISOString().split('T')[0];

      let maxSeq = 0;
      members.forEach((m) => {
        if (m.memberId && m.memberId.startsWith(prefix)) {
          const parts = m.memberId.split('-');
          if (parts.length >= 3) {
            const num = parseInt(parts[2], 10);
            if (!isNaN(num) && num > maxSeq) {
              maxSeq = num;
            }
          }
        }
      });

      let assignedFamilyId = null;
      let newFamilyObj = null;

      if (typeof familyModeData === 'string') {
        assignedFamilyId = familyModeData;
      } else if (typeof familyModeData === 'object' && familyModeData.familyName) {
        assignedFamilyId = `fam-${Date.now()}`;
        newFamilyObj = {
          id: assignedFamilyId,
          familyName: familyModeData.familyName,
          address: familyModeData.address || primaryMemberData.address || '',
          contactPhone: familyModeData.contactPhone || primaryMemberData.phone || '',
          headMemberId: '',
          memberIds: [],
          notes: familyModeData.notes || ''
        };
      }

      maxSeq += 1;
      const primaryAutoId = primaryMemberData.memberId || `${prefix}${String(maxSeq).padStart(3, '0')}`;
      const primaryId = `mem-${Date.now()}-primary`;
      const registeredByText = user?.user_metadata?.full_name || (currentRole === 'admin' ? 'Admin' : 'Staff');

      const primaryMember = {
        ...primaryMemberData,
        id: primaryId,
        memberId: primaryAutoId,
        familyId: assignedFamilyId,
        familyRole: primaryRole || 'Head of Family',
        registeredAt: primaryMemberData.registeredAt || today,
        registeredBy: registeredByText,
        status: primaryMemberData.status || 'Active',
        photo: primaryMemberData.photo || '',
        spiritualInfo: {
          baptismStatus: primaryMemberData.spiritualInfo?.baptismStatus || 'Unbaptized',
          baptismDate: primaryMemberData.spiritualInfo?.baptismDate || '',
          salvationDate: primaryMemberData.spiritualInfo?.salvationDate || '',
          certificateNo: primaryMemberData.spiritualInfo?.certificateNo || '',
          officiatedBy: primaryMemberData.spiritualInfo?.officiatedBy || settings.seniorPastor || 'Reverend (Kes) Desta Guyo',
          location: primaryMemberData.spiritualInfo?.location || 'EECMY Sanctuary Baptistery',
          witness: primaryMemberData.spiritualInfo?.witness || 'Church Council Elder'
        }
      };

      const createdMembers = [primaryMember];
      const allMemberIdsInFamily = [primaryAutoId];

      inlineMembers.forEach((inlineM, idx) => {
        maxSeq += 1;
        const inlineAutoId = `${prefix}${String(maxSeq).padStart(3, '0')}`;
        const inlineId = `mem-${Date.now()}-rel-${idx + 1}`;

        const newRelative = {
          ...inlineM,
          id: inlineId,
          memberId: inlineAutoId,
          familyId: assignedFamilyId,
          familyRole: inlineM.familyRole || 'Member',
          registeredAt: today,
          registeredBy: registeredByText,
          status: 'Active',
          phone: inlineM.phone || primaryMember.phone || '',
          email: inlineM.email || '',
          address: primaryMember.address || '',
          ministryIds: inlineM.ministryIds || [],
          spiritualInfo: {
            baptismStatus: inlineM.spiritualInfo?.baptismStatus || 'Unbaptized',
            baptismDate: inlineM.spiritualInfo?.baptismDate || '',
            salvationDate: inlineM.spiritualInfo?.salvationDate || '',
            certificateNo: inlineM.spiritualInfo?.certificateNo || '',
            officiatedBy: inlineM.spiritualInfo?.officiatedBy || settings.seniorPastor || 'Reverend (Kes) Desta Guyo',
            location: inlineM.spiritualInfo?.location || 'EECMY Sanctuary Baptistery',
            witness: inlineM.spiritualInfo?.witness || 'Church Council Elder'
          }
        };

        createdMembers.push(newRelative);
        allMemberIdsInFamily.push(inlineAutoId);
      });

      setMembers((prev) => [...createdMembers, ...prev]);

      if (newFamilyObj) {
        newFamilyObj.headMemberId = primaryRole === 'Head of Family' ? primaryAutoId : allMemberIdsInFamily[0];
        newFamilyObj.memberIds = allMemberIdsInFamily;
        setFamilies((prev) => [newFamilyObj, ...prev]);
      } else if (assignedFamilyId) {
        setFamilies((prev) =>
          prev.map((f) => {
            if (f.id === assignedFamilyId) {
              const currentList = f.memberIds || [];
              const merged = Array.from(new Set([...currentList, ...allMemberIdsInFamily]));
              return { ...f, memberIds: merged };
            }
            return f;
          })
        );
      }

      showToast(`Successfully registered ${createdMembers.length} congregation member${createdMembers.length > 1 ? 's' : ''}!`);

      try {
        const dbMemberRows = createdMembers.map(mapMemberToDb);
        await supabase.from('members').insert(dbMemberRows);

        if (newFamilyObj) {
          await supabase.from('families').insert([mapFamilyToDb(newFamilyObj)]);
        }
      } catch (err) {
        console.error('Supabase household sync error:', err);
      }

      return createdMembers;
    },
    [members, user, currentRole, settings.seniorPastor, showToast]
  );

  // Record Believer Baptism
  const recordBaptism = useCallback(
    async (memberIdOrId, baptismRecord) => {
      let targetMember = null;

      setMembers((prev) =>
        prev.map((m) => {
          if (m.id === memberIdOrId || m.memberId === memberIdOrId) {
            const certNumber =
              baptismRecord.certificateNo || `BAP-${new Date().getFullYear()}-${m.memberId.replace(/[^0-9]/g, '')}`;
            const updatedSpiritual = {
              ...m.spiritualInfo,
              baptismStatus: 'Baptized',
              baptismDate: baptismRecord.baptismDate || new Date().toISOString().split('T')[0],
              officiatedBy: baptismRecord.officiatedBy || settings.seniorPastor || 'Reverend (Kes) Desta Guyo',
              location: baptismRecord.location || 'EECMY Sanctuary Baptistery',
              certificateNo: certNumber,
              witness: baptismRecord.witness || 'Church Council Elder',
              salvationDate: baptismRecord.salvationDate || m.spiritualInfo?.salvationDate || ''
            };
            targetMember = {
              ...m,
              spiritualInfo: updatedSpiritual,
              notes: baptismRecord.notes ? `${m.notes ? m.notes + '\n' : ''}[Baptism Note: ${baptismRecord.notes}]` : m.notes
            };
            return targetMember;
          }
          return m;
        })
      );

      showToast('Holy Baptism recorded and certificate generated.');

      if (targetMember) {
        try {
          await supabase
            .from('members')
            .update({
              spiritual_info: targetMember.spiritualInfo,
              notes: targetMember.notes,
              updated_at: new Date().toISOString()
            })
            .eq('id', targetMember.id);
        } catch (err) {
          console.error('Supabase update baptism error:', err);
        }
      }
    },
    [settings.seniorPastor, showToast]
  );

  const updateMember = useCallback(
    async (id, updatedData) => {
      let mergedMember = null;
      setMembers((prev) =>
        prev.map((m) => {
          if (m.id === id) {
            mergedMember = { ...m, ...updatedData };
            if (updatedData.familyId !== undefined && updatedData.familyId !== m.familyId) {
              if (m.familyId) {
                setFamilies((fPrev) =>
                  fPrev.map((f) =>
                    f.id === m.familyId
                      ? { ...f, memberIds: (f.memberIds || []).filter((mid) => mid !== m.memberId) }
                      : f
                  )
                );
              }
              if (updatedData.familyId) {
                setFamilies((fPrev) =>
                  fPrev.map((f) =>
                    f.id === updatedData.familyId
                      ? { ...f, memberIds: Array.from(new Set([...(f.memberIds || []), m.memberId])) }
                      : f
                  )
                );
              }
            }
            return mergedMember;
          }
          return m;
        })
      );

      showToast('Member record updated successfully.');

      if (mergedMember) {
        try {
          const dbRow = mapMemberToDb(mergedMember);
          await supabase.from('members').update(dbRow).eq('id', id);
        } catch (err) {
          console.error('Supabase member update error:', err);
        }
      }
    },
    [showToast]
  );

  const deleteMember = useCallback(
    async (id) => {
      const member = members.find((m) => m.id === id);
      if (!member) return;

      setMembers((prev) => prev.filter((m) => m.id !== id));
      setFamilies((prev) =>
        prev.map((f) => (f.headMemberId === member.memberId ? { ...f, headMemberId: '' } : f))
      );
      showToast(`Member "${member.firstName} ${member.lastName}" removed.`, 'info');

      try {
        await supabase.from('members').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase member delete error:', err);
      }
    },
    [members, showToast]
  );

  const toggleMemberStatus = useCallback(
    async (id) => {
      let updated = null;
      setMembers((prev) =>
        prev.map((m) => {
          if (m.id === id) {
            const newStatus = m.status === 'Active' ? 'Inactive' : 'Active';
            showToast(`Member status changed to ${newStatus}.`);
            updated = { ...m, status: newStatus };
            return updated;
          }
          return m;
        })
      );

      if (updated) {
        try {
          await supabase.from('members').update({ status: updated.status }).eq('id', id);
        } catch (err) {
          console.error('Supabase toggle status error:', err);
        }
      }
    },
    [showToast]
  );

  // --- Family Actions ---
  const addFamily = useCallback(
    async (familyData) => {
      const newFamily = {
        ...familyData,
        id: `fam-${Date.now()}`,
        memberIds: familyData.memberIds || []
      };
      setFamilies((prev) => [newFamily, ...prev]);
      showToast(`Family "${newFamily.familyName}" created.`);

      try {
        await supabase.from('families').insert([mapFamilyToDb(newFamily)]);
      } catch (err) {
        console.error('Supabase add family error:', err);
      }

      return newFamily;
    },
    [showToast]
  );

  const updateFamily = useCallback(
    async (id, updatedData) => {
      let mergedFamily = null;
      setFamilies((prev) =>
        prev.map((f) => {
          if (f.id === id) {
            mergedFamily = { ...f, ...updatedData };
            return mergedFamily;
          }
          return f;
        })
      );
      showToast('Family record updated.');

      if (mergedFamily) {
        try {
          await supabase.from('families').update(mapFamilyToDb(mergedFamily)).eq('id', id);
        } catch (err) {
          console.error('Supabase family update error:', err);
        }
      }
    },
    [showToast]
  );

  const deleteFamily = useCallback(
    async (id) => {
      setFamilies((prev) => prev.filter((f) => f.id !== id));
      setMembers((prev) =>
        prev.map((m) => (m.familyId === id ? { ...m, familyId: null, familyRole: null } : m))
      );
      showToast('Family record deleted.', 'info');

      try {
        await supabase.from('families').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase family delete error:', err);
      }
    },
    [showToast]
  );

  // --- Ministry Actions ---
  const addMinistry = useCallback(
    async (ministryData) => {
      const newMinistry = {
        ...ministryData,
        id: `min-${Date.now()}`,
        badgeColor: ministryData.badgeColor || '#2563eb'
      };
      setMinistries((prev) => [...prev, newMinistry]);
      showToast(`Ministry "${newMinistry.name}" added.`);

      try {
        await supabase.from('ministries').insert([mapMinistryToDb(newMinistry)]);
      } catch (err) {
        console.error('Supabase add ministry error:', err);
      }

      return newMinistry;
    },
    [showToast]
  );

  const updateMinistry = useCallback(
    async (id, updatedData) => {
      let merged = null;
      setMinistries((prev) =>
        prev.map((m) => {
          if (m.id === id) {
            merged = { ...m, ...updatedData };
            return merged;
          }
          return m;
        })
      );
      showToast('Ministry details updated.');

      if (merged) {
        try {
          await supabase.from('ministries').update(mapMinistryToDb(merged)).eq('id', id);
        } catch (err) {
          console.error('Supabase ministry update error:', err);
        }
      }
    },
    [showToast]
  );

  const deleteMinistry = useCallback(
    async (id) => {
      setMinistries((prev) => prev.filter((m) => m.id !== id));
      setMembers((prev) =>
        prev.map((m) => ({
          ...m,
          ministryIds: (m.ministryIds || []).filter((mId) => mId !== id)
        }))
      );
      showToast('Ministry removed.', 'info');

      try {
        await supabase.from('ministries').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase ministry delete error:', err);
      }
    },
    [showToast]
  );

  const toggleMemberMinistry = useCallback(
    async (memberId, ministryId) => {
      let updatedMember = null;
      setMembers((prev) =>
        prev.map((m) => {
          if (m.id === memberId || m.memberId === memberId) {
            const currentList = m.ministryIds || [];
            const exists = currentList.includes(ministryId);
            const updatedList = exists
              ? currentList.filter((id) => id !== ministryId)
              : [...currentList, ministryId];
            updatedMember = { ...m, ministryIds: updatedList };
            return updatedMember;
          }
          return m;
        })
      );

      if (updatedMember) {
        try {
          await supabase
            .from('members')
            .update({ ministry_ids: updatedMember.ministryIds, updated_at: new Date().toISOString() })
            .eq('id', updatedMember.id);
        } catch (err) {
          console.error('Supabase update member ministries error:', err);
        }
      }
    },
    []
  );

  const setMinistryMembers = useCallback(
    async (ministryId, memberIdsToInclude) => {
      const updatedMembersList = [];
      setMembers((prev) =>
        prev.map((m) => {
          const shouldBeIn = memberIdsToInclude.includes(m.id) || memberIdsToInclude.includes(m.memberId);
          const currentList = m.ministryIds || [];
          const isCurrentlyIn = currentList.includes(ministryId);

          if (shouldBeIn && !isCurrentlyIn) {
            const updated = { ...m, ministryIds: [...currentList, ministryId] };
            updatedMembersList.push(updated);
            return updated;
          } else if (!shouldBeIn && isCurrentlyIn) {
            const updated = { ...m, ministryIds: currentList.filter((id) => id !== ministryId) };
            updatedMembersList.push(updated);
            return updated;
          }
          return m;
        })
      );
      showToast('Ministry roster updated.');

      for (const m of updatedMembersList) {
        try {
          await supabase
            .from('members')
            .update({ ministry_ids: m.ministryIds, updated_at: new Date().toISOString() })
            .eq('id', m.id);
        } catch (err) {
          console.error('Supabase update roster error:', err);
        }
      }
    },
    [showToast]
  );

  // --- Settings & Reset ---
  const updateSettings = useCallback(
    async (newSettings) => {
      const merged = { ...settings, ...newSettings };
      setSettings(merged);
      showToast('Church settings saved.');

      try {
        await supabase.from('church_settings').upsert(mapSettingsToDb(merged));
      } catch (err) {
        console.error('Supabase update settings error:', err);
      }
    },
    [settings, showToast]
  );

  const resetToDemoData = useCallback(() => {
    setSettings(initialChurchSettings);
    setMembers([]);
    setFamilies([]);
    setMinistries([]);
    showToast('Clean registration state initialized (all mock data removed).', 'info');
  }, [showToast]);

  // Export JSON Backup
  const exportDataJson = useCallback(() => {
    const exportObject = {
      settings,
      members,
      families,
      ministries,
      exportedAt: new Date().toISOString(),
      version: '3.0'
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `church_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Church data exported successfully.');
  }, [settings, members, families, ministries, showToast]);

  // Import JSON Backup
  const importDataJson = useCallback(
    async (jsonString) => {
      try {
        const parsed = JSON.parse(jsonString);
        if (parsed.members !== undefined && parsed.families !== undefined && parsed.ministries !== undefined) {
          if (parsed.settings) setSettings(parsed.settings);
          if (parsed.members) setMembers(parsed.members);
          if (parsed.families) setFamilies(parsed.families);
          if (parsed.ministries) setMinistries(parsed.ministries);

          try {
            if (parsed.members.length > 0) {
              await supabase.from('members').upsert(parsed.members.map(mapMemberToDb));
            }
            if (parsed.families.length > 0) {
              await supabase.from('families').upsert(parsed.families.map(mapFamilyToDb));
            }
            if (parsed.ministries.length > 0) {
              await supabase.from('ministries').upsert(parsed.ministries.map(mapMinistryToDb));
            }
          } catch (e) {
            console.error('Supabase import sync error:', e);
          }

          showToast('Backup restored successfully!');
          return true;
        } else {
          showToast('Invalid backup file format.', 'error');
          return false;
        }
      } catch {
        showToast('Failed to parse JSON file.', 'error');
        return false;
      }
    },
    [showToast]
  );

  // Helper getters
  const getMemberById = useCallback(
    (idOrMemberId) => {
      return members.find((m) => m.id === idOrMemberId || m.memberId === idOrMemberId) || null;
    },
    [members]
  );

  const getFamilyById = useCallback(
    (id) => {
      return families.find((f) => f.id === id) || null;
    },
    [families]
  );

  const getFamilyMembers = useCallback(
    (familyId) => {
      return members.filter((m) => m.familyId === familyId);
    },
    [members]
  );

  const getMinistryMembers = useCallback(
    (ministryId) => {
      return members.filter((m) => (m.ministryIds || []).includes(ministryId));
    },
    [members]
  );

  return (
    <ChurchContext.Provider
      value={{
        session,
        user,
        authLoading,
        isAuthenticated,
        signIn,
        signUp,
        signOut,
        resetPassword,
        login,
        logout,
        currentRole,
        setCurrentRole,
        theme,
        setTheme,
        toggleTheme,
        isSyncing,
        isSupabaseConnected,
        refreshData,
        userProfiles,
        pendingUsersCount,
        approveUser,
        rejectUser,
        changeUserRole,
        deleteUserAccount,
        updateAdminEmail,
        updateAdminPassword,
        updateAdminName,
        settings,
        updateSettings,
        members,
        generateMemberId,
        addMember,
        registerMemberWithFamily,
        recordBaptism,
        updateMember,
        deleteMember,
        toggleMemberStatus,
        families,
        addFamily,
        updateFamily,
        deleteFamily,
        ministries,
        addMinistry,
        updateMinistry,
        deleteMinistry,
        toggleMemberMinistry,
        setMinistryMembers,
        toast,
        showToast,
        resetToDemoData,
        exportDataJson,
        importDataJson,
        getMemberById,
        getFamilyById,
        getFamilyMembers,
        getMinistryMembers
      }}
    >
      {children}
    </ChurchContext.Provider>
  );
};

export const useChurch = () => {
  const context = useContext(ChurchContext);
  if (!context) {
    throw new Error('useChurch must be used within a ChurchProvider');
  }
  return context;
};
