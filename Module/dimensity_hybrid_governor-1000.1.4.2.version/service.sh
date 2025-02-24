#!/system/bin/sh

MODDIR=${0%/*}
LOG_FILE="$MODDIR/gpu_governor.log"

log_info() {
  echo "[INFO] $(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

log_error() {
  echo "[ERROR] $(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# 优化: 添加错误处理
# 确保日志目录存在且有正确权限
ensure_log_dir() {
  mkdir -p "$MODDIR"
  chmod 0755 "$MODDIR"
  touch "$LOG_FILE"
  chmod 0644 "$LOG_FILE"
}

start_scheduler() {
  local max_retries=3
  local retry_count=0
  
  # 确保日志目录和文件存在
  ensure_log_dir
  
  log_info "开始启动GPU调度器"
  
  while [ $retry_count -lt $max_retries ]; do
    sleep 60
    if nohup $MODDIR/gpu-scheduler > /dev/null 2>&1 &; then
      log_info "GPU调度器启动成功" || echo "日志写入失败"
      return 0
    fi
    retry_count=$((retry_count + 1))
    log_error "GPU调度器启动失败，重试次数: $retry_count"
    sleep 5
  done
  
  log_error "GPU调度器启动失败，已达到最大重试次数"
  return 1
}

start_scheduler
