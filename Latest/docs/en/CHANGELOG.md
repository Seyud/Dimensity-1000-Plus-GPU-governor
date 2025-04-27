# 🎮 Dimensity GPU Hybrid Governor Changelog

## 🚀 Version 1.5.0 → 1.5.1 (2025-04-27)

### 🔧 Improvements
- 🌐 Comprehensive optimization of WebUI interface, enhancing user experience
  - 📊 Restructured module information display components, adding more detailed information
  - 🔗 Improved GitHub link handling, providing more intuitive access methods
  - 🎨 Optimized interface styles and interaction effects, improving visual consistency
  - 🔄 Fixed version number display from 7.1.1 to 1.5.1, maintaining consistency with module version
- 🌍 Enhanced multi-language support
  - 🔤 Expanded translation entries, added GPU configuration related terminology
  - 📝 Optimized translation quality for Chinese, English and Russian
  - 🔍 Added translations for frequency range and recommended frequency list
- 📱 GPU configuration page enhancements
  - 📋 Added recommended frequency list feature, providing more frequency options
  - 📏 Added frequency range description, clarifying available frequency ranges
  - 🔢 Improved frequency application mechanism, supporting more precise frequency selection
  - 📑 Optimized configuration editor layout and interaction methods

### 🐛 Fixes
- 🔄 Fixed inconsistent version number display in WebUI
- 🖼️ Fixed display issues with some interface elements
- 🔍 Fixed module information rendering logic in about.js page
- 🔗 Fixed incorrect GitHub link handling
- 🎨 Fixed color picker not working properly in certain situations

### 📖 Usage Instructions
- 📂 Main log file location: `/data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log`
- 🎮 Launch control panel: `sh /data/adb/modules/dimensity_hybrid_governor/action.sh`
- 🔄 Switch scheduler state: `sh /data/adb/modules/dimensity_hybrid_governor/action.sh switch`
- 📊 View scheduler status: `sh /data/adb/modules/dimensity_hybrid_governor/action.sh status`
- 🌐 Access WebUI interface: Visit `http://127.0.0.1:9999` in browser

### ⚠️ Upgrade Notes
- This version mainly optimizes the WebUI interface and fixes issues
- Configuration file format remains compatible, no modifications needed
- Control panel commands remain compatible
- It is recommended to clear browser cache before accessing WebUI to ensure getting the latest interface
