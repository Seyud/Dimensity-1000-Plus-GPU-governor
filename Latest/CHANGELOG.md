# 🎮 天玑GPU混合调速器 更新日志

## 🚀 版本 1.4.6 → 1.4.7 (2025-04-26)

### ✨ 新增功能
- 🖥️ 新增交互式控制面板，提供更友好的用户界面
- 🔄 新增一键切换GPU调度器开关功能
- 📊 新增状态显示功能，实时查看调度器运行状态

### 🔧 改进
- 🛡️ 增强SOC兼容性检查，提供更明确的错误提示
- 🔌 优化安装脚本，使用ui_print替代echo提升安装体验
- 🔍 改进频率列表获取方式，增加错误处理和默认值
- 📁 优化模块目录路径获取方式，使用动态路径提高兼容性
- 🔧 简化配置文件创建流程，减少冗余代码
- 📝 完善控制脚本，增加更多功能选项
- 🔄 优化服务启动流程，增强错误处理能力

### 🐛 修复
- 🔧 修复在某些设备上无法正确获取GPU频率列表的问题
- 🚀 修复模块路径引用不一致导致的潜在问题
- 🔒 修复卸载脚本中可能的进程清理不完全问题

### 📖 使用说明
- 📂 日志文件位置: `/data/adb/modules/dimensity_hybrid_governor/gpu_governor.log`
- 🎮 启动控制面板: `sh /data/adb/modules/dimensity_hybrid_governor/action.sh`
- 🔄 切换调度器状态: `sh /data/adb/modules/dimensity_hybrid_governor/action.sh switch`
- 📊 查看调度器状态: `sh /data/adb/modules/dimensity_hybrid_governor/action.sh status`
- 📝 日志管理: `sh /data/adb/modules/dimensity_hybrid_governor/action.sh log [选项]`

