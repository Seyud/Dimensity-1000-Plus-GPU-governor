
# Dimensity-1000+ GPU Governor

[![Magisk](https://img.shields.io/badge/Magisk-20.4%2B-brightgreen)](https://github.com/topjohnwu/Magisk)
![Platform](https://img.shields.io/badge/Platform-Android%2010.0%2B-blue)
![SOC](https://img.shields.io/badge/SOC-MediaTek_Dimensity_1000%2B-red)
![Framework](https://img.shields.io/badge/Framework-AMMF2-purple)

A GPU dynamic governor for MediaTek Dimensity 1000+, optimizing power and performance balance in high-load scenarios

**Built with AMMF2**

## 📌 Features
- 🚀 Dynamic GPU frequency adjustment algorithm
- 🔋 Smart power management (15-30% power saving in high-frequency scenarios)
- 🎮 Game-specific optimizations
- 📊 Customizable frequency/voltage table
- ⚡ Automatic memory frequency adjustment (DDR_OPP)
- 📈 Real-time performance margin control (percentage/MHz dual modes)
- 🔄 Dual governor modes (hybrid/simple) for different scenarios
- 📝 Comprehensive log management system (auto-rotation, compression, and level control)
- 🛠️ Command-line log management tools
- 🖥️ Interactive control panel
- 🔄 One-click GPU governor toggle
- 🌐 WebUI interface support (status monitoring, configuration, and control)

## ⚠️ Important Warnings
**Please be aware before using:**
- ❗ May cause crashes/screen flickering/stuttering (due to improper configuration)
- ❗ Modifying voltage/frequency requires hardware knowledge
- ❗ Memory downclocking significantly affects GPU performance
- ❗ First-time users should keep default configuration

## 📥 Installation
1. Flash the module through your root manager
2. Restart your device
3. Wait 60 seconds for the service to start
4. Check logs: `cat /data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log`

## ⚙️ Configuration Guide
Configuration file path: `/data/gpu_freq_table.conf`

### Configuration Options
#### Governor Mode
```
# Configuration item: Governor mode
# Can be set to hybrid or simple, default is hybrid
# simple: only uses frequencies defined in gpu_freq_table.conf
# hybrid: pauses auxiliary governor at low performance demand to reduce power consumption
governor=hybrid
```

#### Performance Margin
```
# Configuration item: Performance margin
# Can be configured as percentage(%) or fixed frequency(MHz)
# Percentage mode example: margin=7%
# Fixed frequency mode example: margin=50MHz
margin=7%
```

#### Frequency/Voltage Table
```
# Format: Freq Volt DDR_OPP
# Frequency range: 218000-853000 MHz
# DDR_OPP: 999(auto) 0-4(fixed memory frequency)
218000 43750 999
280000 46875 999
...
853000 60625 0
```

### Tuning Recommendations
1. Screen flickering issues: Lower the frequency at the current voltage level
2. Regular crashes: Set DDR_OPP=999
3. Insufficient performance: Increase margin value (adjust gradually by 5-10%)
4. Power optimization: Lower voltage at high-frequency levels (decrease by 625uv each time)

## 🛠️ Technical Principles
A[System startup] --> B[Load frequency table]
B --> C[Monitor GPU load]
C --> D{Load evaluation}
D -->|High load| E[Increase frequency level]
D -->|Low load| F[Decrease frequency level]
E --> G[Synchronize DDR frequency adjustment]
F --> G
G --> H[Apply new voltage]

## 🖥️ Control Panels
Two control interfaces are provided to meet different usage needs:

### Command-line Control Panel
```
sh /data/adb/modules/dimensity_hybrid_governor/action.sh
```

#### Command-line Control Panel Features
- Display GPU governor current status (running/stopped)
- One-click GPU governor toggle
- Quick view of recent logs
- Integrated log management functions

### WebUI Interface
Access the WebUI interface provided by the module, supporting more features:

#### WebUI Features
- View module and device status (running status, device information)
- View and manage logs (auto-refresh, export, clear)
- Start/stop/restart GPU governor
- Edit GPU governor configuration (card mode/text mode)
- Multi-language support (Chinese, English, Russian)
- Dark/light theme switching

#### GPU Configuration Page Features
- Card-style configuration interface, intuitive and easy to use
- Support for selecting governor mode (hybrid/simple)
- Support for selecting margin type (percentage/MHz)
- Provides recommended frequency list
- Support for custom frequency/voltage/DDR_OPP configuration
- Real-time configuration preview and saving

#### Accessing WebUI
The module's WebUI can be accessed through the following methods:

**Method 1: Using KsuWebUI (Recommended)**
1. Download and install the KsuWebUI app from [GitHub](https://github.com/5ec1cff/KsuWebUIStandalone)
2. Open the KsuWebUI app
3. Find and click on "Dimensity Hybrid Governor" in the module list
4. The WebUI will open within the app

**Method 2: Using MMRL**
1. Download and install the MMRL app from [GitHub](https://github.com/MMRLApp/MMRL)
2. Open the MMRL app
3. Find "Dimensity Hybrid Governor" in the installed modules list
4. Click on the module, then click the "Open WebUI" button



## 📝 Log Management System
Comprehensive log management system with the following features:

### Log File Locations
Main log file location: `/data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log`

Other log files:
- `/data/adb/modules/dimensity_hybrid_governor/logs/service.log` - Service logs
- `/data/adb/modules/dimensity_hybrid_governor/logs/action.log` - Control script logs
- `/data/adb/modules/dimensity_hybrid_governor/logs/main.log` - Main script logs
- `/data/adb/modules/dimensity_hybrid_governor/logs/service_script.log` - Service script logs

Historical log files are saved with `.old` or numeric suffixes, such as `gpu-scheduler.log.old`
Compressed log files are saved with `.gz` suffix, such as `gpu-scheduler.log.old.gz`

### Viewing Logs
You can use the following command to view log files:
```
cat /data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log
```

Or use standard Linux commands to view and manage logs:
```
# View logs
cat /data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log

# Real-time log updates
tail -f /data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log

# View last 10 lines of logs
tail -n 10 /data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log

# Clear logs
echo "" > /data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log
```

### Log Level Description
The logging system supports multiple levels of logging:
- `DEBUG` - Debug level, records all information
- `INFO` - Information level, records general information (default)
- `WARN` - Warning level, only records warnings and errors
- `ERROR` - Error level, only records errors

## 📚 FAQ
**Q: What if the module doesn't work?**
A: Use the control panel to check status: `sh /data/adb/modules/dimensity_hybrid_governor/action.sh`, or check logs: `cat /data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log`, or view status through WebUI

**Q: How to temporarily disable the governor?**
A: Use the WebUI interface, command-line control panel, or directly execute: `sh /data/adb/modules/dimensity_hybrid_governor/action.sh switch`

**Q: How to restore default configuration?**
A: Delete `/data/gpu_freq_table.conf` and restart

**Q: How to switch governor modes?**
A: Select the governor mode in the GPU configuration page of WebUI, or edit the `/data/gpu_freq_table.conf` file, change `governor=hybrid` to `governor=simple` or vice versa, then restart the device

**Q: Does it support other SOCs?**
A: Limited to Dimensity 1000+ (mt6885/mt6889) only

**Q: Why do games stutter instead?**
A: Try increasing the margin value or check DDR_OPP settings

**Q: What if log files get too large?**
A: Clear logs through the WebUI logs page, or execute the command: `echo "" > /data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log`

**Q: What if the control panel won't start?**
A: Check file permissions: `chmod 755 /data/adb/modules/dimensity_hybrid_governor/action.sh`

**Q: What if WebUI is inaccessible?**
A: WebUI can only be accessed through KsuWebUI or MMRL apps, direct browser access is not supported. Please make sure you have installed the appropriate app.

**Q: How to modify GPU configuration in WebUI?**
A: Click on the "GPU Configuration" tab in WebUI, you can edit the configuration using card mode or text mode
