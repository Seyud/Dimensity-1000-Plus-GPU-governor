freq_table=/data/gpu_freq_table.conf
soc=$(getprop ro.hardware)

if [[ "$soc" == "mt6893" ]] && [[ $(cat /sys/devices/system/cpu/cpu7/cpufreq/cpuinfo_max_freq) -lt 2700000 ]]; then
  soc='mt6891'
fi

echo
echo " 频率/电压表位于 $freq_table 可自行修改 "
echo " 修改频率表后，需重启手机使其生效 "
echo " 该模块将在开机60秒后生效 "
echo " 如遇死机问题，可在重启后及时禁用模块 "
echo
echo
echo " 此模块用于改善天玑1000+ GPU的高频功耗 "
echo " 你所玩的游戏GPU性能需求越大收益越明显 "
echo " 如果你不玩游戏，此模块的作用将不太明显 "
echo
echo

set_perm_recursive $MODPATH 0 0 0755 0644
set_perm_recursive $MODPATH/gpu-scheduler 0 0 0755 0755

if [[ "$soc" != "mt6893" ]] && [[ "$soc" != "mt6889" ]]; then
  echo
  echo
  echo "此模块仅适用于天玑1000+"
  echo
  echo

  exit 2
fi

volt_list=$(cat /proc/gpufreq/gpufreq_opp_dump | awk '{print $7}' | cut -f1 -d ',')
volt_list=$(echo $volt_list)
if [[ "$soc" == "mt6889" ]]; then
volt_list="65000 64375 63750 63125 62500 61875 61875 61250 60625 60000 59375 58750 58125 57500 56875 56250 55625 55000 54375 53750 53125 52500 51875 51250 50625 50000 49375 48750 48125 47500 46875 46250 45625 45000 44375 43750 43125 42500 41875"
fi

freq_list=$(cat /proc/gpufreq/gpufreq_opp_dump | awk '{print $4}' | cut -f1 -d ',')
freq_list=$(echo $freq_list)

# default_margin="7"
# if [[ "$soc" == "mt6893" ]]; then
#   default_margin="7"
# elif [[ "$soc" == "mt6891" ]]; then
#   default_margin="10"
# fi

default_margin="15MHz"

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

# 配置项：余量(%) 或 余量(MHz)
# 可配置为 0~100 代表GPU空闲比例，数值越大升频越激进
# 或配置为0MHz~800MHz 代表以MHz为单位的固定性能余量
margin=$default_margin

# 以下为频率/电压表配置内容
# 请务必将频率/电压值以从低到高的顺序配置
"

test() {
  echo $1 $2 > /proc/gpufreq/gpufreq_fixed_freq_volt
}
# test 867000 61875

preset_1200="$notes
# Freq Volt DDR_OPP
350000 45000 999
431000 46875 999
471000 48125 999
532000 50625 999
573000 51250 0
634000 52500 0
685000 53750 0
755000 55625 0
805000 58125 0
842000 60000 0
886000 63125 0"

preset_1000="$notes
# Freq Volt DDR_OPP
218000 43750 999
280000 46875 999
350000 48750 999
431000 50625 999
471000 50625 999
532000 53125 999
573000 53125 1
634000 55000 1
685000 56875 1
755000 59375 0
847000 60625 0"

if [[ ! -f $freq_table ]]; then
  if [[ "$soc" == "mt6893" ]]; then
    echo "$preset_1200" > $freq_table
  elif [[ "$soc" == "mt6889" ]]; then
    echo "$preset_1000" > $freq_table
  else
    echo "未找到可用预设，请自行配置"
    echo -e "# Freq Volt DDR_OPP\n# example(Does not include the # symbol)\n#852000 61250 3" > $freq_table
    return
  fi

  echo "如果你在测试过程中遇到了"
  echo "不生效、死机、闪屏、突发卡顿"
  echo "通常是频率/电压配置不合适"
  echo "默认的配置降压非常极限，如果经常花屏，建议降低每档电压对应的频率"
  echo ""
  echo "如果各档位压力测试正常，但日常使用过程中经常死机"
  echo "可考虑将DDR_OPP列全部配置为999"
fi
