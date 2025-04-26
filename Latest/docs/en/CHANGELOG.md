# 🎮 Dimensity GPU Hybrid Governor Changelog

## 🚀 Version 1.4.7 → 1.5.0 (2025-04-26)

### ✨ New Features
- 🌐 Added WebUI interface support, providing graphical configuration and management functions
- 🔄 Added module architecture based on AMMF2 framework, improving stability and scalability
- 📊 Added GPU configuration editor, allowing direct editing of configuration files in WebUI
- 🌍 Added multi-language support (Chinese, English, Russian)
- 🔍 Added file monitoring system, implementing real-time monitoring based on inotify
- 📝 Added enhanced logging system, supporting multi-level logs and module-based separation

### 🔧 Improvements
- 📂 Refactored log management system, optimized log file structure and storage location
  - New path: `/data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log`
- 🛠️ Optimized service startup process, improved startup stability and error handling capability
- 🔌 Improved module installation script, added more compatibility checks
- 📱 Optimized control panel interface, providing a more intuitive operating experience
- 🔄 Enhanced GPU scheduler switching function, providing more reliable state management
- 📊 Improved GPU frequency acquisition and management methods, increased compatibility
- 🔧 Optimized configuration file processing logic, supporting more flexible configuration options

### 🐛 Fixes
- 🔍 Fixed log file permission issues on certain devices
- 🚀 Fixed initialization failure issues that may be caused by service startup delays
- 🔄 Fixed inaccurate GPU scheduler state detection issues
- 📁 Fixed file loss issues that may be caused by log rotation

### 📖 Usage Instructions
- 📂 Main log file location: `/data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log`
- 🎮 Launch control panel: `sh /data/adb/modules/dimensity_hybrid_governor/action.sh`
- 🔄 Switch scheduler state: `sh /data/adb/modules/dimensity_hybrid_governor/action.sh switch`
- 📊 View scheduler status: `sh /data/adb/modules/dimensity_hybrid_governor/action.sh status`
- 🌐 Access WebUI interface: Visit `http://127.0.0.1:9999` in browser

### 🌐 WebUI Features
- View module and device status
- View and manage logs
- Start/stop GPU governor
- Edit GPU governor configuration files
- Real-time monitoring of GPU governor status
- Multi-language support (Chinese, English, Russian)

### 📝 Framework Upgrade Notes
This version is built on the AMMF2 framework, with the following major changes compared to previous versions:
- More standardized directory structure
- More powerful logging system
- More comprehensive error handling
- WebUI support
- Multi-language support
- File monitoring system

### ⚠️ Upgrade Notes
- Log file path has changed, old version logs will no longer be visible
- Configuration file format remains compatible, no modifications needed
- Control panel commands remain compatible, but some parameters may have changed
