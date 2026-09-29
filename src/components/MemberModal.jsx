import React, { useState, useEffect } from 'react';
import { useChurch } from '../context/ChurchContext';
import { ImagePositionModal } from './ImagePositionModal';
import {
  UserPlus,
  Edit2,
  X,
  Check,
  Home,
  Layers,
  Award,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  User,
  Sparkles,
  Users,
  Upload,
  Camera,
  Move
} from 'lucide-react';

// ── Wizard Step Indicator ──────────────────────────────────────
const WizardProgress = ({ currentStep, steps, onStepClick }) => (
  <div className="wizard-progress">
    {steps.map((step, i) => {
      const stepNum = i + 1;
      const isDone = stepNum < currentStep;
      const isActive = stepNum === currentStep;
      const isLast = i === steps.length - 1;
      return (
        <div
          key={step}
          className={`wizard-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
          onClick={() => isDone && onStepClick && onStepClick(stepNum)}
          style={{ cursor: isDone ? 'pointer' : 'default' }}
        >
          <div className="wizard-step__circle">
            {isDone ? <Check size={13} /> : stepNum}
          </div>
          <span className="wizard-step__label">{step}</span>
          {!isLast && <div className="wizard-step__line" />}
        </div>
      );
    })}
  </div>
);

const STEPS = ['Personal Info', 'Family Unit', 'Spiritual & Baptism', 'Ministries'];

export const MemberModal = ({ isOpen, onClose, memberToEdit = null }) => {
  const {
    addMember,
    updateMember,
    registerMemberWithFamily,
    generateMemberId,
    families,
    ministries
  } = useChurch();

  const isEditing = !!memberToEdit;

  const getInitialState = () => {
    if (memberToEdit) {
      return {
        memberId: memberToEdit.memberId || generateMemberId(),
        firstName: memberToEdit.firstName || '',
        lastName: memberToEdit.lastName || '',
        photo: memberToEdit.photo || '',
        rawPhoto: memberToEdit.rawPhoto || memberToEdit.photo || '',
        photoPosition: memberToEdit.photoPosition || null,
        gender: memberToEdit.gender || 'Male',
        dob: memberToEdit.dob || '',
        phone: memberToEdit.phone || '',
        email: memberToEdit.email || '',
        address: memberToEdit.address || '',
        maritalStatus: memberToEdit.maritalStatus || 'Single',
        occupation: memberToEdit.occupation || '',
        status: memberToEdit.status || 'Active',
        familyId: memberToEdit.familyId || '',
        familyRole: memberToEdit.familyRole || '',
        ministryIds: memberToEdit.ministryIds || [],
        spiritualInfo: {
          baptismStatus: memberToEdit.spiritualInfo?.baptismStatus || 'Unbaptized',
          baptismDate: memberToEdit.spiritualInfo?.baptismDate || '',
          salvationDate: memberToEdit.spiritualInfo?.salvationDate || '',
          officiatedBy: memberToEdit.spiritualInfo?.officiatedBy || '',
          location: memberToEdit.spiritualInfo?.location || 'Sanctuary Baptistery'
        },
        notes: memberToEdit.notes || ''
      };
    }
    return {
      memberId: generateMemberId(),
      firstName: '',
      lastName: '',
      photo: '',
      rawPhoto: '',
      photoPosition: null,
      gender: 'Male',
      dob: '',
      phone: '',
      email: '',
      address: '',
      maritalStatus: 'Single',
      occupation: '',
      status: 'Active',
      familyId: '',
      familyRole: '',
      ministryIds: [],
      spiritualInfo: {
        baptismStatus: 'Unbaptized',
        baptismDate: '',
        salvationDate: '',
        officiatedBy: '',
        location: 'Sanctuary Baptistery'
      },
      notes: ''
    };
  };

  const [formData, setFormData] = useState(getInitialState);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);

  // ── Family Mode State: 'new', 'existing', 'none' ─────────────
  const [familyMode, setFamilyMode] = useState('none');
  const [newFamilyData, setNewFamilyData] = useState({
    familyName: '',
    address: '',
    contactPhone: '',
    notes: ''
  });
  const [selectedFamilyId, setSelectedFamilyId] = useState('');
  const [familyRole, setFamilyRole] = useState('Head of Family');
  const [inlineFamilyMembers, setInlineFamilyMembers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const initial = getInitialState();
      setFormData(initial);
      setStep(1);
      setErrors({});

      if (memberToEdit) {
        if (memberToEdit.familyId) {
          setFamilyMode('existing');
          setSelectedFamilyId(memberToEdit.familyId);
          setFamilyRole(memberToEdit.familyRole || 'Member');
        } else {
          setFamilyMode('none');
        }
      } else {
        setFamilyMode('none');
        setNewFamilyData({
          familyName: '',
          address: '',
          contactPhone: '',
          notes: ''
        });
        setSelectedFamilyId('');
        setFamilyRole('Head of Family');
        setInlineFamilyMembers([]);
      }
    }
  }, [isOpen, memberToEdit]);

  // Auto-fill family name when last name changes in new family mode
  useEffect(() => {
    if (!isEditing && familyMode === 'new' && formData.lastName) {
      setNewFamilyData((prev) => ({
        ...prev,
        familyName: prev.familyName ? prev.familyName : `${formData.lastName} Family`,
        address: prev.address ? prev.address : formData.address,
        contactPhone: prev.contactPhone ? prev.contactPhone : formData.phone
      }));
    }
  }, [formData.lastName, formData.address, formData.phone, familyMode, isEditing]);

  if (!isOpen) return null;

  // ── Photo Upload Handler ──────────────────────────────────────
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setFormData((prev) => ({
        ...prev,
        photo: dataUrl,
        rawPhoto: dataUrl,
        photoPosition: null
      }));
      setIsPositionModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveFraming = (croppedUrl, positionMetadata) => {
    setFormData((prev) => ({
      ...prev,
      photo: croppedUrl,
      rawPhoto: positionMetadata.rawPhoto || prev.rawPhoto,
      photoPosition: positionMetadata
    }));
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: '', rawPhoto: '', photoPosition: null }));
  };

  // ── Form Input Handlers ───────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSpiritualChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      spiritualInfo: {
        ...prev.spiritualInfo,
        [name]: value
      }
    }));
  };

  const toggleMinistry = (ministryId) => {
    setFormData((prev) => {
      const current = prev.ministryIds || [];
      const updated = current.includes(ministryId)
        ? current.filter((id) => id !== ministryId)
        : [...current, ministryId];
      return { ...prev, ministryIds: updated };
    });
  };

  // ── Inline Family Builder Actions ─────────────────────────────
  const addInlineFamilyMember = (defaultRole = 'Son', defaultGender = 'Male') => {
    const newInline = {
      tempId: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      firstName: '',
      lastName: formData.lastName || '',
      gender: defaultGender,
      familyRole: defaultRole,
      dob: '',
      phone: '',
      email: '',
      spiritualInfo: {
        baptismStatus: 'Unbaptized',
        baptismDate: '',
        salvationDate: ''
      }
    };
    setInlineFamilyMembers((prev) => [...prev, newInline]);
  };

  const updateInlineFamilyMember = (tempId, field, value) => {
    setInlineFamilyMembers((prev) =>
      prev.map((item) => (item.tempId === tempId ? { ...item, [field]: value } : item))
    );
  };

  const updateInlineSpiritual = (tempId, field, value) => {
    setInlineFamilyMembers((prev) =>
      prev.map((item) =>
        item.tempId === tempId
          ? { ...item, spiritualInfo: { ...item.spiritualInfo, [field]: value } }
          : item
      )
    );
  };

  const removeInlineFamilyMember = (tempId) => {
    setInlineFamilyMembers((prev) => prev.filter((item) => item.tempId !== tempId));
  };

  // ── Validation ────────────────────────────────────────────────
  const validateStep = (currentStep) => {
    const errs = {};
    if (currentStep === 1) {
      if (!formData.firstName.trim()) errs.firstName = 'First name is required.';
      if (!formData.lastName.trim()) errs.lastName = 'Last name is required.';
    } else if (currentStep === 2) {
      if (familyMode === 'new') {
        if (!newFamilyData.familyName.trim()) errs.familyName = 'Family household name is required.';
      } else if (familyMode === 'existing') {
        if (!selectedFamilyId) errs.selectedFamilyId = 'Please select an existing family household.';
      }
      // Validate inline members
      inlineFamilyMembers.forEach((im, idx) => {
        if (!im.firstName.trim()) {
          errs[`inline_fn_${im.tempId}`] = `Member #${idx + 1} first name is required.`;
        }
      });
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  // ── Form Submission ───────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    if (isEditing) {
      const updatedMemberPayload = {
        ...formData,
        familyId: familyMode === 'none' ? null : (familyMode === 'existing' ? selectedFamilyId : formData.familyId),
        familyRole: familyMode === 'none' ? null : familyRole
      };
      updateMember(memberToEdit.id, updatedMemberPayload);
      onClose();
    } else {
      if (familyMode === 'new') {
        registerMemberWithFamily(
          formData,
          newFamilyData,
          familyRole,
          inlineFamilyMembers
        );
      } else if (familyMode === 'existing') {
        registerMemberWithFamily(
          formData,
          selectedFamilyId,
          familyRole,
          inlineFamilyMembers
        );
      } else {
        addMember(formData);
      }
      onClose();
    }
  };

  const Field = ({ label, required, error, children }) => (
    <div className={`form-group ${error ? 'has-error' : ''}`}>
      <label className="form-label">
        {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
      </label>
      {children}
      {error && <span className="form-error-msg">{error}</span>}
    </div>
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog lg animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-title-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              {isEditing ? <Edit2 size={18} /> : <UserPlus size={18} />}
            </div>
            <div>
              <h3 className="modal-title">
                {isEditing ? `Edit Profile: ${formData.firstName} ${formData.lastName}` : 'Register New Congregation Member'}
              </h3>
              <p className="modal-subtitle">
                {isEditing
                  ? 'Update member records, contact info, baptism status, and department roles.'
                  : 'Enroll a believer with contact info, household relationships, baptism record, and ministry roles.'}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Wizard Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-body" style={{ maxHeight: 'calc(80vh - 170px)', overflowY: 'auto', padding: '20px 24px' }}>
            {/* Auto ID & Status Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'var(--bg-app)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '18px',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  AUTO MEMBER ID:
                </span>
                <span className="member-id-pill" style={{ fontSize: '0.82rem' }}>{formData.memberId}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label className="form-label" style={{ margin: 0 }}>Membership Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                  style={{ width: 'auto', padding: '3px 8px', fontSize: '0.8rem' }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Wizard Progress Indicator */}
            <WizardProgress currentStep={step} steps={STEPS} onStepClick={setStep} />

            {/* ── STEP 1: Personal Info ─────────────────────────── */}
            {step === 1 && (
              <div className="animate-fade-in">
                {/* Photo Upload Widget */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '18px',
                    padding: '14px',
                    background: 'var(--bg-app)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '50%',
                      background: 'var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: '2px solid var(--border-color)',
                      cursor: formData.photo ? 'pointer' : 'default',
                      position: 'relative'
                    }}
                    onClick={() => {
                      if (formData.photo) setIsPositionModalOpen(true);
                    }}
                    title={formData.photo ? 'Click to adjust position & crop' : ''}
                  >
                    {formData.photo ? (
                      <img
                        src={formData.photo}
                        alt="Member Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <User size={30} color="var(--text-muted)" />
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Member Profile Photo (Optional)</span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
                        <Upload size={13} />
                        <span>{formData.photo ? 'Change Photo' : 'Upload Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                      {formData.photo && (
                        <>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setIsPositionModalOpen(true)}
                            style={{
                              background: 'var(--primary-light)',
                              color: 'var(--primary)',
                              borderColor: 'var(--primary)'
                            }}
                          >
                            <Move size={13} />
                            <span>Adjust Position</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={handleRemovePhoto}
                          >
                            <Trash2 size={13} />
                            <span>Remove</span>
                          </button>
                        </>
                      )}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Used on Member ID Card and Church Profile. Zoom, pan, and center face with "Adjust Position".
                    </span>
                  </div>
                </div>

                <div className="form-grid">
                  <Field label="First Name" required error={errors.firstName}>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="e.g. Dawit"
                      className="form-input"
                      autoFocus
                    />
                  </Field>

                  <Field label="Last Name" required error={errors.lastName}>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="e.g. Tadesse"
                      className="form-input"
                    />
                  </Field>

                  <Field label="Gender">
                    <select name="gender" value={formData.gender} onChange={handleChange} className="form-select">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </Field>

                  <Field label="Date of Birth">
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="form-input" />
                  </Field>

                  <Field label="Phone Number">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+251 900 000 000"
                      className="form-input"
                    />
                  </Field>

                  <Field label="Email Address">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="dawit.tadesse@example.com"
                      className="form-input"
                    />
                  </Field>

                  <Field label="Marital Status">
                    <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="form-select">
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Divorced">Divorced</option>
                    </select>
                  </Field>

                  <Field label="Occupation">
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      placeholder="e.g. Teacher, Engineer, Student"
                      className="form-input"
                    />
                  </Field>

                  <div className="form-group full">
                    <label className="form-label">Residential Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="e.g. Kebele 01, Yabello"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: Family Unit & Inline Builder ─────────── */}
            {step === 2 && (
              <div className="animate-fade-in">
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Organize members into households. You can create a new family and add spouse/children right here.
                </p>

                {/* Family Choice Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                  <div
                    className={`checkbox-item ${familyMode === 'new' ? 'checked' : ''}`}
                    onClick={() => setFamilyMode('new')}
                    style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '12px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                      <input type="radio" checked={familyMode === 'new'} onChange={() => { }} />
                      <span style={{ fontWeight: '700', fontSize: '0.88rem' }}>Create New Family</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Register household and add spouse or children in one go
                    </span>
                  </div>

                  <div
                    className={`checkbox-item ${familyMode === 'existing' ? 'checked' : ''}`}
                    onClick={() => setFamilyMode('existing')}
                    style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '12px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                      <input type="radio" checked={familyMode === 'existing'} onChange={() => { }} />
                      <span style={{ fontWeight: '700', fontSize: '0.88rem' }}>Join Existing Family</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Link to an already registered household
                    </span>
                  </div>

                  <div
                    className={`checkbox-item ${familyMode === 'none' ? 'checked' : ''}`}
                    onClick={() => setFamilyMode('none')}
                    style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '12px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                      <input type="radio" checked={familyMode === 'none'} onChange={() => { }} />
                      <span style={{ fontWeight: '700', fontSize: '0.88rem' }}>Individual (No Family)</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Register without linking to a family unit
                    </span>
                  </div>
                </div>

                {/* New Family Fields */}
                {familyMode === 'new' && (
                  <div style={{ padding: '16px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <Home size={16} color="var(--primary)" />
                      <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>New Household Details</span>
                    </div>
                    <div className="form-grid">
                      <Field label="Family Household Name" required error={errors.familyName}>
                        <input
                          type="text"
                          value={newFamilyData.familyName}
                          onChange={(e) => setNewFamilyData((prev) => ({ ...prev, familyName: e.target.value }))}
                          placeholder="e.g. Guyo Family"
                          className="form-input"
                        />
                      </Field>
                      <Field label="Primary Member Role">
                        <select value={familyRole} onChange={(e) => setFamilyRole(e.target.value)} className="form-select">
                          <option value="Head of Family">Head of Family</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Parent">Parent</option>
                          <option value="Member">Member</option>
                        </select>
                      </Field>
                      <Field label="Household Phone">
                        <input
                          type="tel"
                          value={newFamilyData.contactPhone}
                          onChange={(e) => setNewFamilyData((prev) => ({ ...prev, contactPhone: e.target.value }))}
                          placeholder="+251 900 000 000"
                          className="form-input"
                        />
                      </Field>
                      <Field label="Household Address">
                        <input
                          type="text"
                          value={newFamilyData.address}
                          onChange={(e) => setNewFamilyData((prev) => ({ ...prev, address: e.target.value }))}
                          placeholder="Residential address"
                          className="form-input"
                        />
                      </Field>
                    </div>
                  </div>
                )}

                {/* Existing Family Picker */}
                {familyMode === 'existing' && (
                  <div style={{ padding: '16px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '18px' }}>
                    <div className="form-grid">
                      <Field label="Select Household" required error={errors.selectedFamilyId}>
                        <select
                          value={selectedFamilyId}
                          onChange={(e) => setSelectedFamilyId(e.target.value)}
                          className="form-select"
                        >
                          <option value="">-- Choose Existing Family --</option>
                          {families.map((f) => (
                            <option key={f.id} value={f.id}>{f.familyName} ({f.memberIds?.length || 0} members)</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Role in This Household">
                        <select value={familyRole} onChange={(e) => setFamilyRole(e.target.value)} className="form-select">
                          <option value="Spouse">Spouse</option>
                          <option value="Son">Son</option>
                          <option value="Daughter">Daughter</option>
                          <option value="Parent">Parent</option>
                          <option value="Relative">Relative</option>
                          <option value="Member">Member</option>
                          <option value="Head of Family">Head of Family</option>
                        </select>
                      </Field>
                    </div>
                  </div>
                )}

                {/* Inline Family Members Builder */}
                {familyMode !== 'none' && !isEditing && (
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                        Add Family Members ({inlineFamilyMembers.length})
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => addInlineFamilyMember('Spouse', formData.gender === 'Male' ? 'Female' : 'Male')}
                        >
                          <Plus size={13} /> Spouse
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => addInlineFamilyMember('Son', 'Male')}
                        >
                          <Plus size={13} /> Son
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => addInlineFamilyMember('Daughter', 'Female')}
                        >
                          <Plus size={13} /> Daughter
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => addInlineFamilyMember('Relative', 'Male')}
                        >
                          <Plus size={13} /> Relative
                        </button>
                      </div>
                    </div>

                    {inlineFamilyMembers.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        Use the buttons above to add spouse, sons, daughters, or relatives to this household.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {inlineFamilyMembers.map((im, idx) => (
                          <div
                            key={im.tempId}
                            style={{
                              padding: '12px 14px',
                              background: 'var(--bg-card)',
                              border: '1px solid var(--border-color)',
                              borderRadius: 'var(--radius-md)',
                              position: 'relative'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)' }}>
                                #{idx + 1} · {im.familyRole}
                              </span>
                              <button
                                type="button"
                                className="btn btn-icon sm"
                                onClick={() => removeInlineFamilyMember(im.tempId)}
                                style={{ color: 'var(--danger)' }}
                                title="Remove member"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                              <div>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>First Name *</label>
                                <input
                                  type="text"
                                  value={im.firstName}
                                  onChange={(e) => updateInlineFamilyMember(im.tempId, 'firstName', e.target.value)}
                                  placeholder="First name"
                                  className="form-input"
                                  style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Last Name</label>
                                <input
                                  type="text"
                                  value={im.lastName}
                                  onChange={(e) => updateInlineFamilyMember(im.tempId, 'lastName', e.target.value)}
                                  placeholder="Last name"
                                  className="form-input"
                                  style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Role</label>
                                <select
                                  value={im.familyRole}
                                  onChange={(e) => updateInlineFamilyMember(im.tempId, 'familyRole', e.target.value)}
                                  className="form-select"
                                  style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                                >
                                  <option value="Spouse">Spouse</option>
                                  <option value="Son">Son</option>
                                  <option value="Daughter">Daughter</option>
                                  <option value="Parent">Parent</option>
                                  <option value="Relative">Relative</option>
                                  <option value="Member">Member</option>
                                </select>
                              </div>
                              <div>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Gender</label>
                                <select
                                  value={im.gender}
                                  onChange={(e) => updateInlineFamilyMember(im.tempId, 'gender', e.target.value)}
                                  className="form-select"
                                  style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                                >
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                </select>
                              </div>
                              <div>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Birthdate</label>
                                <input
                                  type="date"
                                  value={im.dob}
                                  onChange={(e) => updateInlineFamilyMember(im.tempId, 'dob', e.target.value)}
                                  className="form-input"
                                  style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Baptism Status</label>
                                <select
                                  value={im.spiritualInfo?.baptismStatus || 'Unbaptized'}
                                  onChange={(e) => updateInlineSpiritual(im.tempId, 'baptismStatus', e.target.value)}
                                  className="form-select"
                                  style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                                >
                                  <option value="Unbaptized">Unbaptized</option>
                                  <option value="Baptized">Baptized</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 3: Spiritual & Baptism ──────────────────── */}
            {step === 3 && (
              <div className="animate-fade-in">
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Manage Holy Baptism records, salvation testimony, and pastoral notes.
                </p>

                <div className="form-grid">
                  <Field label="Baptism Status">
                    <select
                      name="baptismStatus"
                      value={formData.spiritualInfo.baptismStatus}
                      onChange={handleSpiritualChange}
                      className="form-select"
                    >
                      <option value="Unbaptized">Unbaptized (Baptism Candidate)</option>
                      <option value="Baptized">Baptized Believer</option>
                    </select>
                  </Field>

                  {formData.spiritualInfo.baptismStatus === 'Baptized' && (
                    <>
                      <Field label="Date of Baptism">
                        <input
                          type="date"
                          name="baptismDate"
                          value={formData.spiritualInfo.baptismDate}
                          onChange={handleSpiritualChange}
                          className="form-input"
                        />
                      </Field>

                      <Field label="Officiating Reverend / Kes">
                        <input
                          type="text"
                          name="officiatedBy"
                          value={formData.spiritualInfo.officiatedBy}
                          onChange={handleSpiritualChange}
                          placeholder="e.g. Reverend (Kes) Desta Guyo"
                          className="form-input"
                        />
                      </Field>

                      <Field label="Baptism Location">
                        <input
                          type="text"
                          name="location"
                          value={formData.spiritualInfo.location}
                          onChange={handleSpiritualChange}
                          placeholder="e.g. EECMY Yabello Sanctuary"
                          className="form-input"
                        />
                      </Field>
                    </>
                  )}

                  <Field label="Date of Salvation (Optional)">
                    <input
                      type="date"
                      name="salvationDate"
                      value={formData.spiritualInfo.salvationDate}
                      onChange={handleSpiritualChange}
                      className="form-input"
                    />
                  </Field>

                  <div className="form-group full">
                    <label className="form-label">Kes & Pastoral Testimony Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Spiritual background, special prayer requests, spiritual gifts..."
                      className="form-textarea"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 4: Ministries ───────────────────────────── */}
            {step === 4 && (
              <div className="animate-fade-in">
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Select all ministries and volunteer teams this member serves in.
                </p>

                <div className="checkbox-grid">
                  {ministries.map((min) => {
                    const isChecked = (formData.ministryIds || []).includes(min.id);
                    return (
                      <div
                        key={min.id}
                        className={`checkbox-item ${isChecked ? 'checked' : ''}`}
                        onClick={() => toggleMinistry(min.id)}
                        style={{ borderLeft: isChecked ? '4px solid var(--primary)' : undefined }}
                      >
                        <input type="checkbox" checked={isChecked} onChange={() => { }} style={{ cursor: 'pointer' }} />
                        <div>
                          <div style={{ fontSize: '0.84rem', fontWeight: '700' }}>{min.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{min.category}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Registration summary preview */}
                <div style={{ marginTop: '20px', padding: '12px 16px', background: 'var(--primary-light)', border: '1px solid var(--primary-border)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--primary-active)', marginBottom: '4px' }}>
                    Ready to Complete Registration
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    • Primary Member: <strong>{formData.firstName || '—'} {formData.lastName || '—'}</strong> ({formData.gender}, {formData.maritalStatus})
                    <br />
                    • Household: <strong>{familyMode === 'new' ? newFamilyData.familyName || 'New Family' : (familyMode === 'existing' ? 'Linked Household' : 'Individual')}</strong>
                    {inlineFamilyMembers.length > 0 && ` (+ ${inlineFamilyMembers.length} family members)`}
                    <br />
                    • Baptism: <strong>{formData.spiritualInfo.baptismStatus}</strong> • Ministries: <strong>{(formData.ministryIds || []).length} assigned</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            {step > 1 && (
              <button type="button" className="btn btn-secondary" onClick={handleBack} style={{ marginRight: 'auto' }}>
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>
            )}
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            {step < STEPS.length ? (
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                <span>Next Step</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button type="submit" className="btn btn-primary">
                <Check size={16} />
                <span>{isEditing ? 'Save Member Profile' : `Complete Registration (${inlineFamilyMembers.length + 1} People)`}</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {isPositionModalOpen && (
        <ImagePositionModal
          isOpen={isPositionModalOpen}
          imageSrc={formData.rawPhoto || formData.photo}
          initialPosition={formData.photoPosition}
          memberName={`${formData.firstName} ${formData.lastName}`.trim() || 'Member'}
          onSave={handleSaveFraming}
          onClose={() => setIsPositionModalOpen(false)}
        />
      )}
    </div>
  );
};
