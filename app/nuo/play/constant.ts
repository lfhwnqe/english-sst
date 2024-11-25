// 定义 Section 类型
type Section = {
  name: string; // 标题
  url: string; // 音频链接
  str: string; // 内容字符串
};

// 定义 SectionMap 类型
type SectionMap = {
  [key: number | string]: Section; // 键为数字，值为 Section 类型
};

export const sectionMap: SectionMap = {
  1: {
    name: "起床出门",
    url: "https://nuo-english.s3.us-east-2.amazonaws.com/getup.wav",
    str: `场景英语表达分析
Morning Routine from Waking Up to Heading Out
I was woken up by my alarm at 8:10
I hit the snooze button for another 10 minutes of sleep
At 8:20, I had to get up
I went to the bathroom, brushed my teeth, washed my face, and applied face cream
I styled my hair with pomade for a classic slicked-back look
I grabbed my phone, work ID, and keys
I closed the door and double-checked if it was properly locked
Then I headed out for the day
应用 (Application)
基础描述版本
我被闹钟在8点10分叫醒
我按了贪睡按钮想再睡10分钟
8点20分我不得不起床了
我去洗手间刷牙洗脸擦护肤品
我用发蜡做了个复古油头造型
我拿上手机工卡和钥匙
我关上门并检查是否锁好
然后我出门了
场合变体
对同事
I overslept a bit this morning
早上我睡过头了一会
对朋友
Man I barely made it out of bed this morning
老兄我今天早上好不容易才爬起来
对长辈
I started my day a little later than usual today
今天我比平时晚起了一点
分析 (Analysis)
关键表达解析
wake up vs be woken up
自然醒来的表达
wake up
主动醒来的行为表达
be woken up
被动醒来的表达
hit the snooze button vs turn off alarm
贪睡按钮操作表达
hit the snooze button
更生动形象的表达方式
turn off alarm
直接关闭的表达方式
评估 (Evaluation)
表达效果比较
描述起床过程
I dragged myself out of bed
体现起床困难的状态
I jumped out of bed
形容精神饱满的起床状态
I slowly got up
描述慢慢起床的过程
描述整理过程
I rushed through my morning routine
匆忙进行晨间护理的表达
I took my time getting ready
从容准备的表达
I went about my usual morning routine
按平常节奏进行的表达
创造 (Creation)
个性化表达
赶时间场景
Time to dash through my morning prep
该快速完成晨间准备了
Running way behind schedule here
这里已经严重落后于计划了
悠闲场景
Taking it slow this lovely morning
在这个美好的早晨慢慢来
No rush just a peaceful start
不着急享受平静的开始
实践建议
情境扩展
匆忙版
Gotta sprint through this morning routine
必须快速完成这个早晨流程
悠闲版
Enjoying a relaxed morning start
享受轻松的早晨时光
糟糕版
Everything is going wrong this morning
今早所有事情都不顺心
心情变化版
疲惫时
Another morning another struggle
又一个早晨又一次挣扎
精神好
Ready to tackle the day ahead
准备迎接新的一天`,
  },
  2: {
    name: "开始工作",
    url: "https://nuo-english.s3.us-east-2.amazonaws.com/workstart.wav",
    str: `场景英语表达分析
A Typical Work Morning and Lunch Break
I arrive at the office and boot up my computer first thing in the morning
I open Notion to check my schedule and todo list
I launch my IDE and start working on the project
I open the design files to work on the UI implementation
When I need API documentation I consult with our Java developers
I debug and test the API integration
Our product manager schedules a Zoom meeting for requirement review
All relevant developers join to discuss the new features
We raise questions about unclear requirements
We also point out design issues that need improvement
At noon I grab my pre ordered lunch
I quickly finish my meal
I take the elevator to the company gym
I do some light exercise spending about 50 minutes walking on the treadmill
While exercising I watch some videos on my phone for entertainment
After working out I am all sweaty
Instead of taking a shower which would be time consuming I decide to freshen up
I go to the restroom to wipe off the sweat
Then I start my lunch break nap
应用 (Application)
基础描述版本
I am starting my workday at the office
我正在办公室开始我的工作日
First I need to boot up my computer and check my tasks
首先我需要启动电脑查看任务
I spend the morning coding and attending meetings
我整个上午都在编程和参加会议
At lunch I exercise in the gym before taking a break
午餐时我在健身房运动后休息
场合变体
对同事
Hey I will be in the requirement review meeting after I finish this API integration
嘿 我完成这个接口对接后就去参加需求评审会议
对朋友
Got a busy morning with coding and meetings but managed to squeeze in some exercise during lunch
上午很忙要写代码开会 不过午休时间还是抽空运动了下
对长辈
I have a good work life balance at this company they even provide a gym for employees
这家公司的工作生活平衡很好 甚至还为员工提供健身房
分析 (Analysis)
关键表达解析
boot up vs turn on
启动电脑的表达
boot up
更专业正式 常用于计算机场景
turn on
更口语化 使用范围更广
launch vs open
打开软件的表达
launch
正式用语 暗示启动较大的程序
open
通用说法 适用于所有类型文件和程序
evaluation (Evaluation)
表达效果比较
描述工作进度
I am working on the API integration
正在进行中 比较中性的表达
I am in the middle of the API integration
强调正处于关键阶段
I am about to finish the API integration
即将完成 带有时间紧迫感
描述运动强度
I do some light exercise
温和的表达 表示运动强度适中
I take a quick workout
简短有力 强调时间紧凑
I squeeze in some exercise
暗示时间有限 但仍然重视运动
Creation (Creation)
个性化表达
忙碌工作场景变体
I am juggling between coding and meetings this morning
我今天上午在编程和会议之间周旋
The morning flew by with back to back tasks
上午在一个接一个的任务中飞快过去
运动场景变体
I am sneaking in some exercise during lunch
我午餐时间偷偷做运动
I am treating myself to some me time at the gym
我在健身房享受属于自己的时光
实践建议
情境扩展
匆忙版
No time for shower just a quick freshen up before afternoon work
没时间洗澡 下午工作前快速整理一下
悠闲版
Taking my time to properly cool down after the workout
运动后悠闲地让身体冷却下来
疲惫版
The morning meetings drained me I really need this lunch break
上午的会议让我很疲惫 我真的需要这个午休时间
心情变化版
疲惫时
These meetings are wearing me out need some exercise to recharge
这些会议让我疲惫不堪 需要运动来充电
精神好
Feeling energized after the workout ready to tackle afternoon tasks
运动后感觉精力充沛 准备应对下午的任务`,
  },
};
