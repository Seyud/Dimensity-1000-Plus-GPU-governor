
# Dimensity-1000+ GPU Governor

[![Magisk](https://img.shields.io/badge/Magisk-20.4%2B-brightgreen)](https://github.com/topjohnwu/Magisk)
![Platform](https://img.shields.io/badge/Platform-Android%2010.0%2B-blue)
![SOC](https://img.shields.io/badge/SOC-MediaTek_Dimensity_1000%2B-red)
![Version](https://img.shields.io/badge/Version-1.5.0-orange)
![Framework](https://img.shields.io/badge/Framework-AMMF2-purple)

GPU dynamic governor for MediaTek Dimensity 1000+, optimizing power consumption and performance balance in high-load scenarios

**Built with AMMF2**

## 📌 Features
- 🚀 Dynamic GPU frequency adjustment algorithm
- 🔋 Smart power management (15-30% power saving in high-frequency scenarios)
- 🎮 Game-specific optimizations
- 📊 Customizable frequency/voltage table
- ⚡ Automatic memory frequency adjustment (DDR_OPP)
- 📈 Real-time performance margin control (percentage/MHz dual mode)
- 📝 Comprehensive log management system (automatic rotation, compression, and level control)
- 🛠️ Command-line log management tools
- 🖥️ Interactive control panel
- 🔄 One-click GPU governor switch function
- 🌐 WebUI interface support (view status, configuration, and control)

## ⚠️ Important Warning
**Please be aware before using:**
- ❗ May cause system crashes/screen flickering/stuttering (due to improper configuration)
- ❗ Modifying voltage/frequency requires hardware knowledge
- ❗ Memory downclocking significantly affects GPU performance
- ❗ First-time users should maintain default configuration

## 📥 Installation Instructions
1. Flash the module through Magisk/KernelSU Manager
2. Restart your device
3. Wait 60 seconds for the service to start automatically
4. View logs: `cat /data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log`
5. Access WebUI through browser: `http://127.0.0.1:9999`

## ⚙️ Configuration Guide
Configuration file path: `/data/gpu_freq_table.conf`

### Configuration Example
Freq Volt DDR_OPP
218000 43750 999
280000 46875 999
...
847000 60625 0

### Tuning Recommendations
1. Screen flickering issues: Lower the frequency at the current voltage level
2. Regular system crashes: Set DDR_OPP=999
3. Insufficient performance: Increase margin value (adjust gradually by 5-10%)
4. Power optimization: Reduce high-frequency band voltage (decrease by 625uv each time)

## 🛠️ Technical Principles
A[System Startup] --> B[Load Frequency Table]
B --> C[Monitor GPU Load]
C --> D{Load Assessment}
D -->|High Load| E[Increase Frequency Level]
D -->|Low Load| F[Decrease Frequency Level]
E --> G[Synchronize DDR Frequency Adjustment]
F --> G
G --> H[Apply New Voltage]

## 🖥️ Control Panel
Two control interfaces are provided to meet different usage needs:

### Command-line Control Panel
```
sh /data/adb/modules/dimensity_hybrid_governor/action.sh
```

#### Command-line Control Panel Features
- Display GPU governor current status (running/stopped)
- One-click GPU governor switch
- Quick view of recent logs
- Integrated log management functions

#### Command-line Options
Besides the interactive interface, you can also operate directly through the command line:
```
sh /data/adb/modules/dimensity_hybrid_governor/action.sh [option]
```

Available options:
- `switch` - Toggle GPU governor status
- `status` - Display GPU governor status
- `help` - Display help information

### WebUI Interface
Access the WebUI interface provided by the module through a browser, supporting richer features:

#### WebUI Features
- View module and device status
- View and manage logs
- Start/stop GPU governor
- Edit GPU governor configuration file
- Real-time monitoring of GPU governor status
- Multi-language support (Chinese, English, Russian)

#### Accessing WebUI
In browser, visit: `http://127.0.0.1:9999`
Or use ADB command: `adb shell am start -a android.intent.action.VIEW -d http://127.0.0.1:9999`

## 📝 Log Management System
Comprehensive log management system providing the following features:

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

# Real-time view of log updates
tail -f /data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log

# View the last 10 lines of logs
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
A: Check the status using the control panel: `sh /data/adb/modules/dimensity_hybrid_governor/action.sh`, or view logs: `cat /data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log`, or check status through WebUI

**Q: How to temporarily turn off the governor?**
A: Use the WebUI interface, command-line control panel, or directly execute: `sh /data/adb/modules/dimensity_hybrid_governor/action.sh switch`

**Q: How to restore default configuration?**
A: Delete `/data/gpu_freq_table.conf` and restart

**Q: Does it support other SOCs?**
A: Limited to Dimensity 1000+ (mt6885/mt6889)

**Q: Why do games stutter instead?**
A: Try increasing the margin value or check DDR_OPP settings

**Q: What if the log file is too large?**
A: You can clear the log file: `echo "" > /data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log`, or view and manage logs through WebUI

**Q: What if the control panel fails to start?**
A: Check file permissions: `chmod 755 /data/adb/modules/dimensity_hybrid_governor/action.sh`

**Q: What if WebUI is inaccessible?**
A: Check if the WebUI service is running: `ps -ef | grep webui`, if not started, try restarting the module

**Q: How to modify GPU configuration in WebUI?**
A: Click on the "GPU Config" tab in WebUI to directly edit and save the configuration file
