# 🎮 天玑GPU混合调速器 更新日志

## 🚀 版本 1.4.6 (2025-04-23)

### ✨ 新增功能
- 📊 新增日志管理系统，提供更完善的日志记录和管理功能
- 🔄 新增日志轮转功能，自动管理日志大小，防止日志过大占用存储空间
- 🗜️ 新增日志压缩功能，定期压缩旧日志文件
- 🔍 新增日志级别控制，支持debug/info/warn/error四个级别
- 🛠️ 新增`log_manager.sh`工具，提供命令行日志管理功能

### 🔧 改进
- 📦 重构日志系统，将日志功能抽取到独立的`log_utils.sh`文件中
- 🚦 优化服务启动流程，增加更多错误检查和状态报告
- 🔌 改进SOC兼容性检查，提供更详细的设备信息记录
- 📝 增强日志内容，记录更多系统和运行时信息
- ⏱️ 定期执行日志轮转，每小时检查一次日志大小
- 💾 每天自动压缩旧日志文件，节省存储空间
- 🔥 重构卸载脚本，集成统一日志系统，增强错误处理
- 🔒 卸载脚本增加进程清理功能，确保完全卸载

### 🐛 修复
- 🔧 修复日志文件大小检测在不同系统上的兼容性问题
- 🚀 修复服务脚本中的潜在启动问题
- 🔒 修复日志初始化可能导致的权限问题

### 📖 使用说明
- 📂 日志文件位置: `/data/adb/modules/dimensity_hybrid_governor/gpu_governor.log`
- 🔍 日志管理工具使用: `sh /data/adb/modules/dimensity_hybrid_governor/log_manager.sh help`
- 👁️ 查看日志: `sh /data/adb/modules/dimensity_hybrid_governor/log_manager.sh view`
- 📺 实时查看日志: `sh /data/adb/modules/dimensity_hybrid_governor/log_manager.sh tail`
- 🎚️ 设置日志级别: `sh /data/adb/modules/dimensity_hybrid_governor/log_manager.sh level [debug|info|warn|error]`


