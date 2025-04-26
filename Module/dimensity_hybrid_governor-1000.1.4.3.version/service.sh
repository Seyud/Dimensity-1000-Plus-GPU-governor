MODDIR=${0%/*}
sleep 60

# 定义临时文件路径
FLAG_FILE="$MODDIR/head_done.flag"
rm -f "$FLAG_FILE"  # 清理旧文件

# 启动 GPU 调度器，处理前20行后创建标志文件
nohup "$MODDIR/gpu-scheduler" 2>&1 | {
  head -n 20 > "$MODDIR/gpu_governor.log"
  touch "$FLAG_FILE"  # 前20行处理完毕，生成标志文件
  cat > /dev/null
} &

# 等待标志文件生成（轮询检测）
while [ ! -f "$FLAG_FILE" ]; do
  sleep 0.1
done

# 此时前20行已写入日志，追加启动成功消息
echo "$(date +'%Y-%m-%d %H:%M:%S') [INFO] GPU调度器启动成功" >> "$MODDIR/gpu_governor.log"

# 可选：清理临时文件
rm -f "$FLAG_FILE"