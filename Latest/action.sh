#!/system/bin/sh

module=/data/adb/modules/dimensity_hybrid_governor
source "$module/log_utils.sh"

dimensity_hybrid_switch() {
  disable=$module/disable
  if [[ $(pidof gpu-scheduler) != '' ]]; then
    log_info "用户手动关闭GPU调度器"
    echo '' > $disable
    killall gpu-scheduler 2>/dev/null
    echo "天玑GPU混合调速器已关闭"
  else
    log_info "用户手动启动GPU调度器"
    nohup $module/gpu-scheduler 2>&1 | while read line; do
      echo "[SCHEDULER] $(date '+%Y-%m-%d %H:%M:%S') - $line" >> "$LOG_FILE"
    done &
    rm -f $disable 2>/dev/null
    echo "天玑GPU混合调速器已启动"
    
    # 等待确认启动成功
    sleep 2
    if pgrep -f "gpu-scheduler" > /dev/null; then
      SCHEDULER_PID=$(pgrep -f "gpu-scheduler")
      log_info "GPU调度器启动成功，PID: $SCHEDULER_PID"
    else
      log_error "GPU调度器启动失败"
    fi
  fi
}

# 显示用法
show_usage() {
  echo "天玑GPU混合调速器控制工具"
  echo "用法: $0 [选项]"
  echo "选项:"
  echo "  switch    - 切换GPU调度器开关状态"
  echo "  status    - 显示GPU调度器状态"
  echo "  log       - 查看日志管理工具的用法"
  echo "  help      - 显示此帮助信息"
}

# 主函数
main() {
  case "$1" in
    "switch")
      dimensity_hybrid_switch
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
    "log")
      shift
      "$module/log_manager.sh" "$@"
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
}

main "$@"
