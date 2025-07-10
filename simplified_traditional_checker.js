// 簡繁體字檢查工具
// 用於檢查文本中是否包含簡體字，並提供繁體字建議

const fs = require('fs');
const path = require('path');

// 讀取簡繁對照表
function loadMappings() {
    const hantFile = path.join(__dirname, 'docs', 'zh2Hant.properties');
    const hansFile = path.join(__dirname, 'docs', 'zh2Hans.properties');
    
    const simplifiedToTraditional = {};
    const traditionalToSimplified = {};
    
    try {
        // 讀取繁體字對照表 (簡體 -> 繁體)
        const hantContent = fs.readFileSync(hantFile, 'utf8');
        const hantLines = hantContent.split('\n');
        
        hantLines.forEach(line => {
            if (line.trim() && line.includes('=')) {
                const [simplified, traditional] = line.split('=');
                if (simplified && traditional) {
                    // 將Unicode編碼轉換為實際字符
                    const simpChar = simplified.replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => 
                        String.fromCharCode(parseInt(code, 16)));
                    const tradChar = traditional.replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => 
                        String.fromCharCode(parseInt(code, 16)));
                    
                    if (simpChar !== tradChar) { // 只記錄不同的字
                        simplifiedToTraditional[simpChar] = tradChar;
                    }
                }
            }
        });
        
        // 讀取簡體字對照表 (繁體 -> 簡體)
        const hansContent = fs.readFileSync(hansFile, 'utf8');
        const hansLines = hansContent.split('\n');
        
        hansLines.forEach(line => {
            if (line.trim() && line.includes('=')) {
                const [traditional, simplified] = line.split('=');
                if (traditional && simplified) {
                    // 將Unicode編碼轉換為實際字符
                    const tradChar = traditional.replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => 
                        String.fromCharCode(parseInt(code, 16)));
                    const simpChar = simplified.replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => 
                        String.fromCharCode(parseInt(code, 16)));
                    
                    if (simpChar !== tradChar) { // 只記錄不同的字
                        traditionalToSimplified[tradChar] = simpChar;
                    }
                }
            }
        });
        
    } catch (error) {
        console.error('讀取對照表文件時出錯:', error.message);
    }
    
    return { simplifiedToTraditional, traditionalToSimplified };
}

// 檢查文本中的簡體字
function checkSimplifiedCharacters(text) {
    const { simplifiedToTraditional } = loadMappings();
    const results = [];
    
    // 逐字檢查
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        // 如果這個字在簡體字對照表中，說明它是簡體字
        if (simplifiedToTraditional[char]) {
            results.push({
                position: i + 1,
                simplifiedChar: char,
                traditionalChar: simplifiedToTraditional[char],
                context: getContext(text, i)
            });
        }
    }
    
    return results;
}

// 獲取字符的上下文
function getContext(text, position, contextLength = 10) {
    const start = Math.max(0, position - contextLength);
    const end = Math.min(text.length, position + contextLength + 1);
    const before = text.substring(start, position);
    const char = text[position];
    const after = text.substring(position + 1, end);
    
    return {
        before: before,
        char: char,
        after: after,
        full: before + '[' + char + ']' + after
    };
}

// 分析文本文件
function analyzeTextFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const results = checkSimplifiedCharacters(content);
        
        console.log(`\n=== 簡體字檢查結果 ===`);
        console.log(`文件: ${filePath}`);
        console.log(`總字符數: ${content.length}`);
        console.log(`發現簡體字: ${results.length} 個\n`);
        
        if (results.length === 0) {
            console.log('✅ 未發現簡體字');
        } else {
            console.log('❌ 發現以下簡體字:\n');
            
            results.forEach((result, index) => {
                console.log(`${index + 1}. 位置 ${result.position}:`);
                console.log(`   簡體字: ${result.simplifiedChar}`);
                console.log(`   繁體字: ${result.traditionalChar}`);
                console.log(`   上下文: ${result.context.full}`);
                console.log('');
            });
        }
        
        return results;
        
    } catch (error) {
        console.error('讀取文件時出錯:', error.message);
        return [];
    }
}

// 主函數
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('使用方法:');
        console.log('node simplified_traditional_checker.js <文本文件路徑>');
        console.log('');
        console.log('例如:');
        console.log('node simplified_traditional_checker.js extracted_text.txt');
        return;
    }
    
    const filePath = args[0];
    
    if (!fs.existsSync(filePath)) {
        console.error(`文件不存在: ${filePath}`);
        return;
    }
    
    analyzeTextFile(filePath);
}

// 如果直接運行此腳本
if (require.main === module) {
    main();
}

// 導出函數供其他模塊使用
module.exports = {
    checkSimplifiedCharacters,
    analyzeTextFile,
    loadMappings
};