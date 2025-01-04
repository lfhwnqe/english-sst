import GradientButton from "@/app/components/common/GradientButton";
import StaticAppHeader from "@/app/components/common/header/staticAppHeader";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 text-foreground p-8">
      <StaticAppHeader />
      {/* Hero Section */}
      <section className="px-4 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
              AI 驱动的
            </span>
            <br />
            音频场景生成器
          </h1>
          <p className="text-lg sm:text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            使用先进的 AI 技术，轻松创建逼真的音频场景。让您的创作更加生动。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <GradientButton
              href="/audio-scene/create"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 
              text-white hover:text-white dark:hover:text-white font-semibold 
              shadow-lg hover:shadow-xl hover:shadow-blue-500/20
              border-none ring-0"
            >
              开始创作
            </GradientButton>
            <GradientButton
              href="/audio-scene/list"
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 font-semibold
              border border-gray-200 dark:border-gray-700
              hover:border-blue-500/50 dark:hover:border-blue-400/50
              shadow-sm hover:shadow-md"
            >
              浏览作品
            </GradientButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 border-t border-foreground/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            主要功能
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/70 dark:bg-gray-800/70 rounded-xl p-6 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 border border-foreground/10 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-foreground/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="px-4 py-16 bg-background/50 border-y border-foreground/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            使用流程
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center text-xl font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-foreground/70">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/4 left-full w-full h-0.5 bg-foreground/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            准备好开始您的创作了吗？
          </h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90">
            立即加入我们，探索 AI 音频场景的无限可能。
          </p>
          <GradientButton
            href="/auth/signup"
            className="px-8 py-4 bg-white dark:bg-gray-800 text-blue-500 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-gray-700 shadow-lg hover:shadow-xl"
          >
            免费注册
          </GradientButton>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
    ),
    title: "AI 音频生成",
    description: "使用先进的 AI 模型，将文字描述转换为逼真的音频场景。",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
    title: "场景组合",
    description: "支持多个音频元素组合，创建复杂的声音环境。",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>
    ),
    title: "在线分享",
    description: "一键分享您的作品，与他人交流创作经验。",
  },
];

const steps = [
  {
    title: "描述场景",
    description: "用文字描述您想要的音频场景。",
  },
  {
    title: "AI 生成",
    description: "AI 自动生成符合描述的音频内容。",
  },
  {
    title: "调整优化",
    description: "根据需要微调音频参数。",
  },
  {
    title: "保存分享",
    description: "保存作品并与他人分享。",
  },
];
