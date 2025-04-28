# Dimensity-1000+ GPU Governor

[![Magisk](https://img.shields.io/badge/Magisk-20.4%2B-brightgreen)](https://github.com/topjohnwu/Magisk)
![Platform](https://img.shields.io/badge/Platform-Android%2010.0%2B-blue)
![SOC](https://img.shields.io/badge/SOC-MediaTek_Dimensity_1000%2B-red)
![Version](https://img.shields.io/badge/Version-1.5.0-orange)
![Framework](https://img.shields.io/badge/Framework-AMMF2-purple)

适用于联发科天玑1000+的GPU动态调速器，优化高负载场景下的功耗与性能平衡

**使用AMMF2构建**

## 📌 功能特性
- 🚀 动态GPU频率调节算法
- 🔋 智能功耗管理（高频场景节能15-30%）
- 🎮 游戏场景专项优化
- 📊 可自定义的频率/电压表
- ⚡ 自动内存频率调节（DDR_OPP）
- 📈 实时性能余量控制（百分比/MHz双模式）
- 🔄 双模式调速器（hybrid/simple）支持不同场景需求
- 📝 完善的日志管理系统（自动轮转、压缩和级别控制）
- 🛠️ 命令行日志管理工具
- 🖥️ 交互式控制面板
- 🔄 一键切换GPU调度器开关功能
- 🌐 WebUI界面支持（查看状态、配置和控制）

## ⚠️ 重要警告
**使用前请务必知悉：**
- ❗ 可能导致死机/闪屏/卡顿（配置不当引发）
- ❗ 修改电压/频率需硬件知识
- ❗ 内存降频会显著影响GPU性能
- ❗ 首次使用建议保持默认配置

## 📥 安装说明
1. 通过root管理器刷入模块
2. 重启设备
3. 等待60秒服务自启
4. 查看日志：`cat /data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log`

## ⚙️ 配置指南
配置文件路径：`/data/gpu_freq_table.conf`

### 配置选项
#### 调速模式（governor）
```
# 配置项：调速模式
# 可配置为 hybrid simple , 默认 hybrid
# simple 仅使用gpu_freq_table.conf中定义的频率
# hybrid 在性能需求较低时暂停辅助调速器以降低功耗
governor=hybrid
```

#### 性能余量（margin）
```
# 配置项：性能余量
# 可配置为百分比(%)或固定频率(MHz)
# 百分比模式示例：margin=7%
# 固定频率模式示例：margin=50MHz
margin=7%
```

#### 频率/电压表
```
# 格式: Freq Volt DDR_OPP
# 频率范围: 218000-853000 MHz
# DDR_OPP: 999(自动) 0-4(固定内存频率)
218000 43750 999
280000 46875 999
...
853000 60625 0
```

### 调参建议
1. 花屏问题：降低当前电压档位的频率
2. 日常死机：设置DDR_OPP=999
3. 性能不足：提升margin值（5-10%逐步调整）
4. 功耗优化：降低高频段电压（每次625uv递减）

## 🛠️ 技术原理
A[系统启动] --> B[加载频率表]
B --> C[监控GPU负载]
C --> D{负载评估}
D -->|高负载| E[提升频率档位]
D -->|低负载| F[降低频率档位]
E --> G[同步调整DDR频率]
F --> G
G --> H[应用新电压]

## 🖥️ 控制面板
提供两种控制界面，满足不同使用需求：

### 命令行控制面板
```
sh /data/adb/modules/dimensity_hybrid_governor/action.sh
```

#### 命令行控制面板功能
- 显示GPU调度器当前状态（运行/停止）
- 一键切换GPU调度器开关
- 快速查看最近日志
- 集成日志管理功能

### WebUI界面
通过WebUI访问模块提供的图形界面，支持更丰富的功能：

#### WebUI功能
- 查看模块和设备状态（运行状态、设备信息）
- 查看和管理日志（自动刷新、导出、清空）
- 启动/停止/重启GPU调速器
- 编辑GPU调速器配置（卡片模式/文本模式）
- 多语言支持（中文、英文、俄语）
- 深色/浅色主题切换

#### GPU配置页面特性
- 卡片式配置界面，直观易用
- 支持选择调速模式（hybrid/simple）
- 支持选择余量类型（百分比/MHz）
- 提供推荐频率列表
- 支持自定义频率/电压/DDR_OPP配置
- 实时配置预览和保存

#### 访问WebUI
本模块的WebUI可通过以下方式访问：

**方法一：使用KsuWebUI（推荐）**
1. 从 [GitHub](https://github.com/5ec1cff/KsuWebUIStandalone) 下载并安装 KsuWebUI 应用
2. 打开KsuWebUI应用
3. 在模块列表中找到并点击"Dimensity Hybrid Governor"
4. WebUI将在应用内打开

**方法二：使用MMRL**
1. 从 [GitHub](https://github.com/MMRLApp/MMRL) 下载并安装 MMRL 应用
2. 打开MMRL应用
3. 在已安装模块列表中找到"Dimensity Hybrid Governor"
4. 点击模块，然后点击"打开WebUI"按钮



## 📝 日志管理系统
完善的日志管理系统，提供以下功能：

### 日志文件位置
主日志文件位置：`/data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log`

其他日志文件：
- `/data/adb/modules/dimensity_hybrid_governor/logs/service.log` - 服务日志
- `/data/adb/modules/dimensity_hybrid_governor/logs/action.log` - 控制脚本日志
- `/data/adb/modules/dimensity_hybrid_governor/logs/main.log` - 主脚本日志
- `/data/adb/modules/dimensity_hybrid_governor/logs/service_script.log` - 服务脚本日志

历史日志文件会以 `.old` 或数字后缀保存，如 `gpu-scheduler.log.old`
压缩后的日志文件会以 `.gz` 后缀保存，如 `gpu-scheduler.log.old.gz`

### 查看日志
可以使用以下命令查看日志文件：
```
cat /data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log
```

或使用标准Linux命令查看和管理日志：
```
# 查看日志
cat /data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log

# 实时查看日志更新
tail -f /data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log

# 查看最后10行日志
tail -n 10 /data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log

# 清空日志
echo "" > /data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log
```

### 日志级别说明
日志系统支持多个级别的日志记录：
- `DEBUG` - 调试级别，记录所有信息
- `INFO` - 信息级别，记录一般信息(默认)
- `WARN` - 警告级别，只记录警告和错误
- `ERROR` - 错误级别，只记录错误

## 📚 常见问题
**Q：模块不生效怎么办？**
A：使用控制面板查看状态：`sh /data/adb/modules/dimensity_hybrid_governor/action.sh`，或查看日志：`cat /data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log`，或通过WebUI查看状态

**Q：如何临时关闭调度器？**
A：使用WebUI界面、命令行控制面板或直接执行：`sh /data/adb/modules/dimensity_hybrid_governor/action.sh switch`

**Q：如何恢复默认配置？**
A：删除`/data/gpu_freq_table.conf`后重启

**Q：如何切换调速模式？**
A：在WebUI的GPU配置页面中选择调速模式，或编辑`/data/gpu_freq_table.conf`文件，修改`governor=hybrid`为`governor=simple`或反之，然后重启设备

**Q：支持其他SOC吗？**
A：仅限天玑1000+（mt6885/mt6889）

**Q：为什么游戏反而卡顿？**
A：尝试提高margin值或检查DDR_OPP设置

**Q：日志文件过大怎么办？**
A：可以通过WebUI日志页面清空日志，或执行命令：`echo "" > /data/adb/modules/dimensity_hybrid_governor/logs/gpu-scheduler.log`

**Q：控制面板无法启动怎么办？**
A：检查文件权限：`chmod 755 /data/adb/modules/dimensity_hybrid_governor/action.sh`

**Q：WebUI无法访问怎么办？**
A：WebUI需要通过KsuWebUI或MMRL应用访问，不支持直接通过浏览器访问。请确保已安装相应的应用。

**Q：如何在WebUI中修改GPU配置？**
A：在WebUI中点击"GPU配置"选项卡，可以使用卡片模式或文本模式编辑配置
