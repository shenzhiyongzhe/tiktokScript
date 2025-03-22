const { launchAweme, LoadImgList, FindImgInList, StopScript, RandomPress, RecycleImgList, Sleep, swipeDown, swipeUp, FindMultiColors } = require("./utils");


const blessingBagImgList = LoadImgList("blessingBag");
const popupCloseImgList = LoadImgList("popupClose");

const shortVideoQueue = {
    queue: [],
    getLength: function ()
    {
        return this.queue.length
    },
    getCurrent: function ()
    {
        let index = 0;
        const user_name = id("user_name").findOne(200)
        if (user_name)
        {
            index = this.getTheIndex(user_name.text())
        }
        return this.queue[index]
    },
    getTheIndex: function (user_name)
    {
        let index = -1;
        this.queue.map(item =>
        {
            if (item.user_name == user_name)
            {
                index = item.index;
            }
        })
        return index;
    }
}

const findBlessingBag = () => FindImgInList(blessingBagImgList, [3, 158, 340, 179])
const havePopupClose = () => FindImgInList(popupCloseImgList, [347, 1105, 30, 55])


const pushBlessingBag = (blessingBag) =>
{
    shortVideoQueue.queue.push(blessingBag)
}

function timeToSeconds(timeStr)
{
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
}

const getBlessingBagInfo = () =>
{
    const info = {}
    const pos = findBlessingBag()
    if (!pos)
    {
        return info;
    }
    const { x, y } = pos
    RandomPress([x, y, 10, 10], 2)
    const timeCountTxt = text("倒计时").findOne(5000)
    if (timeCountTxt)
    {
        if (text("加入粉丝团").findOne(20))
        {
            console.log("需要加入粉丝团，暂时跳过")
            RandomPress([89, 330, 519, 444])
            return info;
        }

        const goToCommentBtn = text("去发表评论").findOne(3000)
        if (goToCommentBtn)
        {
            goToCommentBtn.click()
            const publishBtn = text("发送").findOne(5000)
            if (publishBtn)
            {
                publishBtn.click()
                console.log("已发表评论")
                Sleep(3)
                const afterPos = findBlessingBag()
                RandomPress([afterPos.x, afterPos.y, 10, 10], 3)
            }
        }
    }
    const timeTxt = textMatches(/.*倒计时.*/).findOne(4000)
    if (timeTxt)
    {
        const time = timeTxt.text().split('倒计时')[1].trim()
        const seconds = timeToSeconds(time)
        info.seconds = seconds
        info.received = false
        info.timeStamp = new Date().getTime()
        const closePopupBtn = text("关闭福袋").findOne(2000)
        if (closePopupBtn)
        {
            closePopupBtn.click()
            console.log("关闭福袋")
            Sleep(2)
        }
    }
    console.log("福袋信息：" + JSON.stringify(info))
    return info;
}

const getVideoInfo = () =>
{
    const videoInfo = {}
    videoInfo.index = shortVideoQueue.getLength()
    const user_name = id("user_name").findOne(5000)
    if (user_name)
    {
        videoInfo.user_name = user_name.text()
    }
    const blessingBagInfo = getBlessingBagInfo()
    if (blessingBagInfo.seconds)
    {
        console.log(`直播间：${user_name.text()},福袋倒计时为：${blessingBagInfo.seconds}`)
        videoInfo.blessingBagInfo = blessingBagInfo
        if (blessingBagInfo.seconds < 120)
        {
            console.log("倒计时小于120秒，直接等待")
            Sleep(blessingBagInfo.seconds + 3)
            videoInfo.blessingBagInfo.received = true;
            pageException()
        }
    }
    else
    {
        console.log("没有红包信息")
    }

    const queue = shortVideoQueue.queue;
    for (let i = 0; i < queue.length; i++)
    {
        if (queue[i].user_name === videoInfo.user_name)
        {
            if (videoInfo.blessingBagInfo)
            {
                console.log("更新队列信息")
                shortVideoQueue.queue[i].blessingBagInfo = videoInfo.blessingBagInfo
            }
            console.log("已在队列，不需要重复加入")
            return videoInfo
        }
    }
    if (videoInfo.user_name)
    {
        pushBlessingBag(videoInfo)
    }
    return videoInfo
}
const pageException = () =>
{
    const gotKnown = text("知道了").findOne(20)
    if (gotKnown)
    {
        gotKnown.click()
        Sleep()
        console.log("点击知道了")
    }
    const closeBtn = text("关闭，按钮").findOne(20)
    if (closeBtn)
    {
        closeBtn.click()
        Sleep()
        console.log("点击关闭")
    }

    const hasPopupClose = havePopupClose()
    if (hasPopupClose)
    {
        console.log("点击关闭弹窗")
        RandomPress([hasPopupClose.x, hasPopupClose.y, 10, 10])
    }
}

const swipeToThepreviousVideo = () =>
{
    pageException()
    swipeDown()
    console.log("上一条视频")
    const delay = random(1000, 2000) / 1000
    Sleep(delay)
}

const swipeToTheNextVideo = () =>
{
    pageException()
    swipeUp()
    console.log("下一条视频")
    const delay = random(10000, 12000) / 1000
    Sleep(delay)
    getVideoInfo()
}
const findShortestBlessingBag = () =>
{
    let shortestItem = null;
    const currentTime = new Date().getTime()
    const calculateTime = (blessingBagInfo) =>
    {
        const stamp = Math.ceil((currentTime - blessingBagInfo.timeStamp) / 1000)
        if (blessingBagInfo.seconds - stamp < 120)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    for (let i = 0; i < shortVideoQueue.queue.length; i++)
    {
        let queueItem = shortVideoQueue.queue[i]
        if (queueItem.blessingBagInfo && queueItem.blessingBagInfo.received == false)
        {
            if (calculateTime(queueItem.blessingBagInfo))
            {
                shortestItem = queueItem
                break;
            }
        }
    }
    return shortestItem
}
const enterLiveRoom = () =>
{
    launchAweme()
    const publishPlusImgList = LoadImgList("publishPlus")
    for (let i = 0; i < 10; i++)
    {
        if (FindImgInList(publishPlusImgList, [311, 1406, 105, 193]))
        {
            RandomPress([650, 86, 31, 31], 2)
            break;
        }
        Sleep()
    }
    const searchBtn = text("搜索").findOne(12000)
    if (searchBtn)
    {
        setText("直播")
        Sleep(2)
        console.log("输入  直播")
        console.log("点击搜索")
        RandomPress([633, 89, 52, 28])
        Sleep(4)
    }
    const livingPage = desc("直播").findOne(6000)
    if (livingPage)
    {
        click(livingPage.bounds().centerX(), livingPage.bounds().centerY())
        console.log("点击直播页面")
        Sleep(2)
        RandomPress([184, 506, 433, 239])
    }
}
const blessingBagFlow = () =>
{
    enterLiveRoom()
    pageException()
    getVideoInfo()
    // for (let i = 0; i < 100; i++)
    while (true)
    {
        console.log(JSON.stringify(shortVideoQueue))
        swipeToTheNextVideo()
        let haveShortBlessingBag = findShortestBlessingBag()
        if (haveShortBlessingBag)
        {
            console.log(`有最近的红包即将开放，开始前往其直播间, 名称是：${haveShortBlessingBag.user_name}`)
            try
            {
                let swipeStep = shortVideoQueue.getCurrent()["index"] - shortVideoQueue.getTheIndex(haveShortBlessingBag.user_name)
                console.log("滑动步数：" + swipeStep + "次")
                for (let j = 1; j < Math.abs(swipeStep) + 1; j++)
                {
                    if (swipeStep > 0)
                    {
                        swipeToThepreviousVideo()
                    }
                    else
                    {
                        swipeToTheNextVideo()
                    }
                    let user_name = id("user_name").findOne(5000)
                    if (user_name == haveShortBlessingBag.user_name)
                    {
                        console.log("已到达直播间，开始等待")
                        shortVideoQueue.currentIndex = haveShortBlessingBag.index
                        break;
                    }
                }
                console.log("详情：" + shortVideoQueue.queue[haveShortBlessingBag.index])
                Sleep(120 - 3 * Math.abs(swipeStep))
                if (shortVideoQueue.queue[haveShortBlessingBag.index] && shortVideoQueue.queue[haveShortBlessingBag.index].blessingBagInfo)
                {
                    shortVideoQueue.queue[haveShortBlessingBag.index].blessingBagInfo.received = true
                }

                console.log("已领取红包")
            } catch (error)
            {
                console.log("前往直播间发生错误：" + error)
            }

        }
        sleep(1000)
    }
}

module.exports = { blessingBagFlow }