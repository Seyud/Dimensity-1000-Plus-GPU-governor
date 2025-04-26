MODDIR=${0%/*}

sleep 60

nohup $MODDIR/gpu-scheduler > /dev/null 2>&1 &
