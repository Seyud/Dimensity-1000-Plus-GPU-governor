#!/system/bin/sh

# Custom Script
# -----------------
# This script extends the functionality of the default and setup scripts, allowing direct use of their variables and functions.
# SCRIPT_EN.md

# 使用示例:
# 要进入暂停模式并监控配置文件，可以这样调用:
# enter_pause_mode "$MODPATH/module_settings/config.sh" "$MODPATH/scripts/on_config_change.sh"
# 设置日志文件
MODDIR=${0%/*}

# 设置service_script的日志文件
set_log_file "service_script"
log_info "开始执行service_script.sh"

sleep 60

# 创建临时日志文件
GPU_LOG_FILE="$MODDIR/logs/gpu_scheduler_output.log"

# 启动gpu-scheduler并将输出重定向到临时文件
nohup $MODDIR/gpu-scheduler > "$GPU_LOG_FILE" 2>&1 &

# 等待一小段时间以确保有输出
sleep 2

# 检查日志文件是否存在且有内容
if [ -f "$GPU_LOG_FILE" ] && [ -s "$GPU_LOG_FILE" ]; then
    # 获取前20行日志
    GPU_LOG_CONTENT=$(head -n 20 "$GPU_LOG_FILE")

    # 记录到日志系统
    if [ -f "$MODDIR/bin/logmonitor" ]; then
        # 设置日志文件名为gpu-scheduler
        "$MODDIR/bin/logmonitor" -c write -n "gpu-scheduler" -m "GPU调度器已启动" -l 3 >/dev/null 2>&1

        # 逐行记录前20行日志
        echo "$GPU_LOG_CONTENT" | while read -r line; do
            if [ -n "$line" ]; then
                "$MODDIR/bin/logmonitor" -c write -n "gpu-scheduler" -m "$line" -l 4 >/dev/null 2>&1
            fi
        done

        # 记录日志完成信息
        "$MODDIR/bin/logmonitor" -c write -n "gpu-scheduler" -m "以上为GPU调度器启动的前20行日志" -l 3 >/dev/null 2>&1
    fi

    # 输出日志完成信息
    Aurora_ui_print "GPU调度器日志已记录到 $MODDIR/logs/gpu-scheduler.log"
else
    # 记录错误信息
    if [ -f "$MODDIR/bin/logmonitor" ]; then
        "$MODDIR/bin/logmonitor" -c write -n "gpu-scheduler" -m "GPU调度器启动但未产生输出" -l 2 >/dev/null 2>&1
    fi

    Aurora_ui_print "GPU调度器启动但未产生输出"
fi
