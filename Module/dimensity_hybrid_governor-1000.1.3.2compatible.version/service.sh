MODDIR=${0%/*}

mount -t debugfs none /sys/kernel/debug
sleep 60

ged_kpi=/sys/module/sspm_v3/holders/ged/parameters/is_GED_KPI_enabled
if [[ ! -f /cache/is_GED_KPI_enabled ]]; then
  echo '0' > /cache/is_GED_KPI_enabled
  chattr +i /cache/is_GED_KPI_enabled
fi
mount  --bind /cache/is_GED_KPI_enabled $ged_kpi

nohup $MODDIR/gpu-scheduler > /dev/null 2>&1 &
