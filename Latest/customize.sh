freq_table=/data/gpu_freq_table.conf
soc=$(getprop ro.hardware)

ui_print
ui_print " 频率/电压表位于 $freq_table 可自行修改 "
ui_print " 修改频率表后，需重启手机使其生效 "
ui_print " 该模块将在开机60秒后生效 "
ui_print " 如遇死机问题，可在重启后及时禁用模块 "
ui_print
ui_print " 运行日志位于 $MODPATH/gpu_governor.log "
ui_print " 遇到问题时请提供此日志文件 "
ui_print
ui_print " 此模块用于改善天玑1000+ GPU的高频功耗 "
ui_print " 你所玩的游戏GPU性能需求越大收益越明显 "
ui_print " 如果你不玩游戏，此模块的作用将不太明显 "
ui_print

set_perm_recursive $MODPATH 0 0 0755 0644
set_perm_recursive $MODPATH/gpu-scheduler 0 0 0755 0755

if [[ "$soc" != "mt6885" ]] && [[ "$soc" != "mt6889" ]]; then
  ui_print
  ui_print
  ui_print "此模块仅适用于天玑1000+"
  ui_print
  ui_print

  abort "设备不兼容：检测到 $soc，本模块仅支持 mt6885/mt6889 (天玑1000+)"
fi

# GPU电压列表，每625为一档
volt_list="65000 64375 63750 63125 62500 61875 61250 60625 60000 59375 58750 58125 57500 56875 56250 55625 55000 54375 53750 53125 52500 51875 51250 50625 50000 49375 48750 48125 47500 46875 46250 45625 45000 44375 43750 43125 42500 41875"

# 安全地获取频率列表，如果文件不存在则使用默认值
if [ -f /proc/gpufreq/gpufreq_opp_dump ]; then
  freq_list=$(cat /proc/gpufreq/gpufreq_opp_dump | awk '{print $4}' | cut -f1 -d ',')
else
  # 默认频率列表，如果无法从系统获取
  freq_list="218000 280000 350000 431000 471000 532000 573000 634000 685000 755000 853000"
  ui_print "警告：无法从系统获取GPU频率列表，使用默认值"
fi

default_margin="7"

notes="
# DDR_OPP 用于固定内存频率，常用值：
# 999 : 自动
# 0 : 固定 725000uv 3733000KHz
# 1 : 固定 725000uv 3200000KHz
# 2 : 固定 650000uv 3200000KHz
# 3 : 固定 650000uv 2400000KHz
# 4 : 固定 600000uv 2400000KHz
# 降低/限制内存频率能略微降低功耗，但GPU性能会严重受损

# Volt(GPU电压) 每625为一档，常用值：
# $volt_list

# Freq(GPU频率) 必须是以下值之一
# $freq_list

# 配置项：调速模式
# 可配置为 hybrid simple , 默认 hybrid
# simple 仅使用gpu_freq_table.conf中定义的频率
# hybrid 在性能需求较低时暂停辅助调速器以降低功耗
governor=hybrid

# 配置项：余量(%) 或 余量(MHz)
# 可配置为 0~100 代表GPU空闲比例，数值越大升频越激进
# 或配置为0MHz~800MHz 代表以MHz为单位的固定性能余量
margin=$default_margin

# 以下为频率/电压表配置内容
# 请务必将频率/电压值以从低到高的顺序配置
"

preset_1000="$notes
# Freq Volt DDR_OPP
218000 43750 999
280000 46875 999
350000 48750 999
431000 49375 999
471000 50625 999
532000 51875 999
573000 53125 1
634000 55000 1
685000 56875 1
755000 59375 0
853000 60625 0"

# 检查频率表文件是否存在，不存在则创建
if [[ ! -f $freq_table ]]; then
  # 我们在脚本开始已经检查过SoC型号，这里只需要写入预设
  echo "$preset_1000" > $freq_table

  ui_print "如果你在测试过程中遇到了"
  ui_print "不生效、死机、闪屏、突发卡顿"
  ui_print "通常是频率/电压配置不合适"
  ui_print "默认的配置降压非常极限，如果经常花屏，建议降低每档电压对应的频率"
  ui_print ""
  ui_print "如果各档位压力测试正常，但日常使用过程中经常死机"
  ui_print "可考虑将DDR_OPP列全部配置为999"
fi
