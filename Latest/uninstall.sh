#!/system/bin/sh

# GPU调度器模块卸载脚本
# 用途：在模块卸载时清理模块创建的配置文件
# 说明：gpu_freq_table.conf 存储了GPU频率/电压表的配置信息
#      删除此文件以恢复系统默认的GPU设置

# 获取模块目录
MODDIR=${0%/*}

# 引入日志工具库
if [ -f "$MODDIR/log_utils.sh" ]; then
    source "$MODDIR/log_utils.sh"
    # 初始化日志
    log_init
    log_info "开始执行卸载脚本"
else
    # 如果日志工具库不存在，使用简单的日志函数
    log_info() {
        echo "[INFO] $(date '+%Y-%m-%d %H:%M:%S') - $1"
    }

    log_error() {
        echo "[ERROR] $(date '+%Y-%m-%d %H:%M:%S') - $1"
    }

    log_info "日志工具库不存在，使用简单日志函数"
fi

# 定义配置文件路径
CONFIG_FILE="/data/gpu_freq_table.conf"

log_info "开始卸载GPU调度器模块"

# 检查文件是否存在
if [ -f "$CONFIG_FILE" ]; then
    # 删除配置文件
    if rm "$CONFIG_FILE"; then
        log_info "成功删除配置文件: $CONFIG_FILE"
    else
        log_error "删除配置文件失败: $CONFIG_FILE"
        exit 1
    fi
else
    log_info "配置文件不存在: $CONFIG_FILE"
fi

# 关闭运行中的GPU调度器进程
if pgrep -f "gpu-scheduler" > /dev/null; then
    log_info "关闭GPU调度器进程"
    killall gpu-scheduler 2>/dev/null
    sleep 1
    if ! pgrep -f "gpu-scheduler" > /dev/null; then
        log_info "GPU调度器进程已终止"
    else
        log_error "无法终止GPU调度器进程"
    fi
fi

log_info "GPU调度器模块卸载完成"
exit 0
