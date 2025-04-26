#!/system/bin/sh
# log_manager.sh - GPU调度器日志管理工具

MODDIR=${0%/*}
source "$MODDIR/log_utils.sh"  # 引入日志工具库

show_usage() {
  echo "GPU调度器日志管理工具"
  echo "用法: $0 [选项]"
  echo "选项:"
  echo "  view        - 查看当前日志"
  echo "  tail [n]    - 实时查看日志更新 (默认显示最后10行)"
  echo "  clear       - 清空日志"
  echo "  rotate      - 手动轮转日志"
  echo "  compress    - 压缩旧日志"
  echo "  level LEVEL - 设置日志级别 (debug|info|warn|error)"
  echo "  status      - 显示GPU调度器状态"
  echo "  sysinfo     - 记录系统信息到日志"
  echo "  help        - 显示此帮助信息"
}

case "$1" in
  "view")
    if [ -f "$LOG_FILE" ]; then
      cat "$LOG_FILE"
    else
      echo "日志文件不存在"
    fi
    ;;
  "tail")
    if [ -f "$LOG_FILE" ]; then
      LINES=${2:-10}
      tail -n $LINES -f "$LOG_FILE"
    else
      echo "日志文件不存在"
    fi
    ;;
  "clear")
    echo "=== GPU Governor Log $(date '+%Y-%m-%d %H:%M:%S') === (Cleared)" > "$LOG_FILE"
    echo "日志已清空"
    ;;
  "rotate")
    log_rotate
    echo "日志轮转完成"
    ;;
  "compress")
    compress_old_logs
    echo "旧日志压缩完成"
    ;;
  "level")
    if [ -z "$2" ]; then
      echo "请指定日志级别: debug, info, warn, error"
    else
      set_log_level "$2"
      echo "日志级别已设置为: $2"
    fi
    ;;
  "status")
    if pgrep -f "gpu-scheduler" > /dev/null; then
      PID=$(pgrep -f "gpu-scheduler")
      RUNTIME=$(ps -o etime= -p $PID)
      echo "GPU调度器正在运行"
      echo "进程ID: $PID"
      echo "运行时间: $RUNTIME"
    else
      echo "GPU调度器未运行"
    fi
    ;;
  "sysinfo")
    log_system_info
    echo "系统信息已记录到日志"
    ;;
  "help"|"")
    show_usage
    ;;
  *)
    echo "未知选项: $1"
    show_usage
    exit 1
    ;;
esac
