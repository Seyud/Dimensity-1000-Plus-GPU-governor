# Dimensity-1000+ GPU Governor

[![Magisk](https://img.shields.io/badge/Magisk-20.4%2B-brightgreen)](https://github.com/topjohnwu/Magisk)
![Platform](https://img.shields.io/badge/Platform-Android%209.0%2B-blue)
![SOC](https://img.shields.io/badge/SOC-MediaTek_Dimensity_1000%2B-red)

适用于联发科天玑1000+的GPU动态调速器，优化高负载场景下的功耗与性能平衡

## 📌 功能特性
- 🚀 动态GPU频率调节算法
- 🔋 智能功耗管理（高频场景节能15-30%）
- 🎮 游戏场景专项优化
- 📊 可自定义的频率/电压表
- ⚡ 自动内存频率调节（DDR_OPP）
- 📈 实时性能余量控制（百分比/MHz双模式）

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
4. 查看日志：`adb shell cat $MODDIR/gpu_governor.log`

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

## 📚 常见问题
**Q：模块不生效怎么办？**  
A：检查`$MODDIR/gpu_governor.log`错误日志

**Q：如何恢复默认配置？**  
A：删除`/data/gpu_freq_table.conf`后重启

**Q：支持其他SOC吗？**  
A：仅限天玑1000+（mt6885/mt6889）

**Q：为什么游戏反而卡顿？**  
A：尝试提高margin值或检查DDR_OPP设置

## 📜 开源协议
本项目基于GPL-3.0协议开源，禁止任何商业用途
