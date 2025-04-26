#!/system/bin/sh
# log_utils.sh - 统一的日志工具库

LOG_FILE="/data/adb/modules/dimensity_hybrid_governor/gpu_governor.log"
MAX_LOG_SIZE=1048576  # 1MB

# 日志级别
LOG_LEVEL_DEBUG=0
LOG_LEVEL_INFO=1
LOG_LEVEL_WARN=2
LOG_LEVEL_ERROR=3
CURRENT_LOG_LEVEL=$LOG_LEVEL_INFO  # 默认日志级别

# 初始化日志
log_init() {
  # 检查并执行日志轮转
  log_rotate
  
  # 创建新日志文件
  if [ ! -f "$LOG_FILE" ]; then
    touch "$LOG_FILE"
    echo "=== GPU Governor Log $(date '+%Y-%m-%d %H:%M:%S') ===" > "$LOG_FILE"
  fi
}

# 记录调试日志
log_debug() {
  [ $CURRENT_LOG_LEVEL -le $LOG_LEVEL_DEBUG ] && \
    echo "[DEBUG] $(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# 记录信息日志
log_info() {
  [ $CURRENT_LOG_LEVEL -le $LOG_LEVEL_INFO ] && \
    echo "[INFO] $(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# 记录警告日志
log_warn() {
  [ $CURRENT_LOG_LEVEL -le $LOG_LEVEL_WARN ] && \
    echo "[WARN] $(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# 记录错误日志
log_error() {
  [ $CURRENT_LOG_LEVEL -le $LOG_LEVEL_ERROR ] && \
    echo "[ERROR] $(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# 日志轮转
log_rotate() {
  # 兼容不同系统的文件大小获取方式
  if [ -f "$LOG_FILE" ]; then
    local file_size=$(stat -c %s "$LOG_FILE" 2>/dev/null || stat -f %z "$LOG_FILE" 2>/dev/null || wc -c < "$LOG_FILE")
    
    if [ "$file_size" -gt $MAX_LOG_SIZE ]; then
      # 保留多个历史日志
      [ -f "${LOG_FILE}.3" ] && rm -f "${LOG_FILE}.3"
      [ -f "${LOG_FILE}.2" ] && mv "${LOG_FILE}.2" "${LOG_FILE}.3"
      [ -f "${LOG_FILE}.1" ] && mv "${LOG_FILE}.1" "${LOG_FILE}.2"
      [ -f "${LOG_FILE}.old" ] && mv "${LOG_FILE}.old" "${LOG_FILE}.1"
      mv "$LOG_FILE" "${LOG_FILE}.old"
      touch "$LOG_FILE"
      echo "=== GPU Governor Log $(date '+%Y-%m-%d %H:%M:%S') === (Rotated)" > "$LOG_FILE"
      log_info "日志已轮转，旧日志已保存为 ${LOG_FILE}.old"
    fi
  fi
}

# 压缩旧日志
compress_old_logs() {
  for old_log in "${LOG_FILE}."[1-3] "${LOG_FILE}.old"; do
    if [ -f "$old_log" ] && [ ! -f "${old_log}.gz" ]; then
      gzip -9 "$old_log" 2>/dev/null || log_warn "无法压缩日志: $old_log"
    fi
  done
}

# 设置日志级别
set_log_level() {
  case "$1" in
    "debug") CURRENT_LOG_LEVEL=$LOG_LEVEL_DEBUG; log_info "日志级别设置为: DEBUG" ;;
    "info")  CURRENT_LOG_LEVEL=$LOG_LEVEL_INFO; log_info "日志级别设置为: INFO" ;;
    "warn")  CURRENT_LOG_LEVEL=$LOG_LEVEL_WARN; log_info "日志级别设置为: WARN" ;;
    "error") CURRENT_LOG_LEVEL=$LOG_LEVEL_ERROR; log_info "日志级别设置为: ERROR" ;;
    *)       log_warn "未知日志级别: $1, 使用默认级别 (INFO)" ;;
  esac
}

# 记录系统信息
log_system_info() {
  log_info "===== 系统信息 ====="
  log_info "设备型号: $(getprop ro.product.model)"
  log_info "Android版本: $(getprop ro.build.version.release)"
  log_info "内核版本: $(uname -r)"
  log_info "SOC型号: $(getprop ro.hardware)"
  log_info "===================="
}
