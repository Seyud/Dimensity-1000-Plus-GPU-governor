# GPU调度器模块卸载脚本
# 用途：在模块卸载时清理模块创建的配置文件
# 说明：gpu_freq_table.conf 存储了GPU频率/电压表的配置信息
#      删除此文件以恢复系统默认的GPU设置

rm -rf /data/gpu_freq_table.conf
