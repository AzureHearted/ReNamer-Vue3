/**
 * 同步读取 Quicker 中的变量值
 * @param {string} variableName - Quicker 中的变量名称（必须是字符串类型）
 * @returns {any} - 从 Quicker 中读取的返回值
 */
function getQuickerVariableSync(variableName) {
	return $quickerSync.getVar(variableName);
}

/**
 * 同步更新 Quicker 中的变量值
 * @param {string} variableName - Quicker 中的变量名称（必须是字符串类型）
 * @param {any} value - 要设置的变量值（支持常见数据类型）
 */
function setQuickerVariableSync(variableName, value) {
	$quickerSync.setVar(variableName, value);
}

/**
 * 异步读取 Quicker 中的变量值
 * @param {string} variableName - Quicker 中的变量名称（必须是字符串类型）
 * @returns {Promise<any>} - 从 Quicker 中读取的返回值
 */
async function getQuickerVariableAsync(variableName) {
	// 获取 Quicker 对象
	const quicker = await $quicker;
	return await quicker.getVar(variableName);
}

/**
 * 异步更新 Quicker 中的变量值
 * @param {string} variableName - Quicker 中的变量名称（必须是字符串类型）
 * @param {any} value - 要设置的变量值（支持常见数据类型）
 */
async function setQuickerVariableAsync(variableName, value) {
	// 获取 Quicker 对象
	const quicker = await $quicker;
	await quicker.setVar(variableName, value);
}
