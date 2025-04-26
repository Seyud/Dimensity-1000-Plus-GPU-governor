/**
 * GPU配置页面模块
 * 用于查看和编辑GPU调速器配置文件
 */

const GpuConfigPage = {
    // 配置文件路径
    configPath: '/data/gpu_freq_table.conf',

    // 配置文件内容
    configContent: '',

    // 原始配置内容（用于检测更改）
    originalContent: '',

    // 频率和电压列表
    freqList: [],
    voltList: [],

    // 初始化
    async init() {
        try {
            // 加载配置文件内容
            await this.loadConfigFile();

            // 加载频率和电压列表
            await this.loadFreqVoltLists();

            return true;
        } catch (error) {
            console.error('初始化GPU配置页面失败:', error);
            return false;
        }
    },

    // 渲染页面
    render() {
        // 设置页面标题
        document.getElementById('page-title').textContent = I18n.translate('NAV_GPU_CONFIG', 'GPU配置');

        // 设置页面操作按钮
        const pageActions = document.getElementById('page-actions');
        pageActions.innerHTML = `
            <button id="refresh-config" class="icon-button" title="${I18n.translate('REFRESH', '刷新')}">
                <span class="material-symbols-rounded">refresh</span>
            </button>
            <button id="save-config" class="icon-button" title="${I18n.translate('SAVE', '保存')}">
                <span class="material-symbols-rounded">save</span>
            </button>
        `;

        return `
            <div class="gpu-config-page">
                <div class="card">
                    <div class="card-header">
                        <h2 data-i18n="GPU_CONFIG_TITLE">GPU调速器配置</h2>
                    </div>
                    <div class="card-content">
                        <div class="config-description">
                            <p data-i18n="GPU_CONFIG_DESC">配置文件位于 ${this.configPath}，修改后需要保存并重启调速器才能生效。</p>
                        </div>

                        <div class="config-editor-container">
                            <div class="config-editor-header">
                                <span data-i18n="CONFIG_EDITOR">配置编辑器</span>
                            </div>
                            <textarea id="config-editor" class="config-editor" rows="15">${this.configContent}</textarea>
                        </div>

                        <div class="config-help">
                            <div class="config-help-header">
                                <span data-i18n="CONFIG_HELP">配置帮助</span>
                            </div>
                            <div class="config-help-content">
                                <h3 data-i18n="CONFIG_FORMAT">配置格式</h3>
                                <p data-i18n="CONFIG_FORMAT_DESC">每行一个配置项，格式为：Freq Volt DDR_OPP</p>

                                <h3 data-i18n="FREQ_LIST">可用频率列表</h3>
                                <div class="freq-list">${this.renderFreqList()}</div>

                                <h3 data-i18n="VOLT_LIST">可用电压列表</h3>
                                <div class="volt-list">${this.renderVoltList()}</div>

                                <h3 data-i18n="DDR_OPP_LIST">DDR_OPP值说明</h3>
                                <ul>
                                    <li>999 : 自动</li>
                                    <li>0 : 固定 725000uv 3733000KHz</li>
                                    <li>1 : 固定 725000uv 3200000KHz</li>
                                    <li>2 : 固定 650000uv 3200000KHz</li>
                                    <li>3 : 固定 650000uv 2400000KHz</li>
                                    <li>4 : 固定 600000uv 2400000KHz</li>
                                </ul>
                                <p data-i18n="DDR_OPP_NOTE">降低/限制内存频率能略微降低功耗，但GPU性能会严重受损</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h2 data-i18n="GPU_CONTROL_TITLE">GPU调速器控制</h2>
                    </div>
                    <div class="card-content">
                        <div class="gpu-control-buttons">
                            <button id="start-gpu" class="button primary">
                                <span class="material-symbols-rounded">play_arrow</span>
                                <span data-i18n="START_GPU">启动调速器</span>
                            </button>
                            <button id="stop-gpu" class="button danger">
                                <span class="material-symbols-rounded">stop</span>
                                <span data-i18n="STOP_GPU">停止调速器</span>
                            </button>
                            <button id="restart-gpu" class="button secondary">
                                <span class="material-symbols-rounded">restart_alt</span>
                                <span data-i18n="RESTART_GPU">重启调速器</span>
                            </button>
                        </div>
                        <div id="gpu-status" class="gpu-status">
                            <span data-i18n="GPU_STATUS">状态</span>: <span id="gpu-status-value">加载中...</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // 渲染频率列表
    renderFreqList() {
        if (!this.freqList || this.freqList.length === 0) {
            return '<p data-i18n="NO_FREQ_LIST">无法获取频率列表</p>';
        }

        return `<div class="chip-container">
            ${this.freqList.map(freq => `<div class="chip">${freq}</div>`).join('')}
        </div>`;
    },

    // 渲染电压列表
    renderVoltList() {
        if (!this.voltList || this.voltList.length === 0) {
            return '<p data-i18n="NO_VOLT_LIST">无法获取电压列表</p>';
        }

        return `<div class="chip-container">
            ${this.voltList.map(volt => `<div class="chip">${volt}</div>`).join('')}
        </div>`;
    },

    // 加载配置文件
    async loadConfigFile() {
        try {
            // 检查配置文件是否存在
            const fileExists = await Core.execCommand(`[ -f "${this.configPath}" ] && echo "true" || echo "false"`);

            if (fileExists.trim() === 'true') {
                // 读取配置文件内容
                this.configContent = await Core.execCommand(`cat "${this.configPath}"`);
                this.originalContent = this.configContent;
            } else {
                // 配置文件不存在，使用默认配置
                this.configContent = this.getDefaultConfig();
                this.originalContent = this.configContent;
            }
        } catch (error) {
            console.error('加载配置文件失败:', error);
            this.configContent = this.getDefaultConfig();
            this.originalContent = this.configContent;
        }
    },

    // 加载频率和电压列表
    async loadFreqVoltLists() {
        try {
            // 获取频率列表
            const freqListResult = await Core.execCommand(`
                if [ -f /proc/gpufreq/gpufreq_opp_dump ]; then
                    cat /proc/gpufreq/gpufreq_opp_dump | awk '{print $4}' | cut -f1 -d ','
                else
                    echo "218000 280000 350000 431000 471000 532000 573000 634000 685000 755000 853000"
                fi
            `);

            this.freqList = freqListResult.trim().split(/\s+/);

            // 获取电压列表
            const voltListResult = await Core.execCommand(`
                echo "65000 64375 63750 63125 62500 61875 61250 60625 60000 59375 58750 58125 57500 56875 56250 55625 55000 54375 53750 53125 52500 51875 51250 50625 50000 49375 48750 48125 47500 46875 46250 45625 45000 44375 43750 43125 42500 41875"
            `);

            this.voltList = voltListResult.trim().split(/\s+/);
        } catch (error) {
            console.error('加载频率和电压列表失败:', error);
            // 使用默认值
            this.freqList = ["218000", "280000", "350000", "431000", "471000", "532000", "573000", "634000", "685000", "755000", "853000"];
            this.voltList = ["65000", "64375", "63750", "63125", "62500", "61875", "61250", "60625", "60000", "59375", "58750", "58125", "57500", "56875", "56250", "55625", "55000", "54375", "53750", "53125", "52500", "51875", "51250", "50625", "50000", "49375", "48750", "48125", "47500", "46875", "46250", "45625", "45000", "44375", "43750", "43125", "42500", "41875"];
        }
    },

    // 获取默认配置
    getDefaultConfig() {
        return `# GPU频率/电压配置文件
# 格式: Freq Volt DDR_OPP
# DDR_OPP 用于固定内存频率，常用值：
# 999 : 自动
# 0 : 固定 725000uv 3733000KHz
# 1 : 固定 725000uv 3200000KHz
# 2 : 固定 650000uv 3200000KHz
# 3 : 固定 650000uv 2400000KHz
# 4 : 固定 600000uv 2400000KHz

# 配置项：调速模式
# 可配置为 hybrid simple , 默认 hybrid
# simple 仅使用gpu_freq_table.conf中定义的频率
# hybrid 在性能需求较低时暂停辅助调速器以降低功耗
governor=hybrid

# 配置项：余量(%) 或 余量(MHz)
# 可配置为 0~100 代表GPU空闲比例，数值越大升频越激进
# 或配置为0MHz~800MHz 代表以MHz为单位的固定性能余量
margin=7

# 以下为频率/电压表配置内容
# 请务必将频率/电压值以从低到高的顺序配置
218000 43750 999
280000 46875 999
350000 50000 999
431000 53125 999
471000 55000 999
532000 56875 999
573000 58125 999
634000 59375 999
685000 60000 999
755000 60625 0
847000 61250 0`;
    },

    // 保存配置文件
    async saveConfigFile() {
        try {
            // 获取编辑器内容
            const editor = document.getElementById('config-editor');
            const newContent = editor.value;

            // 检查是否有更改
            if (newContent === this.originalContent) {
                Core.showToast(I18n.translate('NO_CHANGES', '没有更改需要保存'));
                return;
            }

            // 保存配置文件
            await Core.execCommand(`echo '${newContent.replace(/'/g, "'\\''")}' > "${this.configPath}"`);

            // 更新原始内容
            this.originalContent = newContent;

            Core.showToast(I18n.translate('CONFIG_SAVED', '配置已保存'));

            // 询问是否重启调速器
            if (confirm(I18n.translate('RESTART_GPU_CONFIRM', '配置已保存，是否需要重启调速器使配置生效？'))) {
                await this.restartGpu();
            }
        } catch (error) {
            console.error('保存配置文件失败:', error);
            Core.showToast(I18n.translate('CONFIG_SAVE_ERROR', '保存配置文件失败'), 'error');
        }
    },

    // 刷新配置文件
    async refreshConfig() {
        try {
            // 检查是否有未保存的更改
            const editor = document.getElementById('config-editor');
            if (editor && editor.value !== this.originalContent) {
                if (!confirm(I18n.translate('DISCARD_CHANGES', '有未保存的更改，确定要放弃吗？'))) {
                    return;
                }
            }

            // 重新加载配置文件
            await this.loadConfigFile();

            // 更新编辑器内容
            if (editor) {
                editor.value = this.configContent;
            }

            Core.showToast(I18n.translate('CONFIG_REFRESHED', '配置已刷新'));
        } catch (error) {
            console.error('刷新配置文件失败:', error);
            Core.showToast(I18n.translate('CONFIG_REFRESH_ERROR', '刷新配置文件失败'), 'error');
        }
    },

    // 获取GPU调速器状态
    async getGpuStatus() {
        try {
            // 直接检查进程是否运行
            const processRunning = await Core.execCommand(`pidof gpu-scheduler >/dev/null && echo "RUNNING" || echo "STOPPED"`);
            return processRunning.trim();
        } catch (error) {
            console.error('获取GPU状态失败:', error);
            return 'UNKNOWN';
        }
    },

    // 更新GPU状态显示
    async updateGpuStatus() {
        try {
            const status = await this.getGpuStatus();
            const statusElement = document.getElementById('gpu-status-value');

            if (statusElement) {
                // 清除所有状态类
                statusElement.classList.remove('status-running', 'status-stopped', 'status-error', 'status-unknown');

                // 设置状态文本和类
                switch (status) {
                    case 'RUNNING':
                        statusElement.textContent = I18n.translate('RUNNING', '运行中');
                        statusElement.classList.add('status-running');
                        break;
                    case 'STOPPED':
                        statusElement.textContent = I18n.translate('STOPPED', '已停止');
                        statusElement.classList.add('status-stopped');
                        break;
                    case 'ERROR':
                        statusElement.textContent = I18n.translate('ERROR', '错误');
                        statusElement.classList.add('status-error');
                        break;
                    default:
                        statusElement.textContent = I18n.translate('UNKNOWN', '未知');
                        statusElement.classList.add('status-unknown');
                }
            }

            // 更新按钮状态
            this.updateButtonState(status);
        } catch (error) {
            console.error('更新GPU状态失败:', error);
        }
    },

    // 更新按钮状态
    updateButtonState(status) {
        const startButton = document.getElementById('start-gpu');
        const stopButton = document.getElementById('stop-gpu');

        if (startButton && stopButton) {
            if (status === 'RUNNING') {
                startButton.disabled = true;
                stopButton.disabled = false;
            } else {
                startButton.disabled = false;
                stopButton.disabled = true;
            }
        }
    },

    // 启动GPU调速器
    async startGpu() {
        try {
            await Core.execCommand(`sh ${Core.MODULE_PATH}action.sh`);
            Core.showToast(I18n.translate('GPU_STARTED', 'GPU调速器已启动'));
            await this.updateGpuStatus();
        } catch (error) {
            console.error('启动GPU调速器失败:', error);
            Core.showToast(I18n.translate('GPU_START_ERROR', '启动GPU调速器失败'), 'error');
        }
    },

    // 停止GPU调速器
    async stopGpu() {
        try {
            await Core.execCommand(`sh ${Core.MODULE_PATH}action.sh`);
            Core.showToast(I18n.translate('GPU_STOPPED', 'GPU调速器已停止'));
            await this.updateGpuStatus();
        } catch (error) {
            console.error('停止GPU调速器失败:', error);
            Core.showToast(I18n.translate('GPU_STOP_ERROR', '停止GPU调速器失败'), 'error');
        }
    },

    // 重启GPU调速器
    async restartGpu() {
        try {
            // 先停止再启动
            await Core.execCommand(`sh ${Core.MODULE_PATH}action.sh`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await Core.execCommand(`sh ${Core.MODULE_PATH}action.sh`);

            Core.showToast(I18n.translate('GPU_RESTARTED', 'GPU调速器已重启'));
            await this.updateGpuStatus();
        } catch (error) {
            console.error('重启GPU调速器失败:', error);
            Core.showToast(I18n.translate('GPU_RESTART_ERROR', '重启GPU调速器失败'), 'error');
        }
    },

    // 渲染后的回调
    afterRender() {
        // 绑定按钮事件
        const refreshButton = document.getElementById('refresh-config');
        const saveButton = document.getElementById('save-config');
        const startButton = document.getElementById('start-gpu');
        const stopButton = document.getElementById('stop-gpu');
        const restartButton = document.getElementById('restart-gpu');

        if (refreshButton) {
            refreshButton.addEventListener('click', () => this.refreshConfig());
        }

        if (saveButton) {
            saveButton.addEventListener('click', () => this.saveConfigFile());
        }

        if (startButton) {
            startButton.addEventListener('click', () => this.startGpu());
        }

        if (stopButton) {
            stopButton.addEventListener('click', () => this.stopGpu());
        }

        if (restartButton) {
            restartButton.addEventListener('click', () => this.restartGpu());
        }

        // 更新编辑器内容
        const editor = document.getElementById('config-editor');
        if (editor) {
            editor.value = this.configContent;
        }

        // 更新GPU状态
        this.updateGpuStatus();

        // 设置定时刷新状态
        this.statusTimer = setInterval(() => this.updateGpuStatus(), 5000);
    },

    // 页面激活时的回调
    onActivate() {
        console.log('GPU配置页面已激活');
        // 刷新GPU状态
        this.updateGpuStatus();

        // 启动状态刷新定时器
        if (!this.statusTimer) {
            this.statusTimer = setInterval(() => this.updateGpuStatus(), 5000);
        }
    },

    // 页面停用时的回调
    onDeactivate() {
        console.log('GPU配置页面已停用');
        // 清除状态刷新定时器
        if (this.statusTimer) {
            clearInterval(this.statusTimer);
            this.statusTimer = null;
        }
    }
};

// 导出GPU配置页面模块
window.GpuConfigPage = GpuConfigPage;
