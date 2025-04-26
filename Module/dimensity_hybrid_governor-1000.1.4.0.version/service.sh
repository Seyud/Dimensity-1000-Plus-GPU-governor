#!/system/bin/sh

# 模块目录路径
MODDIR=${0%/*}
# 日志文件路径
LOG_FILE=/data/local/tmp/gpu_scheduler.log
# 启动延迟时间(秒)
STARTUP_DELAY=60
# GPU调度器可执行文件
SCHEDULER_BIN="$MODDIR/gpu-scheduler"

# 日志函数
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') $1" >> "$LOG_FILE"
}

# 检查GPU调度器是否已在运行
is_scheduler_running() {
    pgrep -f "$SCHEDULER_BIN" > /dev/null
    return $?
}

# 启动GPU调度器
start_scheduler() {
    # 检查可执行文件是否存在
    if [ ! -f "$SCHEDULER_BIN" ]; then
        log "错误: GPU调度器执行文件不存在"
        return 1
    fi
    
    # 检查是否已经在运行
    if is_scheduler_running; then
        log "GPU调度器已在运行"
        return 0
    }
    
    # 等待系统启动完成
    log "等待系统启动完成 ($STARTUP_DELAY 秒)..."
    sleep $STARTUP_DELAY
    
    # 启动调度器
    log "正在启动GPU调度器..."
    nohup "$SCHEDULER_BIN" > /dev/null 2>&1 &
    
    # 检查启动结果
    sleep 1
    if is_scheduler_running; then
        log "GPU调度器启动成功"
        return 0
    else
        log "错误: GPU调度器启动失败"
        return 1
    fi
}

# 清理旧日志
if [ -f "$LOG_FILE" ]; then
    mv "$LOG_FILE" "$LOG_FILE.old"
fi

# 启动服务
start_scheduler
