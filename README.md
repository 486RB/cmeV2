# 继续医学教育 FAQ 智能搜索客服静态网页

## 项目用途

本项目是一个面向继续医学教育领域的常见问题查询静态网页，适用于：

- 项目申报、举办管理、学分管理、远程教育、资料归档、整改监管等常见问题查询
- 医疗卫生机构管理员、项目负责人、学员个人等角色的自助查询服务
- 无需登录、不限查询次数、不接入大模型的轻量化知识库查询工具

## 项目结构

```
.
├── index.html          # 网页入口
├── qa.json             # Q&A 数据文件（可通过替换此文件更新知识库）
├── assets/
│   ├── index-xxx.css   # 样式文件
│   └── index-xxx.js    # 脚本文件
├── \u7ee7\u7eed\u533b\u5b66\u6559\u80b2\u667a\u80fd\u5ba2\u670d_QA\u77e5\u8bc6\u5e93.xlsx  # Q&A 知识库 Excel 维护模板
└── README.md           # 本文档
```

## 如何修改 Q&A

### 方法一：直接修改 qa.json（推荐）

1. 打开 `qa.json` 文件
2. 按照现有格式添加、修改或删除问题条目
3. 确保每个问题包含以下必填字段：
   - `id`: 唯一编号（如 Q001）
   - `question`: 问题标题
   - `answer`: 标准答案
   - `category`: 大类（如"学分管理"）
   - `keywords`: 关键词数组（用于搜索匹配）
   - `policy`: 政策依据文件名称
   - `updateDate`: 更新日期（YYYY-MM-DD 格式）
   - `isPublic`: 是否公开（true/false，只有 true 才会展示）
   - `status`: 状态（"已发布"才会展示）
4. 保存文件后刷新网页即可生效

### 方法二：通过 Excel 维护后导出

1. 打开 `继续医学教育智能客服_QA知识库.xlsx`
2. 在"Q&A知识库"工作表中维护问题内容
3. 使用下拉选项确保分类、状态等字段的规范性
4. 维护完成后，导出为 JSON 格式并重命名为 `qa.json`
5. 替换项目中的 `qa.json` 文件

## 如何替换 qa.json

### 本地测试

直接将新的 `qa.json` 文件覆盖到项目目录下，刷新浏览器即可。

### 部署到 GitHub Pages

1. 将更新后的 `qa.json` 提交到 GitHub 仓库
2. 确保 `qa.json` 位于仓库根目录或 `public/` 目录下
3. GitHub Pages 会自动部署更新内容

## 如何部署到 GitHub Pages

### 步骤一：创建 GitHub 仓库

1. 登录 GitHub，点击右上角 "+" 号 → "New repository"
2. 填写仓库名称（如 `cme-faq-webpage`）
3. 选择 "Public" 可见性
4. 点击 "Create repository"

### 步骤二：上传文件

#### 方式 A：通过 Git 命令行

```bash
# 克隆仓库
git clone https://github.com/\u4f60\u7684\u7528\u6237\u540d/cme-faq-webpage.git
cd cme-faq-webpage

# 将构建后的文件复制到仓库目录
# （将 dist 目录下的 index.html、qa.json、assets 文件夹复制过来）

# 提交并推送
git add .
git commit -m "Initial commit: FAQ static webpage"
git push origin main
```

#### 方式 B：直接上传（无需命令行）

1. 在仓库页面点击 "Add file" → "Upload files"
2. 将 `index.html`、`qa.json` 和 `assets` 文件夹拖拽上传
3. 点击 "Commit changes"

### 步骤三：启用 GitHub Pages

1. 进入仓库的 "Settings" 页面
2. 左侧菜单找到 "Pages"
3. "Source" 选择 "Deploy from a branch"
4. "Branch" 选择 "main" 或 "master"，文件夹选择 "/ (root)"
5. 点击 "Save"
6. 等待几分钟，页面会显示访问链接（如 `https://\u4f60\u7684\u7528\u6237\u540d.github.io/cme-faq-webpage/`）

## 注意事项

1. **数据过滤规则**：前台只展示 `isPublic === true` 且 `status === "已发布"` 的内容
2. **搜索范围**：目前只搜索"问题标题"和"关键词/同义词"，不搜索"标准答案"正文
3. **排序规则**：按匹配度（标题完全匹配 > 标题包含 > 关键词完全匹配 > 关键词部分匹配）排序
4. **移动端适配**：页面已针对手机端优化，搜索框醒目，分类按钮可换行，答案卡片宽度自适应
5. **浏览器兼容性**：支持 Chrome、Firefox、Safari、Edge 等主流浏览器的最新版本
6. **更新频率**：建议定期更新知识库内容，并在"更新记录"工作表中记录每次更新

## 技术栈

- HTML + CSS + JavaScript（React + TypeScript + Vite）
- 纯静态网页，无需后端服务器
- 不依赖数据库，不接入付费 API
- 数据通过本地 `qa.json` 文件加载

## 联系方式

如有问题或建议，请通过以下方式反馈：

- 发送邮件至：cmefeedback@example.com
- 联系单位管理员
- 拨打客服热线：123-4567-8900
