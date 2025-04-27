# 🎮 天玑GPU混合调速器 更新日志

## 🚀 版本 1.5.0 → 1.5.1 (2025-04-27)

### 🔧 改进
- 🌐 全面优化WebUI界面，提升用户体验
  - 📊 重构模块信息显示组件，添加更多详细信息
  - 🔗 改进GitHub链接处理方式，提供更直观的访问方式
  - 🎨 优化界面样式和交互效果，提高视觉一致性
  - 🔄 修复版本号显示从7.1.1到1.5.1，与模块版本保持一致
- 🌍 增强多语言支持
  - 🔤 扩展翻译词条，新增GPU配置相关术语
  - 📝 优化中文、英文和俄语的翻译质量
  - 🔍 新增频率范围和推荐频率列表的翻译
- 📱 GPU配置页面增强
  - 📋 新增推荐频率列表功能，提供更多频率选择
  - 📏 新增频率范围描述，明确可用频率范围
  - 🔢 改进频率应用机制，支持更精确的频率选择
  - 📑 优化配置编辑器布局和交互方式

### 🐛 修复
- 🔄 修复WebUI中版本号显示不一致的问题
- 🖼️ 修复部分界面元素显示异常的问题
- 🔍 修复about.js页面中模块信息渲染逻辑
- 🔗 修复GitHub链接处理不正确的问题
- 🎨 修复颜色选择器在某些情况下无法正常工作的问题


### 📖 使用说明
- 📂 主日志文件位置: `/data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log`
- 🎮 启动控制面板: `sh /data/adb/modules/dimensity_hybrid_governor/action.sh`
- 🔄 切换调度器状态: `sh /data/adb/modules/dimensity_hybrid_governor/action.sh switch`
- 📊 查看调度器状态: `sh /data/adb/modules/dimensity_hybrid_governor/action.sh status`
- 🌐 访问WebUI界面: 浏览器访问 `http://127.0.0.1:9999`

### ⚠️ 升级注意事项
- 此版本主要优化WebUI界面和修复问题
- 配置文件格式保持兼容，无需修改
- 控制面板命令保持兼容
- 建议清除浏览器缓存后再访问WebUI，以确保获取最新界面

