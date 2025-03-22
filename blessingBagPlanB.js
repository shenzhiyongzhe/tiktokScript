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

function timeToSeconds(timeStr)
{
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
}
const sendComment = () =>
{
    if (text("加入粉丝团").findOne(2000))
    {
        console.log("需要加入粉丝团，暂时跳过")
        RandomPress([89, 330, 519, 444])
        return false;
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
            return true;
        }
    }
    return false;
}
const getBlessingInfo = () =>
{
    let haveBlessingBag = false;
    for (let i = 0; i < 10; i++)
    {
        haveBlessingBag = findBlessingBag()
        if (haveBlessingBag)
        {
            RandomPress([haveBlessingBag.x, haveBlessingBag.y, 10, 10], 2)
            break;
        }
        let delay = random(1000, 2000) / 1000
        Sleep(delay)
    }
    if (!haveBlessingBag)
    {
        console.log("没有发现福袋,下一个视频")
        return false;
    }
    const info = {}
    const blessingBagTitle = text("倒计时").findOne(2000)
    if (!blessingBagTitle)
    {
        console.log("没有找到倒计时")
        return false;
    }
    const count = blessingBagTitle.parent().childCount()
    if (count < 12)
    {
        return false
    }
    const parent = blessingBagTitle.parent()
    info.countDown = timeToSeconds(parent.child(2).text())
    info.totalDiamond = parent.child(5).text()
    info.totalBag = parseInt(parent.child(7).text().split("个")[0])
    info.participants = parseInt(parent.child(1).text().split("人")[0])
    info.winningProbability = (info.totalBag / info.participants).toFixed(2)

    if (info.countDown < 120 || info.winningProbability > 0.1)
    {
        const haveSendComment = sendComment()
        if (haveSendComment)
        {
            console.log(`倒计时小于2分钟或者中奖概率较大，等待${info.countDown}s`)
            Sleep(info.countDown + 3)
        }
    }
    console.log("count: " + JSON.stringify(info))
    return info
}
const getParticipateInfo = () =>
{
    const info = {}
    const blessingBagTitle = text("已参与").findOne(2000)
    if (!blessingBagTitle)
    {
        return info;
    }
    console.log(blessingBagTitle)
    const count = blessingBagTitle.parent().childCount()
    if (count < 10)
    {
        return info
    }
    const parent = blessingBagTitle.parent()

    for (let i = 0; i < count; i++)
    {
        console.log(i + ": " + parent.child(i).text())
    }
    info.countDown = timeToSeconds(parent.child(7).text())
    info.totalBag = parseInt(parent.child(1).text())
    info.participants = parseInt(parent.child(3).text())
    info.winningProbability = (info.totalBag / info.participants).toFixed(2)
    console.log("count: " + JSON.stringify(info))
    if (info.participants > 0.1)
    {
        console.log(`概率大于0.1，等待${info.countDown}`)
        Sleep(info.countDown + 3)
    }
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
    const haveParticipated = text("已参与").findOne(20)
    if (haveParticipated)
    {
        console.log("已参与，查看倒计时")
        getParticipateInfo()
        return
    }
}

const swipeToTheNextVideo = () =>
{
    pageException()
    swipeUp()
    console.log("下一条视频")
    getBlessingInfo()
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
    // for (let i = 0; i < 100; i++)
    while (true)
    {
        swipeToTheNextVideo()
    }
}

module.exports = { blessingBagFlow }
// blessingBagFlow()