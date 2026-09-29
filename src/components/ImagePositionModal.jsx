import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Move,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Check,
  X,
  RefreshCw,
  Grid,
  Circle,
  Square,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  User,
  Sliders,
  Sparkles,
  Layers,
  CreditCard
} from 'lucide-react';

const VIEWPORT_SIZE = 320; // px
const CANVAS_OUTPUT_SIZE = 800; // px high resolution

export const ImagePositionModal = ({
  isOpen,
  imageSrc,
  initialPosition = null,
  memberName = 'Member',
  onSave,
  onClose
}) => {
  const [imgElement, setImgElement] = useState(null);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [maskType, setMaskType] = useState('both'); // 'badge' | 'circle' | 'both'
  const [showGrid, setShowGrid] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Load the image to get dimensions
  useEffect(() => {
    if (!isOpen || !imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImgElement(img);
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = imageSrc;

    // Set initial position if provided
    if (initialPosition) {
      setPan(initialPosition.pan || { x: initialPosition.x || 0, y: initialPosition.y || 0 });
      setZoom(initialPosition.zoom || initialPosition.scale || 1);
      setRotate(initialPosition.rotate || 0);
    } else {
      setPan({ x: 0, y: 0 });
      setZoom(1);
      setRotate(0);
    }
  }, [isOpen, imageSrc, initialPosition]);

  if (!isOpen || !imageSrc) return null;

  // Calculate base display scaling to fit/cover the 320px viewport
  const isRotated90or270 = rotate % 180 !== 0;
  const effectiveW = isRotated90or270 ? naturalSize.height : naturalSize.width;
  const effectiveH = isRotated90or270 ? naturalSize.width : naturalSize.height;

  let baseScale = 1;
  if (effectiveW > 0 && effectiveH > 0) {
    baseScale = Math.max(VIEWPORT_SIZE / effectiveW, VIEWPORT_SIZE / effectiveH);
  }

  const displayW = naturalSize.width * baseScale;
  const displayH = naturalSize.height * baseScale;

  // Pointer drag handlers for panning
  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy
    });
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        if (containerRef.current && containerRef.current.hasPointerCapture(e.pointerId)) {
          containerRef.current.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }
    }
  };

  // Scroll wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((prev) => Math.min(3.5, Math.max(0.8, +(prev + zoomDelta).toFixed(2))));
  };

  // Nudge functions
  const nudge = (dx, dy) => {
    setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  // Presets
  const applyPreset = (type) => {
    switch (type) {
      case 'center':
        setPan({ x: 0, y: 0 });
        setZoom(1);
        break;
      case 'face':
        setPan({ x: 0, y: Math.round(VIEWPORT_SIZE * 0.18) });
        setZoom((z) => Math.max(1.15, z));
        break;
      case 'bust':
        setPan({ x: 0, y: -Math.round(VIEWPORT_SIZE * 0.12) });
        break;
      case 'left':
        setPan((prev) => ({ ...prev, x: -Math.round(VIEWPORT_SIZE * 0.15) }));
        break;
      case 'right':
        setPan((prev) => ({ ...prev, x: Math.round(VIEWPORT_SIZE * 0.15) }));
        break;
      default:
        break;
    }
  };

  const handleReset = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
    setRotate(0);
  };

  // Generate cropped output canvas and save
  const handleApply = () => {
    if (!imgElement) return;

    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_OUTPUT_SIZE;
    canvas.height = CANVAS_OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Neutral white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_OUTPUT_SIZE, CANVAS_OUTPUT_SIZE);

    const ratio = CANVAS_OUTPUT_SIZE / VIEWPORT_SIZE;

    ctx.save();
    // Move to center of canvas plus scaled pan offset
    ctx.translate(
      CANVAS_OUTPUT_SIZE / 2 + pan.x * ratio,
      CANVAS_OUTPUT_SIZE / 2 + pan.y * ratio
    );

    // Apply rotation and zoom scale
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    const drawW = naturalSize.width * baseScale * ratio;
    const drawH = naturalSize.height * baseScale * ratio;

    ctx.drawImage(imgElement, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.94);
    const positionMetadata = {
      pan,
      zoom,
      rotate,
      rawPhoto: imageSrc
    };

    onSave(croppedDataUrl, positionMetadata);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-dialog animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', width: '96%', maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(30, 58, 138, 0.1)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Move size={18} />
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                Position & Frame Photo
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Adjust crop, zoom, and framing for {memberName}'s profile and ID card
              </div>
            </div>
          </div>

          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          className="modal-body"
          style={{
            padding: '20px',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1fr) 280px',
            gap: '20px',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Interactive Framing Canvas */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            {/* Viewport Box */}
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onWheel={handleWheel}
              style={{
                width: `${VIEWPORT_SIZE}px`,
                height: `${VIEWPORT_SIZE}px`,
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#0f172a',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                touchAction: 'none'
              }}
            >
              {/* Image Layer */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: `${displayW}px`,
                  height: `${displayH}px`,
                  marginLeft: `-${displayW / 2}px`,
                  marginTop: `-${displayH / 2}px`,
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotate}deg)`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.08s ease-out',
                  pointerEvents: 'none'
                }}
              >
                <img
                  src={imageSrc}
                  alt="Framing Target"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    pointerEvents: 'none',
                    userSelect: 'none'
                  }}
                  draggable={false}
                />
              </div>

              {/* Grid Lines Guide */}
              {showGrid && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gridTemplateRows: '1fr 1fr 1fr',
                    border: '1px solid rgba(255,255,255,0.15)'
                  }}
                >
                  <div style={{ borderRight: '1px dashed rgba(255,255,255,0.25)', borderBottom: '1px dashed rgba(255,255,255,0.25)' }} />
                  <div style={{ borderRight: '1px dashed rgba(255,255,255,0.25)', borderBottom: '1px dashed rgba(255,255,255,0.25)' }} />
                  <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.25)' }} />
                  <div style={{ borderRight: '1px dashed rgba(255,255,255,0.25)', borderBottom: '1px dashed rgba(255,255,255,0.25)' }} />
                  <div style={{ borderRight: '1px dashed rgba(255,255,255,0.25)', borderBottom: '1px dashed rgba(255,255,255,0.25)' }} />
                  <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.25)' }} />
                  <div style={{ borderRight: '1px dashed rgba(255,255,255,0.25)' }} />
                  <div style={{ borderRight: '1px dashed rgba(255,255,255,0.25)' }} />
                  <div />
                </div>
              )}

              {/* Mask Overlays */}
              {(maskType === 'circle' || maskType === 'both') && (
                <div
                  style={{
                    position: 'absolute',
                    inset: '16px',
                    borderRadius: '50%',
                    boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.55)',
                    border: '2px solid rgba(255, 255, 255, 0.75)',
                    pointerEvents: 'none'
                  }}
                />
              )}

              {maskType === 'badge' && (
                <div
                  style={{
                    position: 'absolute',
                    inset: '24px',
                    borderRadius: '16px',
                    boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.65)',
                    border: '2px solid #d97706',
                    pointerEvents: 'none'
                  }}
                />
              )}

              {/* Drag instruction overlay badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.65)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backdropFilter: 'blur(4px)'
                }}
              >
                <Move size={10} />
                <span>Drag to reposition image</span>
              </div>
            </div>

            {/* Viewport Toolbar: Mask toggle, Grid toggle, Rotate */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div className="btn-group" style={{ display: 'flex', background: 'var(--bg-app)', padding: '2px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${maskType === 'both' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setMaskType('both')}
                  title="Profile Circle Guide"
                  style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                >
                  <Circle size={13} />
                  <span>Circle</span>
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${maskType === 'badge' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setMaskType('badge')}
                  title="ID Badge Frame Guide"
                  style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                >
                  <Square size={13} />
                  <span>Badge</span>
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${maskType === 'none' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setMaskType('none')}
                  title="Full View"
                  style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                >
                  <span>Full</span>
                </button>
              </div>

              <button
                type="button"
                className={`btn btn-sm ${showGrid ? 'btn-secondary' : 'btn-secondary'}`}
                onClick={() => setShowGrid((g) => !g)}
                title="Toggle Guide Grid"
                style={{ padding: '5px 9px', background: showGrid ? 'var(--primary-light)' : undefined, color: showGrid ? 'var(--primary)' : undefined }}
              >
                <Grid size={14} />
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setRotate((r) => (r + 90) % 360)}
                title="Rotate 90° Clockwise"
                style={{ padding: '5px 9px' }}
              >
                <RotateCw size={14} />
                <span>90°</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleReset}
                title="Reset Position & Zoom"
                style={{ padding: '5px 9px' }}
              >
                <RefreshCw size={14} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Right Column: Controls, Sliders & Live Previews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Zoom Slider */}
            <div
              style={{
                padding: '14px',
                background: 'var(--bg-app)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ZoomIn size={14} color="var(--primary)" />
                  Zoom / Scale
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', background: 'var(--bg-card)', padding: '2px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  {Math.round(zoom * 100)}%
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.1).toFixed(2)))}
                  style={{ padding: '4px 8px' }}
                >
                  <ZoomOut size={13} />
                </button>
                <input
                  type="range"
                  min="0.8"
                  max="3.0"
                  step="0.02"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  style={{ flex: 1, accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setZoom((z) => Math.min(3.0, +(z + 0.1).toFixed(2)))}
                  style={{ padding: '4px 8px' }}
                >
                  <ZoomIn size={13} />
                </button>
              </div>
            </div>

            {/* Alignment Presets */}
            <div
              style={{
                padding: '14px',
                background: 'var(--bg-app)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sliders size={14} color="var(--primary)" />
                Quick Alignment
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => applyPreset('face')}
                  style={{ fontSize: '0.74rem', padding: '6px 4px' }}
                >
                  👤 Focus Head
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => applyPreset('center')}
                  style={{ fontSize: '0.74rem', padding: '6px 4px' }}
                >
                  🎯 Center
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => applyPreset('bust')}
                  style={{ fontSize: '0.74rem', padding: '6px 4px' }}
                >
                  👔 Focus Bust
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => applyPreset('left')}
                  style={{ fontSize: '0.74rem', padding: '6px 4px' }}
                >
                  ⬅ Left
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => nudge(0, 0)}
                  style={{ fontSize: '0.74rem', padding: '6px 4px' }}
                >
                  • Neutral
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => applyPreset('right')}
                  style={{ fontSize: '0.74rem', padding: '6px 4px' }}
                >
                  Right ➡
                </button>
              </div>

              {/* D-Pad Nudge Arrows */}
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginRight: '6px' }}>Fine Nudge:</span>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => nudge(-8, 0)} style={{ padding: '3px 6px' }} title="Nudge Left">
                  <ArrowLeft size={12} />
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => nudge(0, -8)} style={{ padding: '3px 6px' }} title="Nudge Up">
                    <ArrowUp size={12} />
                  </button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => nudge(0, 8)} style={{ padding: '3px 6px' }} title="Nudge Down">
                    <ArrowDown size={12} />
                  </button>
                </div>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => nudge(8, 0)} style={{ padding: '3px 6px' }} title="Nudge Right">
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>

            {/* Live Previews Panel */}
            <div
              style={{
                padding: '14px',
                background: 'var(--bg-app)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CreditCard size={14} color="var(--primary)" />
                Live Format Previews
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '12px' }}>
                {/* Profile Circle Avatar Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      position: 'relative',
                      border: '2px solid var(--primary)',
                      background: '#0f172a',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: `${displayW * (64 / VIEWPORT_SIZE)}px`,
                        height: `${displayH * (64 / VIEWPORT_SIZE)}px`,
                        marginLeft: `-${(displayW * (64 / VIEWPORT_SIZE)) / 2}px`,
                        marginTop: `-${(displayH * (64 / VIEWPORT_SIZE)) / 2}px`,
                        transform: `translate(${pan.x * (64 / VIEWPORT_SIZE)}px, ${pan.y * (64 / VIEWPORT_SIZE)}px) scale(${zoom}) rotate(${rotate}deg)`,
                        transformOrigin: 'center center'
                      }}
                    >
                      <img
                        src={imageSrc}
                        alt="Profile Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    Profile
                  </span>
                </div>

                {/* ID Badge Rect Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div
                    style={{
                      width: '58px',
                      height: '58px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      position: 'relative',
                      border: '2px solid #d97706',
                      background: '#0f172a',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: `${displayW * (58 / VIEWPORT_SIZE)}px`,
                        height: `${displayH * (58 / VIEWPORT_SIZE)}px`,
                        marginLeft: `-${(displayW * (58 / VIEWPORT_SIZE)) / 2}px`,
                        marginTop: `-${(displayH * (58 / VIEWPORT_SIZE)) / 2}px`,
                        transform: `translate(${pan.x * (58 / VIEWPORT_SIZE)}px, ${pan.y * (58 / VIEWPORT_SIZE)}px) scale(${zoom}) rotate(${rotate}deg)`,
                        transformOrigin: 'center center'
                      }}
                    >
                      <img
                        src={imageSrc}
                        alt="ID Badge Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    ID Badge
                  </span>
                </div>

                {/* Mini Member Chip */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      position: 'relative',
                      border: '1.5px solid var(--border-color)',
                      background: '#0f172a'
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: `${displayW * (36 / VIEWPORT_SIZE)}px`,
                        height: `${displayH * (36 / VIEWPORT_SIZE)}px`,
                        marginLeft: `-${(displayW * (36 / VIEWPORT_SIZE)) / 2}px`,
                        marginTop: `-${(displayH * (36 / VIEWPORT_SIZE)) / 2}px`,
                        transform: `translate(${pan.x * (36 / VIEWPORT_SIZE)}px, ${pan.y * (36 / VIEWPORT_SIZE)}px) scale(${zoom}) rotate(${rotate}deg)`,
                        transformOrigin: 'center center'
                      }}
                    >
                      <img
                        src={imageSrc}
                        alt="Chip Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    List Chip
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className="modal-footer"
          style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-card)'
          }}
        >
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Pos: ({Math.round(pan.x)}, {Math.round(pan.y)}) • Scale: {Math.round(zoom * 100)}% • Rot: {rotate}°
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleApply}>
              <Check size={16} />
              <span>Apply & Save Framing</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
