
const ignoreList = [".gitignore", "z_test.js", "z0_tool.js", "z1_syncFile.js", "../", "frame", ".git"];

function getFileUrl(path)
{
    function traverseDirectory(dirPath, fileList)
    {
        fileList = fileList || []
        let names = files.listDir(dirPath);
        names = names.filter(item => !ignoreList.includes(item.toString()))
        names.forEach(file =>
        {
            const filePath = files.join(dirPath, file);
            if (files.isDir(filePath))
            {
                // 如果是文件夹，则递归调用自身
                traverseDirectory(filePath, fileList);
            } else if (files.isFile(filePath))
            {
                // 如果是文件，则添加到文件列表
                fileList.push(filePath);
            }
        });
        return fileList;
    }

    // 检查传入路径是否存在并且是一个有效的文件或目录
    if (!files.exists(path))
    {
        console.error("指定路径不存在");
        return [];
    }

    if (files.isDir(path))
    {
        // 如果是目录，则开始遍历
        return traverseDirectory(path);
    } else if (files.isFile(path))
    {
        return [path];
    } else
    {
        console.error("指定路径既不是文件也不是目录");
        return [];
    }
}
const copyFile = (fileList) =>
{
    fileList.map(item =>
    {
        files.copy(item, item.split('/sdcard/脚本/tiktok/')[1])
    })
}
// 使用示例
const filePaths = getFileUrl("/sdcard/脚本/tiktok/");
copyFile(filePaths)
toastLog('同步成功');

// console.log(getUrl());

// files.createWithDirs("/sdcard/脚本/" + 'img/mainStory_confirm.png')