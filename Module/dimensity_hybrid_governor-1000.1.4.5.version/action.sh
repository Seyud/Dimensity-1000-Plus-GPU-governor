#!/system/bin/sh
dimensity_hybrid_switch() {
  module=/data/adb/modules/dimensity_hybrid_governor
  disable=$module/disable
  if [[ $(pidof gpu-scheduler) != '' ]]; then
    echo '' > $disable
    killall gpu-scheduler 2>/dev/null
    echo "天玑GPU混合调速器已关闭"
  else
    nohup $module/gpu-scheduler > /dev/null 2>&1 &
    rm -f $disable 2>/dev/null
    echo "天玑GPU混合调速器已启动"
  fi
}

dimensity_hybrid_switch