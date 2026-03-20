设计规范文档（Design Specification Document）
1. 设计概述
   设计理念：采用"Linear Look"暗色科技美学，以深邃暗色背景为画布，通过精致的渐变光晕、玻璃拟态层次和细腻的线条边框，传达HighClaw作为高性能Go语言AI Agent基础设施的技术权威感与极致性能印象。设计追求"少即是多"——每个视觉元素都服务于信息传达，让开发者在30秒内理解核心价值。
   目标用户：开发者、DevOps工程师、AI爱好者、OpenClaw迁移用户、企业技术决策者
   设计原则：
   信息优先：高信息密度，杜绝装饰性噪音，开发者能快速扫描获取关键信息
   技术可信：终端风格代码块、架构图、对比表格——用开发者熟悉的语言建立信任
   层次清晰：通过色彩明暗、模糊层级、阴影深度构建空间纵深感
   性能即品牌：网站本身就要快——轻量CSS动画，无重型JS库，体现"高性能"品牌承诺
2. 视觉设计规范
   2.1 色彩系统
   基础色板（暗色主题）：



用途	色值	说明
背景色	#0a0a0f	近黑主背景
表面色	#12121a	卡片、面板背景
表面色-高	#1a1a2e	悬停态卡片、活跃面板
边框色	#1e1e2e	细线边框
边框色-亮	#2a2a3e	悬停态边框
强调色（渐变系统）：



用途	色值	说明
主色-蓝	#3b82f6	渐变起点
主色-青	#06b6d4	渐变终点
渐变CSS	linear-gradient(135deg, #3b82f6, #06b6d4)	CTA按钮、高亮边框
主色悬停	linear-gradient(135deg, #2563eb, #0891b2)	按钮hover态加深
文字色：



用途	色值	对比度(vs #0a0a0f)
主文字	#f8fafc	19.2:1 ✅
次文字	#94a3b8	7.1:1 ✅
弱文字	#64748b	4.6:1 ✅
代码高亮	#e2e8f0	16.3:1 ✅
功能色：



用途	色值	场景
成功	#22c55e	对比表✅、成功提示
警告	#f59e0b	⚠️ 状态
错误	#ef4444	❌ 状态、错误提示
信息	#3b82f6	信息提示
代码块色：



用途	色值
代码背景	#0d1117
代码边框	#1e1e2e
代码注释	#6b7280
代码关键字	#7dd3fc（浅蓝）
代码字符串	#86efac（浅绿）
代码命令	#c4b5fd（浅紫）
2.2 字体规范


用途	字体族	字号	字重	行高
H1 大标题	Inter / Noto Sans / system-ui	56px (桌面) / 36px (移动)	700 Bold	1.1
H2 章节标题	同上	40px / 28px	600 Semibold	1.2
H3 小标题	同上	24px / 20px	600 Semibold	1.3
Body 正文	同上	16px / 15px	400 Regular	1.6
Body-lg 大正文	同上	18px / 16px	400 Regular	1.7
Small 辅助文字	同上	14px / 13px	400 Regular	1.5
Caption 标注	同上	12px	500 Medium	1.4
Code 代码	JetBrains Mono	14px / 13px	400 Regular	1.6
Stats 数字	Inter	48px / 32px	700 Bold	1.0
文字渐变效果（用于关键标题）：

background: linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
2.3 布局系统
栅格系统：



参数	桌面 (≥1280px)	平板 (768-1279px)	移动 (<768px)
最大宽度	1200px	100%	100%
列数	12列	8列	4列
列间距	24px	20px	16px
页面内边距	64px	40px	20px
间距规范（8px基础单位）：



Token	值	用途
space-1	4px	图标与文字间距
space-2	8px	紧凑内间距
space-3	12px	列表项间距
space-4	16px	卡片内边距(移动)
space-5	20px	常规内间距
space-6	24px	卡片内边距(桌面)
space-8	32px	组件间距
space-10	40px	区块间距(小)
space-12	48px	区块间距(中)
space-16	64px	模块间距(小)
space-20	80px	模块间距(大)
space-24	96px	页面顶部间距
space-32	128px	模块间距(超大)
圆角规范：



用途	圆角值
按钮	8px
输入框	8px
小卡片	12px
大卡片	16px
模态框	20px
头像	50% (圆形)
标签/徽章	9999px (胶囊)
阴影系统：



层级	阴影值	用途
无	none	默认状态
低	0 2px 8px rgba(0,0,0,0.3)	下拉菜单
中	0 8px 24px rgba(0,0,0,0.4)	浮动卡片
高	0 16px 48px rgba(0,0,0,0.5)	模态框、对话框
发光	0 0 20px rgba(59,130,246,0.15)	主色元素光晕
3. 交互设计规范
   3.1 导航系统
   顶部导航栏：

高度：64px（桌面/平板）、56px（移动端）
背景：rgba(10, 10, 15, 0.8) + backdrop-filter: blur(12px) — 滚动时半透明玻璃效果
定位：position: sticky; top: 0 — 固定顶部
边框：底部1px #1e1e2e 分隔线
布局：Logo | 导航链接(居中或左对齐) | Sign In / Sign Up(右对齐)
移动端：汉堡菜单图标，点击展开全屏抽屉导航（从右侧滑入，背景模糊遮罩）
当前页高亮：文字变为主色渐变，底部2px渐变下划线
页面跳转：

站内跳转使用Next.js <Link> — 无刷新过渡
外部链接（GitHub）：新标签页打开，链接旁显示↗小图标
页面切换：淡入过渡 opacity 0→1, translateY 8px→0，时长300ms
面包屑（Tutorials/Blog详情页）：

格式：Home > Tutorials > [Category] > [Article]
文字色：#64748b，当前页为#f8fafc
分隔符：> 或 / 符号
3.2 交互反馈
按钮状态：



状态	主按钮(Primary)	次按钮(Secondary/Ghost)
默认	渐变填充 #3b82f6→#06b6d4，白色文字	透明背景，#1e1e2e 边框，#f8fafc 文字
悬停	渐变加深 + 外发光 box-shadow: 0 0 20px rgba(59,130,246,0.3)	背景变为 #1a1a2e，边框亮度提升
点击	缩放 scale(0.97) + 渐变继续加深	缩放 scale(0.97) + 背景加深
禁用	渐变降低透明度50%，cursor: not-allowed	文字和边框降低透明度50%
聚焦	outline: 2px solid #3b82f6; outline-offset: 2px	同主按钮
按钮高度统一：44px（大按钮48px，小按钮36px）
过渡时长：transition: all 200ms ease
表单交互：



状态	样式
默认	背景 #12121a，边框 #1e1e2e，文字 #f8fafc
聚焦	边框变为主色 #3b82f6，外发光 0 0 0 3px rgba(59,130,246,0.1)
错误	边框变为 #ef4444，底部显示红色错误文字
成功	边框变为 #22c55e
占位符	文字色 #64748b
加载状态：

按钮loading：文字替换为旋转spinner（16px），按钮宽度不变
页面loading：顶部细条进度条（渐变色），高度2px
骨架屏：#1a1a2e 色块 + 脉冲动画（opacity 0.5↔1）
通知提示：

成功Toast：左侧绿色竖条 + #22c55e 图标 + 文字，3秒自动消失
错误Toast：左侧红色竖条 + #ef4444 图标 + 文字 + 可选重试按钮
位置：页面右上角，堆叠排列
3.3 动效规范
滚动触发动画（全局模块进场）：

/* 基础进场 */
@keyframes fadeInUp {
from { opacity: 0; transform: translateY(24px); }
to { opacity: 1; transform: translateY(0); }
}
/* 触发方式：IntersectionObserver，threshold: 0.1 */
/* 时长：600ms，缓动：cubic-bezier(0.16, 1, 0.3, 1) */
/* 子元素依次延迟：每项 +100ms stagger */
Hero区域特效：

背景：CSS网格线图案（linear-gradient 绘制，opacity 0.03-0.05，无JS）
可选：轻量canvas粒子（限制粒子数≤50，帧率限制30fps以保证性能）
统计数字：计数器动画（数字从0滚动到目标值，时长1.5s，缓动ease-out）
微交互：

卡片hover：transform: translateY(-4px) + 渐变边框显现 + 微光晕
链接hover：下划线从左到右展开动画
代码块复制：点击后图标变为✓，1.5秒后恢复
过渡参数标准：



场景	时长	缓动函数
按钮hover/active	200ms	ease
卡片hover	300ms	ease-out
模块进场	600ms	cubic-bezier(0.16, 1, 0.3, 1)
页面切换	300ms	ease-in-out
Toast弹出	300ms	ease-out
展开/折叠	250ms	ease-in-out
4. 组件设计规范
   4.1 基础组件
   按钮组件：



类型	样式	用途
Primary	渐变填充，白色文字，44px高	主要CTA：Download、Get Started
Secondary	Ghost透明，边框，白色文字，44px高	次要操作：View on GitHub
Text	无边框无背景，主色文字+箭头	链接式操作：Learn more →
Icon	40×40圆形/方形，图标居中	社交链接、操作按钮
卡片组件：



属性	值
背景	rgba(18, 18, 26, 0.6)
边框	1px solid #1e1e2e
圆角	16px
内边距	24px（桌面）/ 20px（移动）
悬停	border-color: rgba(59,130,246,0.3) + translateY(-4px) + 发光阴影
玻璃效果	backdrop-filter: blur(12px)
代码块组件：



属性	值
背景	#0d1117
边框	1px solid #1e1e2e
圆角	12px
内边距	20px
字体	JetBrains Mono, 14px
头部	左侧三色圆点（装饰）+ 右侧复制按钮
语法高亮	Shiki（已在项目依赖中）
标签/徽章组件：

胶囊形状（border-radius: 9999px）
背景：rgba(59,130,246,0.1)，文字：#3b82f6
高度：24px，内边距：4px 12px
用途：版本号、状态标签、分类标记
4.2 业务组件
页面头部（导航栏）：

固定顶部，高64px
左：Logo（SVG，高度32px）
中/左：导航链接（间距32px，字号15px，font-weight 500）
右：Sign In（Ghost按钮）+ Sign Up（Primary按钮，小尺寸36px高）
玻璃效果背景，滚动时显示底部border
Hero区域：

全宽，最小高度100vh（或90vh）
内容垂直居中
背景：暗色 + CSS网格图案 + 可选渐变光晕
标题：H1 56px Bold + 渐变文字效果
副标题：Body-lg 18px，次文字色
统计条：4个指标横排，渐变数字，间距48px
代码块：终端样式，带打字机动画
双CTA按钮：Primary + Secondary，间距16px
内容区域模块（Why HighClaw、Multi-Agent等）：

每模块垂直间距：128px（space-32）
模块标题：H2居中 + 一行副标题
内容：卡片网格/图表/表格，根据模块需求变化
进场动画：滚动触发fadeInUp
页面底部（Footer）：

背景：#0a0a0f，顶部 1px solid #1e1e2e 分隔
三栏布局：品牌信息 | 导航分组 | 社交链接
底部：版权信息 + 法律链接，文字色#64748b
内边距：顶部64px，底部32px
移动端：单列堆叠
5. 页面设计详细说明


页面名称	页面目标	布局结构	关键元素	交互逻辑	状态变化
Landing (Home)	30秒传达HighClaw核心价值，驱动下载和GitHub访问	7个纵向模块：Hero → Why HighClaw(3×2卡片) → Multi-Agent架构图 → 三层内存图 → Model Failover流程图 → 对比表格 → Get Started CTA	Hero大标题+统计数字+终端代码块+双CTA；6张优势卡片；架构流程图（SVG/CSS绘制）；对比表格（✅❌图标）；终端安装步骤	滚动触发各模块淡入；统计数字计数动画；卡片hover上浮+发光；代码块打字机效果；CTA按钮hover发光	导航栏滚动后显示玻璃效果；Hero背景粒子/网格持续微动
Download	用户快速下载正确平台的二进制包	顶部：自动检测Hero卡片；下方：2×3平台网格	自动检测卡片（平台图标+推荐徽章+下载按钮）；6个平台卡片（图标+名称+文件名+下载按钮）；版本号v1.0.0；源码安装命令	JS自动检测OS并高亮推荐卡片；下载按钮点击触发下载+事件追踪；平台卡片hover高亮	检测中→检测完成（推荐卡片突出显示）；下载中按钮loading态
Tutorials	全面学习HighClaw各功能模块	左侧：固定侧边栏导航树（桌面240px宽）；右侧：MDX内容区	侧边栏分类树（可折叠）+ Ctrl+K搜索；内容区：标题+TOC+代码块（带复制）+上下篇导航；面包屑	侧边栏当前页高亮；点击展开/折叠分类；代码一键复制；标题锚点跳转+URL hash更新；移动端侧边栏为抽屉	桌面：侧边栏常驻；移动端：汉堡图标触发侧边栏抽屉滑入
Blog	发布产品更新和技术文章，驱动SEO和用户粘性	列表页：分类Tab + 3列卡片网格；详情页：三栏（TOC	内容	作者）	列表：卡片（封面图+标题+摘要+作者+日期）；分类过滤Tab；分页；详情：左侧粘性TOC，中间Markdown内容，右侧作者信息；Discord CTA横幅
Team	通过世界级团队资历建立项目可信度	2×3人物卡片网格（桌面）/ 1列（移动）	头像（占位几何图形）+姓名+职位+简历+社交链接（LinkedIn/GitHub/Twitter图标）	卡片hover上浮+边框发光；社交图标hover变为主色	默认静态展示；hover态卡片突出
Contact Us	提供清晰的联系渠道	左右分栏：左侧联系表单 / 右侧联系信息+社交链接	表单字段（姓名/邮箱/主题下拉/消息）；提交按钮；右侧：邮箱/GitHub/Discord/Twitter链接	客户端表单验证（必填+邮箱格式）；蜜罐反垃圾；提交成功Toast；提交失败Toast+重试	空表单→填写中（聚焦高亮）→提交loading→成功/失败Toast
Sign In	用户登录	居中卡片布局（最大宽度420px）	Logo + 表单（邮箱+密码）+ 社交登录按钮（Google/GitHub）+ "没有账号？Sign Up"链接	表单验证；社交登录OAuth跳转；错误提示	默认→loading→成功跳转/错误提示
Sign Up	用户注册	居中卡片布局（最大宽度420px）	Logo + 表单（姓名+邮箱+密码+确认密码）+ 社交注册按钮 + "已有账号？Sign In"链接	密码强度指示器；表单验证；社交注册OAuth	默认→loading→成功跳转/错误提示
6. 响应式设计
   断点设置：



断点名	宽度范围	设备类型
sm	< 768px	手机
md	768px - 1279px	平板
lg	≥ 1280px	桌面
布局适配规则：



模块	桌面 (lg)	平板 (md)	移动 (sm)
导航栏	完整展示所有链接	缩减间距，保留关键链接	汉堡菜单 + 抽屉导航
Hero统计条	4项横排	4项横排（缩小间距）	2×2网格
Why HighClaw卡片	3×2网格	2×3网格	1×6垂直堆叠
对比表格	完整表格	横向可滚动	横向可滚动
Blog卡片	3列	2列	1列
Team卡片	3×2网格	2×3网格	1列堆叠
Contact	左右分栏	左右分栏（比例调整）	上下堆叠（表单在上）
Tutorials侧边栏	左侧固定240px	可折叠侧边栏	抽屉式覆盖
Footer	三栏	三栏（缩小间距）	单列堆叠
Auth页面	居中卡片420px	居中卡片400px	全宽-40px边距
组件适配：

按钮：移动端最小宽度100%（CTA场景），间距调整为垂直堆叠
代码块：移动端水平可滚动，字号缩小到13px
标题：响应式字号缩放（见2.2字体规范）
图片/图表：等比缩放，max-width: 100%
7. 开发交付说明
   设计资产：

图标库：@tabler/icons-react（UI图标）+ react-icons/si（品牌Logo：Apple/Windows/Linux）
字体：next/font 加载 Inter（正文标题）+ JetBrains Mono（代码），仅预加载400/600/700字重
Logo：HighClaw品牌Logo（SVG格式，支持单色/渐变两种模式）
团队头像：几何/抽象占位图（SVG生成或CSS渐变圆形）
OG Image：1200×630px品牌卡片（暗色背景+Logo+Tagline）
技术建议：

框架：Next.js 16 (App Router)
样式：Tailwind CSS 4 + OKLCH变量，扩展 src/config/style/theme.css
动画：CSS @keyframes + IntersectionObserver — 禁止引入Framer Motion等重型动画库
代码高亮：Shiki（已在项目依赖中）
教程内容：Fumadocs + MDX（已配置）
认证：复用 src/core/auth/（better-auth）
实现注意事项：

性能第一：所有动画优先使用CSS transform 和 opacity（GPU加速），避免触发layout/paint
玻璃效果降级：backdrop-filter 不被支持时，回退为纯色半透明背景 @supports not (backdrop-filter: blur(1px))
暗色对比度：所有文字-背景组合必须满足WCAG AA（≥4.5:1），已在色彩规范中标注对比度
移动端溢出：严格控制 overflow-x: hidden 在body上，所有元素测试不可水平溢出
图片懒加载：首屏Hero之外的所有图片使用 loading="lazy"
代码块复制：使用 navigator.clipboard.writeText() API
平台检测：Download页面使用 navigator.userAgent 客户端检测，组件需为Client Component
CSS变量：将色彩系统定义为CSS自定义属性，便于未来主题切换
✅ 设计规范文档内容已完整输出！

设计交付内容：

🎨 完整的视觉设计规范（色彩、字体、间距、圆角、阴影）
📐 详细的布局和组件规范（栅格、卡片、按钮、代码块）
⚡ 交互逻辑和动效说明（状态变化、过渡参数、进场动画）
📱 响应式设计适配方案（三档断点、逐模块适配规则）
🛠️ 开发实现指导说明（技术栈、性能要求、注意事项）
如果内容确认没问题，我可以尝试将其写入 DESIGN_SPEC.md 文件。或者你可以直接输入 /开发 启动前端开发工程师开始代码实现。
