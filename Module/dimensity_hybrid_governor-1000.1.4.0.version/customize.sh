#!/system/bin/sh

# 配置文件路径
freq_table=/data/gpu_freq_table.conf
# 获取设备 SOC 型号
soc=$(getprop ro.hardware)

# 显示模块信息
print_module_info() {
    echo
    echo "==================== GPU调度器说明 ===================="
    echo "• 频率/电压表位于 $freq_table"
    echo "• 修改频率表后需重启手机生效"
    echo "• 模块将在开机60秒后生效"
    echo "• 如遇死机问题，可在重启后及时禁用模块"
    echo "• 运行日志位于 /data/local/tmp/gpu_scheduler.log"
    echo
    echo "------------------ 适用场景说明 ------------------"
    echo "• 此模块用于优化天玑1000+ GPU的高频功耗"
    echo "• GPU性能需求越大，优化效果越明显"
    echo "• 主要针对游戏场景优化，日常使用效果不明显"
    echo "=================================================="
    echo
}

# 设置模块权限
set_permissions() {
    set_perm_recursive $MODPATH 0 0 0755 0644
    set_perm_recursive $MODPATH/gpu-scheduler 0 0 0755 0755
}

# 检查设备兼容性
check_device_compatibility() {
    if [[ "$soc" != "mt6885" ]] && [[ "$soc" != "mt6889" ]]; then
        echo
        echo "错误：此模块仅支持天玑1000+"
        echo
        exit 2
    fi
}

# 获取电压和频率列表
get_freq_volt_lists() {
    # 获取当前设备支持的电压列表
    volt_list=$(cat /proc/gpufreq/gpufreq_opp_dump | awk '{print $7}' | cut -f1 -d ',')
    volt_list=$(echo $volt_list)
    
    # 修复电压列表获取问题
    if [[ "$soc" == "mt6889" ]] || [[ "$soc" == "mt6885" ]]; then
        volt_list="65000 64375 63750 63125 62500 61875 61875 61250 60625 60000 59375 58750 58125 57500 56875 56250 55625 55000 54375 53750 53125 52500 51875 51250 50625 50000 49375 48750 48125 47500 46875 46250 45625 45000 44375 43750 43125 42500 41875"
    fi

    # 获取支持的频率列表
    freq_list=$(cat /proc/gpufreq/gpufreq_opp_dump | awk '{print $4}' | cut -f1 -d ',')
    freq_list=$(echo $freq_list)
}

# 生成配置文件说明
generate_config_notes() {
    local default_margin="27MHz"
    
    cat << EOF
# ================== GPU频率配置说明 ==================

# DDR_OPP 内存频率配置说明：
# 999 : 自动调节
# 0   : 725000uv 3733000KHz
# 1   : 725000uv 3200000KHz
# 2   : 650000uv 3200000KHz
# 3   : 650000uv 2400000KHz
# 4   : 600000uv 2400000KHz
# 注意：降低内存频率可减少功耗，但会显著影响GPU性能

# GPU电压档位 (单位：uv)：
# $volt_list

# 可用GPU频率值 (单位：Hz)：
# $freq_list

# 性能余量配置：
# 可选值：0~100 (%) 或 0~800 (MHz)
# 百分比模式：数值越大，升频越激进
# MHz模式：固定的性能余量
margin=$default_margin

# 以下为频率/电压对应表
# 格式：频率 电压 DDR_OPP
# 注意：必须按照频率从低到高排序
EOF
}

# 预设配置
get_preset_config() {
    local notes=$(generate_config_notes)
    
    if [[ "$soc" == "mt6885" ]]; then
        # 天玑1000L预设
        cat << EOF
$notes
# Freq  Volt   DDR_OPP
218000  43750  999
280000  46875  999
350000  48750  999
431000  50625  999
471000  50625  999
532000  53125  999
573000  53125  1
634000  55000  1
685000  56875  1
755000  59375  0
847000  60625  0
EOF
    elif [[ "$soc" == "mt6889" ]]; then
        # 天玑1000预设
        cat << EOF
$notes
# Freq  Volt   DDR_OPP
218000  43750  999
280000  46875  999
350000  48750  999
431000  50625  999
471000  50625  999
532000  53125  999
573000  53125  1
634000  55000  1
685000  56875  1
755000  59375  0
847000  60625  0
EOF
    fi
}

# 创建配置文件
create_config_file() {
    if [[ ! -f $freq_table ]]; then
        if [[ "$soc" == "mt6885" ]] || [[ "$soc" == "mt6889" ]]; then
            get_preset_config > $freq_table
            else
            echo "未找到可用预设，请参考示例自行配置"
            echo -e "# Freq Volt DDR_OPP\n# 示例配置(不要包含#号)\n#852000 61250 3" > $freq_table
        fi
    fi
    
    # 无论是否存在配置文件都显示警告信息
    if [[ "$soc" == "mt6885" ]] || [[ "$soc" == "mt6889" ]]; then
        echo
        echo "警告：默认配置可能导致以下问题："
        echo "• 配置不生效"
        echo "• 系统死机"
        echo "• 屏幕闪烁"
        echo "• 突发卡顿"
        echo
        echo "建议："
        echo "1. 如果出现花屏，请降低每档电压对应的频率"
        echo "2. 如果压力测试正常但日常使用死机，建议将DDR_OPP设为999"
        echo
    fi
}

# 主函数
main() {
    print_module_info
    set_permissions
    check_device_compatibility
    get_freq_volt_lists
    create_config_file
}

# 执行主函数
main
