#!/system/bin/sh

# 动态获取模块目录路径
MODDIR=${0%/*}
source "$MODDIR/log_utils.sh"

# 初始化日志
log_init

dimensity_hybrid_switch() {
  disable=$MODDIR/disable
  if [[ $(pidof gpu-scheduler) != '' ]]; then
    log_info "用户手动关闭GPU调度器"
    echo '' > $disable
    killall gpu-scheduler 2>/dev/null
    echo "天玑GPU混合调速器已关闭"
  else
    log_info "用户手动启动GPU调度器"
    nohup $MODDIR/gpu-scheduler 2>&1 | while read line; do
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

# 显示当前状态
show_status() {
  if pgrep -f "gpu-scheduler" > /dev/null; then
    PID=$(pgrep -f "gpu-scheduler")
    RUNTIME=$(ps -o etime= -p $PID)
    echo "GPU调度器状态: 运行中"
    echo "进程ID: $PID"
    echo "运行时间: $RUNTIME"
  else
    echo "GPU调度器状态: 未运行"
  fi
}

# 显示交互式菜单
show_menu() {
  clear
  echo "===== 天玑GPU混合调速器控制面板 ====="
  echo ""
  show_status
  echo ""
  echo "请选择操作:"
  echo "1. 切换GPU调度器开关状态"
  echo "2. 查看日志"
  echo "3. 日志管理"
  echo "4. 退出"
  echo ""
  echo -n "请输入选项 [1-4]: "
  read choice

  case "$choice" in
    1) dimensity_hybrid_switch; echo ""; echo "按回车键返回主菜单..."; read dummy; show_menu ;;
    2)
      if [ -f "$LOG_FILE" ]; then
        echo "显示最后20行日志:"
        tail -n 20 "$LOG_FILE"
      else
        echo "日志文件不存在"
      fi
      echo ""; echo "按回车键返回主菜单..."; read dummy; show_menu
      ;;
    3)
      echo ""
      "$MODDIR/log_manager.sh" help
      echo ""
      echo "请输入日志管理命令 (例如: view, tail, clear): "
      read log_cmd
      if [ -n "$log_cmd" ]; then
        "$MODDIR/log_manager.sh" $log_cmd
      fi
      echo ""; echo "按回车键返回主菜单..."; read dummy; show_menu
      ;;
    4) echo "退出控制面板"; exit 0 ;;
    *) echo "无效选项"; sleep 2; show_menu ;;
  esac
}

# 主函数
main() {
  # 记录脚本启动信息
  log_info "用户启动了控制脚本"

  case "$1" in
    "switch")
      dimensity_hybrid_switch
      ;;
    "status")
      show_status
      ;;
    "log")
      shift
      "$MODDIR/log_manager.sh" "$@"
      ;;
    "help")
      show_usage
      ;;
    "")
      # 无参数时显示交互式菜单
      show_menu
      ;;
    *)
      echo "未知选项: $1"
      show_usage
      exit 1
      ;;
  esac
}

# 执行主函数
main "$@"
