/**
 * 继续医学教育 FAQ 智能搜索客服
 * 纯静态实现，数据内嵌 + 支持外部 qa.json 加载
 */

// ===== 内嵌默认数据（确保本地直接打开也能运行）=====
const DEFAULT_DATA = [
  {
    "id": "Q001",
    "question": "继续医学教育项目举办前是否需要登记？",
    "answer": "需要。继续医学教育项目应按要求完成举办前登记，确保项目举办时间、地点、内容、师资等信息与实际执行情况一致。",
    "category": "项目举办管理",
    "subcategory": "举办前登记",
    "roles": ["医疗卫生机构管理员", "项目负责人"],
    "keywords": ["举办前登记", "开班登记", "项目备案", "提前登记"],
    "policy": "《继续医学教育项目管理相关规定》",
    "answerType": "政策型",
    "isPublic": true,
    "status": "已发布",
    "updateDate": "2026-05-21",
    "views": 0,
    "remark": ""
  },
  {
    "id": "Q002",
    "question": "项目实际举办时间发生变化怎么办？",
    "answer": "项目举办时间发生变化的，应按规定及时办理变更手续，并保留相关审批和沟通记录。未经确认不得随意改变项目执行安排。",
    "category": "项目举办管理",
    "subcategory": "项目变更",
    "roles": ["项目负责人", "项目秘书"],
    "keywords": ["时间变更", "延期", "改期", "举办时间调整"],
    "policy": "《继续医学教育项目变更管理规定》",
    "answerType": "流程型",
    "isPublic": true,
    "status": "已发布",
    "updateDate": "2026-05-21",
    "views": 0,
    "remark": ""
  },
  {
    "id": "Q003",
    "question": "学分能否按照申报学分直接发放？",
    "answer": "不应简单按照申报学分直接发放。学分授予应与项目实际教学内容、实际学时、考勤记录和考核情况相匹配。",
    "category": "学分管理",
    "subcategory": "学分授予",
    "roles": ["医疗卫生机构管理员", "项目负责人", "学员个人"],
    "keywords": ["学分", "授分", "继续教育分", "学分发放"],
    "policy": "《继续医学教育学分管理办法》",
    "answerType": "政策型",
    "isPublic": true,
    "status": "已发布",
    "updateDate": "2026-05-21",
    "views": 0,
    "remark": ""
  },
  {
    "id": "Q004",
    "question": "继续医学教育项目申报需要准备哪些材料？",
    "answer": "项目申报需准备：项目申报表、项目实施方案、授课师资简历及课件、经费预算说明等。具体要求以当年申报通知为准。",
    "category": "项目申报",
    "subcategory": "申报材料",
    "roles": ["项目负责人", "医疗卫生机构管理员"],
    "keywords": ["申报材料", "申报资料", "项目申请", "申报准备"],
    "policy": "《继续医学教育项目申报指南》",
    "answerType": "材料型",
    "isPublic": true,
    "status": "已发布",
    "updateDate": "2026-05-21",
    "views": 0,
    "remark": ""
  },
  {
    "id": "Q005",
    "question": "项目执行后的资料归档包括哪些内容？",
    "answer": "项目执行后的资料归档包括：通知材料、签到记录、授课课件、项目总结、考核评价、影像资料等。资料应真实完整，保存期限不少于5年。",
    "category": "资料归档",
    "subcategory": "归档要求",
    "roles": ["项目秘书", "医疗卫生机构管理员"],
    "keywords": ["资料归档", "归档材料", "项目总结", "签到记录"],
    "policy": "《继续医学教育档案管理规定》",
    "answerType": "材料型",
    "isPublic": true,
    "status": "已发布",
    "updateDate": "2026-05-21",
    "views": 0,
    "remark": ""
  },
  {
    "id": "Q006",
    "question": "忘记系统登录密码怎么办？",
    "answer": "可通过系统登录页面的\u201c忘记密码\u201d功能重置密码，或联系所在单位管理员协助重置。如仍无法解决，可联系系统客服热线。",
    "category": "系统操作",
    "subcategory": "账号管理",
    "roles": ["通用"],
    "keywords": ["忘记密码", "登录失败", "账号找回", "密码重置"],
    "policy": "《继续医学教育信息系统操作手册》",
    "answerType": "系统操作型",
    "isPublic": true,
    "status": "已发布",
    "updateDate": "2026-05-21",
    "views": 0,
    "remark": ""
  }
];

// ===== 全局状态 =====
let qaData = [];
let currentQuery = '';
let currentCategory = null;

// ===== DOM 元素 =====
const els = {
  searchInput: document.getElementById('searchInput'),
  categoryButtons: document.getElementById('categoryButtons'),
  clearCategory: document.getElementById('clearCategory'),
  emptyState: document.getElementById('emptyState'),
  resultsContent: document.getElementById('resultsContent'),
  resultsCount: document.getElementById('resultsCount'),
  recommendedAnswer: document.getElementById('recommendedAnswer'),
  relatedQuestions: document.getElementById('relatedQuestions'),
  noResults: document.getElementById('noResults'),
  feedbackBtn: document.getElementById('feedbackBtn'),
  modalOverlay: document.getElementById('modalOverlay'),
  modalClose: document.getElementById('modalClose'),
};

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
  loadData().then(() => {
    bindEvents();
  });
});

/**
 * 加载数据：优先从 qa.json 加载，失败则使用内嵌数据
 */
async function loadData() {
  try {
    const response = await fetch('qa.json');
    if (response.ok) {
      const json = await response.json();
      qaData = json.filter(item => item.isPublic === true && item.status === '已发布');
      console.log('已从 qa.json 加载 ' + qaData.length + ' 条数据');
      return;
    }
  } catch (e) {
    console.log('无法从 qa.json 加载，使用内嵌数据');
  }
  // 使用内嵌数据
  qaData = DEFAULT_DATA.filter(item => item.isPublic === true && item.status === '已发布');
  console.log('已使用内嵌数据 ' + qaData.length + ' 条');
}

/**
 * 绑定事件
 */
function bindEvents() {
  // 搜索输入
  els.searchInput.addEventListener('input', (e) => {
    currentQuery = e.target.value.trim();
    performSearch();
  });

  // 分类按钮
  els.categoryButtons.addEventListener('click', (e) => {
    const btn = e.target.closest('.category-btn');
    if (!btn) return;

    const category = btn.dataset.category;
    if (currentCategory === category) {
      // 取消选中
      currentCategory = null;
      btn.classList.remove('active');
      els.clearCategory.style.display = 'none';
    } else {
      // 选中新分类
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      currentCategory = category;
      btn.classList.add('active');
      els.clearCategory.style.display = 'inline-flex';
    }
    performSearch();
  });

  // 清除筛选
  els.clearCategory.addEventListener('click', () => {
    currentCategory = null;
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    els.clearCategory.style.display = 'none';
    performSearch();
  });

  // 反馈按钮
  els.feedbackBtn.addEventListener('click', () => {
    els.modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });

  // 关闭弹窗
  els.modalClose.addEventListener('click', closeModal);
  els.modalOverlay.addEventListener('click', (e) => {
    if (e.target === els.modalOverlay) closeModal();
  });

  // ESC 关闭弹窗
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && els.modalOverlay.style.display === 'flex') {
      closeModal();
    }
  });
}

function closeModal() {
  els.modalOverlay.style.display = 'none';
  document.body.style.overflow = '';
}

// ===== 搜索核心逻辑 =====

/**
 * 计算匹配分数
 * 优先级：标题完全匹配 > 标题包含 > 关键词完全匹配 > 关键词部分匹配 > 浏览量 > 更新时间
 */
function calculateScore(item, query) {
  const q = query.toLowerCase();
  const title = item.question.toLowerCase();
  const keywords = item.keywords.map(k => k.toLowerCase());

  let score = 0;

  // 1. 问题标题完全匹配
  if (title === q) score += 1000;
  // 2. 问题标题包含
  else if (title.includes(q)) score += 500;

  // 3. 关键词完全匹配
  const exactKwMatch = keywords.some(k => k === q);
  if (exactKwMatch) score += 300;

  // 4. 关键词部分匹配
  const partialKwMatch = keywords.some(k => k.includes(q));
  if (partialKwMatch && !exactKwMatch) score += 100;

  // 5. 浏览量加成
  score += Math.min(item.views / 10, 10);

  // 6. 更新时间加成
  const daysSince = (Date.now() - new Date(item.updateDate).getTime()) / (1000 * 60 * 60 * 24);
  score += Math.max(0, 30 - daysSince);

  return score;
}

/**
 * 执行搜索
 */
function performSearch() {
  const hasQuery = currentQuery.length > 0;
  const hasCategory = currentCategory !== null;

  // 无任何条件，显示空状态
  if (!hasQuery && !hasCategory) {
    showEmptyState();
    return;
  }

  // 按分类筛选
  let filtered = hasCategory
    ? qaData.filter(item => item.category === currentCategory)
    : [...qaData];

  // 按搜索词匹配
  let results;
  if (hasQuery) {
    results = filtered
      .map(item => ({ item, score: calculateScore(item, currentQuery) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score);
  } else {
    // 无搜索词时按更新时间排序
    results = filtered
      .map(item => ({ item, score: 0 }))
      .sort((a, b) => new Date(b.item.updateDate) - new Date(a.item.updateDate));
  }

  if (results.length === 0) {
    showNoResults();
  } else {
    showResults(results);
  }
}

// ===== 视图渲染 =====

function showEmptyState() {
  els.emptyState.style.display = 'block';
  els.resultsContent.style.display = 'none';
  els.noResults.style.display = 'none';
}

function showNoResults() {
  els.emptyState.style.display = 'none';
  els.resultsContent.style.display = 'none';
  els.noResults.style.display = 'block';
}

function showResults(results) {
  els.emptyState.style.display = 'none';
  els.noResults.style.display = 'none';
  els.resultsContent.style.display = 'block';

  els.resultsCount.textContent = `共找到 ${results.length} 条结果`;

  // 推荐答案（第一条）
  const recommended = results[0];
  els.recommendedAnswer.innerHTML = renderAnswerCard(recommended.item, true);

  // 相关问题（其余）
  const related = results.slice(1, 6);
  if (related.length > 0) {
    els.relatedQuestions.innerHTML =
      '<h3 class="related-title">相关问题</h3>' +
      related.map(r => renderAnswerCard(r.item, false)).join('');
  } else {
    els.relatedQuestions.innerHTML = '';
  }

  // 绑定展开/复制事件
  bindCardEvents();
}

/**
 * 渲染答案卡片 HTML
 */
function renderAnswerCard(item, isRecommended) {
  const copyText = [
    `【问题】`,
    item.question,
    ``,
    `【答复】`,
    item.answer,
    ``,
    `【分类】`,
    item.category + (item.subcategory ? ` - ${item.subcategory}` : ''),
    ``,
    `【政策依据】`,
    item.policy,
    ``,
    `【更新时间】`,
    item.updateDate
  ].join('\n');

  const copyTextEscaped = copyText.replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  return `
    <div class="answer-card ${isRecommended ? 'recommended' : ''}">
      <button class="answer-header" onclick="toggleAnswer(this)" aria-expanded="${isRecommended ? 'true' : 'false'}">
        <h3 class="answer-title">
          ${isRecommended ? '<span class="badge">推荐答案</span>' : ''}
          ${escapeHtml(item.question)}
        </h3>
        <svg class="answer-toggle ${isRecommended ? 'expanded' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div class="answer-body" style="display: ${isRecommended ? 'block' : 'none'}">
        <div class="answer-content">
          <p>${escapeHtml(item.answer)}</p>
        </div>
        <div class="answer-meta">
          <div><span class="label">【分类】</span>${escapeHtml(item.category)}${item.subcategory ? ' - ' + escapeHtml(item.subcategory) : ''}</div>
          <div><span class="label">【政策依据】</span>${escapeHtml(item.policy)}</div>
          <div><span class="label">【更新时间】</span>${escapeHtml(item.updateDate)}</div>
        </div>
        <div class="answer-footer">
          <p class="answer-hint">温馨提示：本答案根据现有政策文件和常见业务口径整理，仅供参考。涉及具体项目办理、学分认定、整改监管等事项的，以正式文件、主管部门要求及系统审核结果为准。</p>
          <button class="copy-btn" onclick="copyAnswer(this, '${copyTextEscaped}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
            </svg>
            复制答案
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * HTML 转义，防止 XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * 绑定卡片内事件（动态生成的元素需要重新绑定）
 */
function bindCardEvents() {
  // 复制按钮的事件通过 onclick 内联处理，无需额外绑定
}

/**
 * 展开/折叠答案（全局函数，供内联 onclick 调用）
 */
window.toggleAnswer = function(button) {
  const body = button.nextElementSibling;
  const toggle = button.querySelector('.answer-toggle');
  const isExpanded = body.style.display === 'block';

  if (isExpanded) {
    body.style.display = 'none';
    toggle.classList.remove('expanded');
    button.setAttribute('aria-expanded', 'false');
  } else {
    body.style.display = 'block';
    toggle.classList.add('expanded');
    button.setAttribute('aria-expanded', 'true');
  }
};

/**
 * 复制答案到剪贴板（全局函数，供内联 onclick 调用）
 */
window.copyAnswer = async function(button, text) {
  // 恢复转义字符
  const temp = document.createElement('textarea');
  temp.innerHTML = text;
  const cleanText = temp.value;

  let success = false;

  try {
    await navigator.clipboard.writeText(cleanText);
    success = true;
  } catch (err) {
    // 降级方案
    const textarea = document.createElement('textarea');
    textarea.value = cleanText;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    success = document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  if (success) {
    button.classList.add('copied');
    button.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      已复制
    `;
    setTimeout(() => {
      button.classList.remove('copied');
      button.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
        </svg>
        复制答案
      `;
    }, 2000);
  }
};
