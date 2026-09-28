import React, { useState, useEffect } from 'react';
import { useChurch } from '../context/ChurchContext';
import {
  Award,
  Printer,
  X,
  Edit3,
  Check,
  RotateCcw
} from 'lucide-react';

export const BaptismCertificateModal = ({
  isOpen,
  onClose,
  memberId
}) => {
  const { settings, getMemberById } = useChurch();

  const member = memberId ? getMemberById(memberId) : null;

  // Editable Certificate Fields
  const [certData, setCertData] = useState({
    candidateName: '',
    baptismDate: '',
    location: '',
    officiant: '',
    witness: '',
    certNumber: '',
    scriptureQuote: '“Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you.”',
    scriptureRef: '— Matthew 28:19–20'
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (member) {
      const baptismInfo = member.spiritualInfo || {};
      const date = baptismInfo.baptismDate || new Date().toISOString().split('T')[0];
      const certNo = baptismInfo.certificateNo || `BAP-${new Date().getFullYear()}-${member.memberId.replace(/[^0-9]/g, '').slice(-3) || '101'}`;
      const off = baptismInfo.officiatedBy || settings.seniorPastor || 'Reverend (Kes) Desta Guyo';
      const wit = baptismInfo.witness || 'Church Council Elder';
      const loc = baptismInfo.location || 'EECMY Sanctuary Baptistery, Yabello';

      setCertData({
        candidateName: `${member.firstName} ${member.lastName}`,
        baptismDate: date,
        location: loc,
        officiant: off,
        witness: wit,
        certNumber: certNo,
        scriptureQuote: '“Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you.”',
        scriptureRef: '— Matthew 28:19–20'
      });
      setIsEditing(false);
    }
  }, [member, settings]);

  if (!isOpen || !member) return null;

  // Format date: e.g. "18th day of June, in the year of our Lord 2026"
  const formatDateToSpelled = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = d.getDate();
      const month = d.toLocaleString('default', { month: 'long' });
      const year = d.getFullYear();
      
      const nth = (n) => {
        if (n > 3 && n < 21) return 'th';
        switch (n % 10) {
          case 1:  return 'st';
          case 2:  return 'nd';
          case 3:  return 'rd';
          default: return 'th';
        }
      };

      return `${day}${nth(day)} day of ${month}, in the year of our Lord ${year}`;
    } catch {
      return dateStr;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog lg cert-modal-dialog animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header no-print">
          <div className="modal-title">
            <Award size={22} color="var(--primary)" />
            <span>Official Baptism Certificate</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className={`btn btn-sm ${isEditing ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setIsEditing(!isEditing)}
              type="button"
            >
              <Edit3 size={15} />
              <span>{isEditing ? 'Close Editor' : 'Edit Certificate Text'}</span>
            </button>
            <button className="btn btn-primary btn-sm" onClick={handlePrint} type="button">
              <Printer size={16} />
              <span>Print Certificate (A4)</span>
            </button>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Live Edit Form Drawer (if enabled) */}
        {isEditing && (
          <div className="cert-editor-panel no-print animate-fade-in" style={{ padding: '14px 20px', background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>
              Inline Certificate Details Editor (Changes update the live preview below):
            </div>
            <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Candidate Full Name</label>
                <input
                  type="text"
                  value={certData.candidateName}
                  onChange={(e) => setCertData({ ...certData, candidateName: e.target.value })}
                  className="form-input"
                  style={{ padding: '4px 8px', fontSize: '0.82rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Baptism Date</label>
                <input
                  type="date"
                  value={certData.baptismDate}
                  onChange={(e) => setCertData({ ...certData, baptismDate: e.target.value })}
                  className="form-input"
                  style={{ padding: '4px 8px', fontSize: '0.82rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Officiating Reverend / Kes</label>
                <input
                  type="text"
                  value={certData.officiant}
                  onChange={(e) => setCertData({ ...certData, officiant: e.target.value })}
                  className="form-input"
                  style={{ padding: '4px 8px', fontSize: '0.82rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Baptism Location</label>
                <input
                  type="text"
                  value={certData.location}
                  onChange={(e) => setCertData({ ...certData, location: e.target.value })}
                  className="form-input"
                  style={{ padding: '4px 8px', fontSize: '0.82rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Church Witness / Elder</label>
                <input
                  type="text"
                  value={certData.witness}
                  onChange={(e) => setCertData({ ...certData, witness: e.target.value })}
                  className="form-input"
                  style={{ padding: '4px 8px', fontSize: '0.82rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Certificate Serial No.</label>
                <input
                  type="text"
                  value={certData.certNumber}
                  onChange={(e) => setCertData({ ...certData, certNumber: e.target.value })}
                  className="form-input"
                  style={{ padding: '4px 8px', fontSize: '0.82rem' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Certificate Container */}
        <div className="modal-body cert-preview-scroll">
          <div className="cert-sheet">
            <div className="cert-outer-border">
              <div className="cert-inner-border">
                {/* Corner Ornaments */}
                <div className="cert-corner tl" />
                <div className="cert-corner tr" />
                <div className="cert-corner bl" />
                <div className="cert-corner br" />

                {/* Certificate Content Header */}
                <div className="cert-header">
                  <div className="cert-cross-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    <img
                      src="/church-logo.png"
                      alt="EECMY Cross Logo"
                      style={{ width: '52px', height: '52px', objectFit: 'contain' }}
                    />
                  </div>
                  <h2 className="cert-church-name">{settings.churchName}</h2>
                  <div className="cert-church-location">
                    Ethiopian Evangelical Church Mekane Yesus • Yabello Congregation • Founded {settings.foundedYear || 1978}
                  </div>
                  <div className="cert-divider" />
                  <h1 className="cert-main-title">Certificate of Holy Baptism</h1>
                  <div className="cert-sub-title">
                    IN THE NAME OF THE FATHER, AND OF THE SON, AND OF THE HOLY SPIRIT
                  </div>
                </div>

                {/* Certificate Body Text */}
                <div className="cert-body">
                  <p className="cert-declares-text">This is to certify that</p>
                  
                  <div className="cert-candidate-name">
                    {certData.candidateName}
                  </div>

                  <p className="cert-statement-text">
                    having confessed faith in Jesus Christ as Lord and Savior, was baptized by holy immersion at{' '}
                    <strong>{certData.location}</strong> on the
                  </p>

                  <div className="cert-date-text">
                    {formatDateToSpelled(certData.baptismDate)}
                  </div>

                  {/* Scripture Verse */}
                  <div className="cert-scripture-box">
                    <p className="cert-scripture-quote">
                      {certData.scriptureQuote}
                    </p>
                    <span className="cert-scripture-ref">{certData.scriptureRef}</span>
                  </div>

                  {/* Signatures & Seal Grid */}
                  <div className="cert-signatures-grid">
                    <div className="cert-sig-box">
                      <div className="cert-sig-line">
                        <span className="cert-signature-font">{certData.officiant}</span>
                      </div>
                      <span className="cert-sig-title">Officiating Reverend / Kes</span>
                      <span className="cert-sig-sub">{settings.churchName}</span>
                    </div>

                    <div className="cert-seal-box">
                      <div className="cert-gold-seal">
                        <div className="cert-gold-seal-inner">
                          <img
                            src="/church-logo.png"
                            alt="Seal"
                            style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                          />
                          <span className="cert-seal-church">EECMY</span>
                          <span className="cert-seal-word">SEAL</span>
                        </div>
                      </div>
                      <span className="cert-reg-no">Cert. No: {certData.certNumber}</span>
                    </div>

                    <div className="cert-sig-box">
                      <div className="cert-sig-line">
                        <span className="cert-signature-font">{certData.witness}</span>
                      </div>
                      <span className="cert-sig-title">Church Witness / Elder</span>
                      <span className="cert-sig-sub">Member ID: {member.memberId}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer no-print">
          <div style={{ marginRight: 'auto', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Official archival high-resolution certificate ready for framing.
          </div>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print Official Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
