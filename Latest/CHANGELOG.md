# 🎮 天玑GPU混合调速器 更新日志

## 🚀 版本 1.4.7 → 1.5.0 (2025-04-26)

### ✨ 新增功能
- 🌐 新增WebUI界面支持，提供图形化配置和管理功能
- 🔄 新增基于AMMF2框架的模块架构，提升稳定性和扩展性
- 📊 新增GPU配置编辑器，可在WebUI中直接编辑配置文件
- 🌍 新增多语言支持（中文、英文、俄语）
- 🔍 新增文件监控系统，基于inotify实现实时监控
- 📝 新增增强型日志系统，支持多级日志和按模块分离

### 🔧 改进
- 📂 重构日志管理系统，优化日志文件结构和存储位置
  - 新路径: `/data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log`
- 🛠️ 优化服务启动流程，提高启动稳定性和错误处理能力
- 🔌 改进模块安装脚本，增加更多兼容性检查
- 📱 优化控制面板界面，提供更直观的操作体验
- 🔄 增强GPU调度器切换功能，提供更可靠的状态管理
- 📊 改进GPU频率获取和管理方式，提高兼容性
- 🔧 优化配置文件处理逻辑，支持更灵活的配置选项

### 🐛 修复
- 🔍 修复在某些设备上日志文件权限问题
- 🚀 修复服务启动延迟可能导致的初始化失败问题
- 🔄 修复GPU调度器状态检测不准确的问题
- 📁 修复日志轮转可能导致的文件丢失问题

### 📖 使用说明
- 📂 主日志文件位置: `/data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log`
- 🎮 启动控制面板: `sh /data/adb/modules/dimensity_hybrid_governor/action.sh`
- 🔄 切换调度器状态: `sh /data/adb/modules/dimensity_hybrid_governor/action.sh switch`
- 📊 查看调度器状态: `sh /data/adb/modules/dimensity_hybrid_governor/action.sh status`
- 🌐 访问WebUI界面: 浏览器访问 `http://127.0.0.1:9999`

### 🌐 WebUI功能
- 查看模块和设备状态
- 查看和管理日志
- 启动/停止GPU调速器
- 编辑GPU调速器配置文件
- 实时监控GPU调速器状态
- 多语言支持（中文、英文、俄语）

### 📝 框架升级说明
本版本基于AMMF2框架构建，相比之前版本有以下主要变化：
- 更规范的目录结构
- 更强大的日志系统
- 更完善的错误处理
- WebUI支持
- 多语言支持
- 文件监控系统

### ⚠️ 升级注意事项
- 日志文件路径已变更，旧版日志将不再可见
- 配置文件格式保持兼容，无需修改
- 控制面板命令保持兼容，但部分参数可能有变化
