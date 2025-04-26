#!/system/bin/sh
MODDIR=${0%/*}

# 引入日志工具库
source "$MODDIR/log_utils.sh"

# 初始化日志
log_init
log_info "post-fs-data脚本执行"

# 检查配置文件是否存在
if [ ! -f "/data/gpu_freq_table.conf" ]; then
  log_warn "未找到频率表配置文件，将在系统启动后创建默认配置"
fi

# 设置文件权限
chmod 755 "$MODDIR/gpu-scheduler"
chmod 755 "$MODDIR/action.sh"
chmod 755 "$MODDIR/log_manager.sh"
chmod 755 "$MODDIR/log_utils.sh"
chmod 755 "$MODDIR/service.sh"

log_info "post-fs-data脚本执行完成"
