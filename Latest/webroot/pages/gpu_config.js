/**
 * GPU配置页面模块
 * 用于查看和编辑GPU调速器配置文件
 * 支持卡片选择和文本编辑两种配置方式
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

    // 当前配置模式：card(卡片) 或 text(文本)
    configMode: 'card',

    // 解析后的配置项
    parsedConfig: {
        governor: 'hybrid',
        margin: '7',
        marginType: 'percent', // 'percent' 或 'mhz'
        freqVoltTable: []
    },

    // DDR_OPP选项
    ddrOppOptions: [
        { value: '999', label: '自动' },
        { value: '0', label: '725000uv 3733000KHz' },
        { value: '1', label: '725000uv 3200000KHz' },
        { value: '2', label: '650000uv 3200000KHz' },
        { value: '3', label: '650000uv 2400000KHz' },
        { value: '4', label: '600000uv 2400000KHz' }
    ],

    // 调速模式选项
    governorOptions: [
        { value: 'hybrid', label: '混合模式' },
        { value: 'simple', label: '简单模式' }
    ],

    // 初始化
    async init() {
        try {
            // 加载配置文件内容
            await this.loadConfigFile();

            // 加载频率和电压列表
            await this.loadFreqVoltLists();

            // 解析配置文件
            this.parseConfigFile();

            return true;
        } catch (error) {
            console.error('初始化GPU配置页面失败:', error);
            return false;
        }
    },

    // 解析配置文件内容
    parseConfigFile() {
        try {
            // 重置解析结果
            this.parsedConfig = {
                governor: 'hybrid',
                margin: '7',
                marginType: 'percent',
                freqVoltTable: []
            };

            // 按行解析配置文件
            const lines = this.configContent.split('\n');

            for (const line of lines) {
                // 跳过空行和注释行
                if (!line.trim() || line.trim().startsWith('#')) {
                    continue;
                }

                // 解析governor配置
                if (line.includes('governor=')) {
                    const match = line.match(/governor=(\w+)/);
                    if (match && match[1]) {
                        this.parsedConfig.governor = match[1];
                    }
                    continue;
                }

                // 解析margin配置
                if (line.includes('margin=')) {
                    // 检查是否包含MHz单位
                    if (line.includes('MHz')) {
                        const match = line.match(/margin=(\d+)MHz/);
                        if (match && match[1]) {
                            this.parsedConfig.margin = match[1];
                            this.parsedConfig.marginType = 'mhz';
                        }
                    } else {
                        // 不包含MHz单位，视为百分比
                        const match = line.match(/margin=(\d+)/);
                        if (match && match[1]) {
                            this.parsedConfig.margin = match[1];
                            this.parsedConfig.marginType = 'percent';
                        }
                    }
                    continue;
                }

                // 解析频率/电压/DDR_OPP配置行
                const parts = line.trim().split(/\s+/);
                if (parts.length >= 3 && /^\d+$/.test(parts[0]) && /^\d+$/.test(parts[1])) {
                    this.parsedConfig.freqVoltTable.push({
                        freq: parts[0],
                        volt: parts[1],
                        ddrOpp: parts[2] || '999'
                    });
                }
            }

            // 按频率排序
            this.parsedConfig.freqVoltTable.sort((a, b) => parseInt(a.freq) - parseInt(b.freq));

            console.log('解析配置文件成功:', this.parsedConfig);
        } catch (error) {
            console.error('解析配置文件失败:', error);
        }
    },

    // 从卡片界面生成配置文件内容
    generateConfigFromCards() {
        try {
            // 生成配置文件头部注释
            let config = `# GPU频率/电压配置文件
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
governor=${this.parsedConfig.governor}

# 配置项：余量(%) 或 余量(MHz)
# 可配置为 0~100 代表GPU空闲比例，数值越大升频越激进
# 或配置为0MHz~800MHz 代表以MHz为单位的固定性能余量
margin=${this.parsedConfig.margin}${this.parsedConfig.marginType === 'mhz' ? 'MHz' : ''}

# 以下为频率/电压表配置内容
# 请务必将频率/电压值以从低到高的顺序配置`;

            // 添加频率/电压/DDR_OPP配置行
            for (const row of this.parsedConfig.freqVoltTable) {
                config += `\n${row.freq} ${row.volt} ${row.ddrOpp}`;
            }

            return config;
        } catch (error) {
            console.error('生成配置文件内容失败:', error);
            return this.getDefaultConfig();
        }
    },

    // 更新卡片选择状态
    updateCardSelection() {
        try {
            // 更新调速模式选择
            document.querySelectorAll('.governor-card').forEach(card => {
                const value = card.dataset.value;
                if (value === this.parsedConfig.governor) {
                    card.classList.add('selected');
                } else {
                    card.classList.remove('selected');
                }
            });

            // 更新频率/电压/DDR_OPP表格
            const tableBody = document.getElementById('freq-volt-table-body');
            if (tableBody) {
                tableBody.innerHTML = '';

                this.parsedConfig.freqVoltTable.forEach((row, index) => {
                    const tr = document.createElement('tr');

                    // 频率单元格
                    const freqTd = document.createElement('td');
                    const freqInput = document.createElement('input');
                    freqInput.type = 'number';
                    freqInput.className = 'freq-input';
                    freqInput.dataset.index = index;
                    freqInput.min = 218000;
                    freqInput.max = 853000;
                    freqInput.step = 1000; // 设置步进值为1000
                    freqInput.value = row.freq;
                    freqInput.placeholder = '218000-853000';

                    // 添加输入验证和事件处理
                    freqInput.addEventListener('change', (e) => {
                        const idx = parseInt(e.target.dataset.index);
                        let value = parseInt(e.target.value);

                        // 验证输入范围
                        if (isNaN(value)) value = 218000;
                        if (value < 218000) value = 218000;
                        if (value > 853000) value = 853000;

                        // 确保值是1000的倍数
                        value = Math.round(value / 1000) * 1000;

                        e.target.value = value;
                        this.parsedConfig.freqVoltTable[idx].freq = value.toString();
                        this.updateConfigEditor();
                    });

                    // 添加单位标签
                    const freqUnit = document.createElement('span');
                    freqUnit.className = 'input-unit';
                    freqUnit.textContent = 'KHz';

                    const freqInputContainer = document.createElement('div');
                    freqInputContainer.className = 'input-container';
                    freqInputContainer.appendChild(freqInput);
                    freqInputContainer.appendChild(freqUnit);

                    freqTd.appendChild(freqInputContainer);
                    tr.appendChild(freqTd);

                    // 电压单元格
                    const voltTd = document.createElement('td');
                    const voltSelect = document.createElement('select');
                    voltSelect.className = 'volt-select';
                    voltSelect.dataset.index = index;

                    this.voltList.forEach(volt => {
                        const option = document.createElement('option');
                        option.value = volt;
                        option.textContent = `${volt} μV`;
                        option.selected = volt === row.volt;
                        voltSelect.appendChild(option);
                    });

                    voltSelect.addEventListener('change', (e) => {
                        const idx = parseInt(e.target.dataset.index);
                        this.parsedConfig.freqVoltTable[idx].volt = e.target.value;
                        this.updateConfigEditor();
                    });

                    voltTd.appendChild(voltSelect);
                    tr.appendChild(voltTd);

                    // DDR_OPP单元格
                    const ddrTd = document.createElement('td');
                    const ddrSelect = document.createElement('select');
                    ddrSelect.className = 'ddr-select';
                    ddrSelect.dataset.index = index;

                    this.ddrOppOptions.forEach(option => {
                        const opt = document.createElement('option');
                        opt.value = option.value;
                        opt.textContent = option.label;
                        opt.selected = option.value === row.ddrOpp;
                        ddrSelect.appendChild(opt);
                    });

                    ddrSelect.addEventListener('change', (e) => {
                        const idx = parseInt(e.target.dataset.index);
                        this.parsedConfig.freqVoltTable[idx].ddrOpp = e.target.value;
                        this.updateConfigEditor();
                    });

                    ddrTd.appendChild(ddrSelect);
                    tr.appendChild(ddrTd);

                    // 操作单元格
                    const actionTd = document.createElement('td');
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'icon-button small';
                    deleteBtn.innerHTML = '<span class="material-symbols-rounded">delete</span>';
                    deleteBtn.dataset.index = index;

                    deleteBtn.addEventListener('click', (e) => {
                        const idx = parseInt(e.target.closest('button').dataset.index);
                        this.parsedConfig.freqVoltTable.splice(idx, 1);
                        this.updateCardSelection();
                        this.updateConfigEditor();
                    });

                    actionTd.appendChild(deleteBtn);
                    tr.appendChild(actionTd);

                    tableBody.appendChild(tr);
                });
            }

            // 更新余量设置
            const marginInput = document.getElementById('margin-input');
            if (marginInput) {
                marginInput.value = this.parsedConfig.margin;
            }
        } catch (error) {
            console.error('更新卡片选择状态失败:', error);
        }
    },

    // 更新配置编辑器内容
    updateConfigEditor() {
        try {
            const editor = document.getElementById('config-editor');
            if (editor) {
                // 从卡片界面生成配置文件内容
                const newConfig = this.generateConfigFromCards();

                // 更新编辑器内容
                editor.value = newConfig;

                // 更新配置内容变量
                this.configContent = newConfig;
            }
        } catch (error) {
            console.error('更新配置编辑器内容失败:', error);
        }
    },

    // 从编辑器更新卡片界面
    updateCardsFromEditor() {
        try {
            // 解析配置文件
            this.parseConfigFile();

            // 更新卡片选择状态
            this.updateCardSelection();
        } catch (error) {
            console.error('从编辑器更新卡片界面失败:', error);
        }
    },

    // 添加新的频率/电压/DDR_OPP配置行
    addFreqVoltRow() {
        try {
            // 获取最后一行的配置或使用默认值
            let lastFreq = '218000';
            let lastVolt = '43750';
            let lastDdrOpp = '999';

            if (this.parsedConfig.freqVoltTable.length > 0) {
                const lastRow = this.parsedConfig.freqVoltTable[this.parsedConfig.freqVoltTable.length - 1];
                // 使用最小频率值作为默认值，而不是复制最后一行的频率
                lastVolt = lastRow.volt;
                lastDdrOpp = lastRow.ddrOpp;
            }

            // 添加新行
            this.parsedConfig.freqVoltTable.push({
                freq: lastFreq,
                volt: lastVolt,
                ddrOpp: lastDdrOpp
            });

            // 更新界面
            this.updateCardSelection();
            this.updateConfigEditor();
        } catch (error) {
            console.error('添加新的频率/电压/DDR_OPP配置行失败:', error);
        }
    },

    // 切换配置模式
    toggleConfigMode() {
        try {
            // 切换模式
            this.configMode = this.configMode === 'card' ? 'text' : 'card';

            // 更新界面
            const cardContainer = document.getElementById('card-config-container');
            const editorContainer = document.getElementById('config-editor-container');
            const modeSwitch = document.getElementById('config-mode-switch');

            if (cardContainer && editorContainer && modeSwitch) {
                if (this.configMode === 'card') {
                    cardContainer.style.display = 'block';
                    editorContainer.style.display = 'none';
                    modeSwitch.checked = false;

                    // 从编辑器更新卡片界面
                    this.updateCardsFromEditor();
                } else {
                    cardContainer.style.display = 'none';
                    editorContainer.style.display = 'block';
                    modeSwitch.checked = true;

                    // 从卡片界面更新编辑器
                    this.updateConfigEditor();
                }
            }
        } catch (error) {
            console.error('切换配置模式失败:', error);
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
                        <div class="config-mode-switch">
                            <span class="switch-label" data-i18n="CONFIG_MODE_CARD">卡片模式</span>
                            <label class="switch">
                                <input type="checkbox" id="config-mode-switch">
                                <span class="slider round"></span>
                            </label>
                            <span class="switch-label" data-i18n="CONFIG_MODE_TEXT">文本模式</span>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="config-description">
                            <p data-i18n="GPU_CONFIG_DESC">配置文件位于 ${this.configPath}，修改后需要保存并重启调速器才能生效。</p>
                        </div>

                        <!-- 卡片配置界面 -->
                        <div id="card-config-container" class="card-config-container" style="display: ${this.configMode === 'card' ? 'block' : 'none'}">
                            <!-- 调速模式选择 -->
                            <div class="config-section">
                                <div class="config-section-title" data-i18n="GOVERNOR_MODE">调速模式</div>
                                <div class="config-cards">
                                    ${this.governorOptions.map(option => `
                                        <div class="config-card governor-card ${this.parsedConfig.governor === option.value ? 'selected' : ''}" data-value="${option.value}">
                                            <div class="config-card-value">${option.value}</div>
                                            <div class="config-card-label">${option.label}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- 余量设置 -->
                            <div class="config-section">
                                <div class="config-section-title" data-i18n="MARGIN_SETTING">余量设置</div>
                                <div class="margin-setting">
                                    <div class="margin-type-selector">
                                        <div class="margin-type-label" data-i18n="MARGIN_TYPE">余量类型</div>
                                        <div class="margin-type-options">
                                            <label class="margin-type-option">
                                                <input type="radio" name="margin-type" value="percent" ${this.parsedConfig.marginType === 'percent' ? 'checked' : ''}>
                                                <span data-i18n="MARGIN_TYPE_PERCENT">百分比 (%)</span>
                                            </label>
                                            <label class="margin-type-option">
                                                <input type="radio" name="margin-type" value="mhz" ${this.parsedConfig.marginType === 'mhz' ? 'checked' : ''}>
                                                <span data-i18n="MARGIN_TYPE_MHZ">频率 (MHz)</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="input-field">
                                        <label for="margin-input" data-i18n="MARGIN_VALUE">余量值</label>
                                        <input type="number" id="margin-input"
                                            min="0"
                                            max="${this.parsedConfig.marginType === 'percent' ? '100' : '800'}"
                                            value="${this.parsedConfig.margin}">
                                        <span class="input-unit">${this.parsedConfig.marginType === 'percent' ? '%' : 'MHz'}</span>
                                    </div>
                                    <div class="margin-description">
                                        <p data-i18n="MARGIN_DESC_PERCENT" style="display: ${this.parsedConfig.marginType === 'percent' ? 'block' : 'none'}">
                                            百分比模式：0~100 代表GPU空闲比例，数值越大升频越激进
                                        </p>
                                        <p data-i18n="MARGIN_DESC_MHZ" style="display: ${this.parsedConfig.marginType === 'mhz' ? 'block' : 'none'}">
                                            频率模式：0MHz~800MHz 代表以MHz为单位的固定性能余量
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- 频率/电压表 -->
                            <div class="config-section">
                                <div class="config-section-title" data-i18n="FREQ_VOLT_TABLE">频率/电压表</div>
                                <div class="freq-volt-table-container">
                                    <table class="freq-volt-table">
                                        <thead>
                                            <tr>
                                                <th data-i18n="FREQ">频率</th>
                                                <th data-i18n="VOLT">电压</th>
                                                <th data-i18n="DDR_OPP">DDR_OPP</th>
                                                <th data-i18n="ACTION">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody id="freq-volt-table-body">
                                            <!-- 动态生成的表格行 -->
                                        </tbody>
                                    </table>
                                    <div class="table-actions">
                                        <button id="add-freq-volt-row" class="button secondary">
                                            <span class="material-symbols-rounded">add</span>
                                            <span data-i18n="ADD_ROW">添加行</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 文本编辑器界面 -->
                        <div id="config-editor-container" class="config-editor-container" style="display: ${this.configMode === 'text' ? 'block' : 'none'}">
                            <div class="config-editor-header">
                                <span data-i18n="CONFIG_EDITOR">配置编辑器</span>
                                <button id="update-from-editor" class="button small" data-i18n="UPDATE_CARDS">更新卡片</button>
                            </div>
                            <textarea id="config-editor" class="config-editor" rows="15">${this.configContent}</textarea>
                        </div>

                        <div class="config-help">
                            <div class="config-help-header">
                                <span data-i18n="CONFIG_HELP">配置帮助</span>
                            </div>
                            <div class="config-help-content">
                                <h3 data-i18n="GOVERNOR_MODE_HELP">调速模式说明</h3>
                                <ul>
                                    <li><strong>hybrid</strong>: 混合模式，在性能需求较低时暂停辅助调速器以降低功耗（默认推荐）</li>
                                    <li><strong>simple</strong>: 简单模式，仅使用gpu_freq_table.conf中定义的频率</li>
                                </ul>

                                <h3 data-i18n="MARGIN_HELP">余量设置说明</h3>
                                <ul>
                                    <li><strong>百分比模式 (%)</strong>: 0~100 代表GPU空闲比例，数值越大升频越激进</li>
                                    <li><strong>频率模式 (MHz)</strong>: 0MHz~800MHz 代表以MHz为单位的固定性能余量</li>
                                </ul>

                                <h3 data-i18n="CONFIG_FORMAT">配置格式</h3>
                                <p data-i18n="CONFIG_FORMAT_DESC">每行一个配置项，格式为：Freq Volt DDR_OPP</p>

                                <h3 data-i18n="FREQ_RANGE">频率范围</h3>
                                <p data-i18n="FREQ_RANGE_DESC">您可以输入218000到853000之间的任意频率值（单位：KHz），步进值为1000</p>

                                <h3 data-i18n="FREQ_LIST">推荐频率列表</h3>
                                <p data-i18n="FREQ_LIST_DESC">以下频率值是经过验证的稳定且有价值的频率，推荐优先使用：</p>
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
            return '<p data-i18n="NO_FREQ_LIST">无法获取推荐频率列表</p>';
        }

        return `<div class="chip-container recommended-chips">
            ${this.freqList.map(freq => `<div class="chip recommended-chip" title="点击使用此频率值" data-value="${freq}">${freq}</div>`).join('')}
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
        const addRowButton = document.getElementById('add-freq-volt-row');
        const updateFromEditorButton = document.getElementById('update-from-editor');
        const configModeSwitch = document.getElementById('config-mode-switch');

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

        if (addRowButton) {
            addRowButton.addEventListener('click', () => this.addFreqVoltRow());
        }

        if (updateFromEditorButton) {
            updateFromEditorButton.addEventListener('click', () => this.updateCardsFromEditor());
        }

        if (configModeSwitch) {
            configModeSwitch.checked = this.configMode === 'text';
            configModeSwitch.addEventListener('change', () => this.toggleConfigMode());
        }

        // 绑定调速模式卡片点击事件
        document.querySelectorAll('.governor-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const value = e.currentTarget.dataset.value;
                this.parsedConfig.governor = value;

                // 更新选中状态
                document.querySelectorAll('.governor-card').forEach(c => {
                    c.classList.remove('selected');
                });
                e.currentTarget.classList.add('selected');

                // 更新配置编辑器
                this.updateConfigEditor();
            });
        });

        // 绑定余量类型选择事件
        const marginTypeRadios = document.querySelectorAll('input[name="margin-type"]');
        if (marginTypeRadios.length > 0) {
            marginTypeRadios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    const newType = e.target.value;
                    this.parsedConfig.marginType = newType;

                    // 更新输入框最大值和单位显示
                    const marginInput = document.getElementById('margin-input');
                    const inputUnit = document.querySelector('.input-unit');
                    const percentDesc = document.querySelector('[data-i18n="MARGIN_DESC_PERCENT"]');
                    const mhzDesc = document.querySelector('[data-i18n="MARGIN_DESC_MHZ"]');

                    if (marginInput) {
                        marginInput.max = newType === 'percent' ? '100' : '800';

                        // 如果当前值超出新范围，调整为最大值
                        if (parseInt(marginInput.value) > parseInt(marginInput.max)) {
                            marginInput.value = marginInput.max;
                            this.parsedConfig.margin = marginInput.value;
                        }
                    }

                    if (inputUnit) {
                        inputUnit.textContent = newType === 'percent' ? '%' : 'MHz';
                    }

                    if (percentDesc && mhzDesc) {
                        percentDesc.style.display = newType === 'percent' ? 'block' : 'none';
                        mhzDesc.style.display = newType === 'mhz' ? 'block' : 'none';
                    }

                    // 更新配置编辑器
                    this.updateConfigEditor();
                });
            });
        }

        // 绑定余量输入框事件
        const marginInput = document.getElementById('margin-input');
        if (marginInput) {
            marginInput.addEventListener('change', (e) => {
                // 确保值在有效范围内
                const max = this.parsedConfig.marginType === 'percent' ? 100 : 800;
                let value = parseInt(e.target.value);

                if (isNaN(value)) value = 0;
                if (value < 0) value = 0;
                if (value > max) value = max;

                e.target.value = value;
                this.parsedConfig.margin = value.toString();
                this.updateConfigEditor();
            });
        }

        // 更新编辑器内容
        const editor = document.getElementById('config-editor');
        if (editor) {
            editor.value = this.configContent;

            // 监听编辑器内容变化
            editor.addEventListener('input', () => {
                this.configContent = editor.value;
            });
        }

        // 更新卡片选择状态
        this.updateCardSelection();

        // 绑定推荐频率点击事件
        document.querySelectorAll('.recommended-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const freqValue = e.currentTarget.dataset.value;

                // 查找当前活动的频率输入框
                const activeRow = document.querySelector('.freq-volt-table tr:focus-within');
                if (activeRow) {
                    const freqInput = activeRow.querySelector('.freq-input');
                    if (freqInput) {
                        freqInput.value = freqValue;
                        // 触发change事件以更新配置
                        const event = new Event('change', { bubbles: true });
                        freqInput.dispatchEvent(event);

                        // 显示提示
                        Core.showToast(I18n.translate('FREQ_APPLIED', freqValue));
                    }
                } else {
                    // 如果没有选中的行，提示用户
                    Core.showToast(I18n.translate('SELECT_ROW_FIRST', '请先选择一行再点击推荐频率'), 'info');
                }
            });
        });

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
