# Dimensity-1000+ GPU Governor v1.4.7

[![Magisk](https://img.shields.io/badge/Magisk-20.4%2B-brightgreen)](https://github.com/topjohnwu/Magisk)
![Platform](https://img.shields.io/badge/Platform-Android%2010.0%2B-blue)
![SOC](https://img.shields.io/badge/SOC-MediaTek_Dimensity_1000%2B-red)
![Version](https://img.shields.io/badge/Version-1.4.7-orange)

适用于联发科天玑1000+的GPU动态调速器，优化高负载场景下的功耗与性能平衡

## 📌 功能特性
- 🚀 动态GPU频率调节算法
- 🔋 智能功耗管理（高频场景节能15-30%）
- 🎮 游戏场景专项优化
- 📊 可自定义的频率/电压表
- ⚡ 自动内存频率调节（DDR_OPP）
- 📈 实时性能余量控制（百分比/MHz双模式）
- 📝 完善的日志管理系统（自动轮转、压缩和级别控制）
- 🛠️ 命令行日志管理工具
- 🖥️ 交互式控制面板
- 🔄 一键切换GPU调度器开关功能

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
4. 查看日志：`sh /data/adb/modules/dimensity_hybrid_governor/log_manager.sh view`

## ⚙️ 配置指南
配置文件路径：`/data/gpu_freq_table.conf`

### 配置示例
Freq Volt DDR_OPP
218000 43750 999
280000 46875 999
...
847000 60625 0

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
新增了交互式控制面板，提供更友好的用户界面：

### 启动控制面板
```
sh /data/adb/modules/dimensity_hybrid_governor/action.sh
```

### 控制面板功能
- 显示GPU调度器当前状态（运行/停止）
- 一键切换GPU调度器开关
- 快速查看最近日志
- 集成日志管理功能

### 命令行选项
除了交互式界面外，还可以通过命令行直接操作：
```
sh /data/adb/modules/dimensity_hybrid_governor/action.sh [选项]
```

可用选项：
- `switch` - 切换GPU调度器开关状态
- `status` - 显示GPU调度器状态
- `log [选项]` - 日志管理（同log_manager.sh的选项）
- `help` - 显示帮助信息

## 📝 日志管理系统
完善的日志管理系统，提供以下功能：

### 日志文件位置
主日志文件位置：`/data/adb/modules/dimensity_hybrid_governor/gpu_governor.log`

历史日志文件：
- `/data/adb/modules/dimensity_hybrid_governor/gpu_governor.log.old` - 最近一次轮转的日志
- `/data/adb/modules/dimensity_hybrid_governor/gpu_governor.log.1` - 较早的日志
- `/data/adb/modules/dimensity_hybrid_governor/gpu_governor.log.2` - 更早的日志
- `/data/adb/modules/dimensity_hybrid_governor/gpu_governor.log.3` - 最早的日志

压缩后的日志文件会以 `.gz` 后缀保存，如 `gpu_governor.log.old.gz`

### 日志管理工具使用
```
sh /data/adb/modules/dimensity_hybrid_governor/log_manager.sh [option]
```
或通过控制面板：
```
sh /data/adb/modules/dimensity_hybrid_governor/action.sh log [option]
```

### 可用选项
- `view` - 查看当前日志
- `tail [n]` - 实时查看日志更新 (默认显示最后10行)
- `clear` - 清空日志
- `rotate` - 手动轮转日志
- `compress` - 压缩旧日志
- `level [debug|info|warn|error]` - 设置日志级别
- `status` - 显示GPU调度器状态
- `sysinfo` - 记录系统信息到日志
- `help` - 显示帮助信息

### 日志级别
- `debug` - 调试级别，记录所有信息
- `info` - 信息级别，记录一般信息(默认)
- `warn` - 警告级别，只记录警告和错误
- `error` - 错误级别，只记录错误

## 📚 常见问题
**Q：模块不生效怎么办？**
A：使用控制面板查看状态：`sh /data/adb/modules/dimensity_hybrid_governor/action.sh`，或查看日志：`sh /data/adb/modules/dimensity_hybrid_governor/action.sh log view`

**Q：如何临时关闭调度器？**
A：使用控制面板或直接执行：`sh /data/adb/modules/dimensity_hybrid_governor/action.sh switch`

**Q：如何恢复默认配置？**
A：删除`/data/gpu_freq_table.conf`后重启

**Q：支持其他SOC吗？**
A：仅限天玑1000+（mt6885/mt6889）

**Q：为什么游戏反而卡顿？**
A：尝试提高margin值或检查DDR_OPP设置

**Q：日志文件过大怎么办？**
A：使用日志管理工具轮转或压缩日志：`sh /data/adb/modules/dimensity_hybrid_governor/action.sh log rotate`

**Q：控制面板无法启动怎么办？**
A：检查文件权限：`chmod 755 /data/adb/modules/dimensity_hybrid_governor/action.sh`
