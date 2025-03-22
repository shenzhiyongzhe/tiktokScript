
const { blessingBagFlow } = require("./blessingBagPlanB");
const { LoadImgList, FindImgInList, StopScript, RandomPress, RecycleImgList, Sleep, swipeDown, swipeUp } = require("./utils");

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

const Init = () =>
{
    GetCaptureScreenPermission()
}

let joinFanClub = false
const stateFloaty = () =>
{
    console.log("脚本logo");
    const floaty_window = floaty.window(
        <frame gravity="center" id="switch" w="18" h="18" >
            <text color="#ffffff">🎯</text>
        </frame>
    );
    floaty_window.setPosition(0, 682);
    floaty_window.switch.click(() => StopScript());
    // floaty_window.switch.click(() => threads.shutDownAll());
};
const uiFloaty = () =>
{
    Init()
    const floatyWindow = floaty.window(
        <card gravity="center|top" alpha="1" cardBackgroundColor="#71c9ce" cardCornerRadius="10">
            <text id="stop" color="#ffffff" w="30" h="30" bg="#71c9ce" marginLeft="100">✕</text>
            <vertical gravity="center|top" >
                <button id="start" h="40" w="120" color="#ffffff" bg="#a6e3e9" marginTop="20">开始</button>
                <horizontal gravity="center">
                    <checkbox id="joinFanClub" w="100" text="加入粉丝团" textSize="12" checked="{{joinFanClub}}" />
                </horizontal>

            </vertical>
        </card>
    );
    const uiInterval = setInterval(() =>
    {
    }, 1000);

    floatyWindow.setSize(450, 300);
    floatyWindow.setPosition(162, 300);

    floatyWindow.stop.click(StopScript);

    floatyWindow.start.click(() =>
    {

        threads.start(MainFlow);
        clearInterval(uiInterval);
        floatyWindow.close()
    });
}

const MainFlow = () =>
{
    stateFloaty()
    blessingBagFlow()
}

uiFloaty()