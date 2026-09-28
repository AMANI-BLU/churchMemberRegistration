import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  initialChurchSettings,
  initialMinistries,
  initialFamilies,
  initialMembers
} from '../data/initialData';

const ChurchContext = createContext();

const STORAGE_KEYS = {
  SETTINGS: 'church_mgmt_settings_v1',
  MEMBERS: 'church_mgmt_members_v1',
  FAMILIES: 'church_mgmt_families_v1',
  MINISTRIES: 'church_mgmt_ministries_v1',
  ROLE: 'church_mgmt_current_role_v1',
  AUTH: 'church_mgmt_auth_v1',
  THEME: 'church_mgmt_theme_v1'
};

export const ChurchProvider = ({ children }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem(STORAGE_KEYS.AUTH);
    return savedAuth !== null ? JSON.parse(savedAuth) : true;
  });

  // Current user role: 'admin' or 'staff'
  const [currentRole, setCurrentRoleState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.ROLE) || 'admin';
  });

  // Global Theme: 'light' or 'dark'
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  });

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

  const login = useCallback((role = 'admin') => {
    setIsAuthenticated(true);
    setCurrentRoleState(role);
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(true));
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(false));
  }, []);

  // Church Settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          parsed.churchName === 'Grace Community Fellowship' ||
          !parsed.churchName ||
          parsed.seniorPastor === 'Pastor Desta Guyo'
        ) {
          return { ...parsed, ...initialChurchSettings };
        }
        return parsed;
      } catch (e) {
        return initialChurchSettings;
      }
    }
    return initialChurchSettings;
  });

  // Members
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return saved ? JSON.parse(saved) : initialMembers;
  });

  // Families
  const [families, setFamilies] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAMILIES);
    return saved ? JSON.parse(saved) : initialFamilies;
  });

  // Ministries
  const [ministries, setMinistries] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MINISTRIES);
    return saved ? JSON.parse(saved) : initialMinistries;
  });

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Sync state to localStorage
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
  const addMember = useCallback((memberData) => {
    const newId = `mem-${Date.now()}`;
    const autoMemberId = memberData.memberId || generateMemberId();
    const today = new Date().toISOString().split('T')[0];

    const newMember = {
      ...memberData,
      id: newId,
      memberId: autoMemberId,
      registeredAt: memberData.registeredAt || today,
      registeredBy: currentRole === 'admin' ? 'Admin' : 'Staff',
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

    // Link to family if familyId provided
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
    return newMember;
  }, [generateMemberId, currentRole, settings.seniorPastor, showToast]);

  // Register Member with Household
  const registerMemberWithFamily = useCallback((primaryMemberData, familyModeData, primaryRole = 'Head of Family', inlineMembers = []) => {
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

    const primaryMember = {
      ...primaryMemberData,
      id: primaryId,
      memberId: primaryAutoId,
      familyId: assignedFamilyId,
      familyRole: primaryRole || 'Head of Family',
      registeredAt: primaryMemberData.registeredAt || today,
      registeredBy: currentRole === 'admin' ? 'Admin' : 'Staff',
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
        registeredBy: currentRole === 'admin' ? 'Admin' : 'Staff',
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
    return createdMembers;
  }, [members, currentRole, settings.seniorPastor, showToast]);

  // Record Believer Baptism
  const recordBaptism = useCallback((memberIdOrId, baptismRecord) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberIdOrId || m.memberId === memberIdOrId) {
          const certNumber = baptismRecord.certificateNo || `BAP-${new Date().getFullYear()}-${m.memberId.replace(/[^0-9]/g, '')}`;
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
          return {
            ...m,
            spiritualInfo: updatedSpiritual,
            notes: baptismRecord.notes ? `${m.notes ? m.notes + '\n' : ''}[Baptism Note: ${baptismRecord.notes}]` : m.notes
          };
        }
        return m;
      })
    );
    showToast('Holy Baptism recorded and certificate generated.');
  }, [settings.seniorPastor, showToast]);

  const updateMember = useCallback((id, updatedData) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const merged = { ...m, ...updatedData };
          // If familyId changed, update old and new families
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
          return merged;
        }
        return m;
      })
    );
    showToast('Member record updated successfully.');
  }, [showToast]);

  const deleteMember = useCallback((id) => {
    const member = members.find((m) => m.id === id);
    if (!member) return;

    setMembers((prev) => prev.filter((m) => m.id !== id));
    // Clean up family head references
    setFamilies((prev) =>
      prev.map((f) => (f.headMemberId === member.memberId ? { ...f, headMemberId: '' } : f))
    );
    showToast(`Member "${member.firstName} ${member.lastName}" removed.`, 'info');
  }, [members, showToast]);

  const toggleMemberStatus = useCallback((id) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const newStatus = m.status === 'Active' ? 'Inactive' : 'Active';
          showToast(`Member status changed to ${newStatus}.`);
          return { ...m, status: newStatus };
        }
        return m;
      })
    );
  }, [showToast]);

  // --- Family Actions ---
  const addFamily = useCallback((familyData) => {
    const newFamily = {
      ...familyData,
      id: `fam-${Date.now()}`,
      memberIds: familyData.memberIds || []
    };
    setFamilies((prev) => [newFamily, ...prev]);
    showToast(`Family "${newFamily.familyName}" created.`);
    return newFamily;
  }, [showToast]);

  const updateFamily = useCallback((id, updatedData) => {
    setFamilies((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updatedData } : f))
    );
    showToast('Family record updated.');
  }, [showToast]);

  const deleteFamily = useCallback((id) => {
    setFamilies((prev) => prev.filter((f) => f.id !== id));
    setMembers((prev) =>
      prev.map((m) => (m.familyId === id ? { ...m, familyId: null, familyRole: null } : m))
    );
    showToast('Family record deleted.', 'info');
  }, [showToast]);

  // --- Ministry Actions ---
  const addMinistry = useCallback((ministryData) => {
    const newMinistry = {
      ...ministryData,
      id: `min-${Date.now()}`,
      badgeColor: ministryData.badgeColor || '#2563eb'
    };
    setMinistries((prev) => [...prev, newMinistry]);
    showToast(`Ministry "${newMinistry.name}" added.`);
    return newMinistry;
  }, [showToast]);

  const updateMinistry = useCallback((id, updatedData) => {
    setMinistries((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedData } : m))
    );
    showToast('Ministry details updated.');
  }, [showToast]);

  const deleteMinistry = useCallback((id) => {
    setMinistries((prev) => prev.filter((m) => m.id !== id));
    setMembers((prev) =>
      prev.map((m) => ({
        ...m,
        ministryIds: (m.ministryIds || []).filter((mId) => mId !== id)
      }))
    );
    showToast('Ministry removed.', 'info');
  }, [showToast]);

  const toggleMemberMinistry = useCallback((memberId, ministryId) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId || m.memberId === memberId) {
          const currentList = m.ministryIds || [];
          const exists = currentList.includes(ministryId);
          const updatedList = exists
            ? currentList.filter((id) => id !== ministryId)
            : [...currentList, ministryId];
          return { ...m, ministryIds: updatedList };
        }
        return m;
      })
    );
  }, []);

  const setMinistryMembers = useCallback((ministryId, memberIdsToInclude) => {
    setMembers((prev) =>
      prev.map((m) => {
        const shouldBeIn = memberIdsToInclude.includes(m.id) || memberIdsToInclude.includes(m.memberId);
        const currentList = m.ministryIds || [];
        const isCurrentlyIn = currentList.includes(ministryId);

        if (shouldBeIn && !isCurrentlyIn) {
          return { ...m, ministryIds: [...currentList, ministryId] };
        } else if (!shouldBeIn && isCurrentlyIn) {
          return { ...m, ministryIds: currentList.filter((id) => id !== ministryId) };
        }
        return m;
      })
    );
    showToast('Ministry roster updated.');
  }, [showToast]);

  // --- Settings & Reset ---
  const updateSettings = useCallback((newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Church settings saved.');
  }, [showToast]);

  const resetToDemoData = useCallback(() => {
    setSettings(initialChurchSettings);
    setMembers(initialMembers);
    setFamilies(initialFamilies);
    setMinistries(initialMinistries);
    showToast('System data reset to initial EECMY YABELLO demo data.', 'info');
  }, [showToast]);

  // Export JSON Backup
  const exportDataJson = useCallback(() => {
    const exportObject = {
      settings,
      members,
      families,
      ministries,
      exportedAt: new Date().toISOString(),
      version: '2.0'
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `eecmy_church_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Church data exported successfully.');
  }, [settings, members, families, ministries, showToast]);

  // Import JSON Backup
  const importDataJson = useCallback((jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.members && parsed.families && parsed.ministries) {
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.members) setMembers(parsed.members);
        if (parsed.families) setFamilies(parsed.families);
        if (parsed.ministries) setMinistries(parsed.ministries);
        showToast('Backup restored successfully!');
        return true;
      } else {
        showToast('Invalid backup file format.', 'error');
        return false;
      }
    } catch (err) {
      showToast('Failed to parse JSON file.', 'error');
      return false;
    }
  }, [showToast]);

  // Helper getters
  const getMemberById = useCallback((idOrMemberId) => {
    return members.find((m) => m.id === idOrMemberId || m.memberId === idOrMemberId) || null;
  }, [members]);

  const getFamilyById = useCallback((id) => {
    return families.find((f) => f.id === id) || null;
  }, [families]);

  const getFamilyMembers = useCallback((familyId) => {
    return members.filter((m) => m.familyId === familyId);
  }, [members]);

  const getMinistryMembers = useCallback((ministryId) => {
    return members.filter((m) => (m.ministryIds || []).includes(ministryId));
  }, [members]);

  return (
    <ChurchContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        currentRole,
        setCurrentRole,
        theme,
        setTheme,
        toggleTheme,
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
