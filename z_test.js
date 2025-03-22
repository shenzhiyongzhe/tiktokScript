
const { StopScript, RandomPress, launchAweme, LoadImgList, FindImgInList, Sleep, humanSwipe } = require("./utils");

const GetCaptureScreenPermission = () =>
{
    threads.start(() =>
    {
        const haveCancelBtn = text("取消").findOne(10000)
        if (haveCancelBtn)
        {
            RandomPress([494, 1048, 119, 44])
        }
    });

    const isSuccess = requestScreenCapture();
    if (!isSuccess)
    {
        console.log("截图权限申请失败,重新申请");
        alert("截图权限申请失败,重新申请");
        StopScript()
    }
};
const enterLiveRoom = () =>
{
    launchAweme()
    const publishPlusImgList = LoadImgList("publishPlus")
    for (let i = 0; i < 10; i++)
    {
        if (FindImgInList(publishPlusImgList, [312, 1463, 97, 80]))
        {
            RandomPress([650, 86, 31, 31])
            break;
        }
        Sleep()
    }
    setText("直播")
    const searchBtn = text("搜索").findOne(2000)
    if (searchBtn)
    {
        console.log("点击搜索")
        searchBtn.click()
        Sleep(2)
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

GetCaptureScreenPermission()
// enterLiveRoom()
// StopScript()
// humanSwipe([50, 300, 600, 120], [70, 1200, 600, 170], [30, 100])

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
    // if (count < 12)
    // {
    //     return info
    // }
    const parent = blessingBagTitle.parent()

    for (let i = 0; i < count; i++)
    {
        console.log(i + ": " + parent.child(i).text())
    }
    info.countDown = parent.child(7).text()
    info.totalBag = parseInt(parent.child(1).text())
    info.participants = parseInt(parent.child(3).text())

    console.log("count: " + JSON.stringify(info))
}

getParticipateInfo()