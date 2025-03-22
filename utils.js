
const ReadImg = (name) => images.read(`./img/${name}.png`);
const FindImg = (img, region, shot) =>
{
    shot = shot || captureScreen();
    return images.findImage(shot, img, { region });
};

const LoadImgList = (url, length) =>
{
    length = length || 30;
    const list = [];
    let img = null;
    for (let i = 0; i < length; i++)
    {
        img = ReadImg(`${url}/${i}`);

        if (img == null)
        {
            break;
        }
        list.push(img);
    }
    if (list.length == 0)
    {
        alert("加载文件失败", "路径：" + url + "无文件");
    }
    return list;
};
const FindImgInList = (imgList, region, shot) =>
{
    shot = shot || captureScreen();
    let hasImg = false;
    for (let i = 0; i < imgList.length; i++)
    {
        hasImg = FindImg(imgList[i], region, shot);
        if (hasImg)
        {
            return hasImg;
        }
    }
    return false;
};
const RecycleImgList = (list) => list.forEach(img => img.recycle());
const logNormal = (mu, sigma) =>
{
    mu = mu || Math.log(800);
    sigma = sigma || 0.5
    // 生成正态分布随机数，再取指数
    let z = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
    const number = Math.floor(Math.exp(mu + sigma * z));
    return number
}
const Sleep = (time) => 
{
    if (!time)
    {
        time = logNormal()
    }
    else
    {
        time = time * 1000 + logNormal()
    }
    sleep(time)
};
const RandomPress = ([startX, startY, w, h], delay) =>
{
    const beforeDelay = logNormal()
    sleep(beforeDelay)

    const x1 = Math.round(Math.random() * w + startX);
    const y1 = Math.round(Math.random() * h + startY);
    const x2 = x1 + random(-4, 4);
    const y2 = y1 + random(-4, 4)

    const time = random(20, 200);
    swipe(x1, y1, x2, y2, time);
    if (delay)
    {
        delay = delay + logNormal(Math.log(800))
    }
    delay = delay || logNormal();
    sleep(delay);

};
const swipeDown = () =>
{
    humanSwipe([96, 292, 543, 131], [90, 1200, 542, 136], [30, 100])
}
const swipeUp = () =>
{
    humanSwipe([90, 1200, 542, 136], [96, 292, 543, 131], [50, 100])
}

const humanSwipe = (startRegion, endRegion, durationLimit) => 
{
    let steps = 50; // 滑动过程分解为50个步骤
    let points = [];
    durationLimit = durationLimit || [500, 1000]

    const duration = Math.floor(random(durationLimit[0], durationLimit[1]))
    const [x1, y1, w1, h1] = startRegion;
    const startX = Math.round(Math.random() * w1 + x1);
    const startY = Math.round(Math.random() * h1 + y1);
    const [x2, y2, w2, h2] = endRegion;
    const endX = Math.round(Math.random() * w2 + x2);
    const endY = Math.round(Math.random() * h2 + y2);

    // 生成贝塞尔曲线控制点，添加路径扰动
    let controlX = (startX + endX) / 2 + random(-20, 20);
    let controlY = (startY + endY) / 2 + random(-20, 20);

    // 生成变速滑动轨迹（加速-减速）
    for (let i = 0; i <= steps; i++)
    {
        let t = i / steps;
        // 贝塞尔曲线公式（二次）
        let x = (1 - t) * (1 - t) * startX + 2 * t * (1 - t) * controlX + t * t * endX;
        let y = (1 - t) * (1 - t) * startY + 2 * t * (1 - t) * controlY + t * t * endY;
        // 添加随机扰动（模拟手指抖动）
        x += random(-3, 3);
        y += random(-3, 3);
        points.push([x, y]);
    }

    // 执行滑动
    gesture(duration, points);

    Sleep()
}
const StopScript = () => { console.log("退出脚本"); java.lang.System.exit(0); }

const launchAweme = () => app.launch("com.ss.android.ugc.aweme")

const FindMultiColors = (colorArr, region, shot, threshold) =>
{
    let hasColor = false;
    shot = shot || captureScreen();
    threshold = threshold || 4;
    for (let i = 0; i < colorArr.length; i++)
    {
        let [color, position] = colorArr[i];
        hasColor = images.findMultiColors(shot, color, position, { region, threshold });
        if (hasColor)
        {
            break;
        };
    }
    return hasColor;
};

module.exports = {
    FindImgInList,
    LoadImgList,
    launchAweme,
    RecycleImgList,
    RandomPress,
    swipeDown,
    swipeUp,
    humanSwipe,
    StopScript,
    Sleep,
    FindMultiColors
}