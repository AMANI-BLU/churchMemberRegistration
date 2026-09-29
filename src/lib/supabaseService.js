import { supabase } from './supabase';

// --- Mappers to handle snake_case DB columns <-> camelCase React objects ---

export const mapMemberFromDb = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    memberId: row.member_id || row.memberId || row.id,
    firstName: row.first_name || row.firstName || '',
    middleName: row.middle_name || row.middleName || '',
    lastName: row.last_name || row.lastName || '',
    gender: row.gender || 'Male',
    dob: row.dob || '',
    bloodGroup: row.blood_group || row.bloodGroup || '',
    phone: row.phone || '',
    email: row.email || '',
    address: row.address || '',
    city: row.city || 'Yabello',
    subCity: row.sub_city || row.subCity || '',
    houseNumber: row.house_number || row.houseNumber || '',
    maritalStatus: row.marital_status || row.maritalStatus || 'Single',
    occupation: row.occupation || '',
    emergencyContactName: row.emergency_contact_name || row.emergencyContactName || '',
    emergencyContactPhone: row.emergency_contact_phone || row.emergencyContactPhone || '',
    emergencyContactRelation: row.emergency_contact_relation || row.emergencyContactRelation || '',
    registeredAt: row.registered_at || row.registeredAt || new Date().toISOString().split('T')[0],
    registeredBy: row.registered_by || row.registeredBy || 'Admin',
    status: row.status || 'Active',
    photo: row.photo || '',
    familyId: row.family_id || row.familyId || null,
    familyRole: row.family_role || row.familyRole || null,
    ministryIds: Array.isArray(row.ministry_ids)
      ? row.ministry_ids
      : Array.isArray(row.ministryIds)
      ? row.ministryIds
      : [],
    spiritualInfo: row.spiritual_info || row.spiritualInfo || {
      baptismStatus: 'Unbaptized',
      baptismDate: '',
      salvationDate: '',
      certificateNo: '',
      officiatedBy: '',
      location: '',
      witness: ''
    },
    notes: row.notes || ''
  };
};

export const mapMemberToDb = (member) => {
  return {
    id: member.id,
    member_id: member.memberId,
    first_name: member.firstName || '',
    middle_name: member.middleName || '',
    last_name: member.lastName || '',
    gender: member.gender || 'Male',
    dob: member.dob || '',
    blood_group: member.bloodGroup || '',
    phone: member.phone || '',
    email: member.email || '',
    address: member.address || '',
    city: member.city || 'Yabello',
    sub_city: member.subCity || '',
    house_number: member.houseNumber || '',
    marital_status: member.maritalStatus || 'Single',
    occupation: member.occupation || '',
    emergency_contact_name: member.emergencyContactName || '',
    emergency_contact_phone: member.emergencyContactPhone || '',
    emergency_contact_relation: member.emergencyContactRelation || '',
    registered_at: member.registeredAt || new Date().toISOString().split('T')[0],
    registered_by: member.registeredBy || 'Admin',
    status: member.status || 'Active',
    photo: member.photo || '',
    family_id: member.familyId || null,
    family_role: member.familyRole || null,
    ministry_ids: member.ministryIds || [],
    spiritual_info: member.spiritualInfo || {},
    notes: member.notes || '',
    updated_at: new Date().toISOString()
  };
};

export const mapFamilyFromDb = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    familyName: row.family_name || row.familyName || '',
    headMemberId: row.head_member_id || row.headMemberId || '',
    memberIds: Array.isArray(row.member_ids)
      ? row.member_ids
      : Array.isArray(row.memberIds)
      ? row.memberIds
      : [],
    address: row.address || '',
    contactPhone: row.contact_phone || row.contactPhone || '',
    notes: row.notes || ''
  };
};

export const mapFamilyToDb = (family) => {
  return {
    id: family.id,
    family_name: family.familyName || '',
    head_member_id: family.headMemberId || '',
    member_ids: family.memberIds || [],
    address: family.address || '',
    contact_phone: family.contactPhone || '',
    notes: family.notes || '',
    updated_at: new Date().toISOString()
  };
};

export const mapMinistryFromDb = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name || '',
    category: row.category || 'General',
    leaderName: row.leader_name || row.leaderName || '',
    leaderContact: row.leader_contact || row.leaderContact || '',
    meetingSchedule: row.meeting_schedule || row.meetingSchedule || '',
    description: row.description || '',
    badgeColor: row.badge_color || row.badgeColor || '#2563eb'
  };
};

export const mapMinistryToDb = (ministry) => {
  return {
    id: ministry.id,
    name: ministry.name || '',
    category: ministry.category || 'General',
    leader_name: ministry.leaderName || '',
    leader_contact: ministry.leaderContact || '',
    meeting_schedule: ministry.meetingSchedule || '',
    description: ministry.description || '',
    badge_color: ministry.badgeColor || '#2563eb',
    updated_at: new Date().toISOString()
  };
};

export const mapSettingsFromDb = (row) => {
  if (!row) return null;
  return {
    churchName: row.church_name || row.churchName || 'EECMY YABELLO',
    tagline: row.tagline || 'Proclaiming Christ, Growing in Faith & Serving in Love',
    seniorPastor: row.senior_pastor || row.seniorPastor || 'Reverend (Kes) Desta Guyo',
    address: row.address || 'EECMY Compound, Yabello, Borana, Oromia, Ethiopia',
    phone: row.phone || '+251 46 443 0122',
    email: row.email || 'contact@eecmy-yabello.org',
    website: row.website || 'www.eecmy-yabello.org',
    foundedYear: row.founded_year || row.foundedYear || 1978,
    statement: row.statement || 'Serving the Whole Person: Spiritual Growth, Community Love, and Holy Discipleship.',
    logoUrl: row.logo_url || row.logoUrl || ''
  };
};

export const mapSettingsToDb = (settings) => {
  return {
    id: 'default_settings',
    church_name: settings.churchName || '',
    tagline: settings.tagline || '',
    senior_pastor: settings.seniorPastor || '',
    address: settings.address || '',
    phone: settings.phone || '',
    email: settings.email || '',
    website: settings.website || '',
    founded_year: settings.foundedYear || 1978,
    statement: settings.statement || '',
    logo_url: settings.logoUrl || '',
    updated_at: new Date().toISOString()
  };
};

// --- Database Operations ---

export const fetchAllChurchData = async () => {
  try {
    const [membersRes, familiesRes, ministriesRes, settingsRes, usersRes] = await Promise.all([
      supabase.from('members').select('*').order('created_at', { ascending: false }),
      supabase.from('families').select('*').order('created_at', { ascending: false }),
      supabase.from('ministries').select('*').order('name', { ascending: true }),
      supabase.from('church_settings').select('*').limit(1).maybeSingle(),
      supabase.from('user_profiles').select('*').order('created_at', { ascending: false })
    ]);

    return {
      members: (membersRes.data || []).map(mapMemberFromDb),
      families: (familiesRes.data || []).map(mapFamilyFromDb),
      ministries: (ministriesRes.data || []).map(mapMinistryFromDb),
      settings: settingsRes.data ? mapSettingsFromDb(settingsRes.data) : null,
      userProfiles: usersRes.data || [],
      error: membersRes.error || familiesRes.error || ministriesRes.error || settingsRes.error || null
    };
  } catch (err) {
    console.error('Error fetching Supabase data:', err);
    return { members: [], families: [], ministries: [], settings: null, userProfiles: [], error: err };
  }
};

// User Profile & Approval Operations
export const fetchUserProfiles = async () => {
  try {
    const { data, error } = await supabase.from('user_profiles').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('fetchUserProfiles notice:', err.message);
    return [];
  }
};

export const updateUserProfileStatus = async (userId, status) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select();
  if (error) throw error;
  return data;
};

export const updateUserProfileRole = async (userId, role) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select();
  if (error) throw error;
  return data;
};

export const deleteUserProfile = async (userId) => {
  const { error } = await supabase.from('user_profiles').delete().eq('id', userId);
  if (error) throw error;
  return true;
};
