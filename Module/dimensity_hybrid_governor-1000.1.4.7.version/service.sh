#!/system/bin/sh
MODDIR=${0%/*}

# 引入日志工具库
source "$MODDIR/log_utils.sh"

# 初始化日志
log_init
log_info "服务脚本开始执行，等待60秒后启动GPU调度器"

# 等待系统完全启动
sleep 60

# 检查gpu-scheduler是否存在且可执行
if [ ! -f "$MODDIR/gpu-scheduler" ] || [ ! -x "$MODDIR/gpu-scheduler" ]; then
  log_error "GPU调度器可执行文件不存在或没有执行权限"
  exit 1
fi

# 检查是否已经在运行
if pgrep -f "gpu-scheduler" > /dev/null; then
  log_warn "GPU调度器已经在运行，跳过启动"
  exit 0
fi

# 记录系统信息
log_system_info

# 启动GPU调度器并捕获其输出
log_info "正在启动GPU调度器..."
nohup "$MODDIR/gpu-scheduler" 2>&1 | while read line; do
  echo "[SCHEDULER] $(date '+%Y-%m-%d %H:%M:%S') - $line" >> "$LOG_FILE"
done &

# 等待确认启动成功
sleep 2
if pgrep -f "gpu-scheduler" > /dev/null; then
  SCHEDULER_PID=$(pgrep -f "gpu-scheduler")
  log_info "GPU调度器启动成功，PID: $SCHEDULER_PID"
else
  log_error "GPU调度器启动失败"
fi

# 定期执行日志轮转（每小时检查一次）
(
  while true; do
    sleep 3600
    log_rotate
    # 每天压缩一次旧日志（每24小时）
    if [ $((RANDOM % 24)) -eq 0 ]; then
      compress_old_logs
    fi
  done
) &