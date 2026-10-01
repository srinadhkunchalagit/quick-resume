import { RESUME_TEMPLATES, SAMPLE_RESUME_DATA } from './templates-data.js';

// --- State Management ---
const state = {
  currentStep: 1, // 1: Gallery, 2: Form, 3: Preview, 4: History
  selectedTemplateId: 'tpl-harvard-ocs',
  resumeData: JSON.parse(JSON.stringify(SAMPLE_RESUME_DATA)),
  customAccentColor: null,
  activeFilter: 'all',
  atsFilter: 'all', // 'all', '95', '90'
  layoutFilter: 'all', // 'all', 'single-col-classic', etc.
  sortBy: 'ats-desc', // 'ats-desc', 'recommended', 'name-asc'
  searchQuery: '',
  currentLimit: 36,
  modalPreviewTemplateId: null,
  historySearchQuery: '',
  currentEditingHistoryId: null
};

// DOM References
const stepGallery = document.getElementById('step-gallery');
const stepForm = document.getElementById('step-form');
const stepPreview = document.getElementById('step-preview');

const navStep1 = document.getElementById('nav-step-1');
const navStep2 = document.getElementById('nav-step-2');
const navStep3 = document.getElementById('nav-step-3');
const brandLink = document.getElementById('brand-link');

const templatesGrid = document.getElementById('templates-grid');
const searchInput = document.getElementById('template-search-input');
const categoryFilterBar = document.getElementById('category-filter-bar');
const atsFilterPills = document.getElementById('ats-filter-pills');
const layoutSelectFilter = document.getElementById('layout-select-filter');
const sortSelect = document.getElementById('sort-select');
const countBanner = document.getElementById('templates-count-banner');
const loadMoreContainer = document.getElementById('load-more-container');
const btnLoadMore = document.getElementById('btn-load-more');
const btnShowAllTemplates = document.getElementById('btn-show-all-templates');

const selectedTemplateNameBadge = document.getElementById('selected-template-name');
const btnChangeTemplateTop = document.getElementById('btn-change-template-top');
const btnBackToTemplates = document.getElementById('btn-back-to-templates');
const btnBackToTemplatesTop = document.getElementById('btn-back-to-templates-top');
const btnGenerateResumeTop = document.getElementById('btn-generate-resume-top');
const btnClearForm = document.getElementById('btn-clear-form');
const resumeForm = document.getElementById('resume-details-form');

// Upload & Import DOM elements
const uploadDetailsCard = document.getElementById('upload-details-card');
const resumeFileInput = document.getElementById('resume-file-input');
const btnBrowseFile = document.getElementById('btn-browse-file');
const btnTogglePaste = document.getElementById('btn-toggle-paste');
const pasteTextareaWrapper = document.getElementById('paste-textarea-wrapper');
const pasteResumeTextarea = document.getElementById('paste-resume-textarea');
const btnParsePastedText = document.getElementById('btn-parse-pasted-text');
const uploadStatusAlert = document.getElementById('upload-status-alert');

// Image Upload Preview elements
const imagePreviewCard = document.getElementById('image-preview-card');
const imagePreviewImg = document.getElementById('image-preview-img');
const btnRemoveImagePreview = document.getElementById('btn-remove-image-preview');

const previewPaper = document.getElementById('resume-paper');
const previewActiveTplName = document.getElementById('preview-active-tpl-name');
const accentColorPicker = document.getElementById('accent-color-picker');
const btnSavePdf = document.getElementById('btn-save-pdf');
const btnEditDetails = document.getElementById('btn-edit-details');
const btnSwitchTemplateModal = document.getElementById('btn-switch-template-modal');

// History View DOM References
const stepHistory = document.getElementById('step-history');
const navStep4 = document.getElementById('nav-step-4');
const navHistoryBadge = document.getElementById('nav-history-badge');
const historyListContainer = document.getElementById('history-list-container');
const historySearchInput = document.getElementById('history-search-input');
const btnClearHistory = document.getElementById('btn-clear-history');
const btnHistoryCreateNew = document.getElementById('btn-history-create-new');

// Delete Modal DOM References
const modalDeleteConfirm = document.getElementById('modal-delete-confirm');
const deleteResumeItemTitle = document.getElementById('delete-resume-item-title');
const btnCloseDeleteModal = document.getElementById('btn-close-delete-modal');
const btnCancelDelete = document.getElementById('btn-cancel-delete');
const btnConfirmDelete = document.getElementById('btn-confirm-delete');

// Clear History Modal DOM References
const modalClearConfirm = document.getElementById('modal-clear-confirm');
const btnCloseClearModal = document.getElementById('btn-close-clear-modal');
const btnCancelClearHistory = document.getElementById('btn-cancel-clear-history');
const btnConfirmClearHistory = document.getElementById('btn-confirm-clear-history');

// Toast container
const toastContainer = document.getElementById('toast-container');

const previewModal = document.getElementById('preview-modal');
const modalTplTitle = document.getElementById('modal-tpl-title');
const modalResumePaper = document.getElementById('modal-resume-paper');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnModalCancel = document.getElementById('btn-modal-cancel');
const btnModalUseTemplate = document.getElementById('btn-modal-use-template');

// Section Toggle Checkboxes
const sectionToggles = {
  summary: document.getElementById('toggle-sec-summary'),
  experience: document.getElementById('toggle-sec-experience'),
  education: document.getElementById('toggle-sec-education'),
  skills: document.getElementById('toggle-sec-skills'),
  projects: document.getElementById('toggle-sec-projects'),
  certifications: document.getElementById('toggle-sec-certifications'),
  languages: document.getElementById('toggle-sec-languages')
};

const sectionPanels = {
  summary: document.getElementById('panel-summary'),
  experience: document.getElementById('panel-experience'),
  education: document.getElementById('panel-education'),
  skills: document.getElementById('panel-skills'),
  projects: document.getElementById('panel-projects'),
  certifications: document.getElementById('panel-certifications'),
  languages: document.getElementById('panel-languages')
};

// Item Containers
const containerExp = document.getElementById('experience-items-list');
const containerEdu = document.getElementById('education-items-list');
const containerSkills = document.getElementById('skills-groups-list');
const containerProjects = document.getElementById('projects-items-list');
const containerCerts = document.getElementById('certifications-items-list');
const containerLanguages = document.getElementById('languages-items-list');

// Add item buttons
const btnAddExp = document.getElementById('btn-add-experience');
const btnAddEdu = document.getElementById('btn-add-education');
const btnAddSkillGroup = document.getElementById('btn-add-skill-group');
const btnAddProject = document.getElementById('btn-add-project');
const btnAddCert = document.getElementById('btn-add-certification');
const btnAddLang = document.getElementById('btn-add-language');

// --- Helper Functions ---
function getSelectedTemplate() {
  return RESUME_TEMPLATES.find(t => t.id === state.selectedTemplateId) || RESUME_TEMPLATES[0];
}

function switchStep(stepNumber) {
  state.currentStep = stepNumber;

  stepGallery.classList.toggle('hidden', stepNumber !== 1);
  stepForm.classList.toggle('hidden', stepNumber !== 2);
  stepPreview.classList.toggle('hidden', stepNumber !== 3);
  if (stepHistory) stepHistory.classList.toggle('hidden', stepNumber !== 4);

  navStep1.classList.toggle('active', stepNumber === 1);
  navStep2.classList.toggle('active', stepNumber === 2);
  navStep3.classList.toggle('active', stepNumber === 3);
  if (navStep4) navStep4.classList.toggle('active', stepNumber === 4);

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (stepNumber === 2) {
    const tpl = getSelectedTemplate();
    selectedTemplateNameBadge.textContent = tpl.name;
  } else if (stepNumber === 3) {
    renderResumeView();
  } else if (stepNumber === 4) {
    renderHistoryView();
  }
}

// ============================================================================
// STEP 1: 40 TEMPLATES GALLERY RENDERER
// ============================================================================

function generateMiniaturePreviewHTML(template) {
  const accent = template.accentColor;
  const layout = template.layoutType;

  // 1. Two-Column Sidebar Layouts
  if (layout.includes('two-col')) {
    const isRightSide = layout === 'two-col-right';
    const sidebarBg = template.themeClass.includes('charcoal') ? '#1e293b' :
                      template.themeClass.includes('cobalt') ? '#1e40af' :
                      template.themeClass.includes('emerald') ? '#064e3b' :
                      template.themeClass.includes('amber') ? '#fffbeb' : '#f1f5f9';
    const isDarkSidebar = ['#1e293b', '#1e40af', '#064e3b'].includes(sidebarBg);
    const sideTextColor = isDarkSidebar ? '#ffffff' : '#334155';
    const sideLineColor = isDarkSidebar ? 'rgba(255,255,255,0.4)' : '#cbd5e1';

    const sidebarHTML = `
      <div class="mini-side" style="background:${sidebarBg};">
        <div class="mini-name" style="background:${sideTextColor}; width:80%;"></div>
        <div class="mini-line" style="background:${sideLineColor}; width:60%;"></div>
        <div style="margin-top:6px; display:flex; flex-direction:column; gap:2px;">
          <div class="mini-sec-title" style="background:${sideTextColor}; width:45%;"></div>
          <div class="mini-line" style="background:${sideLineColor};"></div>
          <div class="mini-line short" style="background:${sideLineColor};"></div>
        </div>
        <div style="margin-top:6px; display:flex; flex-direction:column; gap:2px;">
          <div class="mini-sec-title" style="background:${sideTextColor}; width:40%;"></div>
          <div class="mini-line" style="background:${sideLineColor};"></div>
        </div>
      </div>
    `;

    const mainHTML = `
      <div class="mini-main">
        <div class="mini-section">
          <div class="mini-sec-title" style="background:${accent}; width:40%;"></div>
          <div class="mini-line"></div>
          <div class="mini-line short"></div>
          <div class="mini-line vshort"></div>
        </div>
        <div class="mini-section">
          <div class="mini-sec-title" style="background:${accent}; width:45%;"></div>
          <div class="mini-line"></div>
          <div class="mini-line short"></div>
          <div class="mini-line"></div>
        </div>
      </div>
    `;

    return `
      <div class="mini-page">
        <div class="mini-two-col" style="${isRightSide ? 'flex-direction:row-reverse;' : ''}">
          ${sidebarHTML}
          ${mainHTML}
        </div>
      </div>
    `;
  }

  // 2. Banner Header Layout (Solid Top Hero Block)
  if (layout === 'banner-header') {
    return `
      <div class="mini-page">
        <div class="mini-header" style="background:${accent}; margin:-8px -10px 8px -10px; padding:10px 10px; border-bottom:none;">
          <div class="mini-name" style="background:#ffffff; width:65%; height:6px;"></div>
          <div class="mini-sub" style="background:rgba(255,255,255,0.7); width:45%;"></div>
          <div class="mini-contact" style="background:rgba(255,255,255,0.5); width:80%;"></div>
        </div>
        <div class="mini-body">
          <div class="mini-section">
            <div class="mini-sec-title" style="background:${accent}; width:40%;"></div>
            <div class="mini-line"></div>
            <div class="mini-line short"></div>
          </div>
          <div class="mini-section">
            <div class="mini-sec-title" style="background:${accent}; width:45%;"></div>
            <div class="mini-line"></div>
            <div class="mini-line short"></div>
          </div>
        </div>
      </div>
    `;
  }

  // 3. Centered Header Layout (Oxford, Classical, Boardroom)
  if (layout === 'centered-header') {
    return `
      <div class="mini-page">
        <div class="mini-header" style="display:flex; flex-direction:column; align-items:center; text-align:center; border-bottom: 1px solid ${accent}; padding-bottom:5px;">
          <div class="mini-name" style="background:${accent}; width:60%; margin:0 auto 3px auto;"></div>
          <div class="mini-sub" style="background:#64748b; width:40%; margin:0 auto 3px auto;"></div>
          <div class="mini-contact" style="background:#94a3b8; width:75%; margin:0 auto;"></div>
        </div>
        <div class="mini-body" style="margin-top:4px;">
          <div class="mini-section">
            <div class="mini-sec-title" style="background:${accent}; width:35%; margin:0 auto 2px auto;"></div>
            <div class="mini-line"></div>
            <div class="mini-line short"></div>
          </div>
          <div class="mini-section">
            <div class="mini-sec-title" style="background:${accent}; width:40%; margin:0 auto 2px auto;"></div>
            <div class="mini-line"></div>
            <div class="mini-line short"></div>
          </div>
        </div>
      </div>
    `;
  }

  // 4. Split Header Layout (2-Way Left/Right)
  if (layout === 'split-header') {
    return `
      <div class="mini-page">
        <div class="mini-header" style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom: 1.5px solid ${accent}; padding-bottom:5px;">
          <div style="width:55%;">
            <div class="mini-name" style="background:${accent}; width:80%;"></div>
            <div class="mini-sub" style="background:#64748b; width:60%;"></div>
          </div>
          <div style="width:40%; display:flex; flex-direction:column; align-items:flex-end; gap:2px;">
            <div class="mini-line short" style="background:#94a3b8; width:90%;"></div>
            <div class="mini-line short" style="background:#cbd5e1; width:70%;"></div>
          </div>
        </div>
        <div class="mini-body" style="margin-top:4px;">
          <div class="mini-section">
            <div class="mini-sec-title" style="background:${accent}; width:35%;"></div>
            <div class="mini-line"></div>
            <div class="mini-line short"></div>
          </div>
          <div class="mini-section">
            <div class="mini-sec-title" style="background:${accent}; width:40%;"></div>
            <div class="mini-line"></div>
            <div class="mini-line short"></div>
          </div>
        </div>
      </div>
    `;
  }

  // 5. Compact Dense Layout (Silicon 1-Page, High Density)
  if (layout === 'compact-dense') {
    return `
      <div class="mini-page" style="padding:5px 6px;">
        <div class="mini-header" style="margin-bottom:3px; padding-bottom:2px; border-bottom: 1px solid ${accent};">
          <div class="mini-name" style="background:${accent}; width:50%; height:4.5px;"></div>
          <div class="mini-contact" style="background:#94a3b8; width:85%; height:2px;"></div>
        </div>
        <div class="mini-body" style="gap:3px;">
          <div class="mini-section">
            <div class="mini-sec-title" style="background:${accent}; width:30%; height:3px;"></div>
            <div class="mini-line" style="height:2px;"></div>
            <div class="mini-line short" style="height:2px;"></div>
          </div>
          <div class="mini-section">
            <div class="mini-sec-title" style="background:${accent}; width:35%; height:3px;"></div>
            <div class="mini-line" style="height:2px;"></div>
            <div class="mini-line short" style="height:2px;"></div>
            <div class="mini-line vshort" style="height:2px;"></div>
          </div>
          <div class="mini-section">
            <div class="mini-sec-title" style="background:${accent}; width:28%; height:3px;"></div>
            <div class="mini-line" style="height:2px;"></div>
            <div class="mini-line short" style="height:2px;"></div>
          </div>
        </div>
      </div>
    `;
  }

  // 6. Timeline Chronological Layout (Enhancv, Kickresume)
  if (layout === 'timeline-left') {
    return `
      <div class="mini-page">
        <div class="mini-header" style="border-bottom: 1.5px solid ${accent}; padding-bottom:4px;">
          <div class="mini-name" style="background:${accent}; width:60%; height:6px;"></div>
          <div class="mini-contact" style="background:#94a3b8; width:80%;"></div>
        </div>
        <div class="mini-body" style="margin-top:6px; padding-left:9px; border-left:1.5px solid ${accent}; position:relative;">
          <div class="mini-section" style="position:relative; margin-bottom:5px;">
            <div style="position:absolute; left:-12px; top:2px; width:4px; height:4px; border-radius:50%; background:${accent};"></div>
            <div class="mini-sec-title" style="background:${accent}; width:35%;"></div>
            <div class="mini-line"></div>
            <div class="mini-line short"></div>
          </div>
          <div class="mini-section" style="position:relative;">
            <div style="position:absolute; left:-12px; top:2px; width:4px; height:4px; border-radius:50%; background:${accent};"></div>
            <div class="mini-sec-title" style="background:${accent}; width:40%;"></div>
            <div class="mini-line"></div>
            <div class="mini-line short"></div>
          </div>
        </div>
      </div>
    `;
  }

  // 7. Boxed Clean Layout (Europass, Framed Ledger)
  if (layout === 'boxed-clean') {
    return `
      <div class="mini-page" style="border: 1px solid #cbd5e1; padding: 4px 6px;">
        <div class="mini-header" style="border-bottom: 2px solid ${accent}; padding-bottom:3px; margin-bottom:4px;">
          <div class="mini-name" style="background:${accent}; width:65%; height:5px;"></div>
          <div class="mini-contact" style="background:#64748b; width:80%; height:2px;"></div>
        </div>
        <div class="mini-body">
          <div class="mini-section" style="background:#f8fafc; padding:2px 3px; border-left:2px solid ${accent}; margin-bottom:3px;">
            <div class="mini-sec-title" style="background:${accent}; width:35%; height:3px;"></div>
            <div class="mini-line" style="height:2px;"></div>
            <div class="mini-line short" style="height:2px;"></div>
          </div>
          <div class="mini-section" style="background:#f8fafc; padding:2px 3px; border-left:2px solid ${accent};">
            <div class="mini-sec-title" style="background:${accent}; width:40%; height:3px;"></div>
            <div class="mini-line" style="height:2px;"></div>
          </div>
        </div>
      </div>
    `;
  }

  // 8. Classic Single Column (Harvard, WSO, Oxford, Strong Horizontal Rules)
  if (layout === 'single-col-classic') {
    return `
      <div class="mini-page">
        <div class="mini-header" style="border-bottom: 1.5px solid #0f172a; padding-bottom:4px;">
          <div class="mini-name" style="background:#0f172a; width:65%; height:6px;"></div>
          <div class="mini-contact" style="background:#64748b; width:85%; height:2px;"></div>
        </div>
        <div class="mini-body">
          <div class="mini-section">
            <div class="mini-sec-title" style="background:#0f172a; width:38%; border-bottom: 0.5px solid #0f172a;"></div>
            <div class="mini-line"></div>
            <div class="mini-line short"></div>
          </div>
          <div class="mini-section">
            <div class="mini-sec-title" style="background:#0f172a; width:42%; border-bottom: 0.5px solid #0f172a;"></div>
            <div class="mini-line"></div>
            <div class="mini-line short"></div>
          </div>
        </div>
      </div>
    `;
  }

  // 9. Modern Single Column (Default)
  return `
    <div class="mini-page">
      <div class="mini-header" style="border-bottom: 1.5px solid ${accent}; padding-bottom:4px;">
        <div class="mini-name" style="background:${accent}; width:60%; height:6px;"></div>
        <div class="mini-sub" style="background:#64748b; width:40%;"></div>
        <div class="mini-contact" style="background:#94a3b8; width:75%;"></div>
      </div>
      <div class="mini-body">
        <div class="mini-section">
          <div class="mini-sec-title" style="background:${accent}; width:35%;"></div>
          <div class="mini-line"></div>
          <div class="mini-line short"></div>
        </div>
        <div class="mini-section">
          <div class="mini-sec-title" style="background:${accent}; width:40%;"></div>
          <div class="mini-line"></div>
          <div class="mini-line short"></div>
          <div class="mini-line"></div>
        </div>
      </div>
    </div>
  `;
}

function getFilteredTemplates() {
  const query = state.searchQuery.toLowerCase().trim();
  const catFilter = state.activeFilter;
  const atsFilter = state.atsFilter;
  const layoutFilter = state.layoutFilter;

  return RESUME_TEMPLATES.filter(tpl => {
    // Category check
    const matchesCat = (catFilter === 'all') || (tpl.category === catFilter);

    // ATS Threshold check
    let matchesAts = true;
    if (atsFilter === '95') matchesAts = (tpl.atsScore >= 95);
    else if (atsFilter === '90') matchesAts = (tpl.atsScore >= 90);

    // Layout check
    const matchesLayout = (layoutFilter === 'all') || (tpl.layoutType === layoutFilter);

    // Search query check
    const matchesQuery = !query ||
      tpl.name.toLowerCase().includes(query) ||
      tpl.category.toLowerCase().includes(query) ||
      (tpl.website && tpl.website.toLowerCase().includes(query)) ||
      tpl.description.toLowerCase().includes(query) ||
      tpl.layoutType.toLowerCase().includes(query) ||
      tpl.tags.some(tag => tag.toLowerCase().includes(query)) ||
      `ats ${tpl.atsScore}`.includes(query) ||
      `${tpl.atsScore}%`.includes(query);

    return matchesCat && matchesAts && matchesLayout && matchesQuery;
  }).sort((a, b) => {
    if (state.sortBy === 'ats-desc') {
      return b.atsScore - a.atsScore;
    }
    if (state.sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    }
    return 0; // recommended / curated default
  });
}

function renderTemplatesGrid() {
  const filtered = getFilteredTemplates();
  const visible = filtered.slice(0, state.currentLimit);

  countBanner.textContent = `Showing ${visible.length} of ${filtered.length} templates (All ATS Scores > 80%)`;

  templatesGrid.innerHTML = '';

  if (filtered.length === 0) {
    templatesGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <p style="font-size: 1.1rem; font-weight: 500; margin-bottom: 0.5rem;">No templates found matching your filters</p>
        <p style="font-size: 0.85rem;">Try adjusting your search, ATS score threshold, or category selection.</p>
      </div>
    `;
    if (loadMoreContainer) loadMoreContainer.classList.add('hidden');
    return;
  }

  visible.forEach(template => {
    const card = document.createElement('div');
    card.className = `template-card ${template.id === state.selectedTemplateId ? 'selected' : ''}`;
    card.dataset.id = template.id;

    const atsClass = template.atsScore >= 95 ? 'ats-elite' : template.atsScore >= 90 ? 'ats-high' : 'ats-good';
    const websiteBadge = template.website ? `<span style="font-size: 0.72rem; font-weight: 600; color: #1e3a8a; background: #e0f2fe; padding: 2px 6px; border-radius: 4px; border: 1px solid #bae6fd;">${template.website} Style</span>` : '';
    const layoutBadge = `<span style="font-size: 0.72rem; color: #475569; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${template.layoutType.replace(/-/g, ' ')}</span>`;

    card.innerHTML = `
      <div class="template-canvas-preview">
        ${generateMiniaturePreviewHTML(template)}
      </div>
      <div class="template-info">
        <div class="template-header-row">
          <h3 class="template-title">${template.name}</h3>
          <span class="ats-score-badge ${atsClass}" title="Algorithmic parsing compliance rating">
            ★ ATS: ${template.atsScore}%
          </span>
        </div>
        <p class="template-desc">${template.description}</p>
        <div class="template-metadata-line" style="display:flex; flex-wrap:wrap; gap:4px; align-items:center; margin-bottom:10px;">
          ${websiteBadge}
          ${layoutBadge}
          <span style="font-size: 0.72rem; color: #64748b;">· ${template.category}</span>
        </div>
        <div class="template-actions">
          <button type="button" class="btn btn-primary btn-sm btn-choose-template" data-id="${template.id}">
            Select Template
          </button>
          <button type="button" class="btn btn-secondary btn-sm btn-preview-demo" data-id="${template.id}" title="Quick Preview with sample data">
            Preview
          </button>
        </div>
      </div>
    `;

    // Click anywhere on card (except buttons) to select
    card.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      selectTemplate(template.id, true);
    });

    const chooseBtn = card.querySelector('.btn-choose-template');
    chooseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectTemplate(template.id, true);
    });

    const previewBtn = card.querySelector('.btn-preview-demo');
    previewBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openPreviewModal(template.id);
    });

    templatesGrid.appendChild(card);
  });

  // Toggle load more container
  if (loadMoreContainer) {
    if (filtered.length > state.currentLimit) {
      loadMoreContainer.classList.remove('hidden');
      btnLoadMore.textContent = `Load More Templates (${filtered.length - state.currentLimit} remaining)`;
    } else {
      loadMoreContainer.classList.add('hidden');
    }
  }
}

function selectTemplate(templateId, proceedToForm = false) {
  state.selectedTemplateId = templateId;
  const tpl = getSelectedTemplate();
  state.customAccentColor = tpl.accentColor;

  // Update card selected indicators
  document.querySelectorAll('.template-card').forEach(card => {
    card.classList.toggle('selected', card.dataset.id === templateId);
  });

  if (proceedToForm) {
    switchStep(2);
  }
}

// ============================================================================
// STEP 2: ADAPTIVE FORM POPULATION & SECTION TOGGLES
// ============================================================================

function setupSectionToggles() {
  Object.keys(sectionToggles).forEach(secKey => {
    const checkbox = sectionToggles[secKey];
    const panel = sectionPanels[secKey];
    const parentLabel = checkbox.closest('.section-switch-label');

    checkbox.addEventListener('change', () => {
      const isEnabled = checkbox.checked;
      state.resumeData[secKey].enabled = isEnabled;
      parentLabel.classList.toggle('checked', isEnabled);
      panel.classList.toggle('section-disabled', !isEnabled);
    });
  });
}

// Dynamic item row renderers
function createExperienceItem(item = { company: '', position: '', duration: '', location: '', description: '' }, index = 1) {
  const div = document.createElement('div');
  div.className = 'repeatable-item';
  div.innerHTML = `
    <div class="repeatable-item-header">
      <span class="item-index-label">Role #${index}</span>
      <button type="button" class="btn btn-sm btn-danger btn-remove-item">Remove</button>
    </div>
    <div class="input-grid-2">
      <div class="form-group">
        <label>Employer / Company</label>
        <input type="text" class="form-control exp-company" value="${escapeHtml(item.company)}" placeholder="e.g. Stripe">
      </div>
      <div class="form-group">
        <label>Job Title / Position</label>
        <input type="text" class="form-control exp-position" value="${escapeHtml(item.position)}" placeholder="e.g. Senior Software Engineer">
      </div>
    </div>
    <div class="input-grid-2">
      <div class="form-group">
        <label>Duration / Timeframe</label>
        <input type="text" class="form-control exp-duration" value="${escapeHtml(item.duration)}" placeholder="e.g. 2022 - Present">
      </div>
      <div class="form-group">
        <label>Location (City, Remote)</label>
        <input type="text" class="form-control exp-location" value="${escapeHtml(item.location || '')}" placeholder="e.g. San Francisco, CA">
      </div>
    </div>
    <div class="form-group">
      <label>Key Responsibilities & Measurable Impact (One per bullet or line)</label>
      <textarea class="form-control exp-description" rows="3" placeholder="• Architected real-time processing pipeline reducing latency by 45%...">${escapeHtml(item.description)}</textarea>
    </div>
  `;

  div.querySelector('.btn-remove-item').addEventListener('click', () => {
    div.remove();
    updateExperienceIndices();
  });

  return div;
}

function updateExperienceIndices() {
  containerExp.querySelectorAll('.repeatable-item').forEach((item, i) => {
    item.querySelector('.item-index-label').textContent = `Role #${i + 1}`;
  });
}

function createEducationItem(item = { degree: '', institution: '', year: '', details: '' }, index = 1) {
  const div = document.createElement('div');
  div.className = 'repeatable-item';
  div.innerHTML = `
    <div class="repeatable-item-header">
      <span class="item-index-label">Degree #${index}</span>
      <button type="button" class="btn btn-sm btn-danger btn-remove-item">Remove</button>
    </div>
    <div class="input-grid-2">
      <div class="form-group">
        <label>Degree / Qualification</label>
        <input type="text" class="form-control edu-degree" value="${escapeHtml(item.degree)}" placeholder="e.g. B.S. in Computer Science">
      </div>
      <div class="form-group">
        <label>College / University / Institution</label>
        <input type="text" class="form-control edu-institution" value="${escapeHtml(item.institution)}" placeholder="e.g. Stanford University">
      </div>
    </div>
    <div class="input-grid-2">
      <div class="form-group">
        <label>Graduation Year or Period</label>
        <input type="text" class="form-control edu-year" value="${escapeHtml(item.year)}" placeholder="e.g. 2017 - 2021">
      </div>
      <div class="form-group">
        <label>Academic Honors, GPA, Relevant Coursework</label>
        <input type="text" class="form-control edu-details" value="${escapeHtml(item.details || '')}" placeholder="e.g. GPA 3.9/4.0 · Dean's List">
      </div>
    </div>
  `;

  div.querySelector('.btn-remove-item').addEventListener('click', () => {
    div.remove();
    updateEducationIndices();
  });

  return div;
}

function updateEducationIndices() {
  containerEdu.querySelectorAll('.repeatable-item').forEach((item, i) => {
    item.querySelector('.item-index-label').textContent = `Degree #${i + 1}`;
  });
}

function createSkillGroupItem(group = { name: '', skills: [] }, index = 1) {
  const div = document.createElement('div');
  div.className = 'repeatable-item';
  const skillsStr = Array.isArray(group.skills) ? group.skills.join(', ') : (group.skills || '');
  div.innerHTML = `
    <div class="repeatable-item-header">
      <span class="item-index-label">Skill Group #${index}</span>
      <button type="button" class="btn btn-sm btn-danger btn-remove-item">Remove</button>
    </div>
    <div class="input-grid-2">
      <div class="form-group">
        <label>Category Name</label>
        <input type="text" class="form-control skill-group-name" value="${escapeHtml(group.name)}" placeholder="e.g. Languages & Frameworks">
      </div>
      <div class="form-group">
        <label>Skills (Comma-separated)</label>
        <input type="text" class="form-control skill-group-items" value="${escapeHtml(skillsStr)}" placeholder="e.g. TypeScript, React, Node.js, Python, PostgreSQL">
      </div>
    </div>
  `;

  div.querySelector('.btn-remove-item').addEventListener('click', () => {
    div.remove();
  });

  return div;
}

function createProjectItem(item = { name: '', role: '', link: '', duration: '', description: '' }, index = 1) {
  const div = document.createElement('div');
  div.className = 'repeatable-item';
  div.innerHTML = `
    <div class="repeatable-item-header">
      <span class="item-index-label">Project #${index}</span>
      <button type="button" class="btn btn-sm btn-danger btn-remove-item">Remove</button>
    </div>
    <div class="input-grid-2">
      <div class="form-group">
        <label>Project Title</label>
        <input type="text" class="form-control proj-name" value="${escapeHtml(item.name)}" placeholder="e.g. Distributed Key-Value Store">
      </div>
      <div class="form-group">
        <label>Role / Responsibility</label>
        <input type="text" class="form-control proj-role" value="${escapeHtml(item.role || '')}" placeholder="e.g. Lead Developer">
      </div>
    </div>
    <div class="input-grid-2">
      <div class="form-group">
        <label>Live URL / GitHub Link</label>
        <input type="text" class="form-control proj-link" value="${escapeHtml(item.link || '')}" placeholder="e.g. github.com/username/project">
      </div>
      <div class="form-group">
        <label>Year / Duration</label>
        <input type="text" class="form-control proj-duration" value="${escapeHtml(item.duration || '')}" placeholder="e.g. 2023">
      </div>
    </div>
    <div class="form-group">
      <label>Brief Description & Outcome</label>
      <textarea class="form-control proj-desc" rows="2" placeholder="Engineered high throughput distributed cache handling 10k req/sec...">${escapeHtml(item.description || '')}</textarea>
    </div>
  `;

  div.querySelector('.btn-remove-item').addEventListener('click', () => {
    div.remove();
  });

  return div;
}

function createCertItem(item = { title: '', issuer: '', year: '' }, index = 1) {
  const div = document.createElement('div');
  div.className = 'repeatable-item';
  div.innerHTML = `
    <div class="repeatable-item-header">
      <span class="item-index-label">Certification #${index}</span>
      <button type="button" class="btn btn-sm btn-danger btn-remove-item">Remove</button>
    </div>
    <div class="input-grid-3">
      <div class="form-group">
        <label>Credential Name</label>
        <input type="text" class="form-control cert-title" value="${escapeHtml(item.title)}" placeholder="e.g. AWS Solutions Architect Professional">
      </div>
      <div class="form-group">
        <label>Issuing Organization</label>
        <input type="text" class="form-control cert-issuer" value="${escapeHtml(item.issuer)}" placeholder="e.g. Amazon Web Services">
      </div>
      <div class="form-group">
        <label>Date or Year</label>
        <input type="text" class="form-control cert-year" value="${escapeHtml(item.year)}" placeholder="e.g. 2023">
      </div>
    </div>
  `;

  div.querySelector('.btn-remove-item').addEventListener('click', () => {
    div.remove();
  });

  return div;
}

function createLanguageItem(item = { name: '', level: '' }, index = 1) {
  const div = document.createElement('div');
  div.className = 'repeatable-item';
  div.innerHTML = `
    <div class="repeatable-item-header">
      <span class="item-index-label">Language #${index}</span>
      <button type="button" class="btn btn-sm btn-danger btn-remove-item">Remove</button>
    </div>
    <div class="input-grid-2">
      <div class="form-group">
        <label>Language</label>
        <input type="text" class="form-control lang-name" value="${escapeHtml(item.name)}" placeholder="e.g. Spanish">
      </div>
      <div class="form-group">
        <label>Proficiency</label>
        <input type="text" class="form-control lang-level" value="${escapeHtml(item.level)}" placeholder="e.g. Native / Professional Working Proficiency">
      </div>
    </div>
  `;

  div.querySelector('.btn-remove-item').addEventListener('click', () => {
    div.remove();
  });

  return div;
}

// Populate entire form from state
function populateFormFromData(data) {
  // Personal
  document.getElementById('inp-fullname').value = data.personal?.fullName || '';
  document.getElementById('inp-jobtitle').value = data.personal?.jobTitle || '';
  document.getElementById('inp-email').value = data.personal?.email || '';
  document.getElementById('inp-phone').value = data.personal?.phone || '';
  document.getElementById('inp-location').value = data.personal?.location || '';
  document.getElementById('inp-website').value = data.personal?.website || '';
  document.getElementById('inp-linkedin').value = data.personal?.linkedin || '';
  document.getElementById('inp-github').value = data.personal?.github || '';

  // Summary
  const sumEnabled = data.summary?.enabled !== false;
  sectionToggles.summary.checked = sumEnabled;
  sectionToggles.summary.closest('.section-switch-label').classList.toggle('checked', sumEnabled);
  sectionPanels.summary.classList.toggle('section-disabled', !sumEnabled);
  document.getElementById('inp-summary-text').value = data.summary?.text || '';

  // Experience
  const expEnabled = data.experience?.enabled !== false;
  sectionToggles.experience.checked = expEnabled;
  sectionToggles.experience.closest('.section-switch-label').classList.toggle('checked', expEnabled);
  sectionPanels.experience.classList.toggle('section-disabled', !expEnabled);
  containerExp.innerHTML = '';
  (data.experience?.items || []).forEach((item, i) => {
    containerExp.appendChild(createExperienceItem(item, i + 1));
  });

  // Education
  const eduEnabled = data.education?.enabled !== false;
  sectionToggles.education.checked = eduEnabled;
  sectionToggles.education.closest('.section-switch-label').classList.toggle('checked', eduEnabled);
  sectionPanels.education.classList.toggle('section-disabled', !eduEnabled);
  containerEdu.innerHTML = '';
  (data.education?.items || []).forEach((item, i) => {
    containerEdu.appendChild(createEducationItem(item, i + 1));
  });

  // Skills
  const skillsEnabled = data.skills?.enabled !== false;
  sectionToggles.skills.checked = skillsEnabled;
  sectionToggles.skills.closest('.section-switch-label').classList.toggle('checked', skillsEnabled);
  sectionPanels.skills.classList.toggle('section-disabled', !skillsEnabled);
  containerSkills.innerHTML = '';
  (data.skills?.categories || []).forEach((cat, i) => {
    containerSkills.appendChild(createSkillGroupItem(cat, i + 1));
  });

  // Projects
  const projEnabled = data.projects?.enabled !== false;
  sectionToggles.projects.checked = projEnabled;
  sectionToggles.projects.closest('.section-switch-label').classList.toggle('checked', projEnabled);
  sectionPanels.projects.classList.toggle('section-disabled', !projEnabled);
  containerProjects.innerHTML = '';
  (data.projects?.items || []).forEach((item, i) => {
    containerProjects.appendChild(createProjectItem(item, i + 1));
  });

  // Certifications
  const certEnabled = data.certifications?.enabled !== false;
  sectionToggles.certifications.checked = certEnabled;
  sectionToggles.certifications.closest('.section-switch-label').classList.toggle('checked', certEnabled);
  sectionPanels.certifications.classList.toggle('section-disabled', !certEnabled);
  containerCerts.innerHTML = '';
  (data.certifications?.items || []).forEach((item, i) => {
    containerCerts.appendChild(createCertItem(item, i + 1));
  });

  // Languages
  const langEnabled = data.languages?.enabled !== false;
  sectionToggles.languages.checked = langEnabled;
  sectionToggles.languages.closest('.section-switch-label').classList.toggle('checked', langEnabled);
  sectionPanels.languages.classList.toggle('section-disabled', !langEnabled);
  containerLanguages.innerHTML = '';
  (data.languages?.items || []).forEach((item, i) => {
    containerLanguages.appendChild(createLanguageItem(item, i + 1));
  });
}

function gatherFormData() {
  const data = {
    personal: {
      fullName: document.getElementById('inp-fullname').value.trim(),
      jobTitle: document.getElementById('inp-jobtitle').value.trim(),
      email: document.getElementById('inp-email').value.trim(),
      phone: document.getElementById('inp-phone').value.trim(),
      location: document.getElementById('inp-location').value.trim(),
      website: document.getElementById('inp-website').value.trim(),
      linkedin: document.getElementById('inp-linkedin').value.trim(),
      github: document.getElementById('inp-github').value.trim()
    },
    summary: {
      enabled: sectionToggles.summary.checked,
      text: document.getElementById('inp-summary-text').value.trim()
    },
    experience: {
      enabled: sectionToggles.experience.checked,
      items: []
    },
    education: {
      enabled: sectionToggles.education.checked,
      items: []
    },
    skills: {
      enabled: sectionToggles.skills.checked,
      categories: []
    },
    projects: {
      enabled: sectionToggles.projects.checked,
      items: []
    },
    certifications: {
      enabled: sectionToggles.certifications.checked,
      items: []
    },
    languages: {
      enabled: sectionToggles.languages.checked,
      items: []
    }
  };

  // Collect Experience
  containerExp.querySelectorAll('.repeatable-item').forEach(item => {
    const company = item.querySelector('.exp-company').value.trim();
    const position = item.querySelector('.exp-position').value.trim();
    const duration = item.querySelector('.exp-duration').value.trim();
    const location = item.querySelector('.exp-location').value.trim();
    const description = item.querySelector('.exp-description').value.trim();

    if (company || position) {
      data.experience.items.push({ company, position, duration, location, description });
    }
  });

  // Collect Education
  containerEdu.querySelectorAll('.repeatable-item').forEach(item => {
    const degree = item.querySelector('.edu-degree').value.trim();
    const institution = item.querySelector('.edu-institution').value.trim();
    const year = item.querySelector('.edu-year').value.trim();
    const details = item.querySelector('.edu-details').value.trim();

    if (degree || institution) {
      data.education.items.push({ degree, institution, year, details });
    }
  });

  // Collect Skills
  containerSkills.querySelectorAll('.repeatable-item').forEach(item => {
    const name = item.querySelector('.skill-group-name').value.trim();
    const skillsStr = item.querySelector('.skill-group-items').value.trim();
    if (name || skillsStr) {
      const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
      data.skills.categories.push({ name, skills });
    }
  });

  // Collect Projects
  containerProjects.querySelectorAll('.repeatable-item').forEach(item => {
    const name = item.querySelector('.proj-name').value.trim();
    const role = item.querySelector('.proj-role').value.trim();
    const link = item.querySelector('.proj-link').value.trim();
    const duration = item.querySelector('.proj-duration').value.trim();
    const description = item.querySelector('.proj-desc').value.trim();

    if (name) {
      data.projects.items.push({ name, role, link, duration, description });
    }
  });

  // Collect Certifications
  containerCerts.querySelectorAll('.repeatable-item').forEach(item => {
    const title = item.querySelector('.cert-title').value.trim();
    const issuer = item.querySelector('.cert-issuer').value.trim();
    const year = item.querySelector('.cert-year').value.trim();

    if (title) {
      data.certifications.items.push({ title, issuer, year });
    }
  });

  // Collect Languages
  containerLanguages.querySelectorAll('.repeatable-item').forEach(item => {
    const name = item.querySelector('.lang-name').value.trim();
    const level = item.querySelector('.lang-level').value.trim();

    if (name) {
      data.languages.items.push({ name, level });
    }
  });

  return data;
}

// ============================================================================
// STEP 3: RESUME PAPER RENDERER (Full-featured for all 40 Templates)
// ============================================================================

function buildResumeHTML(template, data, accentColorOverride = null) {
  const accent = accentColorOverride || template.accentColor;
  const isTwoColLeft = template.layoutType === 'two-col-left';
  const isTwoColRight = template.layoutType === 'two-col-right';
  const isTwoCol = isTwoColLeft || isTwoColRight;

  const personal = data.personal || {};
  const summary = data.summary?.enabled && data.summary?.text ? data.summary.text : null;
  const experience = data.experience?.enabled ? (data.experience.items || []) : [];
  const education = data.education?.enabled ? (data.education.items || []) : [];
  const skills = data.skills?.enabled ? (data.skills.categories || []) : [];
  const projects = data.projects?.enabled ? (data.projects.items || []) : [];
  const certs = data.certifications?.enabled ? (data.certifications.items || []) : [];
  const languages = data.languages?.enabled ? (data.languages.items || []) : [];

  // Contact list with unboxed typographic separators
  const contactParts = [
    personal.email ? `<span class="contact-email">${escapeHtml(personal.email)}</span>` : null,
    personal.phone ? `<span class="contact-phone">${escapeHtml(personal.phone)}</span>` : null,
    personal.location ? `<span class="contact-loc">${escapeHtml(personal.location)}</span>` : null,
    personal.website ? `<span class="contact-web">${escapeHtml(personal.website)}</span>` : null,
    personal.linkedin ? `<span class="contact-li">${escapeHtml(personal.linkedin)}</span>` : null,
    personal.github ? `<span class="contact-gh">${escapeHtml(personal.github)}</span>` : null
  ].filter(Boolean);

  const contactHTML = contactParts.join(' <span class="contact-separator">·</span> ');

  // Format Description text into bullet list if lines start with bullets or dashes
  function formatDescription(desc) {
    if (!desc) return '';
    const lines = desc.split('\n').map(l => l.trim()).filter(Boolean);
    const hasBullets = lines.some(l => l.startsWith('•') || l.startsWith('-') || l.startsWith('*'));
    if (hasBullets) {
      const lis = lines.map(l => `<li>${escapeHtml(l.replace(/^[•\-\*]\s*/, ''))}</li>`).join('');
      return `<ul>${lis}</ul>`;
    }
    return lines.map(l => `<p>${escapeHtml(l)}</p>`).join('');
  }

  // --- HTML Builders for Sections ---
  function renderSummaryBlock() {
    if (!summary) return '';
    return `
      <div class="resume-section section-summary">
        <h2 class="resume-section-title">Professional Summary</h2>
        <div class="entry-desc">${escapeHtml(summary)}</div>
      </div>
    `;
  }

  function renderExperienceBlock() {
    if (experience.length === 0) return '';
    const itemsHTML = experience.map(item => `
      <div class="entry-item">
        <div class="entry-header">
          <div class="entry-title">${escapeHtml(item.position || '')}</div>
          <div class="entry-dates">${escapeHtml(item.duration || '')}</div>
        </div>
        <div class="entry-subtitle">
          ${escapeHtml(item.company || '')} ${item.location ? `· ${escapeHtml(item.location)}` : ''}
        </div>
        ${item.description ? `<div class="entry-desc">${formatDescription(item.description)}</div>` : ''}
      </div>
    `).join('');

    return `
      <div class="resume-section section-experience">
        <h2 class="resume-section-title">Work Experience</h2>
        ${itemsHTML}
      </div>
    `;
  }

  function renderEducationBlock() {
    if (education.length === 0) return '';
    const itemsHTML = education.map(item => `
      <div class="entry-item">
        <div class="entry-header">
          <div class="entry-title">${escapeHtml(item.degree || '')}</div>
          <div class="entry-dates">${escapeHtml(item.year || '')}</div>
        </div>
        <div class="entry-subtitle">${escapeHtml(item.institution || '')}</div>
        ${item.details ? `<div class="entry-desc">${escapeHtml(item.details)}</div>` : ''}
      </div>
    `).join('');

    return `
      <div class="resume-section section-education">
        <h2 class="resume-section-title">Education</h2>
        ${itemsHTML}
      </div>
    `;
  }

  function renderSkillsBlock() {
    if (skills.length === 0) return '';
    const itemsHTML = skills.map(group => {
      const skillsListStr = Array.isArray(group.skills) ? group.skills.join(', ') : (group.skills || '');
      return `
        <div class="skills-category-group">
          <span class="skills-cat-name">${escapeHtml(group.name)}:</span>
          <span class="skills-cat-list">${escapeHtml(skillsListStr)}</span>
        </div>
      `;
    }).join('');

    return `
      <div class="resume-section section-skills">
        <h2 class="resume-section-title">Key Competencies & Skills</h2>
        ${itemsHTML}
      </div>
    `;
  }

  function renderProjectsBlock() {
    if (projects.length === 0) return '';
    const itemsHTML = projects.map(item => `
      <div class="entry-item">
        <div class="entry-header">
          <div class="entry-title">${escapeHtml(item.name || '')}</div>
          <div class="entry-dates">${escapeHtml(item.duration || '')}</div>
        </div>
        <div class="entry-subtitle">
          ${item.role ? `<span>${escapeHtml(item.role)}</span>` : ''}
          ${item.link ? ` · <span style="font-weight:400; color:var(--tpl-accent);">${escapeHtml(item.link)}</span>` : ''}
        </div>
        ${item.description ? `<div class="entry-desc">${formatDescription(item.description)}</div>` : ''}
      </div>
    `).join('');

    return `
      <div class="resume-section section-projects">
        <h2 class="resume-section-title">Projects & Portfolio</h2>
        ${itemsHTML}
      </div>
    `;
  }

  function renderCertificationsBlock() {
    if (certs.length === 0) return '';
    const itemsHTML = certs.map(c => `
      <div class="entry-item" style="margin-bottom:6pt;">
        <div class="entry-header">
          <div class="entry-title">${escapeHtml(c.title)}</div>
          <div class="entry-dates">${escapeHtml(c.year || '')}</div>
        </div>
        <div class="entry-subtitle">${escapeHtml(c.issuer || '')}</div>
      </div>
    `).join('');

    return `
      <div class="resume-section section-certifications">
        <h2 class="resume-section-title">Certifications</h2>
        ${itemsHTML}
      </div>
    `;
  }

  function renderLanguagesBlock() {
    if (languages.length === 0) return '';
    const itemsHTML = languages.map(l => `
      <div style="margin-bottom:4pt; font-size:8.5pt;">
        <strong>${escapeHtml(l.name)}</strong>: <span style="color:#475569;">${escapeHtml(l.level || 'Fluent')}</span>
      </div>
    `).join('');

    return `
      <div class="resume-section section-languages">
        <h2 class="resume-section-title">Languages</h2>
        ${itemsHTML}
      </div>
    `;
  }

  // Two-column layout assembly
  if (isTwoCol) {
    const sidebarSections = `
      <h1 class="candidate-name">${escapeHtml(personal.fullName || 'Your Name')}</h1>
      ${personal.jobTitle ? `<div class="candidate-title">${escapeHtml(personal.jobTitle)}</div>` : ''}
      
      <div class="resume-section" style="margin-top:14pt;">
        <h2 class="resume-section-title">Contact</h2>
        <div style="font-size:8.5pt; display:flex; flex-direction:column; gap:4pt;">
          ${personal.email ? `<div>${escapeHtml(personal.email)}</div>` : ''}
          ${personal.phone ? `<div>${escapeHtml(personal.phone)}</div>` : ''}
          ${personal.location ? `<div>${escapeHtml(personal.location)}</div>` : ''}
          ${personal.website ? `<div>${escapeHtml(personal.website)}</div>` : ''}
          ${personal.linkedin ? `<div>${escapeHtml(personal.linkedin)}</div>` : ''}
          ${personal.github ? `<div>${escapeHtml(personal.github)}</div>` : ''}
        </div>
      </div>

      ${renderEducationBlock()}
      ${renderSkillsBlock()}
      ${renderCertificationsBlock()}
      ${renderLanguagesBlock()}
    `;

    const mainSections = `
      ${renderSummaryBlock()}
      ${renderExperienceBlock()}
      ${renderProjectsBlock()}
    `;

    return `
      <div class="paper-sidebar">
        ${sidebarSections}
      </div>
      <div class="paper-main">
        ${mainSections}
      </div>
    `;
  }

  // Header variations for single-column layouts
  let headerHTML = '';
  if (template.layoutType === 'split-header') {
    const contactLinesHTML = [
      personal.email ? `<span>${escapeHtml(personal.email)}</span>` : null,
      personal.phone ? `<span>${escapeHtml(personal.phone)}</span>` : null,
      personal.location ? `<span>${escapeHtml(personal.location)}</span>` : null,
      personal.linkedin ? `<span>${escapeHtml(personal.linkedin)}</span>` : null,
      personal.website ? `<span>${escapeHtml(personal.website)}</span>` : null,
      personal.github ? `<span>${escapeHtml(personal.github)}</span>` : null
    ].filter(Boolean).map(item => `<div>${item}</div>`).join('');

    headerHTML = `
      <header class="resume-header">
        <div class="header-left">
          <h1 class="candidate-name">${escapeHtml(personal.fullName || 'Your Name')}</h1>
          ${personal.jobTitle ? `<div class="candidate-title">${escapeHtml(personal.jobTitle)}</div>` : ''}
        </div>
        <div class="header-right">
          ${contactLinesHTML}
        </div>
      </header>
    `;
  } else {
    headerHTML = `
      <header class="resume-header">
        <h1 class="candidate-name">${escapeHtml(personal.fullName || 'Your Name')}</h1>
        ${personal.jobTitle ? `<div class="candidate-title">${escapeHtml(personal.jobTitle)}</div>` : ''}
        <div class="contact-line">${contactHTML}</div>
      </header>
    `;
  }

  return `
    ${headerHTML}
    ${renderSummaryBlock()}
    ${renderExperienceBlock()}
    ${renderEducationBlock()}
    ${renderSkillsBlock()}
    ${renderProjectsBlock()}
    ${renderCertificationsBlock()}
    ${renderLanguagesBlock()}
  `;
}

function renderResumeView() {
  const tpl = getSelectedTemplate();
  const data = state.resumeData;
  const accent = state.customAccentColor || tpl.accentColor;

  previewActiveTplName.textContent = `${tpl.name} · ATS Score: ${tpl.atsScore}% (${tpl.category})`;
  accentColorPicker.value = accent;

  // Set classes on paper container
  previewPaper.className = `resume-paper ${tpl.themeClass} layout-${tpl.layoutType}`;

  previewPaper.style.setProperty('--tpl-accent', accent);
  previewPaper.style.fontFamily = tpl.fontFamily;

  previewPaper.innerHTML = buildResumeHTML(tpl, data, accent);
}

// ============================================================================
// MODAL: PREVIEW DEMO
// ============================================================================

function openPreviewModal(templateId) {
  const template = RESUME_TEMPLATES.find(t => t.id === templateId);
  if (!template) return;

  state.modalPreviewTemplateId = templateId;
  modalTplTitle.textContent = `${template.name} — ATS Score: ${template.atsScore}% (${template.category})`;

  modalResumePaper.className = `resume-paper ${template.themeClass} layout-${template.layoutType}`;
  modalResumePaper.style.setProperty('--tpl-accent', template.accentColor);
  modalResumePaper.style.fontFamily = template.fontFamily;

  modalResumePaper.innerHTML = buildResumeHTML(template, SAMPLE_RESUME_DATA, template.accentColor);

  previewModal.classList.remove('hidden');
}

function closePreviewModal() {
  previewModal.classList.add('hidden');
  state.modalPreviewTemplateId = null;
}

// ============================================================================
// EVENT LISTENERS & INITIALIZATION
// ============================================================================

function setupEventListeners() {
  // Navigation
  navStep1.addEventListener('click', () => switchStep(1));
  navStep2.addEventListener('click', () => switchStep(2));
  navStep3.addEventListener('click', () => {
    state.resumeData = gatherFormData();
    switchStep(3);
    saveOrUpdateResumeHistory();
  });
  if (navStep4) navStep4.addEventListener('click', () => switchStep(4));
  if (btnHistoryCreateNew) {
    btnHistoryCreateNew.addEventListener('click', () => {
      state.currentEditingHistoryId = null;
      switchStep(1);
    });
  }

  brandLink.addEventListener('click', (e) => {
    e.preventDefault();
    state.currentEditingHistoryId = null;
    switchStep(1);
  });

  btnChangeTemplateTop.addEventListener('click', () => switchStep(1));
  btnBackToTemplates.addEventListener('click', () => switchStep(1));
  btnEditDetails.addEventListener('click', () => switchStep(2));
  btnSwitchTemplateModal.addEventListener('click', () => switchStep(1));

  // History Search Listener
  if (historySearchInput) {
    historySearchInput.addEventListener('input', (e) => {
      state.historySearchQuery = e.target.value;
      renderHistoryView();
    });
  }

  // Search & Filter
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    state.currentLimit = 36;
    renderTemplatesGrid();
  });

  // Category filter tabs
  categoryFilterBar.addEventListener('click', (e) => {
    const tab = e.target.closest('.category-tab');
    if (!tab) return;
    categoryFilterBar.querySelectorAll('.category-tab').forEach(b => b.classList.remove('active'));
    tab.classList.add('active');
    state.activeFilter = tab.dataset.category;
    state.currentLimit = 36;
    renderTemplatesGrid();
  });

  // ATS Score filter pills
  if (atsFilterPills) {
    atsFilterPills.addEventListener('click', (e) => {
      const pill = e.target.closest('.ats-pill');
      if (!pill) return;
      atsFilterPills.querySelectorAll('.ats-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.atsFilter = pill.dataset.ats;
      state.currentLimit = 36;
      renderTemplatesGrid();
    });
  }

  // Layout dropdown filter
  if (layoutSelectFilter) {
    layoutSelectFilter.addEventListener('change', (e) => {
      state.layoutFilter = e.target.value;
      state.currentLimit = 36;
      renderTemplatesGrid();
    });
  }

  // Sorting dropdown
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderTemplatesGrid();
    });
  }

  // Load More & Show All
  if (btnLoadMore) {
    btnLoadMore.addEventListener('click', () => {
      state.currentLimit += 36;
      renderTemplatesGrid();
    });
  }
  if (btnShowAllTemplates) {
    btnShowAllTemplates.addEventListener('click', () => {
      state.currentLimit = 200;
      renderTemplatesGrid();
    });
  }

  // Add Item Buttons in Form
  btnAddExp.addEventListener('click', () => {
    const count = containerExp.children.length + 1;
    containerExp.appendChild(createExperienceItem(undefined, count));
  });

  btnAddEdu.addEventListener('click', () => {
    const count = containerEdu.children.length + 1;
    containerEdu.appendChild(createEducationItem(undefined, count));
  });

  btnAddSkillGroup.addEventListener('click', () => {
    const count = containerSkills.children.length + 1;
    containerSkills.appendChild(createSkillGroupItem(undefined, count));
  });

  btnAddProject.addEventListener('click', () => {
    const count = containerProjects.children.length + 1;
    containerProjects.appendChild(createProjectItem(undefined, count));
  });

  btnAddCert.addEventListener('click', () => {
    const count = containerCerts.children.length + 1;
    containerCerts.appendChild(createCertItem(undefined, count));
  });

  btnAddLang.addEventListener('click', () => {
    const count = containerLanguages.children.length + 1;
    containerLanguages.appendChild(createLanguageItem(undefined, count));
  });

  // Form Submit
  resumeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    state.resumeData = gatherFormData();
    switchStep(3);
    saveOrUpdateResumeHistory();
  });

  // Top Action Buttons
  if (btnBackToTemplatesTop) {
    btnBackToTemplatesTop.addEventListener('click', () => switchStep(1));
  }
  if (btnGenerateResumeTop) {
    btnGenerateResumeTop.addEventListener('click', () => {
      state.resumeData = gatherFormData();
      switchStep(3);
      saveOrUpdateResumeHistory();
    });
  }

  // Upload & File Handling
  if (btnBrowseFile && resumeFileInput) {
    btnBrowseFile.addEventListener('click', () => {
      resumeFileInput.click();
    });

    resumeFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleUploadedFile(e.target.files[0]);
      }
    });
  }

  // Paste Text Toggle & Parse
  if (btnTogglePaste && pasteTextareaWrapper) {
    btnTogglePaste.addEventListener('click', () => {
      pasteTextareaWrapper.classList.toggle('show');
    });
  }

  if (btnParsePastedText && pasteResumeTextarea) {
    btnParsePastedText.addEventListener('click', () => {
      const text = pasteResumeTextarea.value.trim();
      if (!text) {
        showUploadStatus('Please paste your resume text before clicking extract.', 'error');
        return;
      }
      try {
        parseAndPopulatePlainText(text);
        showUploadStatus('✓ Extracted & populated resume details from your text!', 'success');
        pasteTextareaWrapper.classList.remove('show');
      } catch (err) {
        showUploadStatus(`Parsing error: ${err.message}`, 'error');
      }
    });
  }

  // Drag and Drop on Upload Card
  if (uploadDetailsCard) {
    uploadDetailsCard.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadDetailsCard.classList.add('drag-over');
    });

    uploadDetailsCard.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadDetailsCard.classList.remove('drag-over');
    });

    uploadDetailsCard.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadDetailsCard.classList.remove('drag-over');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleUploadedFile(e.dataTransfer.files[0]);
      }
    });
  }

  // Remove Uploaded Image Preview
  if (btnRemoveImagePreview) {
    btnRemoveImagePreview.addEventListener('click', () => {
      if (imagePreviewImg) imagePreviewImg.src = '';
      if (imagePreviewCard) imagePreviewCard.classList.add('hidden');
      if (resumeFileInput) resumeFileInput.value = '';
      showUploadStatus('Image preview removed.', 'info');
    });
  }

  // Clear Form
  btnClearForm.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all fields in the resume form?')) {
      const emptyData = {
        personal: { fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '' },
        summary: { enabled: true, text: '' },
        experience: { enabled: true, items: [] },
        education: { enabled: true, items: [] },
        skills: { enabled: true, categories: [] },
        projects: { enabled: true, items: [] },
        certifications: { enabled: true, items: [] },
        languages: { enabled: true, items: [] }
      };
      state.resumeData = emptyData;
      populateFormFromData(emptyData);
    }
  });

  // Accent Color Picker in Preview
  accentColorPicker.addEventListener('input', (e) => {
    state.customAccentColor = e.target.value;
    previewPaper.style.setProperty('--tpl-accent', state.customAccentColor);
  });

  // Save PDF Button
  if (btnSavePdf) {
    btnSavePdf.addEventListener('click', () => {
      saveResumeAsPdf();
    });
  }

  // Template Preview Modal Listeners
  if (btnCloseModal) btnCloseModal.addEventListener('click', closePreviewModal);
  if (btnModalCancel) btnModalCancel.addEventListener('click', closePreviewModal);
  if (previewModal) {
    previewModal.addEventListener('click', (e) => {
      if (e.target === previewModal) closePreviewModal();
    });
  }
  if (btnModalUseTemplate) {
    btnModalUseTemplate.addEventListener('click', () => {
      if (state.modalPreviewTemplateId) {
        selectTemplate(state.modalPreviewTemplateId, true);
        closePreviewModal();
      }
    });
  }

  // Delete Resume Modal Listeners
  if (btnCloseDeleteModal) btnCloseDeleteModal.addEventListener('click', closeDeleteModal);
  if (btnCancelDelete) btnCancelDelete.addEventListener('click', closeDeleteModal);
  if (btnConfirmDelete) btnConfirmDelete.addEventListener('click', confirmDeleteResume);
  if (modalDeleteConfirm) {
    modalDeleteConfirm.addEventListener('click', (e) => {
      if (e.target === modalDeleteConfirm) closeDeleteModal();
    });
  }

  // Clear All History Modal Listeners
  if (btnClearHistory) btnClearHistory.addEventListener('click', openClearHistoryModal);
  if (btnCloseClearModal) btnCloseClearModal.addEventListener('click', closeClearHistoryModal);
  if (btnCancelClearHistory) btnCancelClearHistory.addEventListener('click', closeClearHistoryModal);
  if (btnConfirmClearHistory) btnConfirmClearHistory.addEventListener('click', confirmClearHistory);
  if (modalClearConfirm) {
    modalClearConfirm.addEventListener('click', (e) => {
      if (e.target === modalClearConfirm) closeClearHistoryModal();
    });
  }
}

// ============================================================================
// RESUME HISTORY MANAGEMENT & STORAGE
// ============================================================================

const HISTORY_STORAGE_KEY = 'resume_builder_saved_history_v2';
let pendingDeleteId = null;

function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read resume history:', err);
    return [];
  }
}

function setHistory(history) {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('Failed to write resume history:', err);
  }
}

function updateHistoryBadges() {
  const history = getHistory();
  const count = history.length;
  if (navHistoryBadge) {
    navHistoryBadge.textContent = count;
    navHistoryBadge.style.display = count > 0 ? 'inline-flex' : 'none';
  }
  if (btnClearHistory) {
    btnClearHistory.style.display = count > 0 ? 'inline-flex' : 'none';
  }
}

function formatHistoryTime(dateObj = new Date()) {
  const dayName = dateObj.toLocaleDateString(undefined, { weekday: 'long' });
  const dayNum = dateObj.getDate();
  const monthName = dateObj.toLocaleDateString(undefined, { month: 'long' });
  const year = dateObj.getFullYear();
  const dateStr = `${dayNum} ${monthName} ${year}`;
  const timeStr = dateObj.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
  return {
    iso: dateObj.toISOString(),
    day: dayName,
    date: dateStr,
    time: timeStr
  };
}

function saveOrUpdateResumeHistory() {
  const data = state.resumeData || gatherFormData();
  const candidateName = (data.personal?.fullName || '').trim();
  const cleanName = candidateName.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_');
  const fileName = `${cleanName || 'Resume'}.pdf`;
  const resumeTitle = candidateName ? `Resume – ${candidateName}` : 'Resume – Untitled Profile';
  const tpl = getSelectedTemplate();

  const now = new Date();
  const timeInfo = formatHistoryTime(now);

  const history = getHistory();

  // If currently editing an existing history item, update it in place
  if (state.currentEditingHistoryId) {
    const existingIndex = history.findIndex(item => item.id === state.currentEditingHistoryId);
    if (existingIndex !== -1) {
      history[existingIndex].title = resumeTitle;
      history[existingIndex].candidateName = candidateName || 'Untitled Profile';
      history[existingIndex].jobTitle = data.personal?.jobTitle || '';
      history[existingIndex].email = data.personal?.email || '';
      history[existingIndex].phone = data.personal?.phone || '';
      history[existingIndex].location = data.personal?.location || '';
      history[existingIndex].pdfFileName = fileName;
      history[existingIndex].day = timeInfo.day;
      history[existingIndex].date = timeInfo.date;
      history[existingIndex].time = timeInfo.time;
      history[existingIndex].updatedAt = timeInfo.iso;
      history[existingIndex].templateId = state.selectedTemplateId;
      history[existingIndex].templateName = tpl.name;
      history[existingIndex].atsScore = tpl.atsScore;
      history[existingIndex].accentColor = state.customAccentColor;
      history[existingIndex].resumeData = JSON.parse(JSON.stringify(data));

      setHistory(history);
      updateHistoryBadges();
      renderHistoryView();
      return history[existingIndex];
    }
  }

  // Check if identical data already exists in the most recent record (prevent re-render/preview duplicate)
  if (history.length > 0) {
    const latest = history[0];
    const isSameData = JSON.stringify(latest.resumeData) === JSON.stringify(data) &&
                       latest.templateId === state.selectedTemplateId;
    if (isSameData) {
      state.currentEditingHistoryId = latest.id;
      return latest;
    }
  }

  // Create genuinely new record
  const newId = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : ('res_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9));

  const newRecord = {
    id: newId,
    title: resumeTitle,
    candidateName: candidateName || 'Untitled Profile',
    jobTitle: data.personal?.jobTitle || '',
    email: data.personal?.email || '',
    phone: data.personal?.phone || '',
    location: data.personal?.location || '',
    pdfFileName: fileName,
    day: timeInfo.day,
    date: timeInfo.date,
    time: timeInfo.time,
    timestamp: timeInfo.iso,
    createdAt: timeInfo.iso,
    updatedAt: timeInfo.iso,
    templateId: state.selectedTemplateId,
    templateName: tpl.name,
    atsScore: tpl.atsScore,
    accentColor: state.customAccentColor,
    resumeData: JSON.parse(JSON.stringify(data))
  };

  history.unshift(newRecord);
  setHistory(history);
  state.currentEditingHistoryId = newId;
  updateHistoryBadges();
  renderHistoryView();
  return newRecord;
}

function getFilteredHistory() {
  const history = getHistory();
  const q = (state.historySearchQuery || '').trim().toLowerCase();
  if (!q) return history;

  return history.filter(item => {
    const titleMatch = (item.title || '').toLowerCase().includes(q);
    const nameMatch = (item.candidateName || '').toLowerCase().includes(q);
    const emailMatch = (item.email || '').toLowerCase().includes(q);
    const jobMatch = (item.jobTitle || '').toLowerCase().includes(q);
    const tplMatch = (item.templateName || '').toLowerCase().includes(q);
    const dataMatch = JSON.stringify(item.resumeData || {}).toLowerCase().includes(q);
    return titleMatch || nameMatch || emailMatch || jobMatch || tplMatch || dataMatch;
  });
}

function renderHistoryView() {
  if (!historyListContainer) return;
  const history = getHistory();
  updateHistoryBadges();

  if (history.length === 0) {
    historyListContainer.innerHTML = `
      <div class="history-empty-state">
        <div class="empty-icon-circle">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <h3>No resume history available.</h3>
        <p>Every time you create, generate, or save a resume PDF, it will be automatically saved here so you can access, edit, or download it anytime.</p>
        <button class="btn btn-primary" id="btn-empty-create">
          Create a Resume
        </button>
      </div>
    `;

    const btnEmptyCreate = document.getElementById('btn-empty-create');
    if (btnEmptyCreate) {
      btnEmptyCreate.addEventListener('click', () => {
        state.currentEditingHistoryId = null;
        switchStep(1);
      });
    }
    return;
  }

  const filtered = getFilteredHistory();

  if (filtered.length === 0) {
    historyListContainer.innerHTML = `
      <div class="history-empty-state">
        <h3>No resumes found.</h3>
        <p style="margin-bottom: 0;">No saved resumes match "${escapeHtml(state.historySearchQuery)}". Try searching with another term.</p>
      </div>
    `;
    return;
  }

  let html = `<div class="history-grid">`;

  filtered.forEach(item => {
    const data = item.resumeData || {};
    const expCount = (data.experience?.enabled && Array.isArray(data.experience.items)) ? data.experience.items.length : 0;
    const eduCount = (data.education?.enabled && Array.isArray(data.education.items)) ? data.education.items.length : 0;
    const skillsCount = (data.skills?.enabled && Array.isArray(data.skills.categories)) ?
      data.skills.categories.reduce((acc, cat) => {
        if (!cat || !cat.skills) return acc;
        if (Array.isArray(cat.skills)) return acc + cat.skills.length;
        if (typeof cat.skills === 'string') return acc + cat.skills.split(',').map(s => s.trim()).filter(Boolean).length;
        return acc;
      }, 0) : 0;
    const projectCount = (data.projects?.enabled && Array.isArray(data.projects.items)) ? data.projects.items.length : 0;

    const dayText = item.day || '';
    const dateText = item.date || '';
    const timeText = item.time || '';
    const candidateName = item.candidateName || 'Candidate';
    const resumeTitle = item.title || `Resume – ${candidateName}`;
    const pdfFileName = item.pdfFileName || `${candidateName.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_')}.pdf`;

    html += `
      <div class="history-card" data-card-id="${escapeHtml(item.id)}">
        <div class="history-card-header">
          <div>
            <h3 class="history-card-title">${escapeHtml(resumeTitle)}</h3>
            <div class="history-card-candidate-name">${escapeHtml(candidateName)}</div>
            
            <div class="history-card-datetime-grid">
              <span class="history-meta-pill" title="Created Date">
                📅 Date: <strong>${escapeHtml(dateText)}</strong>
              </span>
              <span class="history-meta-pill" title="Day">
                📆 Day: <strong>${escapeHtml(dayText)}</strong>
              </span>
              <span class="history-meta-pill" title="Exact Time">
                🕐 Time: <strong>${escapeHtml(timeText)}</strong>
              </span>
              <span class="history-meta-pill pdf-pill" title="PDF File">
                📄 ${escapeHtml(pdfFileName)}
              </span>
            </div>
          </div>

          <div class="history-card-tags">
            <span class="history-tpl-badge">${escapeHtml(item.templateName || 'Template')}</span>
            <span class="history-ats-badge">${escapeHtml(item.atsScore || '95')}% ATS</span>
          </div>
        </div>

        <div class="history-card-body">
          <div class="history-card-snippet">
            ${item.jobTitle ? `<strong>${escapeHtml(item.jobTitle)}</strong>` : ''}
            ${item.location ? `<span> · 📍 ${escapeHtml(item.location)}</span>` : ''}
            ${item.email ? `<span> · ✉️ ${escapeHtml(item.email)}</span>` : ''}
          </div>

          <div class="history-stats-pills">
            <span class="stat-pill">${expCount} Experience${expCount === 1 ? '' : 's'}</span>
            <span class="stat-pill">${eduCount} Education</span>
            ${skillsCount > 0 ? `<span class="stat-pill">${skillsCount} Skills</span>` : ''}
            ${projectCount > 0 ? `<span class="stat-pill">${projectCount} Project${projectCount === 1 ? '' : 's'}</span>` : ''}
          </div>
        </div>

        <div class="history-card-actions">
          <div class="history-actions-group">
            <button class="btn btn-primary btn-sm btn-history-view" data-id="${escapeHtml(item.id)}" title="View resume preview">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-1px;margin-right:3px;">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              View
            </button>
            <button class="btn btn-secondary btn-sm btn-history-download" data-id="${escapeHtml(item.id)}" title="Download PDF">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-1px;margin-right:3px;">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download
            </button>
            <button class="btn btn-secondary btn-sm btn-history-edit" data-id="${escapeHtml(item.id)}" title="Edit resume details">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-1px;margin-right:3px;">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit
            </button>
          </div>
          <button class="btn btn-danger btn-sm btn-history-delete" data-id="${escapeHtml(item.id)}" title="Delete this resume">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Delete
          </button>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  historyListContainer.innerHTML = html;

  // Add click listeners to history cards
  historyListContainer.querySelectorAll('.btn-history-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      viewResumeFromHistory(id);
    });
  });

  historyListContainer.querySelectorAll('.btn-history-download').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      downloadResumeFromHistory(id);
    });
  });

  historyListContainer.querySelectorAll('.btn-history-edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      editResumeFromHistory(id);
    });
  });

  historyListContainer.querySelectorAll('.btn-history-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      openDeleteModal(id);
    });
  });
}

function viewResumeFromHistory(id) {
  const history = getHistory();
  const item = history.find(r => r.id === id);
  if (!item) return;

  state.currentEditingHistoryId = item.id;
  state.resumeData = JSON.parse(JSON.stringify(item.resumeData));
  state.selectedTemplateId = item.templateId || state.selectedTemplateId;
  state.customAccentColor = item.accentColor || null;

  populateFormFromData(state.resumeData);
  if (state.customAccentColor && accentColorPicker) {
    accentColorPicker.value = state.customAccentColor;
  }
  switchStep(3);
}

function editResumeFromHistory(id) {
  const history = getHistory();
  const item = history.find(r => r.id === id);
  if (!item) return;

  state.currentEditingHistoryId = item.id;
  state.resumeData = JSON.parse(JSON.stringify(item.resumeData));
  state.selectedTemplateId = item.templateId || state.selectedTemplateId;
  state.customAccentColor = item.accentColor || null;

  populateFormFromData(state.resumeData);
  if (state.customAccentColor && accentColorPicker) {
    accentColorPicker.value = state.customAccentColor;
  }
  switchStep(2);
}

let isDownloadingHistoryItem = false;

async function downloadResumeFromHistory(id) {
  if (isDownloadingHistoryItem) return;
  const history = getHistory();
  const item = history.find(r => r.id === id);
  if (!item) return;

  isDownloadingHistoryItem = true;
  showToast(`Generating PDF for "${item.title}"...`, 'info');

  let tempWrapper = null;
  try {
    if (typeof window.html2pdf === 'undefined') {
      throw new Error('PDF library is not loaded');
    }

    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const tpl = RESUME_TEMPLATES.find(t => t.id === item.templateId) || getSelectedTemplate();
    const resumeHtml = buildResumeHTML(tpl, item.resumeData, item.accentColor);

    tempWrapper = document.createElement('div');
    tempWrapper.style.position = 'fixed';
    tempWrapper.style.left = '-9999px';
    tempWrapper.style.top = '0';
    tempWrapper.style.width = '210mm';
    tempWrapper.style.background = '#ffffff';
    tempWrapper.style.zIndex = '-9999';

    const paperEl = document.createElement('div');
    paperEl.className = 'resume-paper';
    paperEl.style.width = '210mm';
    paperEl.style.minHeight = '297mm';
    paperEl.style.maxWidth = '210mm';
    paperEl.style.boxShadow = 'none';
    paperEl.style.margin = '0';
    paperEl.style.borderRadius = '0';
    paperEl.style.boxSizing = 'border-box';
    if (item.accentColor) {
      paperEl.style.setProperty('--tpl-accent', item.accentColor);
    }
    paperEl.innerHTML = resumeHtml;
    tempWrapper.appendChild(paperEl);
    document.body.appendChild(tempWrapper);

    const images = Array.from(paperEl.querySelectorAll('img'));
    if (images.length > 0) {
      await Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(res => { img.onload = res; img.onerror = res; });
      }));
    }

    await new Promise(r => setTimeout(r, 120));

    const fileName = item.pdfFileName || `${(item.candidateName || 'Resume').replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_')}.pdf`;

    const opt = {
      margin: [8, 8, 8, 8],
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy']
      }
    };

    await window.html2pdf().set(opt).from(paperEl).save();
    showToast(`✓ Downloaded "${fileName}"!`, 'success');
  } catch (err) {
    console.error('Download history PDF error:', err);
    showToast('Failed to download PDF: ' + err.message, 'error');
  } finally {
    if (tempWrapper && tempWrapper.parentNode) {
      tempWrapper.parentNode.removeChild(tempWrapper);
    }
    isDownloadingHistoryItem = false;
  }
}

function openDeleteModal(id) {
  const history = getHistory();
  const item = history.find(r => r.id === id);
  if (!item) return;

  pendingDeleteId = id;
  if (deleteResumeItemTitle) {
    deleteResumeItemTitle.textContent = `"${item.title}" will be permanently removed from your history.`;
  }
  if (modalDeleteConfirm) {
    modalDeleteConfirm.classList.remove('hidden');
  }
}

function closeDeleteModal() {
  pendingDeleteId = null;
  if (modalDeleteConfirm) {
    modalDeleteConfirm.classList.add('hidden');
  }
}

function confirmDeleteResume() {
  if (!pendingDeleteId) return;
  if (state.currentEditingHistoryId === pendingDeleteId) {
    state.currentEditingHistoryId = null;
  }
  const history = getHistory().filter(r => r.id !== pendingDeleteId);
  setHistory(history);
  closeDeleteModal();
  renderHistoryView();
  updateHistoryBadges();
  showToast('Resume deleted successfully.', 'info');
}

function openClearHistoryModal() {
  const history = getHistory();
  if (history.length === 0) return;
  if (modalClearConfirm) {
    modalClearConfirm.classList.remove('hidden');
  }
}

function closeClearHistoryModal() {
  if (modalClearConfirm) {
    modalClearConfirm.classList.add('hidden');
  }
}

function confirmClearHistory() {
  state.currentEditingHistoryId = null;
  setHistory([]);
  closeClearHistoryModal();
  renderHistoryView();
  updateHistoryBadges();
  showToast('All resume history cleared.', 'info');
}

function showToast(message, type = 'info') {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast-message ${type}`;
  toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3200);
}

// ============================================================================
// PDF GENERATION & SAVE PDF HISTORY PIPELINE (CRITICAL)
// Exact execution sequence:
// 1. Validate the current resume.
// 2. Generate the PDF successfully.
// 3. Download/save the PDF for the user.
// 4. Immediately create a history record after successful PDF generation.
// 5. Save the history record using persistent storage (localStorage).
// 6. Refresh/update the History UI automatically.
// 7. Show the newly saved resume at the top of History.
// ============================================================================

let isSavingPdf = false;

async function saveResumeAsPdf() {
  // Prevent duplicate execution from multiple clicks or async re-triggers
  if (isSavingPdf) return;
  isSavingPdf = true;

  if (!btnSavePdf) {
    isSavingPdf = false;
    return;
  }

  // -------------------------------------------------------------
  // Step 1: Validate the current resume
  // -------------------------------------------------------------
  const data = state.resumeData || gatherFormData();
  const candidateName = (data.personal?.fullName || '').trim();
  const cleanName = candidateName.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_');
  const fileName = `${cleanName || 'Resume'}.pdf`;
  const resumeTitle = candidateName ? `Resume – ${candidateName}` : 'Resume – Untitled Profile';
  const tpl = getSelectedTemplate();

  const originalContent = btnSavePdf.innerHTML;
  btnSavePdf.disabled = true;
  btnSavePdf.innerHTML = `
    <svg class="spin-animation" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline-block;vertical-align:-2px;margin-right:4px;">
      <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
      <path d="M12 2a10 10 0 0 1 10 10"></path>
    </svg>
    Generating PDF...
  `;

  let tempWrapper = null;

  try {
    if (typeof window.html2pdf === 'undefined') {
      throw new Error('PDF generator library is initializing. Please try again in a moment.');
    }

    // Wait for fonts to finish loading
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const sourcePaper = document.getElementById('resume-paper');
    if (!sourcePaper) {
      throw new Error('Resume preview container not found.');
    }

    // Clone element to guarantee exact A4 layout regardless of viewport/device size
    const clone = sourcePaper.cloneNode(true);
    clone.style.width = '210mm';
    clone.style.minHeight = '297mm';
    clone.style.maxWidth = '210mm';
    clone.style.boxShadow = 'none';
    clone.style.margin = '0';
    clone.style.borderRadius = '0';
    clone.style.boxSizing = 'border-box';
    if (sourcePaper.style.getPropertyValue('--tpl-accent')) {
      clone.style.setProperty('--tpl-accent', sourcePaper.style.getPropertyValue('--tpl-accent'));
    }

    tempWrapper = document.createElement('div');
    tempWrapper.style.position = 'fixed';
    tempWrapper.style.left = '-9999px';
    tempWrapper.style.top = '0';
    tempWrapper.style.width = '210mm';
    tempWrapper.style.background = '#ffffff';
    tempWrapper.style.zIndex = '-9999';
    tempWrapper.appendChild(clone);
    document.body.appendChild(tempWrapper);

    // Wait for any images in clone to be loaded
    const images = Array.from(clone.querySelectorAll('img'));
    if (images.length > 0) {
      await Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(res => {
          img.onload = res;
          img.onerror = res;
        });
      }));
    }

    await new Promise(r => setTimeout(r, 120));

    const opt = {
      margin: [8, 8, 8, 8], // 8mm A4 margins
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy']
      }
    };

    // -------------------------------------------------------------
    // Step 2 & 3: Generate the PDF successfully & Download/save the PDF
    // -------------------------------------------------------------
    await window.html2pdf().set(opt).from(clone).save();

    // Clean up temporary DOM element
    if (tempWrapper && tempWrapper.parentNode) {
      tempWrapper.parentNode.removeChild(tempWrapper);
      tempWrapper = null;
    }

    // -------------------------------------------------------------
    // Step 4: Immediately create a history record after successful PDF generation
    // -------------------------------------------------------------
    const now = new Date();
    const timeInfo = formatHistoryTime(now);
    const newId = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : ('res_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9));

    const historyRecord = {
      id: newId,
      title: resumeTitle,
      candidateName: candidateName || 'Untitled Profile',
      jobTitle: data.personal?.jobTitle || '',
      email: data.personal?.email || '',
      phone: data.personal?.phone || '',
      location: data.personal?.location || '',
      pdfFileName: fileName,
      date: timeInfo.date,
      day: timeInfo.day,
      time: timeInfo.time,
      timestamp: timeInfo.iso,
      createdAt: timeInfo.iso,
      updatedAt: timeInfo.iso,
      templateId: state.selectedTemplateId,
      templateName: tpl.name,
      atsScore: tpl.atsScore,
      accentColor: state.customAccentColor,
      resumeData: JSON.parse(JSON.stringify(data))
    };

    // -------------------------------------------------------------
    // Step 5: Save the history record using persistent storage (localStorage)
    // -------------------------------------------------------------
    const history = getHistory();
    // If currently editing an existing record, replace it so we don't have duplicates
    if (state.currentEditingHistoryId) {
      const idx = history.findIndex(h => h.id === state.currentEditingHistoryId);
      if (idx !== -1) {
        history.splice(idx, 1);
      }
    } else if (history.length > 0) {
      // If the top history entry has identical resume data (e.g. from initial preview auto-save), replace it with the finalized PDF record
      const top = history[0];
      if (JSON.stringify(top.resumeData) === JSON.stringify(data) && top.templateId === state.selectedTemplateId) {
        history.shift();
      }
    }

    // Step 7: Show the newly saved resume at the top of History (index 0)
    history.unshift(historyRecord);
    setHistory(history);
    state.currentEditingHistoryId = historyRecord.id;

    // -------------------------------------------------------------
    // Step 6: Refresh/update the History UI automatically
    // -------------------------------------------------------------
    updateHistoryBadges();
    renderHistoryView();

    showToast(`✓ Downloaded "${fileName}" and saved to History!`, 'success');
  } catch (err) {
    console.error('PDF generation error:', err);
    if (tempWrapper && tempWrapper.parentNode) {
      tempWrapper.parentNode.removeChild(tempWrapper);
    }
    showToast('Failed to generate PDF: ' + (err.message || 'Please try again'), 'error');
  } finally {
    isSavingPdf = false;
    btnSavePdf.disabled = false;
    btnSavePdf.innerHTML = originalContent;
  }
}

// Upload & Parsing Helper Functions
function showUploadStatus(message, type = 'success') {
  if (!uploadStatusAlert) return;
  uploadStatusAlert.textContent = message;
  uploadStatusAlert.className = `upload-status-alert show ${type}`;
  setTimeout(() => {
    uploadStatusAlert.classList.remove('show');
  }, 7000);
}

function importJsonResume(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid JSON structure.');
  }

  if (parsed.personal) {
    state.resumeData = JSON.parse(JSON.stringify(parsed));
    populateFormFromData(state.resumeData);
    return;
  }

  // Handle standard JSON Resume schema
  const newData = JSON.parse(JSON.stringify(state.resumeData));

  if (parsed.basics) {
    const b = parsed.basics;
    if (b.name) newData.personal.fullName = b.name;
    if (b.label) newData.personal.jobTitle = b.label;
    if (b.email) newData.personal.email = b.email;
    if (b.phone) newData.personal.phone = b.phone;
    if (b.url) newData.personal.website = b.url;
    if (b.location) {
      newData.personal.location = typeof b.location === 'string' 
        ? b.location 
        : [b.location.city, b.location.region || b.location.countryCode].filter(Boolean).join(', ');
    }
    if (b.profiles && Array.isArray(b.profiles)) {
      const li = b.profiles.find(p => (p.network || '').toLowerCase().includes('linkedin'));
      if (li) newData.personal.linkedin = li.url || li.username;
      const gh = b.profiles.find(p => (p.network || '').toLowerCase().includes('github'));
      if (gh) newData.personal.github = gh.url || gh.username;
    }
    if (b.summary) {
      newData.summary.enabled = true;
      newData.summary.text = b.summary;
    }
  }

  if (Array.isArray(parsed.work) && parsed.work.length > 0) {
    newData.experience.enabled = true;
    newData.experience.items = parsed.work.map(w => ({
      company: w.name || w.company || '',
      position: w.position || '',
      duration: [w.startDate, w.endDate || 'Present'].filter(Boolean).join(' - '),
      location: w.location || '',
      description: w.summary || (Array.isArray(w.highlights) ? w.highlights.map(h => '• ' + h).join('\n') : '')
    }));
  }

  if (Array.isArray(parsed.education) && parsed.education.length > 0) {
    newData.education.enabled = true;
    newData.education.items = parsed.education.map(e => ({
      degree: [e.studyType, e.area].filter(Boolean).join(' in ') || e.degree || '',
      institution: e.institution || '',
      year: [e.startDate, e.endDate].filter(Boolean).join(' - '),
      details: Array.isArray(e.courses) ? e.courses.join(', ') : (e.score ? `GPA: ${e.score}` : '')
    }));
  }

  if (Array.isArray(parsed.skills) && parsed.skills.length > 0) {
    newData.skills.enabled = true;
    newData.skills.categories = parsed.skills.map(s => ({
      name: s.name || 'Key Skills',
      skills: Array.isArray(s.keywords) ? s.keywords : [s.name]
    }));
  }

  if (Array.isArray(parsed.projects) && parsed.projects.length > 0) {
    newData.projects.enabled = true;
    newData.projects.items = parsed.projects.map(p => ({
      name: p.name || '',
      role: p.type || 'Contributor',
      link: p.url || '',
      duration: [p.startDate, p.endDate].filter(Boolean).join(' - '),
      description: p.description || (Array.isArray(p.highlights) ? p.highlights.join('\n') : '')
    }));
  }

  state.resumeData = newData;
  populateFormFromData(newData);
}

function parseAndPopulatePlainText(rawText) {
  if (!rawText || !rawText.trim()) {
    throw new Error('Provided text is empty.');
  }

  const text = rawText.trim();
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return;

  const newData = JSON.parse(JSON.stringify(state.resumeData));

  // Extract Email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) newData.personal.email = emailMatch[0];

  // Extract Phone
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) newData.personal.phone = phoneMatch[0];

  // Extract LinkedIn
  const liMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  if (liMatch) newData.personal.linkedin = liMatch[0];

  // Extract GitHub
  const ghMatch = text.match(/github\.com\/[\w-]+/i);
  if (ghMatch) newData.personal.github = ghMatch[0];

  // Extract Name & Job Title from first 2 lines
  if (lines[0] && !lines[0].includes('@') && !lines[0].match(/\d{5,}/)) {
    newData.personal.fullName = lines[0].replace(/^[#*\-•\s]+/, '').trim();
    if (lines[1] && !lines[1].includes('@') && lines[1].length < 60) {
      newData.personal.jobTitle = lines[1].replace(/^[#*\-•\s]+/, '').trim();
    }
  }

  // Segment sections
  const sections = {};
  let currentSection = 'HEADER';
  sections[currentSection] = [];

  for (const line of lines) {
    const trimmed = line.replace(/^[#*\-•\s]+/, '').trim().toUpperCase();
    if (trimmed.startsWith('SUMMARY') || trimmed.startsWith('PROFILE') || trimmed.startsWith('OBJECTIVE')) {
      currentSection = 'SUMMARY';
      sections[currentSection] = [];
    } else if (trimmed.startsWith('EXPERIENCE') || trimmed.startsWith('WORK HISTORY') || trimmed.startsWith('EMPLOYMENT')) {
      currentSection = 'EXPERIENCE';
      sections[currentSection] = [];
    } else if (trimmed.startsWith('EDUCATION') || trimmed.startsWith('ACADEMIC')) {
      currentSection = 'EDUCATION';
      sections[currentSection] = [];
    } else if (trimmed.startsWith('SKILL') || trimmed.startsWith('COMPETENCIES') || trimmed.startsWith('TECHNOLOGIES')) {
      currentSection = 'SKILLS';
      sections[currentSection] = [];
    } else if (trimmed.startsWith('PROJECT')) {
      currentSection = 'PROJECTS';
      sections[currentSection] = [];
    } else if (trimmed.startsWith('CERTIF')) {
      currentSection = 'CERTIFICATIONS';
      sections[currentSection] = [];
    } else {
      sections[currentSection].push(line);
    }
  }

  if (sections['SUMMARY'] && sections['SUMMARY'].length > 0) {
    newData.summary.enabled = true;
    newData.summary.text = sections['SUMMARY'].join(' ');
  }

  if (sections['SKILLS'] && sections['SKILLS'].length > 0) {
    newData.skills.enabled = true;
    const skillTokens = sections['SKILLS'].join(' ').split(/[,•|·\n]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 35);
    if (skillTokens.length > 0) {
      newData.skills.categories = [{
        name: 'Technical & Professional Skills',
        skills: skillTokens.slice(0, 16)
      }];
    }
  }

  if (sections['EXPERIENCE'] && sections['EXPERIENCE'].length > 0) {
    newData.experience.enabled = true;
    const expText = sections['EXPERIENCE'].join('\n');
    newData.experience.items = [
      {
        company: 'Professional Experience',
        position: newData.personal.jobTitle || 'Role',
        duration: 'Recent',
        location: newData.personal.location || '',
        description: expText
      }
    ];
  }

  if (sections['EDUCATION'] && sections['EDUCATION'].length > 0) {
    newData.education.enabled = true;
    newData.education.items = [
      {
        degree: sections['EDUCATION'][0] || 'Degree / Diploma',
        institution: sections['EDUCATION'][1] || 'University / Institution',
        year: 'Recent',
        details: sections['EDUCATION'].slice(2).join(' ')
      }
    ];
  }

  state.resumeData = newData;
  populateFormFromData(newData);
}

let pdfjsLibModule = null;

async function getPdfJs() {
  if (pdfjsLibModule) return pdfjsLibModule;
  try {
    const mod = await import('./pdf.min.mjs');
    if (mod.GlobalWorkerOptions) {
      mod.GlobalWorkerOptions.workerSrc = './pdf.worker.min.mjs';
    }
    pdfjsLibModule = mod;
    return mod;
  } catch (err) {
    console.error('Failed to load PDF library:', err);
    throw new Error('PDF extraction engine could not be initialized.');
  }
}

function extractNameFromFilename(filename) {
  if (!filename) return '';
  const base = filename.replace(/\.[^/.]+$/, '');
  const clean = base
    .replace(/[-_]+/g, ' ')
    .replace(/\b(resume|cv|curriculum|vitae|profile|final|updated|draft|v\d+)\b/gi, '')
    .trim();
  if (clean.length >= 2 && clean.length <= 40) {
    return clean.split(' ').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }
  return '';
}

function extractStringsFromArrayBuffer(buffer) {
  const bytes = new Uint8Array(buffer);
  let asciiText = '';
  let cur = '';
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    if ((b >= 32 && b <= 126) || b === 10 || b === 13 || b === 9) {
      cur += String.fromCharCode(b);
    } else {
      if (cur.length >= 3) {
        asciiText += cur + ' ';
      }
      cur = '';
    }
  }

  // Also check UTF-16LE runs (common in Microsoft Word binary format)
  if (asciiText.length < 50) {
    let utf16Text = '';
    let cur16 = '';
    for (let i = 0; i < bytes.length - 1; i += 2) {
      const charCode = bytes[i] | (bytes[i + 1] << 8);
      if ((charCode >= 32 && charCode <= 126) || charCode === 10 || charCode === 13 || charCode === 9) {
        cur16 += String.fromCharCode(charCode);
      } else {
        if (cur16.length >= 3) {
          utf16Text += cur16 + ' ';
        }
        cur16 = '';
      }
    }
    if (utf16Text.length > asciiText.length) {
      asciiText = utf16Text;
    }
  }

  return asciiText
    .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
    .replace(/WordDocument|CompObj|SummaryInformation|DocumentSummaryInformation|Normal\.dotm|Microsoft Word/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function handleUploadedFile(file) {
  if (!file) return;

  const fileName = file.name || 'resume_file';
  const ext = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : '';
  const mimeType = (file.type || '').toLowerCase();

  const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) || mimeType.startsWith('image/');
  const isPdf = ext === 'pdf' || mimeType === 'application/pdf';
  const isWord = ['docx', 'doc'].includes(ext) || mimeType.includes('word') || mimeType.includes('officedocument');
  const isJson = ext === 'json' || mimeType.includes('json');
  const isText = ['txt', 'md', 'text'].includes(ext) || mimeType.startsWith('text/');

  if (!isImage && !isPdf && !isWord && !isJson && !isText) {
    showUploadStatus(`Unsupported file format "${ext ? '.' + ext : fileName}". Please upload an image (.jpg, .png, .webp), PDF (.pdf), or Word document (.doc, .docx).`, 'error');
    return;
  }

  showUploadStatus(`Processing "${fileName}"...`, 'info');

  try {
    // 1. IMAGE FILES
    if (isImage) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target.result;
        if (imagePreviewImg) {
          imagePreviewImg.src = dataUrl;
        }
        if (imagePreviewCard) {
          imagePreviewCard.classList.remove('hidden');
        }

        const candidateName = extractNameFromFilename(fileName);
        if (candidateName) {
          const newData = JSON.parse(JSON.stringify(state.resumeData));
          newData.personal.fullName = candidateName;
          state.resumeData = newData;
          populateFormFromData(newData);
        }

        // Try Shape Detection API if supported
        let extractedOcr = '';
        if ('TextDetector' in window && imagePreviewImg) {
          try {
            const detector = new window.TextDetector();
            const detected = await detector.detect(imagePreviewImg);
            if (Array.isArray(detected) && detected.length > 0) {
              extractedOcr = detected.map(d => d.rawValue).join('\n');
            }
          } catch (ocrErr) {
            console.log('TextDetector inactive:', ocrErr);
          }
        }

        if (extractedOcr && extractedOcr.trim().length > 20) {
          parseAndPopulatePlainText(extractedOcr);
          showUploadStatus(`✓ Resume image "${fileName}" uploaded with extracted text! You can edit any details below.`, 'success');
        } else {
          showUploadStatus(`✓ Resume image "${fileName}" uploaded! Preview displayed below. You can continue editing your details.`, 'success');
        }
      };
      reader.onerror = () => {
        showUploadStatus(`Failed to read image "${fileName}".`, 'error');
      };
      reader.readAsDataURL(file);
      return;
    }

    // 2. PDF FILES
    if (isPdf) {
      const arrayBuffer = await file.arrayBuffer();
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('PDF file is empty or corrupted');
      }

      const pdfjs = await getPdfJs();
      const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(arrayBuffer),
        useSystemFonts: true
      });

      const pdf = await loadingTask.promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
      }

      if (fullText.trim().length > 10) {
        parseAndPopulatePlainText(fullText);
        showUploadStatus(`✓ Successfully extracted resume details from "${fileName}"! You can continue editing below.`, 'success');
      } else {
        const candidateName = extractNameFromFilename(fileName);
        if (candidateName) {
          const newData = JSON.parse(JSON.stringify(state.resumeData));
          newData.personal.fullName = candidateName;
          state.resumeData = newData;
          populateFormFromData(newData);
        }
        showUploadStatus(`✓ Accepted PDF "${fileName}". Document text is ready for you to edit in the fields below!`, 'info');
      }
      return;
    }

    // 3. WORD DOCUMENTS (.docx, .doc)
    if (isWord) {
      const arrayBuffer = await file.arrayBuffer();
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('Word document is empty or corrupted');
      }

      // Try mammoth for .docx
      if (window.mammoth && ext === 'docx') {
        try {
          const result = await window.mammoth.extractRawText({ arrayBuffer });
          if (result && result.value && result.value.trim().length > 10) {
            parseAndPopulatePlainText(result.value);
            showUploadStatus(`✓ Successfully extracted resume text from "${fileName}"! You can continue editing below.`, 'success');
            return;
          }
        } catch (mErr) {
          console.warn('Mammoth docx parsing failed, using fallback reader:', mErr);
        }
      }

      // Fallback for .doc binary format or mammoth fallback
      const rawStrings = extractStringsFromArrayBuffer(arrayBuffer);
      if (rawStrings && rawStrings.trim().length > 20) {
        parseAndPopulatePlainText(rawStrings);
        showUploadStatus(`✓ Extracted available resume text from "${fileName}"! You can continue editing below.`, 'success');
        return;
      }

      const candidateName = extractNameFromFilename(fileName);
      if (candidateName) {
        const newData = JSON.parse(JSON.stringify(state.resumeData));
        newData.personal.fullName = candidateName;
        state.resumeData = newData;
        populateFormFromData(newData);
      }
      showUploadStatus(`✓ Accepted document "${fileName}". You can now edit your details in the fields below.`, 'info');
      return;
    }

    // 4. JSON RESUME
    if (isJson) {
      const text = await file.text();
      const parsed = JSON.parse(text);
      importJsonResume(parsed);
      showUploadStatus(`✓ Successfully imported resume data from "${fileName}"!`, 'success');
      return;
    }

    // 5. PLAIN TEXT / MARKDOWN
    if (isText) {
      const text = await file.text();
      parseAndPopulatePlainText(text);
      showUploadStatus(`✓ Successfully parsed resume text from "${fileName}"!`, 'success');
      return;
    }
  } catch (err) {
    console.error('File parsing error:', err);
    showUploadStatus(`Could not process "${fileName}": ${err.message || 'File may be corrupted or unreadable.'}`, 'error');
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Initialize Application
function initApp() {
  try {
    setupSectionToggles();
    setupEventListeners();
    populateFormFromData(state.resumeData);
    renderTemplatesGrid();
    updateHistoryBadges();
    switchStep(1);
    console.log('ResumeBuilder initialized successfully');
  } catch (err) {
    console.error('Initialization error in ResumeBuilder:', err);
  }
}

// Bulletproof check for document readiness (handles module deferral & iframe environments)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
